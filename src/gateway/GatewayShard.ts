import { Gateway } from './Gateway';

import { DiscordConstants } from '../constants/DiscordConstants';
import { LogCallback } from '../types/Log';

import { TypedEmitter } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/v10';
import { randomUUID } from 'node:crypto';
import { setTimeout as wait } from 'node:timers/promises';
import { TextDecoder } from 'node:util';
import { RawData, WebSocket } from 'ws';

/**
 * {@link GatewayShard Gateway shard} events.
 */
export type GatewayShardEvents = {
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT_PAYLOAD: (payload: string) => void
    /**
     * When the {@link GatewayShard shard} receives a payload. Data is the parsed payload.
     */
    RECEIVED_PAYLOAD: (payload: DiscordTypes.GatewayDispatchPayload) => void
    /**
     * When the {@link GatewayShard shard} enters an {@link GatewayShardState idle state}.
     */
    IDLE: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState disconnected state}.
     */
    DISCONNECTED: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState connecting state}.
     */
    CONNECTING: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState ready state}.
     */
    READY: () => void
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState guilds ready state}.
     */
    GUILDS_READY: () => void
}

/**
 * {@link GatewayShard Gateway shard} states.
 */
export enum GatewayShardState {
    /**
     * The {@link GatewayShard shard} is not running.
     */
    IDLE,
    /**
     * The {@link GatewayShard shard} was disconnected.
     */
    DISCONNECTED,
    /**
     * The {@link GatewayShard shard} is connecting to the gateway.
     * During this stage, the {@link GatewayShard shard}:
     * - Initiates the websocket connection
     * - Waits for a [hello payload](https://discord.com/developers/docs/topics/gateway#hello)
     * - Starts [heartbeating](https://discord.com/developers/docs/topics/gateway#heartbeating)
     * - The shard sends an [identify payload](https://discord.com/developers/docs/topics/gateway#identify)
     * - Waits for the [READY](https://discord.com/developers/docs/topics/gateway#ready) dispatch
     *
     * Alternatively, if the shard receives an [Invalid Session payload](https://discord.com/developers/docs/topics/gateway#invalid-session) and enters this state:
     * - The shard sends an [identify payload](https://discord.com/developers/docs/topics/gateway#identify) or a [resume payload](https://discord.com/developers/docs/topics/gateway#resume)
     * - Waits for the [READY](https://discord.com/developers/docs/topics/gateway#ready) or [RESUMED](https://discord.com/developers/docs/topics/gateway#resumed) dispatch
     */
    CONNECTING,
    /**
     * The {@link GatewayShard shard} is connected and is operating normally. A [READY](https://discord.com/developers/docs/topics/gateway#ready) or [RESUMED](https://discord.com/developers/docs/topics/gateway#resumed) dispatch has been received.
     */
    READY,
    /**
     * The {@link GatewayShard shard} has received all [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) dispatches (or has timed out).
     */
    GUILDS_READY
}

/**
 * A gateway shard.
 * Handles the low level ws communication with Discord.
 */
export class GatewayShard extends TypedEmitter<GatewayShardEvents> {
    /**
     * Guilds that belong to the shard.
     * This is populated as the shard is receiving [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) payloads, and is accurate after the shard is in a {@link GatewayShardState guilds ready state}.
     */
    public guilds: Set<Snowflake> = new Set();
    /**
     * The shard's heartbeat ping in milliseconds.
     */
    public heartbeatPing = 0;
    /**
     * The last [sequence number](https://discord.com/developers/docs/topics/gateway#resumed) received.
     */
    public lastSequence: number | null = null;
    /**
     * The shard's [session ID](https://discord.com/developers/docs/topics/gateway#ready-ready-event-fields).
     */
    public sessionId: string | null = null;
    /**
     * The shard's {@link GatewayShardState state}.
     */
    public state: GatewayShardState = GatewayShardState.IDLE;
    /**
     * Guilds expected to receive a [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) from.
     */
    public waitingForGuilds: Set<Snowflake> | null = null;
    /**
     * The [WebSocket](https://github.com/websockets/ws) used by the shard.
     */
    public ws: WebSocket | null = null;

    /**
     * The shard's ID.
     */
    public readonly id: number;
    /**
     * The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     */
    public readonly numShards: number;
    /**
     * Options for the gateway shard.
     */
    public readonly options: Gateway[`options`];
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    public readonly system: `Gateway Shard ${number}`;
    /**
     * The URL being used.
     */
    public readonly url: string;

    /**
     * The shard's text decoder.
     */
    private _textDecoder: TextDecoder = new TextDecoder();
    /**
     * Timers used by the shard.
     */
    private _timers: {
        /**
         * Waiting for guilds timeout.
         */
        guilds: NodeJS.Timeout | null
        /**
         * Timeout to send the next heartbeat at.
         */
        heartbeat: NodeJS.Timeout | NodeJS.Timer | null
    } = {
            guilds: null,
            heartbeat: null
        };
    /**
     * Timestamps used by the shard.
     */
    private _timestamps: {
        /**
         * The timestamp of the last sent heartbeat.
         */
        lastHeartbeat: number | null
        /**
         * The timestamp of the last received heartbeat ack.
         */
        lastHeartbeatAck: number | null
    } = {
            lastHeartbeat: null,
            lastHeartbeatAck: null
        };
    /**
     * The {@link LogCallback log callback} used by the shard.
     */
    private _log: LogCallback;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a gateway shard.
     * @param token The bot's token.
     * @param id The shard's ID.
     * @param url The URL being used to connect to the gateway.
     * @param numShards The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     * @param options Gateway shard options.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway shard.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor (token: string, id: number, numShards: number, url: string, options: Gateway[`options`], logCallback: LogCallback = (): void => {}, logThisArg?: any) {
        super();

        if (typeof token !== `string`) throw new TypeError(`Parameter "token" (string) not provided: got ${token} (${typeof token})`);
        if (typeof id !== `number`) throw new TypeError(`Parameter "id" (number) not provided: got ${id} (${typeof id})`);
        if (typeof numShards !== `number`) throw new TypeError(`Parameter "numShards" (number) not provided: got ${numShards} (${typeof numShards})`);
        if (typeof url !== `string`) throw new TypeError(`Parameter "url" (string) not provided: got ${url} (${typeof url})`);
        if (typeof options !== `object`) throw new TypeError(`Parameter "options" (object) not provided: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`) throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as GatewayShard[`_token`],
            writable: false
        });

        this.id = id;
        this.system = `Gateway Shard ${this.id}`;
        this.numShards = numShards;
        this.url = url;
        this.options = options;

        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized gateway shard ${id}`, {
            level: `DEBUG`, system: this.system
        });
    }

    /**
     * Gets the shard's ping.
     * @returns The node's ping in milliseconds.
     */
    public async getPing (): Promise<number> {
        return await new Promise((resolve, reject) => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                reject(new Error(`Cannot send data when the socket is not in an OPEN state`));
            } else {
                const uuid = randomUUID();
                const start = Date.now();

                const onPong = (data: Buffer): void => {
                    const time = Date.now() - start;
                    if (data.toString() === uuid) {
                        this.ws?.removeListener(`pong`, onPong);
                        resolve(time);
                    }
                };

                this.ws.ping(uuid, undefined, (error) => {
                    if (error) reject(error);
                    else this.ws?.on(`pong`, onPong);
                });
            }
        });
    }

    /**
     * Kills the shard.
     * @param reason The reason the shard is being killed. Defaults to `"Manual kill"`.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code) to send if the connection is still open. Defaults to `1000`.
     */
    public kill (reason = `Manual kill`, code = 1000): void {
        this._enterState(GatewayShardState.IDLE);
        this._close(reason, code);

        this._log(`Shard killed: ${reason}`, {
            level: `WARN`, system: this.system
        });
    }

    /**
     * Sends a payload to the gateway.
     * @param paylaod The data to send.
     */
    public async send (payload: DiscordTypes.GatewaySendPayload): Promise<void> {
        if (this.state < GatewayShardState.READY && ![DiscordTypes.GatewayOpcodes.Heartbeat, DiscordTypes.GatewayOpcodes.Identify, DiscordTypes.GatewayOpcodes.Resume].includes(payload.op)) {
            return await TypedEmitter.once(this as TypedEmitter<GatewayShardEvents>, `READY`).then(() => this.send(payload));
        }

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) throw new Error(`Cannot send data when the WebSocket is not in an OPEN state`);

        return await new Promise((resolve, reject) => {
            const data = JSON.stringify(payload);

            this.ws!.send(data, (error) => {
                if (error) reject(error);
                else {
                    this._log(`Sent payload (opcode ${payload.op} ${DiscordTypes.GatewayOpcodes[payload.op]})`, {
                        level: `DEBUG`, system: this.system
                    });

                    this.emit(`SENT_PAYLOAD`, data);

                    resolve();
                }
            });
        });
    }

    /**
     * Spawns the shard.
     */
    public async spawn (): Promise<void> {
        if (this.state >= GatewayShardState.READY) return Promise.resolve();
        if (this.state >= GatewayShardState.CONNECTING) return await TypedEmitter.once(this as TypedEmitter<GatewayShardEvents>, `READY`).then(() => {});
        return await this._spawn();
    }

    /**
     * Checks if all [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) dispatches have been received.
     */
    private _checkGuilds (): void {
        if (this._timers.guilds !== null) {
            clearTimeout(this._timers.guilds);
            this._timers.guilds = null;
        }

        if (!this.waitingForGuilds || !this.waitingForGuilds.size) {
            this._enterState(GatewayShardState.GUILDS_READY);
            return;
        }

        this._timers.guilds = setTimeout(() => {
            this._log(`Timed out while waiting for guilds, entering GUILDS_READY state anyways...`, {
                level: `WARN`, system: this.system
            });

            this._enterState(GatewayShardState.GUILDS_READY);
        }, this.options.guildsReadyTimeout).unref();
    }

    /**
     * Closes the connection and cleans up variables on the shard to spawn a new connection.
     */
    private _close (reason: string, code: number): void {
        if (this.ws) {
            this.ws.removeAllListeners();

            if (this.ws.readyState !== WebSocket.CLOSED) {
                try {
                    this.ws.close(code, reason);
                    this._log(`Closed connection (Code ${code}, reason "${reason}")`, {
                        level: `DEBUG`, system: this.system
                    });
                } catch {
                    this.ws.terminate();
                    this._log(`Terminated connection`, {
                        level: `DEBUG`, system: this.system
                    });
                }
            }

            this.ws = null;
        }

        if (this.state === GatewayShardState.IDLE) {
            this.lastSequence = null;
            this.sessionId = null;
        }

        this.guilds = new Set();
        this.heartbeatPing = 0;
        this.waitingForGuilds = null;

        if (this._timers.guilds) {
            clearTimeout(this._timers.guilds);
            this._timers.guilds = null;
        }

        if (this._timers.heartbeat) {
            clearInterval(this._timers.heartbeat);
            this._timers.heartbeat = null;
        }

        this._timestamps = {
            lastHeartbeat: null,
            lastHeartbeatAck: null
        };

        this._log(`Cleaned up shard`, {
            level: `DEBUG`, system: this.system
        });
    }

    /**
     * Enter a state.
     * @param state The state to enter.
     */
    private _enterState (state: GatewayShardState): void {
        if (this.state !== state) {
            this.state = state;

            this._log(GatewayShardState[state], {
                level: `DEBUG`, system: this.system
            });

            (this.emit as (event: string) => void)(GatewayShardState[state]);
        }
    }

    /**
     * Send the [identify payload](https://discord.com/developers/docs/topics/gateway#identify).
     */
    private async _identify (): Promise<void> {
        return await this.send({
            op: DiscordTypes.GatewayOpcodes.Identify,
            d: {
                intents: this.options.intents,
                large_threshold: this.options.largeGuildThreshold,
                presence: (this.options.presence as any) ?? undefined,
                properties: {
                    browser: `distype`,
                    device: `distype`,
                    os: process.platform
                },
                shard: [this.id, this.numShards],
                token: this._token
            }
        });
    }

    /**
     * Send the [resume payload](https://discord.com/developers/docs/topics/gateway#resume).
     */
    private async _resume (): Promise<void> {
        if (this.lastSequence === null || this.sessionId === null) throw new Error(`Cannot resume; lastSequence and / or sessionId is not defined`);

        return await this.send({
            op: DiscordTypes.GatewayOpcodes.Resume,
            d: {
                seq: this.lastSequence,
                session_id: this.sessionId,
                token: this._token
            }
        });
    }

    /**
     * Sends a heartbeat.
     * @param force If waiting for the ACK check should be omitted. Only use for responding to heartbeat requests.
     */
    private _sendHeartbeat (force = false): void {
        if (this._timestamps.lastHeartbeatAck !== null && !force) {
            this._log(`Not receiving heartbeat ACKs (Zombified Connection), restarting...`, {
                level: `WARN`, system: this.system
            });
            this._enterState(GatewayShardState.DISCONNECTED);
            this._spawn();
        } else {
            this.send(({
                op: DiscordTypes.GatewayOpcodes.Heartbeat,
                d: this.lastSequence
            })).then(() => {
                this._timestamps.lastHeartbeat = Date.now();
            }).catch((error) => {
                this._timestamps.lastHeartbeatAck = null;
                this._log(`Failed to send heartbeat: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                    level: `WARN`, system: this.system
                });
            });
        }
    }

    /**
     * Spawns the shard.
     * @param attempt The current attempt count.
     */
    private async _spawn (attempt = 1): Promise<void> {
        return await new Promise<void>((resolve, reject) => {
            this._close(`Respawning`, this.state === GatewayShardState.IDLE ? 1000 : 4000);

            this._enterState(GatewayShardState.CONNECTING);
            this._log(`Connecting... (Attempt ${attempt})`, {
                level: `DEBUG`, system: this.system
            });

            const closedListener = ((): void => {
                this.removeListener(`READY`, readyListener);
                reject(new Error(`Connection closed while spawning`));
            }).bind(this);

            const readyListener = ((): void => {
                this.removeListener(`IDLE`, closedListener);
                this.removeListener(`DISCONNECTED`, closedListener);
                resolve();
            }).bind(this);

            this.once(`IDLE`, closedListener);
            this.once(`DISCONNECTED`, closedListener);
            this.once(`READY`, readyListener);

            this.ws = new WebSocket(this.url, this.options.wsOptions);

            this.ws.once(`open`, () => {
                this._log(`WebSocket open`, {
                    level: `DEBUG`, system: this.system
                });
            });

            this.ws!.on(`close`, this._wsOnClose.bind(this));
            this.ws!.on(`error`, this._wsOnError.bind(this));
            this.ws!.on(`message`, this._wsOnMessage.bind(this));
        }).catch(async () => {
            if (this.state === GatewayShardState.IDLE) {
                this._close(`Shard killed`, 1000);
                return Promise.reject(new Error(`Shard killed`));
            } else {
                await wait(this.options.spawnAttemptDelay);
                return await this._spawn(attempt + 1);
            }
        });
    }

    /**
     * Unpack a payload.
     * @param payload The payload.
     * @param isBinary If the payload is binary.
     * @returns The unpacked payload.
     */
    private _unpackPayload (payload: ArrayBuffer | Buffer, isBinary: boolean): DiscordTypes.GatewayReceivePayload | null {
        try {
            const raw = new Uint8Array(payload);

            if (!isBinary) {
                return JSON.parse(this._textDecoder.decode(raw));
            } else {
                this._log(`Got binary payload; unable to unpack`, {
                    level: `DEBUG`, system: this.system
                });

                return null;
            }
        } catch (error: any) {
            this._log(`Unable to unpack payload: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                level: `WARN`, system: this.system
            });

            return null;
        }
    }

    /**
     * When the WebSocket emits a close event.
     */
    private _wsOnClose (code: number, reason: Buffer): void {
        let parsedReason;
        try {
            parsedReason = reason.toString();
        } catch (error: any) {
            this._log(`Unable to parse close reason: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                level: `WARN`, system: this.system
            });
        }

        this._log(`Received close code ${code} with reason "${parsedReason ?? `[Unknown Reason]`}"`, {
            level: `WARN`, system: this.system
        });

        if (DiscordConstants.GATEWAY.CLOSE_CODES.NOT_RECONNECTABLE.includes(code)) {
            this.kill(`Connection Closed with code ${code}`);
        } else {
            this._enterState(GatewayShardState.DISCONNECTED);
            this._spawn();
        }
    }

    /**
     * When the WebSocket emits an error event.
     */
    private _wsOnError (error: Error): void {
        this._log((error?.message ?? error) ?? `Unknown WebSocket error`, {
            level: `ERROR`, system: this.system
        });
    }

    /**
     * When the WebSocket emits a message event.
     */
    private _wsOnMessage (payload: RawData, isBinary: boolean): void {
        const parsedPayload = this._unpackPayload(payload as ArrayBuffer | Buffer, isBinary);
        if (!parsedPayload) return;

        if (parsedPayload.s !== null) this.lastSequence = parsedPayload.s;

        switch (parsedPayload.op) {
            case DiscordTypes.GatewayOpcodes.Dispatch: {
                switch (parsedPayload.t) {
                    case DiscordTypes.GatewayDispatchEvents.Ready: {
                        this.sessionId = parsedPayload.d.session_id;

                        parsedPayload.d.guilds.forEach((guild) => this.guilds.add(guild.id));

                        this._enterState(GatewayShardState.READY);

                        if ((DiscordConstants.GATEWAY.INTENTS.GUILDS & this.options.intents) === DiscordConstants.GATEWAY.INTENTS.GUILDS) {
                            this.waitingForGuilds = new Set(parsedPayload.d.guilds.map((guild) => guild.id));
                            this._checkGuilds();
                        } else {
                            this._enterState(GatewayShardState.GUILDS_READY);
                        }

                        break;
                    }

                    case DiscordTypes.GatewayDispatchEvents.Resumed: {
                        this._enterState(GatewayShardState.READY);
                        break;
                    }

                    case DiscordTypes.GatewayDispatchEvents.GuildCreate: {
                        this.guilds.add(parsedPayload.d.id);
                        if (this.state < GatewayShardState.GUILDS_READY && this.waitingForGuilds) {
                            this.waitingForGuilds.delete(parsedPayload.d.id);
                            this._checkGuilds();
                        }
                        break;
                    }

                    case DiscordTypes.GatewayDispatchEvents.GuildDelete: {
                        if (!parsedPayload.d.unavailable) {
                            this.guilds.delete(parsedPayload.d.id);
                        }
                    }
                }

                this.emit(`RECEIVED_PAYLOAD`, parsedPayload);

                break;
            }

            case DiscordTypes.GatewayOpcodes.Heartbeat: {
                this._log(`Got heartbeat request`, {
                    level: `DEBUG`, system: this.system
                });

                this._sendHeartbeat(true);

                break;
            }

            case DiscordTypes.GatewayOpcodes.Reconnect: {
                this._log(`Got Reconnect (opcode ${DiscordTypes.GatewayOpcodes.Reconnect})`, {
                    level: `INFO`, system: this.system
                });

                this._enterState(GatewayShardState.DISCONNECTED);
                this._spawn();

                break;
            }

            case DiscordTypes.GatewayOpcodes.InvalidSession: {
                this._log(`Got ${parsedPayload.d ? `resumable` : `non-resumable`} Invalid Session (opcode ${DiscordTypes.GatewayOpcodes.InvalidSession})`, {
                    level: `INFO`, system: this.system
                });

                this._enterState(GatewayShardState.CONNECTING);
                if (parsedPayload.d) {
                    this._resume();
                } else {
                    this._identify();
                }

                break;
            }

            case DiscordTypes.GatewayOpcodes.Hello: {
                this._log(`Got Hello`, {
                    level: `DEBUG`, system: this.system
                });

                this._timers.heartbeat = setTimeout(() => {
                    this._sendHeartbeat();
                    this._timers.heartbeat = setInterval(() => {
                        this._sendHeartbeat();
                    }, parsedPayload.d.heartbeat_interval);
                }, parsedPayload.d.heartbeat_interval * 0.5);

                if (this.lastSequence !== null && this.sessionId !== null) {
                    this._resume();
                } else {
                    this._identify();
                }

                break;
            }

            case DiscordTypes.GatewayOpcodes.HeartbeatAck: {
                if (this._timestamps.lastHeartbeat !== null) {
                    this.heartbeatPing = Date.now() - this._timestamps.lastHeartbeat;
                    this._timestamps.lastHeartbeatAck = null;
                }

                this._log(`Heartbeat ACK (Heartbeat ping at ${this.heartbeatPing}ms)`, {
                    level: `DEBUG`, system: this.system
                });

                break;
            }

            default: {
                break;
            }
        }
    }
}
