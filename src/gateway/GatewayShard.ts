import { Gateway } from './Gateway';

import { LogCallback } from '../types/Log';

import { TypedEmitter, wait } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
import { RawData, WebSocket } from 'ws';

/**
 * {@link GatewayShard Gateway shard} events.
 */
export interface GatewayShardEvents {
    /**
     * When the {@link GatewayShard shard} receives a payload. Data is the parsed payload.
     */
    '*': DiscordTypes.GatewayDispatchPayload // eslint-disable-line quotes
    /**
     * When the {@link GatewayShard shard} gets a ready dispatch. Data is the [ready payload](https://discord.com/developers/docs/topics/gateway#ready).
     */
    READY: DiscordTypes.GatewayReadyDispatch
    /**
     * When the {@link GatewayShard shard} gets a resumed dispatch. Data is the [resumed payload](https://discord.com/developers/docs/topics/gateway#resumed).
     */
    RESUMED: DiscordTypes.GatewayResumedDispatch
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT: string
    /**
     * When the {@link GatewayShard shard} enters a disconnected state.
     */
    STATE_DISCONNECTED: null
    /**
     * When the {@link GatewayShard shard} enters a connecting state.
     */
    STATE_CONNECTING: null
    /**
     * When the {@link GatewayShard shard} enters a resuming state.
     */
    STATE_RESUMING: null
    /**
     * When the {@link GatewayShard shard} enters a connected state.
     */
    STATE_CONNECTED: null
}

/**
 * {@link GatewayShard Gateway shard} states.
 */
export enum GatewayShardState {
    /**
     * The {@link GatewayShard shard} is disconnected.
     */
    DISCONNECTED,
    /**
     * The {@link GatewayShard shard} is connecting. `GatewayShard#_ws` may be defined, however the connection process has not finished.
     * During this stage, the {@link GatewayShard shard}:
     * - Waits for an opcode 10 "hello" payload
     * - Responds with a heartbeat
     * - Waits for the first heartbeat ACK
     * - Sends an identify payload
     * - Waits for the ready event
     */
    CONNECTING,
    /**
     * The {@link GatewayShard shard} is resuming. `GatewayShard#_ws` may be defined, however the resuming process has not finished.
     * During this stage, the {@link GatewayShard shard}:
     * - Sends a resume payload
     * - Waits for the resumed event
     */
    RESUMING,
    /**
     * The {@link GatewayShard shard} is connected and is operating normally. A [ready](https://discord.com/developers/docs/topics/gateway#ready) or [resumed](https://discord.com/developers/docs/topics/gateway#resumed) event has been received.
     */
    CONNECTED,
}

/**
 * A gateway shard.
 * Handles the low level ws communication with Discord.
 */
export class GatewayShard extends TypedEmitter<GatewayShardEvents> {
    /**
     * The last [sequence number](https://discord.com/developers/docs/topics/gateway#resumed) received.
     */
    public lastSequence: number | null = null;
    /**
     * The shard's [session ID](https://discord.com/developers/docs/topics/gateway#ready-ready-event-fields).
     */
    public sessionId: string | null = null;
    /**
     * The {@link GatewayShardState state} of the shard's connection.
     */
    public state: GatewayShardState = GatewayShardState.DISCONNECTED;

    /**
     * The shard's ID.
     */
    public readonly id: number;
    /**
     * The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     */
    public readonly numShards: number;
    /**
     * The URL being used to connect to the gateway.
     */
    public readonly url: string;
    /**
     * {@link GatewayShardOptions Options} for the gateway shard.
     * Note that if you are using a {@link Client} or {@link ClientMaster} / {@link ClientWorker} and not manually creating a {@link Client} separately, these options may differ than the options specified when creating the client due to them being passed through the {@link clientOptionsFactory}.
     */
    public readonly options: Gateway[`options`];

    /**
     * A timeout used when connecting or resuming the shard.
     */
    private _connectionTimeout: NodeJS.Timeout | null = null;
    /**
     * [Heartbeat](https://discord.com/developers/docs/topics/gateway#heartbeating) interval.
     */
    private _heartbeatInterval: NodeJS.Timer | null = null;
    /**
     * If the shard is waiting for a [heartbeat](https://discord.com/developers/docs/topics/gateway#heartbeating).
     */
    private _heartbeatWaiting = false;
    /**
     * The {@link LogCallback log callback} used by the shard.
     */
    private _log: LogCallback;
    /**
     * The pending reject callback for the promise starting the shard.
     */
    private _pendingStartReject: ((reason?: any) => void) | null = null;
    /**
     * A queue of payloads to be sent after the shard has spawned. Pushed to when the shard has not spawned, and flushed after the READY event is dispatched.
     */
    private _spawnSendQueue: Array<{
        payload: string
        reject: () => void
        resolve: () => void
    }> = [];
    /**
     * The websocket used by the shard.
     */
    private _ws: WebSocket | null = null;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a gateway shard.
     * @param token The bot's token.
     * @param id The shard's ID.
     * @param numShards The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     * @param url The URL being used to connect to the gateway.
     * @param options {@link GatewayShardOptions Gateway shard options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway shard.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor (token: string, id: number, numShards: number, url: string, options: Gateway[`options`], logCallback: LogCallback = (): void => {}, logThisArg?: any) {
        super();

        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);
        if (typeof id !== `number`) throw new TypeError(`A shard ID must be specified`);
        if (typeof numShards !== `number`) throw new TypeError(`numShards must be specified`);
        if (typeof url !== `string`) throw new TypeError(`A shard url must be specified`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as GatewayShard[`_token`],
            writable: false
        });

        this.id = id;
        this.numShards = numShards;
        this.url = url;

        this.options = options;

        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized gateway shard ${id}`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });
    }

    /**
     * Connect to the gateway.
     * The shard must be in a {@link GatewayShardState DISCONNECTED} state.
     * @returns The [ready payload](https://discord.com/developers/docs/topics/gateway#ready).
     */
    public async spawn (): Promise<DiscordTypes.GatewayReadyDispatch> {
        if (this.state !== GatewayShardState.DISCONNECTED) {
            const error = new Error(`Cannot spawn when the shard isn't in a disconnected state`);
            this._log(`Failed to spawn shard: ${error.message}`, {
                level: `ERROR`, system: `Gateway Shard ${this.id}`
            });
            throw error;
        }

        this._log(`Starting spawning attempts`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });

        for (let i = 0; i < this.options.spawnMaxAttempts; i++) {
            this._log(`Starting shard spawn attempt`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });
            this._clearTimers();
            this._enterState(GatewayShardState.CONNECTING);

            const attempt: DiscordTypes.GatewayReadyDispatch | Error = await this._initConnection(false).catch((error: Error) => error).catch((error: Error) => error);

            this._log(`Spawning attempt ${attempt instanceof Error ? `rejected` : `resolved`}`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });
            if (!(attempt instanceof Error)) {
                this._log(`Spawning attempts resolved with success; shard is ready`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
                return attempt;
            } else if (i !== this.options.spawnMaxAttempts - 1) await wait(this.options.spawnAttemptDelay);
        }

        const error = new Error(`Unable to spawn shard after ${this.options.spawnMaxAttempts} attempts`);
        this._log(error.message, {
            level: `ERROR`, system: `Gateway Shard ${this.id}`
        });
        throw error;
    }

    /**
     * Restart / resume the shard.
     * @returns The [resumed payload](https://discord.com/developers/docs/topics/gateway#resumed).
     */
    public async restart (): Promise<DiscordTypes.GatewayResumedDispatch> {
        if (this.state !== GatewayShardState.DISCONNECTED && this.state !== GatewayShardState.CONNECTED) {
            const error = new Error(`Cannot resume when the shard isn't in a disconnected or connected state`);
            this._log(`Failed to spawn shard: ${error.message}`, {
                level: `ERROR`, system: `Gateway Shard ${this.id}`
            });
            throw error;
        }

        this._log(`Starting resume attempts`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });

        for (; ;) {
            this._log(`Starting shard resume attempt`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });
            if (this._ws) this.kill(1012, `Restarting shard`);
            else this._clearTimers();
            this._enterState(GatewayShardState.RESUMING);

            const attempt: DiscordTypes.GatewayResumedDispatch | Error = await this._initConnection(true).catch((error: Error) => error);

            this._log(`Resume attempt ${attempt instanceof Error ? `rejected` : `resolved`}`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });
            if (!(attempt instanceof Error)) {
                this._log(`Resume attempts resolved with success; shard is ready`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
                return attempt;
            } else await wait(this.options.spawnAttemptDelay);
        }
    }

    /**
     * Kill the shard.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code).
     * @param reason The reason the shard is being killed.
     */
    public kill (code = 1000, reason = `Manual kill`): void {
        this._log(`Killing shard with code ${code} for reason ${reason}`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });

        if (this._pendingStartReject) {
            this._pendingStartReject(new Error(`Shard killed before connection was initiated`));
            this._pendingStartReject = null;
            this._log(`Stopped connection attempt`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });
        }

        this._clearTimers();
        this._ws?.removeAllListeners();
        if (this._ws?.readyState === WebSocket.OPEN) this._ws?.close(code);
        this._ws = null;
        this._log(`Killed shard with code ${code} for reason ${reason}`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });

        this._enterState(GatewayShardState.DISCONNECTED);
    }

    /**
     * Send a payload.
     * @param data The data to send.
     * @param force If the payload should bypass the send queue and always be sent immediately. Note that the queue is only used to cache `GatewayShard#send()` calls before the shard is in a {@link GatewayShardState CONNECTED} state, so this option will have no effect when the shard is spawned. The queue is flushed after the shard receives the [ready event](https://discord.com/developers/docs/topics/gateway#ready). This option is primarily used internally, for dispatches such as a heartbeat or identify.
     */
    public async send (data: DiscordTypes.GatewaySendPayload, force = false): Promise<void> {
        return await new Promise((resolve, reject) => {
            const payload = JSON.stringify(data);

            if (!force && this.state !== GatewayShardState.CONNECTED) {
                this._spawnSendQueue.push({
                    payload, reject, resolve
                });
                this._log(`Pushed payload "${payload}" to the send queue`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
            } else this._send(payload).then(resolve).catch(reject);
        });
    }

    /**
     * Clears timers on the shard.
     */
    private _clearTimers (): void {
        if (this._connectionTimeout) {
            clearTimeout(this._connectionTimeout);
            this._connectionTimeout = null;
        }
        if (this._heartbeatInterval) {
            clearInterval(this._heartbeatInterval);
            this._heartbeatInterval = null;
        }
        this._log(`Cleared timers`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });
    }

    /**
     * Set the shard's {@link GatewayShardState state}.
     * @param state The {@link GatewayShardState state} to set the shard to.
     */
    private _enterState (state: GatewayShardState): void {
        switch (state) {
            case (GatewayShardState.DISCONNECTED): {
                this.state = GatewayShardState.DISCONNECTED;
                this.emit(`STATE_DISCONNECTED`, null);
                this._log(`Entered "DISCONNECTED" state`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
                break;
            }

            case (GatewayShardState.CONNECTING): {
                this.state = GatewayShardState.CONNECTING;
                this.emit(`STATE_CONNECTING`, null);
                this._log(`Entered "CONNECTING" state`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
                break;
            }

            case (GatewayShardState.RESUMING): {
                this.state = GatewayShardState.RESUMING;
                this.emit(`STATE_RESUMING`, null);
                this._log(`Entered "RESUMING" state`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
                break;
            }

            case (GatewayShardState.CONNECTED): {
                this.state = GatewayShardState.CONNECTED;
                this.emit(`STATE_CONNECTED`, null);
                this._log(`Entered "CONNECTED" state`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
                break;
            }
        }
    }

    /**
     * Flushes the send queue.
     */
    private async _flushQueue (): Promise<void> {
        this._log(`Flushing queue`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });
        for (const send of this._spawnSendQueue) {
            await this._send(send.payload).then(send.resolve).catch(send.reject);
        }
        this._log(`Flushed queue`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });
    }

    /**
     * Initiates the socket connection.
     * Creates `GatewayManager#_ws`, waits for open, binds events, then returns.
     * This method does not wait for a [ready](https://discord.com/developers/docs/topics/gateway#ready) or [resumed](https://discord.com/developers/docs/topics/gateway#resumed) event.
     * Expects the shard to be in a {@link GatewayShardState CONNECTING} or {@link GatewayShardState RESUMING} state.
     * @param resume If the shard is being resumed.
     */
    private async _initConnection<T extends boolean> (resume: T): Promise<T extends true ? DiscordTypes.GatewayResumedDispatch : DiscordTypes.GatewayReadyDispatch> {
        this._log(`Initiating WebSocket connection`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });

        if (this.state !== GatewayShardState.CONNECTING && this.state !== GatewayShardState.RESUMING) {
            const error = new Error(`Cannot initiate a connection when the shard isn't in a connecting or resuming state`);
            this._log(`Failed to connect shard: ${error.message}`, {
                level: `ERROR`, system: `Gateway Shard ${this.id}`
            });
            throw error;
        }

        return await new Promise((resolve, reject) => {
            if (this._pendingStartReject) {
                this._pendingStartReject(new Error(`Shard initiated connection attempt before connection was initiated`));
                this._log(`Stopped connection attempt`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
            }
            this._pendingStartReject = reject;

            this._connectionTimeout = setTimeout(() => {
                const error = new Error(`Timed out while connecting shard`);
                this._log(`Failed to connect shard: ${error.message}`, {
                    level: `ERROR`, system: `Gateway Shard ${this.id}`
                });

                this._ws?.removeAllListeners();
                this._ws = null;
                this._clearTimers();
                this._enterState(GatewayShardState.DISCONNECTED);
                reject(error);
            }, this.options.spawnTimeout);

            this._ws = new WebSocket(this.url, this.options.wsOptions);
            this._log(`Created WebSocket`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });

            this._ws.once(`error`, (error) => {
                this._log(`Failed to connect shard: ${error.message}`, {
                    level: `ERROR`, system: `Gateway Shard ${this.id}`
                });

                this._ws?.removeAllListeners();
                this._ws = null;
                this._clearTimers();
                this._enterState(GatewayShardState.DISCONNECTED);
                reject(error);
            });

            this._ws.once(`open`, () => {
                this._log(`WebSocket open`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
                this._clearTimers();

                this._ws!.removeAllListeners();
                this._ws!.on(`close`, this._onClose.bind(this));
                this._ws!.on(`error`, this._onError.bind(this));
                this._ws!.on(`message`, this._onMessage.bind(this));
                this._log(`WebSocket events bound`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });

                this._log(`WebSocket connection initiated successfully`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });

                if (!resume) {
                    this.once(`READY`, (data) => {
                        this._log(`Successfully spawned shard`, {
                            level: `DEBUG`, system: `Gateway Shard ${this.id}`
                        });
                        this._pendingStartReject = null;
                        resolve(data as any);
                    });
                } else {
                    this.once(`RESUMED`, (data) => {
                        this._log(`Successfully resumed shard`, {
                            level: `DEBUG`, system: `Gateway Shard ${this.id}`
                        });
                        this._pendingStartReject = null;
                        resolve(data as any);
                    });
                }
            });
        });
    }

    /**
     * Sends a payload to the gateway. Used internally for `GatewayShard#send` and when flushing the queue in `GatewayShard#_flushQueue()`.
     * @param payload The payload to send.
     * @internal
     */
    private async _send (payload: string): Promise<void> {
        return await new Promise((resolve, reject) => {
            if (!this._ws || this._ws.readyState !== WebSocket.OPEN) {
                const error = new Error(`The shard's socket must be defined and open to send a payload`);
                this._log(`Failed to send payload "${payload}": ${error.message}`, {
                    level: `ERROR`, system: `Gateway Shard ${this.id}`
                });
                return reject(error);
            }

            this._log(`Sending payload "${payload}"`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });
            this._ws.send(payload, (error) => {
                if (error) {
                    this._log(`Failed to send payload "${payload}": ${error.message}`, {
                        level: `ERROR`, system: `Gateway Shard ${this.id}`
                    });
                    reject(error);
                } else {
                    this.emit(`SENT`, payload);
                    this._log(`Successfully sent payload "${payload}"`, {
                        level: `DEBUG`, system: `Gateway Shard ${this.id}`
                    });
                    resolve();
                }
            });
        });
    }

    /**
     * Sends a [heartbeat](https://discord.com/developers/docs/topics/gateway#heartbeating).
     * @param force If the ACK check should be omitted. Only use for responding to heartbeat requests.
     */
    private _sendHeartbeat (force = false): void {
        if (this._heartbeatWaiting && !force) {
            this._log(`Not receiving heartbeat ACKs; restarting`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });
            void this.restart();
        } else {
            this._heartbeatWaiting = true;
            this.send({
                op: DiscordTypes.GatewayOpcodes.Heartbeat,
                d: this.lastSequence
            }, true).then(() => {
                this._log(`Sent heartbeat`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
            }).catch((error) => {
                this._heartbeatWaiting = false;
                this._log(`Failed to send heartbeat: ${(error as Error).message}`, {
                    level: `ERROR`, system: `Gateway Shard ${this.id}`
                });
            });
        }
    }

    /**
     * Listener used for `GatewayShard#_ws#on('close')`
     * @internal
     */
    private _onClose (code: number, reason: Buffer): void {
        this._log(`WebSocket close: ${code}, ${reason.toString(`utf-8`)}`, {
            level: `DEBUG`, system: `Gateway Shard ${this.id}`
        });
        this._clearTimers();
        this._enterState(GatewayShardState.DISCONNECTED);
        void this.restart();
    }

    /**
     * Listener used for `GatewayShard#_ws#on('error')`
     * @internal
     */
    private _onError (error: Error): void {
        this._log(`WebSocket error: ${error.message}`, {
            level: `ERROR`, system: `Gateway Shard ${this.id}`
        });
    }

    /**
     * Listener used for `GatewayShard#_ws#on('message')`
     * @internal
     */
    private _onMessage (data: RawData): void {
        try {
            this._log(`WebSocket got message`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });
            if (Array.isArray(data)) data = Buffer.concat(data);
            else if (data instanceof ArrayBuffer) data = Buffer.from(data);
            const payload: DiscordTypes.GatewayReceivePayload = JSON.parse(data.toString());
            this._log(`WebSocket parsed message`, {
                level: `DEBUG`, system: `Gateway Shard ${this.id}`
            });

            if (payload.s && this.state !== GatewayShardState.DISCONNECTED && this.state !== GatewayShardState.RESUMING) {
                this.lastSequence = payload.s;
                this._log(`Updated last sequence number: ${this.lastSequence}`, {
                    level: `DEBUG`, system: `Gateway Shard ${this.id}`
                });
            }

            switch (payload.op) {
                case (DiscordTypes.GatewayOpcodes.Dispatch): {
                    this._log(`Got dispatch "${payload.t}"`, {
                        level: `DEBUG`, system: `Gateway Shard ${this.id}`
                    });

                    if (payload.t === `READY`) {
                        this.sessionId = payload.d.session_id;
                        this._enterState(GatewayShardState.CONNECTED);
                        this.emit(`READY`, payload);
                        this._log(`READY`, {
                            level: `DEBUG`, system: `Gateway Shard ${this.id}`
                        });
                        void this._flushQueue();
                    }

                    if (payload.t === `RESUMED`) {
                        this._enterState(GatewayShardState.CONNECTED);
                        this.emit(`RESUMED`, payload);
                        this._log(`RESUMED`, {
                            level: `DEBUG`, system: `Gateway Shard ${this.id}`
                        });
                        void this._flushQueue();
                    }

                    this.emit(`*`, payload as any);
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.Heartbeat): {
                    this._log(`Got heartbeat request`, {
                        level: `DEBUG`, system: `Gateway Shard ${this.id}`
                    });
                    this._sendHeartbeat(true);
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.Reconnect): {
                    this._log(`Got reconnect request`, {
                        level: `DEBUG`, system: `Gateway Shard ${this.id}`
                    });
                    void this.restart();
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.InvalidSession): {
                    this._log(`Got invalid session`, {
                        level: `DEBUG`, system: `Gateway Shard ${this.id}`
                    });

                    if (payload.d) void this.restart();
                    else {
                        this.kill(1000, `Received invalid session`);
                        void this.spawn();
                    }

                    break;
                }

                case (DiscordTypes.GatewayOpcodes.Hello): {
                    this._log(`Got hello`, {
                        level: `DEBUG`, system: `Gateway Shard ${this.id}`
                    });

                    this._heartbeatWaiting = false;
                    this._clearTimers();
                    wait(payload.d.heartbeat_interval * 0.5).then(() => {
                        this._sendHeartbeat();
                        this._heartbeatInterval = setInterval(() => this._sendHeartbeat(), payload.d.heartbeat_interval);
                    });

                    if (this.state === GatewayShardState.CONNECTING) {
                        this.send({
                            op: DiscordTypes.GatewayOpcodes.Identify,
                            d: {
                                compress: false,
                                intents: this.options.intents,
                                large_threshold: this.options.largeGuildThreshold,
                                presence: this.options.presence ?? undefined,
                                properties: {
                                    $browser: `distype`,
                                    $device: `distype`,
                                    $os: process.platform
                                },
                                shard: [this.id, this.numShards],
                                token: this._token
                            }
                        }, true).catch((error) => this._log(`Failed to send identify: ${(error as Error).message}`, {
                            level: `ERROR`, system: `Gateway Shard ${this.id}`
                        }));
                    } else if (this.state === GatewayShardState.RESUMING) {
                        if (this.sessionId && typeof this.lastSequence === `number`) {
                            this.send({
                                op: DiscordTypes.GatewayOpcodes.Resume,
                                d: {
                                    token: this._token,
                                    session_id: this.sessionId,
                                    seq: this.lastSequence
                                }
                            }, true).catch((error) => this._log(`Failed to send resume: ${(error as Error).message}`, {
                                level: `ERROR`, system: `Gateway Shard ${this.id}`
                            }));
                        } else {
                            void this.kill(1012, `Respawning shard - no session ID or last sequence`);
                            void this.spawn();
                        }
                    }

                    break;
                }

                case (DiscordTypes.GatewayOpcodes.HeartbeatAck): {
                    this._log(`Got heartbeat ACK`, {
                        level: `DEBUG`, system: `Gateway Shard ${this.id}`
                    });
                    this._heartbeatWaiting = false;
                    break;
                }
            }
        } catch (error) {
            this._log(`Error in GatewayShard._onMessage(): ${(error as Error).message}`, {
                level: `ERROR`, system: `Gateway Shard ${this.id}`
            });
        }
    }
}
