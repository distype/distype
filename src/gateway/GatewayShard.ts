import { ClientOptions, RawData, WebSocket } from 'ws';
import { EventEmitter } from '@jpbberry/typed-emitter';
import * as DiscordTypes from 'discord-api-types';

/**
 * Gateway shard events.
 */
export interface GatewayShardEvents {
    /**
     * When the shard receives a payload. Data is the parsed payload.
     */
    '*': DiscordTypes.GatewayDispatchPayload // eslint-disable-line quotes
    /**
     * Debugging event. Data is the message.
     */
    DEBUG: string
    /**
     * When the shard gets a ready dispatch. Data is the `READY` payload.
     */
    READY: DiscordTypes.GatewayReadyDispatch
    /**
     * When the shard gets a resumed dispatch. Data is the `RESUMED` payload.
     */
    RESUMED: DiscordTypes.GatewayResumedDispatch
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT: string
    /**
     * When the shard enters a disconnected state.
     */
    STATE_DISCONNECTED: null
    /**
     * When the shard enters a connecting state.
     */
    STATE_CONNECTING: null
    /**
     * When the shard enters a resuming state.
     */
    STATE_RESUMING: null
    /**
     * When the shard enters a connected state.
     */
    STATE_CONNECTED: null
}

/**
 * Gateway shard options.
 */
export interface GatewayShardOptions {
    /**
     * Gateway intents.
     */
    intents: number
    /**
     * The number of members in a guild to reach before the gateway stops sending offline members in the guild member list.
     * Must be between 50 and 250.
     * @default 50
     */
    largeGuildThreshold?: number
    /**
     * The total number of shards being spawned / the value to pass to `num_shards` in the identify payload.
     */
    numShards: number
    /**
     * The initial presence for the bot to use.
     */
    presence?: Required<DiscordTypes.GatewayIdentifyData>[`presence`]
    /**
     * The number of milliseconds to wait between spawn and resume attempts.
     * @default 2500
     */
    spawnAttemptDelay?: number
    /**
     * The maximum number of spawn attempts before rejecting.
     * @default 10
     */
    spawnMaxAttempts?: number
    /**
     * The time in milliseconds to wait until considering a spawn or resume attempt timed out.
     * @default 30000
     */
    spawnTimeout?: number
    /**
     * The URL for the socket to connect to.
     */
    url: string
    /**
     * Advanced [ws](https://github.com/websockets/ws) options.
     * [`ws` API Reference](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketaddress-protocols-options)
     */
    wsOptions?: ClientOptions
}

/**
 * Gateway shard states.
 */
export enum GatewayShardState {
    /**
     * The shard is disconnected.
     */
    DISCONNECTED,
    /**
     * The shard is connecting. `GatewayShard#_ws` may be defined, however the connection process has not finished.
     * During this stage, the `GatewayShard`:
     * - Waits for an opcode 10 "hello" payload
     * - Responds with a heartbeat
     * - Waits for the first heartbeat ACK
     * - Sends an identify payload
     * - Waits for the ready event
     */
    CONNECTING,
    /**
     * The shard is resuming. `GatewayShard#_ws` may be defined, however the resuming process has not finished.
     * During this stage, the `GatewayShard`:
     * - Sends a resume payload
     * - Waits for the resumed event
     */
    RESUMING,
    /**
     * The shard is connected and is operating normally. A ready or resume event has been received.
     */
    CONNECTED,
}

/**
 * A single gateway shard.
 * Handles the low level ws communication with Discord.
 */
export class GatewayShard extends EventEmitter<GatewayShardEvents> {
    /**
     * The last sequence number received.
     */
    public lastSequence: number | null = null;
    /**
     * The shard's session ID.
     */
    public sessionId: string | null = null;
    /**
     * The state of the shard's connection.
     */
    public state: GatewayShardState = GatewayShardState.DISCONNECTED;

    /**
     * The shard's ID.
     */
    public readonly id: number;
    /**
     * Options for the gateway shard.
     */
    public readonly options: Required<GatewayShardOptions>;
    /**
     * The bot's token.
     */
    // @ts-expect-error Property 'token' has no initializer and is not definitely assigned in the constructor.
    public readonly token: string;

    /**
     * A timeout used when connecting or resuming the shard.
     */
    private _connectionTimeout: NodeJS.Timeout | null = null;
    /**
     * Heartbeat properties.
     */
    private _heartbeat: {
        interval: NodeJS.Timer | null
        send: () => void
        waiting: boolean
    } = {
            interval: null,
            send: () => {
                if (this._heartbeat.waiting) {
                    this.emit(`DEBUG`, `Not receiving heartbeat ACKs; restarting`);
                    void this.restart();
                } else {
                    this.send({
                        op: DiscordTypes.GatewayOpcodes.Heartbeat,
                        d: this.lastSequence
                    }, true).then(() => {
                        this._heartbeat.waiting = true;
                        this.emit(`DEBUG`, `Sent heartbeat`);
                    }).catch((error) => this.emit(`DEBUG`, `Failed to send heartbeat: ${(error as Error).name} | ${(error as Error).message}`));
                }
            },
            waiting: false
        };
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
     * Create a gateway shard.
     * @param token The bot's token.
     * @param id The shard's ID.
     * @param options Gateway shard options.
     */
    constructor(token: string, id: number, options: Required<GatewayShardOptions>) {
        super();

        if (!token) throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });

        this.id = id;
        this.options = options;
    }

    /**
     * Connect to the gateway.
     * The shard must be in a `DISCONNECTED` state.
     * @returns The ready payload.
     */
    public async spawn(): Promise<DiscordTypes.GatewayReadyDispatch> {
        if (this.state !== GatewayShardState.DISCONNECTED) {
            const error = new Error(`Cannot spawn when the shard isn't in a disconnected state`);
            this.emit(`DEBUG`, `Failed to spawn shard: ${error.name} | ${error.message}`);
            throw error;
        }

        this.emit(`DEBUG`, `Starting spawning attempts`);
        for (let i = 0; i < this.options.spawnMaxAttempts; i++) {
            this.emit(`DEBUG`, `Starting shard spawn attempt`);
            this._clearTimers();
            this._enterState(GatewayShardState.CONNECTING);

            const attempt: DiscordTypes.GatewayReadyDispatch | Error = await this._initConnection(false).catch((error: Error) => error).catch((error: Error) => error);

            this.emit(`DEBUG`, `Spawning attempt ${attempt instanceof Error ? `rejected` : `resolved`}`);
            if (!(attempt instanceof Error)) {
                this.emit(`DEBUG`, `Spawning attempts resolved with success; shard is ready`);
                return attempt;
            } else if (i !== this.options.spawnMaxAttempts - 1) await new Promise((resolve) => setTimeout(resolve, this.options.spawnAttemptDelay));
        }
        this.emit(`DEBUG`, `Unable to spawn shard after ${this.options.spawnMaxAttempts} attempts`);
        throw new Error(`Unable to spawn shard after ${this.options.spawnMaxAttempts} attempts`);
    }

    /**
     * Restart / resume the shard.
     */
    public async restart(): Promise<DiscordTypes.GatewayResumedDispatch> {
        if (this.state !== GatewayShardState.DISCONNECTED && this.state !== GatewayShardState.CONNECTED) {
            const error = new Error(`Cannot resume when the shard isn't in a disconnected or connected state`);
            this.emit(`DEBUG`, `Failed to spawn shard: ${error.name} | ${error.message}`);
            throw error;
        }

        this.emit(`DEBUG`, `Starting resume attempts`);
        for (; ;) {
            this.emit(`DEBUG`, `Starting shard resume attempt`);
            if (this._ws) this.kill(1012, `Restarting shard`);
            else this._clearTimers();
            this._enterState(GatewayShardState.RESUMING);

            const attempt: DiscordTypes.GatewayResumedDispatch | Error = await this._initConnection(true).catch((error: Error) => error);

            this.emit(`DEBUG`, `Resume attempt ${attempt instanceof Error ? `rejected` : `resolved`}`);
            if (!(attempt instanceof Error)) {
                this.emit(`DEBUG`, `Resume attempts resolved with success; shard is ready`);
                return attempt;
            } else await new Promise((resolve) => setTimeout(resolve, this.options.spawnAttemptDelay));
        }

    }

    /**
     * Kill the shard.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code).
     * @param reason The reason the shard is being killed.
     */
    public kill(code = 1000, reason = `Manual kill`): void {
        this.emit(`DEBUG`, `Killing shard with code ${code} for reason ${reason}`);

        if (this._pendingStartReject) {
            this._pendingStartReject(new Error(`Shard killed before connection was initiated`));
            this._pendingStartReject = null;
            this.emit(`DEBUG`, `Stopped connection attempt`);
        }

        this._clearTimers();
        this._ws?.removeAllListeners();
        if (this._ws?.readyState === WebSocket.OPEN) this._ws?.close(code);
        this._ws = null;
        this.emit(`DEBUG`, `Killed shard with code ${code} for reason ${reason}`);

        this._enterState(GatewayShardState.DISCONNECTED);
    }

    /**
     * Send a payload.
     * @param data The data to send.
     * @param force If the payload should bypass the send queue and always be sent immediately. Note that the queue is only used to cache `GatewayShard#send()` calls before the shard is in a `CONNECTED` state, so this option will have no effect when the shard is spawned. The queue is flushed after the shard receives the `READY` event. This option is primarily used internally, for dispatches such as a heartbeat or identify.
     */
    public async send(data: DiscordTypes.GatewaySendPayload, force = false): Promise<void> {
        return await new Promise((resolve, reject) => {
            const payload = JSON.stringify(data);

            if (!force && this.state !== GatewayShardState.CONNECTED) {
                this._spawnSendQueue.push({
                    payload, reject, resolve
                });
                this.emit(`DEBUG`, `Pushed payload "${payload}" to the send queue`);
            } else this._send(payload).then(resolve).catch(reject);
        });
    }

    /**
     * Clears timers on the shard.
     */
    private _clearTimers(): void {
        if (this._connectionTimeout) {
            clearTimeout(this._connectionTimeout);
            this._connectionTimeout = null;
        }
        if (this._heartbeat.interval) {
            clearInterval(this._heartbeat.interval);
            this._heartbeat.interval = null;
        }
        this.emit(`DEBUG`, `Cleared timers`);
    }

    /**
     * Set the shard's state.
     * @param state The state to set the shard to.
     */
    private _enterState(state: GatewayShardState): void {
        switch (state) {
            case (GatewayShardState.DISCONNECTED): {
                this.state = GatewayShardState.DISCONNECTED;
                this.emit(`STATE_DISCONNECTED`, null);
                this.emit(`DEBUG`, `Entered "DISCONNECTED" state`);
                break;
            }

            case (GatewayShardState.CONNECTING): {
                this.state = GatewayShardState.CONNECTING;
                this.emit(`STATE_CONNECTING`, null);
                this.emit(`DEBUG`, `Entered "CONNECTING" state`);
                break;
            }

            case (GatewayShardState.RESUMING): {
                this.state = GatewayShardState.RESUMING;
                this.emit(`STATE_RESUMING`, null);
                this.emit(`DEBUG`, `Entered "RESUMING" state`);
                break;
            }

            case (GatewayShardState.CONNECTED): {
                this.state = GatewayShardState.CONNECTED;
                this.emit(`STATE_CONNECTED`, null);
                this.emit(`DEBUG`, `Entered "CONNECTED" state`);
                break;
            }
        }
    }

    /**
     * Flushes the send queue.
     */
    private async _flushQueue(): Promise<void> {
        this.emit(`DEBUG`, `Flushing queue`);
        for (const send of this._spawnSendQueue) {
            await this._send(send.payload).then(send.resolve).catch(send.reject);
        }
        this.emit(`DEBUG`, `Flushed queue`);
    }

    /**
     * Initiates the socket connection.
     * Creates `GatewayManager#_ws`, waits for open, binds events, then returns.
     * This method does not wait for a ready or resumed event.
     * Expects the shard to be in a "CONNECTING" or "RESUMING" state.
     * @param resume If the shard is being resumed.
     */
    private async _initConnection<T extends boolean>(resume: T): Promise<T extends true ? DiscordTypes.GatewayResumedDispatch : DiscordTypes.GatewayReadyDispatch> {
        this.emit(`DEBUG`, `Initiating WebSocket connection`);

        if (this.state !== GatewayShardState.CONNECTING && this.state !== GatewayShardState.RESUMING) {
            const error = new Error(`Cannot initiate a connection when the shard isn't in a connecting or resuming state`);
            this.emit(`DEBUG`, `Failed to connect shard: ${error.name} | ${error.message}`);
            throw error;
        }

        return await new Promise((resolve, reject) => {
            if (this._pendingStartReject) {
                this._pendingStartReject(new Error(`Shard initiated connection attempt before connection was initiated`));
                this.emit(`DEBUG`, `Stopped connection attempt`);
            }
            this._pendingStartReject = reject;

            this._connectionTimeout = setTimeout(() => {
                const error = new Error(`Timed out while connecting shard`);
                this.emit(`DEBUG`, `Failed to connect shard: ${error.name} | ${error.message}`);

                this._ws?.removeAllListeners();
                this._ws = null;
                this._clearTimers();
                this._enterState(GatewayShardState.DISCONNECTED);
                reject(error);
            }, this.options.spawnTimeout);

            this._ws = new WebSocket(this.options.url, this.options.wsOptions);
            this.emit(`DEBUG`, `Created WebSocket`);

            this._ws.once(`error`, (error) => {
                this.emit(`DEBUG`, `Failed to connect shard: ${error.name} | ${error.message}`);

                this._ws?.removeAllListeners();
                this._ws = null;
                this._clearTimers();
                this._enterState(GatewayShardState.DISCONNECTED);
                reject(error);
            });

            this._ws.once(`open`, () => {
                this.emit(`DEBUG`, `WebSocket open`);
                this._clearTimers();

                this._ws!.removeAllListeners();
                this._ws!.on(`close`, this._onClose.bind(this));
                this._ws!.on(`error`, this._onError.bind(this));
                this._ws!.on(`message`, this._onMessage.bind(this));
                this.emit(`DEBUG`, `WebSocket events bound`);

                this.emit(`DEBUG`, `WebSocket connection initiated successfully`);

                if (!resume) {
                    this.once(`READY`, (data) => {
                        this.emit(`DEBUG`, `Successfully spawned shard`);
                        this._pendingStartReject = null;
                        resolve(data as any);
                    });
                } else {
                    this.once(`RESUMED`, (data) => {
                        this.emit(`DEBUG`, `Successfully resumed shard`);
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
    private async _send(payload: string): Promise<void> {
        return await new Promise((resolve, reject) => {
            if (!this._ws || this._ws.readyState !== WebSocket.OPEN) {
                const error = new Error(`The shard's socket must be defined and open to send a payload`);
                this.emit(`DEBUG`, `Failed to send payload "${payload}": ${error.name} | ${error.message}`);
                return reject(error);
            }

            this.emit(`DEBUG`, `Sending payload "${payload}"`);
            this._ws.send(payload, (error) => {
                if (error) {
                    this.emit(`DEBUG`, `Failed to send payload "${payload}": ${error.name} | ${error.message}`);
                    reject(error);
                } else {
                    this.emit(`SENT`, payload);
                    this.emit(`DEBUG`, `Successfully sent payload "${payload}"`);
                    resolve();
                }
            });
        });
    }

    /**
     * Listener used for `GatewayShard#_ws#on('close')`
     * @internal
     */
    private _onClose(code: number, reason: Buffer): void {
        this.emit(`DEBUG`, `WebSocket close: ${code} | ${reason.toString(`utf-8`)}`);
        this._clearTimers();
        this._enterState(GatewayShardState.DISCONNECTED);
        void this.restart();
    }

    /**
     * Listener used for `GatewayShard#_ws#on('error')`
     * @internal
     */
    private _onError(error: Error) {
        this.emit(`DEBUG`, `WebSocket error: ${error.name} | ${error.message}`);
    }

    /**
     * Listener used for `GatewayShard#_ws#on('message')`
     * @internal
     */
    private _onMessage(data: RawData) {
        try {
            this.emit(`DEBUG`, `WebSocket got message`);
            if (Array.isArray(data)) data = Buffer.concat(data);
            else if (data instanceof ArrayBuffer) data = Buffer.from(data);
            const payload: DiscordTypes.GatewayReceivePayload = JSON.parse(data.toString());
            this.emit(`DEBUG`, `WebSocket parsed message`);

            if (payload.s && this.state !== GatewayShardState.DISCONNECTED && this.state !== GatewayShardState.RESUMING) {
                this.lastSequence = payload.s;
                this.emit(`DEBUG`, `Updated last sequence number: ${this.lastSequence}`);
            }

            switch (payload.op) {
                case (DiscordTypes.GatewayOpcodes.Dispatch): {
                    this.emit(`DEBUG`, `Got dispatch "${payload.t}"`);

                    if (payload.t === `READY`) {
                        this._enterState(GatewayShardState.CONNECTED);
                        this.sessionId = payload.d.session_id;
                        this.emit(`READY`, payload);
                        this.emit(`DEBUG`, `READY`);
                        void this._flushQueue();
                    }

                    if (payload.t === `RESUMED`) {
                        this._enterState(GatewayShardState.CONNECTED);
                        this.emit(`RESUMED`, payload);
                        this.emit(`DEBUG`, `RESUMED`);
                        void this._flushQueue();
                    }

                    this.emit(`*`, payload as any);
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.Heartbeat): {
                    this.emit(`DEBUG`, `Got heartbeat request`);
                    this._heartbeat.send();
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.Reconnect): {
                    this.emit(`DEBUG`, `Got reconnect request`);
                    void this.restart();
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.InvalidSession): {
                    this.emit(`DEBUG`, `Got invalid session`);

                    if (payload.d) void this.restart();
                    else {
                        this.kill(1000, `Received invalid session`);
                        void this.spawn();
                    }

                    break;
                }

                case (DiscordTypes.GatewayOpcodes.Hello): {
                    this.emit(`DEBUG`, `Got hello`);

                    this._heartbeat.waiting = false;
                    this._heartbeat.send();
                    this._clearTimers();
                    this._heartbeat.interval = setInterval(() => this._heartbeat.send(), payload.d.heartbeat_interval);

                    if (this.state === GatewayShardState.CONNECTING) {
                        this.send({
                            op: 2,
                            d: {
                                compress: false,
                                intents: this.options.intents,
                                large_threshold: this.options.largeGuildThreshold,
                                presence: this.options.presence,
                                properties: {
                                    $browser: `boogcord`,
                                    $device: `boogcord`,
                                    $os: process.platform
                                },
                                shard: [this.id, this.options.numShards],
                                token: this.token,
                            }
                        }, true).catch((error) => this.emit(`DEBUG`, `Failed to send identify: ${(error as Error).name} | ${(error as Error).message}`));
                    } else if (this.state === GatewayShardState.RESUMING) {
                        if (this.sessionId && typeof this.lastSequence === `number`) {
                            this.send({
                                op: 6,
                                d: {
                                    token: this.token,
                                    session_id: this.sessionId,
                                    seq: this.lastSequence
                                }
                            }, true).catch((error) => this.emit(`DEBUG`, `Failed to send resume: ${(error as Error).name} | ${(error as Error).message}`));
                        } else {
                            void this.kill(1012, `Respawning shard - no session ID or last sequence`);
                            void this.spawn();
                        }

                    }

                    break;
                }

                case (DiscordTypes.GatewayOpcodes.HeartbeatAck): {
                    this.emit(`DEBUG`, `Got heartbeat ACK`);
                    this._heartbeat.waiting = false;
                    break;
                }
            }
        } catch (error) {
            this.emit(`DEBUG`, `Error in GatewayShard._onMessage(): ${(error as Error).name} | ${(error as Error).message}`);
        }
    }
}
