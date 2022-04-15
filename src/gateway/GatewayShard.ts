import { Gateway } from './Gateway';

import { DiscordConstants } from '../constants/DiscordConstants';
import { DistypeError, DistypeErrorType } from '../errors/DistypeError';
import { LogCallback } from '../types/Log';

import { TypedEmitter, wait } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
import { RawData, WebSocket } from 'ws';

/**
 * {@link GatewayShard Gateway shard} events.
 */
export interface GatewayShardEvents extends Record<string, (...args: any[]) => void> {
    /**
     * When the {@link GatewayShard shard} receives a payload. Data is the parsed payload.
     */
    RECEIVED_MESSAGE: (payload: DiscordTypes.GatewayDispatchPayload) => void
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT_PAYLOAD: (payload: string) => void
    /**
     * When the {@link GatewayShard shard} enters an {@link GatewayShardState idle state}.
     */
    IDLE: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState connecting state}.
     */
    CONNECTING: () => void
    /**
     * When the {@link GatewayShard shard} enters an {@link GatewayShardState identifying state}.
     */
    IDENTIFYING: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState resuming state}.
     */
    RESUMING: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState running state}.
     */
    RUNNING: () => void
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState disconnected state}.
     */
    DISCONNECTED: () => void
}

/**
 * {@link GatewayShard Gateway shard} states.
 */
export enum GatewayShardState {
    /**
     * The {@link GatewayShard shard} is not running, and is not pending a reconnect.
     */
    IDLE,
    /**
     * The {@link GatewayShard shard} is connecting to the gateway.
     * During this stage, the {@link GatewayShard shard}:
     * - Initiates the websocket connection
     * - Starts [heartbeating](https://discord.com/developers/docs/topics/gateway#heartbeating)
     */
    CONNECTING,
    /**
     * The {@link GatewayShard shard} is identifying.
     * During this stage, the {@link GatewayShard shard}:
     * - Waits for a [hello payload](https://discord.com/developers/docs/topics/gateway#hello)
     * - The shard sends an [identify payload](https://discord.com/developers/docs/topics/gateway#identify)
     * - Waits for the [ready event](https://discord.com/developers/docs/topics/gateway#ready)
     */
    IDENTIFYING,
    /**
     * The {@link GatewayShard shard} is resuming.
     * During this stage, the {@link GatewayShard shard}:
     * - Sends a [resume payload](https://discord.com/developers/docs/topics/gateway#resume)
     * - Waits for the [resumed event](https://discord.com/developers/docs/topics/gateway#resumed)
     */
    RESUMING,
    /**
     * The {@link GatewayShard shard} is connected and is operating normally. A [ready](https://discord.com/developers/docs/topics/gateway#ready) or [resumed](https://discord.com/developers/docs/topics/gateway#resumed) event has been received.
     */
    RUNNING,
    /**
     * The {@link GatewayShard shard} was disconnected.
     * Note that if the shard is not automatically reconnecting to the gateway, the shard will enter an `IDLE` state and will not enter a `DISCONNECTED` state.
     */
    DISCONNECTED
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
     * The shard's ping.
     */
    public ping = 0;
    /**
     * The shard's [session ID](https://discord.com/developers/docs/topics/gateway#ready-ready-event-fields).
     */
    public sessionId: string | null = null;
    /**
     * The shard's {@link GatewayShardState state}.
     */
    public state: GatewayShardState = GatewayShardState.DISCONNECTED;

    /**
     * The shard's ID.
     */
    public readonly id: number;
    /**
     * {@link GatewayShardOptions Options} for the gateway shard.
     * Note that if you are using a {@link Client} or {@link ClientMaster} / {@link ClientWorker} and not manually creating a {@link Client} separately, these options may differ than the options specified when creating the client due to them being passed through the {@link clientOptionsFactory}.
     */
    public readonly options: Gateway[`options`];
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    public readonly system: `Gateway Shard ${number}`;

    /**
     * The heartbeat interval timer.
     */
    private _heartbeatIntervalTimer: NodeJS.Timer | null = null;
    /**
     * The time that the heartbeat timer has been waiting for the jitter to start for.
     */
    private _heartbeatJitterActive: number | null = null;
    /**
     * The time the heartbeat has been waiting for an ACK for.
     */
    private _heartbeatWaitingSince: number | null = null;
    /**
     * If the shard was killed. Set back to `false` when a new conection attempt is started.
     */
    private _killed = false;
    /**
     * The {@link LogCallback log callback} used by the shard.
     */
    private _log: LogCallback;
    /**
     * A queue of data to be sent after the socket opens.
     */
    private _queue: Array<{
        data: string
        resolve: () => void
        reject: (error?: Error) => void
    }> = [];
    /**
     * If the shard has an active spawn or restart loop.
     */
    private _spinning = false;
    /**
     * The websocket used.
     */
    private _ws: WebSocket | null = null;

    /**
     * The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     */
    private readonly _numShards: number;
    /**
     * The URL being used.
     */
    private readonly _url: string;
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
     * @param options {@link GatewayShardOptions Gateway shard options}.
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
        this._numShards = numShards;
        this._url = url;
        this.options = options;

        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized gateway shard ${id}`, {
            level: `DEBUG`, system: this.system
        });
    }

    /**
     * If the shard can resume.
     */
    public get canResume (): boolean {
        return this.lastSequence !== null && this.sessionId !== null;
    }

    /**
     * Connect to the gateway.
     * The shard must be in a {@link GatewayShardState DISCONNECTED} state.
     * @returns The [ready payload](https://discord.com/developers/docs/topics/gateway#ready).
     */
    public async spawn (): Promise<void> {
        if (this._spinning) throw new DistypeError(`Shard is already connecting to the gateway`, DistypeErrorType.GATEWAY_SHARD_ALREADY_CONNECTING, this.system);

        this._spinning = true;
        this._killed = false;

        for (let i = 0; i < this.options.spawnMaxAttempts; i++) {
            const attempt = await this._initSocket(false).then(() => true, () => false);

            if (attempt) {
                this._spinning = false;
                this._log(`Spawned after ${i + 1} attempts`, {
                    level: `DEBUG`, system: this.system
                });
                return;
            }

            if (this._killed) {
                this._enterState(GatewayShardState.IDLE);

                this._log(`Spawning interruped by kill`, {
                    level: `DEBUG`, system: this.system
                });
                throw new DistypeError(`Shard spawn attempts interrupted by kill`, DistypeErrorType.GATEWAY_SHARD_INTERRUPT_FROM_KILL, this.system);
            }
        }

        this._spinning = false;
        this._enterState(GatewayShardState.IDLE);
        throw new DistypeError(`Failed to spawn shard after ${this.options.spawnMaxAttempts} attempts`, DistypeErrorType.GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED, this.system);
    }

    /**
     * Restart / resume the shard.
     * @returns The [resumed payload](https://discord.com/developers/docs/topics/gateway#resumed).
     */
    public async restart (): Promise<void> {
        if (this._spinning) throw new DistypeError(`Shard is already connecting to the gateway`, DistypeErrorType.GATEWAY_SHARD_ALREADY_CONNECTING, this.system);

        this._spinning = true;
        this._killed = false;

        for (let i = 1; ; i++) {
            const attempt = await this._initSocket(true).then(() => true, () => false);

            if (attempt) {
                this._log(`Restarted after ${i} attempts`, {
                    level: `DEBUG`, system: this.system
                });
                this._spinning = false;
                return;
            }

            if (this._killed) {
                this._enterState(GatewayShardState.IDLE);

                this._log(`Restarting interruped by kill`, {
                    level: `DEBUG`, system: this.system
                });
                throw new DistypeError(`Shard restart attempts interrupted by kill`, DistypeErrorType.GATEWAY_SHARD_INTERRUPT_FROM_KILL, this.system);
            }
        }
    }

    /**
     * Kill the shard.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code). Defaults to `1000`.
     * @param reason The reason the shard is being killed. Defaults to `"Manual kill"`.
     */
    public kill (code = 1000, reason = `Manual kill`): void {
        if (typeof code !== `number`) throw new TypeError(`Parameter "code" (number) type mismatch: got ${code} (${typeof code})`);
        if (typeof reason !== `string`) throw new TypeError(`Parameter "reason" (string) type mismatch: got ${reason} (${typeof reason})`);

        this._close(false, code, reason);
        this._enterState(GatewayShardState.IDLE);

        this._killed = true;

        this._log(`Shard killed with code ${code}, reason "${reason}"`, {
            level: `INFO`, system: this.system
        });
    }

    /**
     * Send data to the gateway.
     * @param data The data to send.
     */
    public async send (data: DiscordTypes.GatewaySendPayload): Promise<void> {
        if (typeof data !== `object`) throw new TypeError(`Parameter "data" (object) not provided: got ${data} (${typeof data})`);

        return await new Promise((resolve, reject) => {
            if (this.state !== GatewayShardState.RUNNING) {
                this._queue.push({
                    data: JSON.stringify(data), resolve, reject
                });
            } else {
                this._send(JSON.stringify(data)).then(resolve, reject);
            }
        });
    }

    /**
     * Closes the connection, cleans up helper variables and flushes the queue.
     * @param resuming If the shard will be resuming after the close.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code).
     * @param reason The reason the shard is being closed.
     */
    private _close (resuming: boolean, code: number, reason: string): void {
        this._log(`Closing... (Code ${code}, reason "${reason}")`, {
            level: `DEBUG`, system: this.system
        });

        this._flushQueue(true);

        this._ws?.removeAllListeners();
        if (this._ws?.readyState !== WebSocket.CLOSED) {
            try {
                this._ws?.close(code, reason);
            } catch {
                this._ws?.terminate();
            }
        }
        this._ws = null;

        this.ping = 0;

        if (this._heartbeatIntervalTimer !== null) {
            clearInterval(this._heartbeatIntervalTimer);
            this._heartbeatIntervalTimer = null;
        }
        this._heartbeatJitterActive = null;
        this._heartbeatWaitingSince = null;

        if (!resuming) {
            this.lastSequence = null;
            this.sessionId = null;
        }
    }

    /**
     * Enter a state.
     * @param state The state to enter.
     */
    private _enterState (state: GatewayShardState): void {
        if (this.state !== state) {
            this.state = state;
            (this.emit as (event: string) => void)(GatewayShardState[state]);

            this._log(GatewayShardState[state], {
                level: `DEBUG`, system: this.system
            });
        }
    }

    /**
     * Flushes the send queue.
     * @param reject If the queue shouldn't be sent, and all promises should be rejected.
     */
    private async _flushQueue (reject = false): Promise<void> {
        do {
            const next = this._queue.shift();
            if (next) {
                if (reject) next.reject(new DistypeError(`Send queue force flushed`, DistypeErrorType.GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED, this.system));
                else await this._send(next.data).then(next.resolve, next.reject);
            }
        }
        while (this._queue.length);

        this._log(`Flushed send queue`, {
            level: `DEBUG`, system: this.system
        });
    }

    /**
     * Sends a heartbeat.
     * @param force If waiting for the ACK check should be omitted. Only use for responding to heartbeat requests.
     */
    private _heartbeat (force = false): void {
        if (this._heartbeatWaitingSince !== null && !force) {
            this._log(`Not receiving heartbeat ACKs (Zombified Connection), restarting...`, {
                level: `WARN`, system: this.system
            });
            this._close(true, 4009, `Did not receive heartbeat ACK`);
            this._enterState(GatewayShardState.DISCONNECTED);
            this._reconnect(true);
        } else {
            this._send(JSON.stringify({
                op: DiscordTypes.GatewayOpcodes.Heartbeat,
                d: this.lastSequence
            })).then(() => {
                this._heartbeatWaitingSince = Date.now();
            }).catch((error) => {
                this._heartbeatWaitingSince = null;
                this._log(`Failed to send heartbeat: ${error.message}`, {
                    level: `ERROR`, system: this.system
                });
            });
        }
    }

    /**
     * Initiate the socket.
     * @param resume If the shard is resuming.
     */
    private async _initSocket (resume: boolean): Promise<void> {
        if (this.state !== GatewayShardState.IDLE && this.state !== GatewayShardState.DISCONNECTED) {
            this._close(resume, resume ? 4000 : 1000, `Restarting`);
            this._enterState(GatewayShardState.DISCONNECTED);
        }

        this._log(`Initiating socket... (Resuming: ${resume})`, {
            level: `DEBUG`, system: this.system
        });

        this._enterState(GatewayShardState.CONNECTING);

        try {
            return await new Promise((resolve, reject) => {
                this._ws = new WebSocket(this._url, this.options.wsOptions);

                const closeListener = ((code: number, reason: Buffer): void => reject(new DistypeError(`Socket closed with code ${code}: "${this._parsePayload(reason)}"`, DistypeErrorType.GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT, this.system))).bind(this);
                this._ws.once(`close`, closeListener);

                const errorListener = ((error: Error): void => reject(error)).bind(this);
                this._ws.once(`error`, errorListener);

                this._ws.once(`open`, () => {
                    this._log(`Socket open`, {
                        level: `DEBUG`, system: this.system
                    });

                    if (resume && this.canResume) this._enterState(GatewayShardState.RESUMING);
                    else this._enterState(GatewayShardState.IDENTIFYING);

                    this._ws!.on(`close`, this._wsOnClose.bind(this));
                    this._ws!.on(`error`, this._wsOnError.bind(this));
                    this._ws!.on(`message`, this._wsOnMessage.bind(this));

                    TypedEmitter.once(this, `RUNNING`).then(() => {
                        this._ws!.removeListener(`close`, closeListener);
                        this._ws!.removeListener(`error`, errorListener);

                        resolve();
                    });
                });
            });
        } catch (error) {
            this._close(resume, resume ? 4000 : 1000, `Failed to initialize shard`);
            this._enterState(GatewayShardState.DISCONNECTED);
            throw error;
        }
    }

    /**
     * Reconnect the shard.
     * @param resume If the shard should be resumed.
     */
    private _reconnect (resume: boolean): void {
        this._log(`Reconnecting...`, {
            level: `DEBUG`, system: this.system
        });

        if (resume) {
            void this.restart();
        } else {
            void this.spawn();
        }
    }

    /**
     * Send data to the gateway.
     * @param data The data to send.
     */
    private async _send (data: string): Promise<void> {
        if (typeof data !== `string`) throw new TypeError(`Parameter "data" (string) not provided: got ${data} (${typeof data})`);

        return await new Promise((resolve, reject) => {
            if (!this._ws || this._ws.readyState !== WebSocket.OPEN) {
                reject(new DistypeError(`Cannot send data when the socket is not in an OPEN state`, DistypeErrorType.GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET, this.system));
            } else {
                this._ws.send(data, (error) => {
                    if (error) reject(error);
                    else {
                        this.emit(`SENT_PAYLOAD`, data);

                        const op = JSON.parse(data).op;
                        this._log(`Sent payload (opcode ${op} ${DiscordTypes.GatewayOpcodes[op]})`, {
                            level: `DEBUG`, system: this.system
                        });

                        resolve();
                    }
                });
            }
        });
    }

    /**
     * Parses an incoming payload.
     * @param data The data to parse.
     * @returns The parsed data.
     */
    private _parsePayload (data: RawData): any {
        if (Array.isArray(data)) data = Buffer.concat(data);
        else if (data instanceof ArrayBuffer) data = Buffer.from(data);
        return JSON.parse(data.toString());
    }

    /**
     * When the socket emits a close event.
     */
    private _wsOnClose (code: number, reason: Buffer): void {
        const parsedReason = `Received close code ${code} with reason "${this._parsePayload(reason)}"`;

        this._log(parsedReason, {
            level: `DEBUG`, system: this.system
        });

        if (DiscordConstants.GATEWAY_CLOSE_CODES.NOT_RECONNECTABLE.includes(code)) {
            this.kill(1000, parsedReason);
        } else {
            this._close(true, 4000, parsedReason);
            this._enterState(GatewayShardState.DISCONNECTED);
            this._reconnect(true);
        }
    }

    /**
     * When the socket emits an error event.
     */
    private _wsOnError (error: Error): void {
        this._log(error.message, {
            level: `ERROR`, system: this.system
        });
    }

    /**
     * When the socket emits a message event.
     */
    private _wsOnMessage (data: RawData): void {
        const payload = this._parsePayload(data) as DiscordTypes.GatewayReceivePayload;

        if (payload.s !== null) this.lastSequence = payload.s;

        switch (payload.op) {
            case DiscordTypes.GatewayOpcodes.Dispatch: {
                this.emit(`RECEIVED_MESSAGE`, payload);

                if (payload.t === DiscordTypes.GatewayDispatchEvents.Ready) {
                    this.sessionId = payload.d.session_id;
                    this._enterState(GatewayShardState.RUNNING);
                } else if (payload.t === DiscordTypes.GatewayDispatchEvents.Resumed) {
                    this._enterState(GatewayShardState.RUNNING);
                }

                break;
            }

            case DiscordTypes.GatewayOpcodes.Heartbeat: {
                this._heartbeat(true);

                break;
            }

            case DiscordTypes.GatewayOpcodes.Reconnect: {
                this._close(true, 4000, `Got Reconnect (opcode ${DiscordTypes.GatewayOpcodes.Reconnect})`);
                this._enterState(GatewayShardState.DISCONNECTED);
                this._reconnect(true);

                break;
            }

            case DiscordTypes.GatewayOpcodes.InvalidSession: {
                this._close(!!payload.d, payload.d ? 4000 : 1000, `Got Invalid Session (opcode ${DiscordTypes.GatewayOpcodes.InvalidSession})`);
                this._enterState(GatewayShardState.DISCONNECTED);
                wait(2500).then(() => this._reconnect(!!payload.d));

                break;
            }

            case DiscordTypes.GatewayOpcodes.Hello: {
                this._log(`Got Hello`, {
                    level: `DEBUG`, system: this.system
                });

                const jitterActive = Date.now();
                this._heartbeatJitterActive = jitterActive;
                wait(payload.d.heartbeat_interval * 0.5).then(() => {
                    if (jitterActive === this._heartbeatJitterActive && (this.state === GatewayShardState.IDENTIFYING || this.state === GatewayShardState.RESUMING || this.state === GatewayShardState.RUNNING)) {
                        this._heartbeatJitterActive = null;
                        this._heartbeat();
                        if (this._heartbeatIntervalTimer !== null) clearInterval(this._heartbeatIntervalTimer);
                        this._heartbeatIntervalTimer = setInterval(() => this._heartbeat, payload.d.heartbeat_interval).unref();
                    }
                });

                if (this.state === GatewayShardState.RESUMING && this.canResume) {
                    this._send(JSON.stringify({
                        op: DiscordTypes.GatewayOpcodes.Resume,
                        d: {
                            seq: this.lastSequence,
                            session_id: this.sessionId,
                            token: this._token
                        }
                    } as DiscordTypes.GatewayResume));
                } else {
                    this._send(JSON.stringify({
                        op: DiscordTypes.GatewayOpcodes.Identify,
                        d: {
                            intents: this.options.intents,
                            large_threshold: this.options.largeGuildThreshold,
                            presence: this.options.presence ?? undefined,
                            properties: {
                                $browser: `distype`,
                                $device: `distype`,
                                $os: process.platform
                            },
                            shard: [this.id, this._numShards],
                            token: this._token
                        }
                    } as DiscordTypes.GatewayIdentify));
                }

                break;
            }

            case DiscordTypes.GatewayOpcodes.HeartbeatAck: {
                if (this._heartbeatWaitingSince !== null) {
                    this.ping = Date.now() - this._heartbeatWaitingSince;
                    this._heartbeatWaitingSince = null;
                }

                this._log(`Heartbeat ACK (Ping at ${this.ping}ms)`, {
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
