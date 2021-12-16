import { ClientOptions, RawData, WebSocket } from 'ws';
import { EventEmitter } from '@jpbberry/typed-emitter';
import * as DiscordTypes from 'discord-api-types';

/**
 * Gateway shard events.
 */
export interface GatewayShardEvents {
    /**
     * When the shard receives a payload.
     */
    '*': DiscordTypes.GatewayDispatchPayload // eslint-disable-line quotes
    /**
     * Debugging event.
     */
    DEBUG: string
    /**
     * When the shard gets a ready dispatch.
     */
    READY: DiscordTypes.GatewayReadyDispatch
    /**
     * When the shard gets a resumed dispatch.
     */
    RESUMED: DiscordTypes.GatewayResumedDispatch
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
     * The number of milliseconds to wait between spawn and resume attempts.
     * @default 2500
     */
    attemptDelay?: number
    /**
     * The maximum number of spawn attempts before rejecting.
     * @default 10
     */
    maxSpawnAttempts?: number
    /**
     * Socket timeouts.
     */
    timeouts?: {
        /**
         * The amonut of milliseconds to wait before deeming a connect attempt as timed out.
         */
        connect?: number
        /**
         * The amonut of milliseconds to wait before deeming a resume attempt as timed out.
         */
        resume?: number
        /**
         * The amonut of milliseconds to wait before deeming a send attempt as timed out.
         */
        send?: number
    }
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
     * The shard's intents.
     */
    public readonly intents: number;
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
     * The URL to connect to the gateway with.
     */
    public readonly url: string;

    /**
     * Heartbeat properties.
     */
    private _heartbeat: {
        interval: NodeJS.Timer | null
        lastSequence: number | null
        send: () => void
        waiting: boolean
    } = {
            interval: null,
            lastSequence: null,
            send: () => {
                if (this._heartbeat.waiting) {
                    this.emit(`DEBUG`, `Not receiving heartbeat ACKs; restarting`);
                    void this.resume();
                } else {
                    this.send({
                        op: DiscordTypes.GatewayOpcodes.Heartbeat,
                        d: this._heartbeat.lastSequence
                    }).then(() => {
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
     * A timeout used when connecting or resuming the shard.
     */
    private _timeout: NodeJS.Timeout | null = null;
    /**
     * The websocket used by the shard.
     */
    private _ws: WebSocket | null = null;

    /**
     * Create a gateway shard.
     * @param token The bot's token.
     * @param id The shard's ID.
     * @param url The URL to connect to the gateway with.
     * @param options Gateway shard options.
     */
    constructor(token: string, id: number, intents: number, url: string, options: Required<GatewayShardOptions>) {
        super();

        if (!token) throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });

        this.id = id;
        this.intents = intents;
        this.url = url;
        this.options = options;

        this.emit(`DEBUG`, `Created GatewayShard with id ${this.id}`);
    }

    /**
     * Connect to the gateway.
     * The shard must be in a `DISCONNECTED` state.
     * @returns The ready payload.
     */
    public async spawn(): Promise<DiscordTypes.GatewayReadyDispatch> {
        const spawn: Promise<DiscordTypes.GatewayReadyDispatch> = new Promise((resolve, reject) => {
            if (this._pendingStartReject) {
                this._pendingStartReject(new Error(`Shard initiated spawn attempt before connection was initiated`));
                this.emit(`DEBUG`, `Stopped connection attempt`);
            }
            this._pendingStartReject = reject;

            this.emit(`DEBUG`, `Starting shard spawn attempt`);

            if (this.state !== GatewayShardState.DISCONNECTED) {
                const error = new Error(`Cannot spawn when the shard isn't in a disconnected state`);
                this.emit(`DEBUG`, `Failed to spawn shard: ${error.name} | ${error.message}`);
                reject(error);
            }

            this.state = GatewayShardState.CONNECTING;
            this.emit(`STATE_CONNECTING`, null);
            this.emit(`DEBUG`, `Entered "CONNECTING" state`);

            if (this.options.timeouts?.connect) this._timeout = setTimeout(() => {
                const error = new Error(`Timed out while spawning shard`);

                this._ws?.removeAllListeners();
                this._ws = null;
                this.emit(`DEBUG`, `Failed to spawn shard: ${error.name} | ${error.message}`);

                this.state = GatewayShardState.DISCONNECTED;
                this.emit(`STATE_DISCONNECTED`, null);
                this.emit(`DEBUG`, `Entered "DISCONNECTED" state`);

                reject(error);
            }, this.options.timeouts.connect);

            this._initConnection().then(() => {
                this.once(`READY`, (ready) => {
                    this.emit(`DEBUG`, `Successfully spawned shard`);
                    this._pendingStartReject = null;
                    resolve(ready);
                });
            }).catch((error) => reject(error));
        });

        this.emit(`DEBUG`, `Starting spawning attempts`);
        for (let i = 0; i < this.options.maxSpawnAttempts; i++) {
            const attempt: Error | DiscordTypes.GatewayReadyDispatch = await spawn.catch((error: Error) => error);
            this.emit(`DEBUG`, `Spawning attempt ${attempt instanceof Error ? `rejected` : `resolved`}`);
            if (!(attempt instanceof Error)) {
                this.emit(`DEBUG`, `Spawning attempts resolved with success; shard is ready`);
                return attempt;
            } else if (this.options.maxSpawnAttempts - 1 === i) await new Promise((resolve) => setTimeout(resolve, this.options.attemptDelay));
        }
        this.emit(`DEBUG`, `Unable to spawn shard after ${this.options.maxSpawnAttempts} attempts`);
        throw new Error(`Unable to spawn shard after ${this.options.maxSpawnAttempts} attempts`);
    }

    /**
     * Resume / restart the shard.
     */
    public async resume(): Promise<DiscordTypes.GatewayResumedDispatch> {
        const resume: Promise<DiscordTypes.GatewayResumedDispatch> = new Promise((resolve, reject) => {
            if (this._pendingStartReject) {
                this._pendingStartReject(new Error(`Shard initiated resume attempt before connection was initiated`));
                this.emit(`DEBUG`, `Stopped connection attempt`);
            }
            this._pendingStartReject = reject;

            this.emit(`DEBUG`, `Starting shard resume attempt`);

            if (this.state !== GatewayShardState.DISCONNECTED && this.state !== GatewayShardState.CONNECTED) {
                const error = new Error(`Cannot resume when the shard isn't in a disconnected or connected state`);
                this.emit(`DEBUG`, `Failed to resume shard: ${error.name} | ${error.message}`);
                reject(error);
            }

            if (this._ws) this.kill(1012, `Restarting shard`);

            this.state = GatewayShardState.RESUMING;
            this.emit(`STATE_RESUMING`, null);
            this.emit(`DEBUG`, `Entered "RESUMING" state`);

            if (this.options.timeouts?.resume) this._timeout = setTimeout(() => {
                const error = new Error(`Timed out while resuming shard`);

                this._ws?.removeAllListeners();
                this._ws = null;
                this.emit(`DEBUG`, `Failed to resume shard: ${error.name} | ${error.message}`);

                this.state = GatewayShardState.DISCONNECTED;
                this.emit(`STATE_DISCONNECTED`, null);
                this.emit(`DEBUG`, `Entered "DISCONNECTED" state`);

                reject(error);
            }, this.options.timeouts.resume);

            this._initConnection().then(() => {
                this.once(`RESUMED`, (resumed) => {
                    this.emit(`DEBUG`, `Successfully resumed shard`);
                    this._pendingStartReject = null;
                    resolve(resumed);
                });
            }).catch((error) => reject(error));
        });

        this.emit(`DEBUG`, `Starting resume attempts`);
        for (; ;) {
            const attempt: Error | DiscordTypes.GatewayResumedDispatch = await resume.catch((error: Error) => error);
            this.emit(`DEBUG`, `Resume attempt ${attempt instanceof Error ? `rejected` : `resolved`}`);
            if (!(attempt instanceof Error)) {
                this.emit(`DEBUG`, `Resume attempts resolved with success; shard is ready`);
                return attempt;
            } else await new Promise((resolve) => setTimeout(resolve, this.options.attemptDelay));
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

        this._ws?.removeAllListeners();
        this._ws?.close(code);
        this._ws = null;
        this.emit(`DEBUG`, `Killed shard with code ${code} for reason ${reason}`);

        this.state = GatewayShardState.DISCONNECTED;
        this.emit(`STATE_DISCONNECTED`, null);
        this.emit(`DEBUG`, `Entered "DISCONNECTED" state`);
    }

    /**
     * Send a payload.
     * @param data The data to send.
     */
    public async send(data: DiscordTypes.GatewaySendPayload): Promise<void> {
        return await new Promise((resolve, reject) => {
            const payload = JSON.stringify(data);
            this.emit(`DEBUG`, `Sending payload "${payload}"`);
            if (!this._ws) {
                const error = new Error(`The shard's socket must be defined to send a payload`);
                this.emit(`DEBUG`, `Failed to send payload "${payload}": ${error.name} | ${error.message}`);
                return reject(error);
            }
            this._ws.send(payload, (error) => {
                if (error) {
                    this.emit(`DEBUG`, `Failed to send payload "${payload}": ${error.name} | ${error.message}`);
                    reject(error);
                } else {
                    this.emit(`DEBUG`, `Successfully sent payload "${payload}"`);
                    resolve();
                }
            });
        });
    }

    /**
     * Initiates the socket connection.
     * Creates `GatewayManager#_ws`, waits for open, binds events, then returns.
     * This method does not wait for a ready or resumed event.
     * Expects the shard to be in a "CONNECTING" or "RESUMING" state.
     */
    private async _initConnection(): Promise<void> {
        this.emit(`DEBUG`, `Initiating WebSocket connection`);

        if (this.state !== GatewayShardState.CONNECTING && this.state !== GatewayShardState.RESUMING) {
            const error = new Error(`Cannot initiate a connection when the shard isn't in a connecting or resuming state`);
            this.emit(`DEBUG`, `Failed to connect shard: ${error.name} | ${error.message}`);
            throw error;
        }

        return await new Promise((resolve, reject) => {
            this._ws = new WebSocket(this.url, this.options.wsOptions);
            this.emit(`DEBUG`, `Created WebSocket`);

            this._ws.once(`error`, (error) => {
                if (this._timeout) clearTimeout(this._timeout);

                this._ws?.removeAllListeners();
                this._ws = null;
                this.emit(`DEBUG`, `Failed to connect shard: ${error.name} | ${error.message}`);

                this.state = GatewayShardState.DISCONNECTED;
                this.emit(`STATE_DISCONNECTED`, null);
                this.emit(`DEBUG`, `Entered "DISCONNECTED" state`);

                reject(error);
            });

            this._ws.once(`open`, () => {
                this._ws!.removeAllListeners();
                if (this._timeout) clearTimeout(this._timeout);
                this.emit(`DEBUG`, `WebSocket open`);

                this._ws!.on(`close`, this._onClose.bind(this));
                this._ws!.on(`error`, this._onError.bind(this));
                this._ws!.on(`message`, this._onMessage.bind(this));
                this.emit(`DEBUG`, `WebSocket events bound`);

                this.emit(`DEBUG`, `WebSocket connection initiated successfully`);
                resolve();
            });
        });
    }

    /**
     * Listener used for `GatewayShard#_ws#on('close')`
     */
    private _onClose(code: number, reason: Buffer): void {
        try {
            this.emit(`DEBUG`, `WebSocket close: ${code} | ${reason.toString(`utf-8`)}`);

            this.state = GatewayShardState.DISCONNECTED;
            this.emit(`STATE_DISCONNECTED`, null);
            this.emit(`DEBUG`, `Entered "DISCONNECTED" state`);

            void this.resume();
        } catch (error) {
            this.emit(`DEBUG`, `Error in GatewayShard._onClose(): ${(error as Error).name} | ${(error as Error).message}`);
        }
    }

    /**
     * Listener used for `GatewayShard#_ws#on('error')`
     */
    private _onError(error: Error) {
        try {
            this.emit(`DEBUG`, `WebSocket error: ${error.name} | ${error.message}`);
        } catch (error) {
            this.emit(`DEBUG`, `Error in GatewayShard._onError(): ${(error as Error).name} | ${(error as Error).message}`);
        }
    }

    /**
     * Listener used for `GatewayShard#_ws#on('message')`
     */
    private _onMessage(data: RawData) {
        try {
            this.emit(`DEBUG`, `WebSocket message`);

            if (Array.isArray(data)) data = Buffer.concat(data);
            else if (data instanceof ArrayBuffer) data = Buffer.from(data);
            const payload: DiscordTypes.GatewayReceivePayload = JSON.parse(data.toString());

            switch (payload.op) {
                case (DiscordTypes.GatewayOpcodes.Hello): {
                    this.emit(`DEBUG`, `Got hello`);
                    this._heartbeat.waiting = false;
                    this._heartbeat.send();

                    if (this._heartbeat.interval) clearInterval(this._heartbeat.interval);
                    this._heartbeat.interval = setInterval(() => this._heartbeat.send(), payload.d.heartbeat_interval);
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.Reconnect): {
                    this.emit(`DEBUG`, `Got reconnect request`);
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.Heartbeat): {
                    this.emit(`DEBUG`, `Got heartbeat request`);
                    this._heartbeat.send();
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.HeartbeatAck): {
                    this.emit(`DEBUG`, `Got heartbeat ACK`);
                    this._heartbeat.waiting = false;
                    break;
                }

                case (DiscordTypes.GatewayOpcodes.Dispatch): {
                    this.emit(`DEBUG`, `Got dispatch "${payload.t}"`);

                    if (payload.t === `READY`) {
                        this.state = GatewayShardState.CONNECTED;
                        this.emit(`STATE_CONNECTED`, null);
                        this.emit(`DEBUG`, `Entered "CONNECTED" state`);

                        this.sessionId = payload.d.session_id;

                        this.emit(`READY`, payload);
                        this.emit(`DEBUG`, `READY`);
                    }

                    if (payload.t === `RESUMED`) {
                        this.state = GatewayShardState.CONNECTED;
                        this.emit(`STATE_CONNECTED`, null);
                        this.emit(`DEBUG`, `Entered "CONNECTED" state`);

                        this.emit(`RESUMED`, payload);
                        this.emit(`DEBUG`, `RESUMED`);
                    }

                    this.emit(`*`, payload as any);
                }
            }
        } catch (error) {
            this.emit(`DEBUG`, `Error in GatewayShard._onMessage(): ${(error as Error).name} | ${(error as Error).message}`);
        }
    }
}
