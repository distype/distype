"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayShard = exports.GatewayShardState = void 0;
const ws_1 = require("ws");
const typed_emitter_1 = require("@jpbberry/typed-emitter");
/**
 * Gateway shard states.
 */
var GatewayShardState;
(function (GatewayShardState) {
    /**
     * The shard is disconnected.
     */
    GatewayShardState[GatewayShardState["DISCONNECTED"] = 0] = "DISCONNECTED";
    /**
     * The shard is connecting. `GatewayShard#_ws` may be defined, however the connection process has not finished.
     * During this stage, the `GatewayShard`:
     * - Waits for an opcode 10 "hello" payload
     * - Responds with a heartbeat
     * - Waits for the first heartbeat ACK
     * - Sends an identify payload
     * - Waits for the ready event
     */
    GatewayShardState[GatewayShardState["CONNECTING"] = 1] = "CONNECTING";
    /**
     * The shard is resuming. `GatewayShard#_ws` may be defined, however the resuming process has not finished.
     * During this stage, the `GatewayShard`:
     * - Sends a resume payload
     * - Waits for the resumed event
     */
    GatewayShardState[GatewayShardState["RESUMING"] = 2] = "RESUMING";
    /**
     * The shard is connected and is operating normally. A ready or resume event has been received.
     */
    GatewayShardState[GatewayShardState["CONNECTED"] = 3] = "CONNECTED";
})(GatewayShardState = exports.GatewayShardState || (exports.GatewayShardState = {}));
/**
 * A single gateway shard.
 * Handles the low level ws communication with Discord.
 */
class GatewayShard extends typed_emitter_1.EventEmitter {
    /**
     * Create a gateway shard.
     * @param token The bot's token.
     * @param id The shard's ID.
     * @param options Gateway shard options.
     */
    constructor(token, id, options) {
        super();
        /**
         * The last sequence number received.
         */
        this.lastSequence = null;
        /**
         * The shard's session ID.
         */
        this.sessionId = null;
        /**
         * The state of the shard's connection.
         */
        this.state = GatewayShardState.DISCONNECTED;
        /**
         * A timeout used when connecting or resuming the shard.
         */
        this._connectionTimeout = null;
        /**
         * Heartbeat properties.
         */
        this._heartbeat = {
            interval: null,
            send: () => {
                if (this._heartbeat.waiting) {
                    this.emit(`DEBUG`, `Not receiving heartbeat ACKs; restarting`);
                    void this.restart();
                }
                else {
                    this.send({
                        op: 1 /* Heartbeat */,
                        d: this.lastSequence
                    }, true).then(() => {
                        this._heartbeat.waiting = true;
                        this.emit(`DEBUG`, `Sent heartbeat`);
                    }).catch((error) => this.emit(`DEBUG`, `Failed to send heartbeat: ${error.name} | ${error.message}`));
                }
            },
            waiting: false
        };
        /**
         * The pending reject callback for the promise starting the shard.
         */
        this._pendingStartReject = null;
        /**
         * A queue of payloads to be sent after the shard has spawned. Pushed to when the shard has not spawned, and flushed after the READY event is dispatched.
         */
        this._spawnSendQueue = [];
        /**
         * The websocket used by the shard.
         */
        this._ws = null;
        if (!token)
            throw new TypeError(`A bot token must be specified`);
        if (!id)
            throw new TypeError(`A shard ID must be specified`);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        Object.defineProperty(this, `id`, {
            configurable: false,
            enumerable: true,
            value: id,
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options),
            writable: false
        });
    }
    /**
     * Connect to the gateway.
     * The shard must be in a `DISCONNECTED` state.
     * @returns The ready payload.
     */
    async spawn() {
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
            const attempt = await this._initConnection(false).catch((error) => error).catch((error) => error);
            this.emit(`DEBUG`, `Spawning attempt ${attempt instanceof Error ? `rejected` : `resolved`}`);
            if (!(attempt instanceof Error)) {
                this.emit(`DEBUG`, `Spawning attempts resolved with success; shard is ready`);
                return attempt;
            }
            else if (i !== this.options.spawnMaxAttempts - 1)
                await new Promise((resolve) => setTimeout(resolve, this.options.spawnAttemptDelay));
        }
        this.emit(`DEBUG`, `Unable to spawn shard after ${this.options.spawnMaxAttempts} attempts`);
        throw new Error(`Unable to spawn shard after ${this.options.spawnMaxAttempts} attempts`);
    }
    /**
     * Restart / resume the shard.
     */
    async restart() {
        if (this.state !== GatewayShardState.DISCONNECTED && this.state !== GatewayShardState.CONNECTED) {
            const error = new Error(`Cannot resume when the shard isn't in a disconnected or connected state`);
            this.emit(`DEBUG`, `Failed to spawn shard: ${error.name} | ${error.message}`);
            throw error;
        }
        this.emit(`DEBUG`, `Starting resume attempts`);
        for (;;) {
            this.emit(`DEBUG`, `Starting shard resume attempt`);
            if (this._ws)
                this.kill(1012, `Restarting shard`);
            else
                this._clearTimers();
            this._enterState(GatewayShardState.RESUMING);
            const attempt = await this._initConnection(true).catch((error) => error);
            this.emit(`DEBUG`, `Resume attempt ${attempt instanceof Error ? `rejected` : `resolved`}`);
            if (!(attempt instanceof Error)) {
                this.emit(`DEBUG`, `Resume attempts resolved with success; shard is ready`);
                return attempt;
            }
            else
                await new Promise((resolve) => setTimeout(resolve, this.options.spawnAttemptDelay));
        }
    }
    /**
     * Kill the shard.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code).
     * @param reason The reason the shard is being killed.
     */
    kill(code = 1000, reason = `Manual kill`) {
        this.emit(`DEBUG`, `Killing shard with code ${code} for reason ${reason}`);
        if (this._pendingStartReject) {
            this._pendingStartReject(new Error(`Shard killed before connection was initiated`));
            this._pendingStartReject = null;
            this.emit(`DEBUG`, `Stopped connection attempt`);
        }
        this._clearTimers();
        this._ws?.removeAllListeners();
        if (this._ws?.readyState === ws_1.WebSocket.OPEN)
            this._ws?.close(code);
        this._ws = null;
        this.emit(`DEBUG`, `Killed shard with code ${code} for reason ${reason}`);
        this._enterState(GatewayShardState.DISCONNECTED);
    }
    /**
     * Send a payload.
     * @param data The data to send.
     * @param force If the payload should bypass the send queue and always be sent immediately. Note that the queue is only used to cache `GatewayShard#send()` calls before the shard is in a `CONNECTED` state, so this option will have no effect when the shard is spawned. The queue is flushed after the shard receives the `READY` event. This option is primarily used internally, for dispatches such as a heartbeat or identify.
     */
    async send(data, force = false) {
        return await new Promise((resolve, reject) => {
            const payload = JSON.stringify(data);
            if (!force && this.state !== GatewayShardState.CONNECTED) {
                this._spawnSendQueue.push({
                    payload, reject, resolve
                });
                this.emit(`DEBUG`, `Pushed payload "${payload}" to the send queue`);
            }
            else
                this._send(payload).then(resolve).catch(reject);
        });
    }
    /**
     * Clears timers on the shard.
     */
    _clearTimers() {
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
    _enterState(state) {
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
    async _flushQueue() {
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
    async _initConnection(resume) {
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
            this._ws = new ws_1.WebSocket(this.options.url, this.options.wsOptions);
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
                this._ws.removeAllListeners();
                this._ws.on(`close`, this._onClose.bind(this));
                this._ws.on(`error`, this._onError.bind(this));
                this._ws.on(`message`, this._onMessage.bind(this));
                this.emit(`DEBUG`, `WebSocket events bound`);
                this.emit(`DEBUG`, `WebSocket connection initiated successfully`);
                if (!resume) {
                    this.once(`READY`, (data) => {
                        this.emit(`DEBUG`, `Successfully spawned shard`);
                        this._pendingStartReject = null;
                        resolve(data);
                    });
                }
                else {
                    this.once(`RESUMED`, (data) => {
                        this.emit(`DEBUG`, `Successfully resumed shard`);
                        this._pendingStartReject = null;
                        resolve(data);
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
    async _send(payload) {
        return await new Promise((resolve, reject) => {
            if (!this._ws || this._ws.readyState !== ws_1.WebSocket.OPEN) {
                const error = new Error(`The shard's socket must be defined and open to send a payload`);
                this.emit(`DEBUG`, `Failed to send payload "${payload}": ${error.name} | ${error.message}`);
                return reject(error);
            }
            this.emit(`DEBUG`, `Sending payload "${payload}"`);
            this._ws.send(payload, (error) => {
                if (error) {
                    this.emit(`DEBUG`, `Failed to send payload "${payload}": ${error.name} | ${error.message}`);
                    reject(error);
                }
                else {
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
    _onClose(code, reason) {
        this.emit(`DEBUG`, `WebSocket close: ${code} | ${reason.toString(`utf-8`)}`);
        this._clearTimers();
        this._enterState(GatewayShardState.DISCONNECTED);
        void this.restart();
    }
    /**
     * Listener used for `GatewayShard#_ws#on('error')`
     * @internal
     */
    _onError(error) {
        this.emit(`DEBUG`, `WebSocket error: ${error.name} | ${error.message}`);
    }
    /**
     * Listener used for `GatewayShard#_ws#on('message')`
     * @internal
     */
    _onMessage(data) {
        try {
            this.emit(`DEBUG`, `WebSocket got message`);
            if (Array.isArray(data))
                data = Buffer.concat(data);
            else if (data instanceof ArrayBuffer)
                data = Buffer.from(data);
            const payload = JSON.parse(data.toString());
            this.emit(`DEBUG`, `WebSocket parsed message`);
            if (payload.s && this.state !== GatewayShardState.DISCONNECTED && this.state !== GatewayShardState.RESUMING) {
                this.lastSequence = payload.s;
                this.emit(`DEBUG`, `Updated last sequence number: ${this.lastSequence}`);
            }
            switch (payload.op) {
                case (0 /* Dispatch */): {
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
                    this.emit(`*`, payload);
                    break;
                }
                case (1 /* Heartbeat */): {
                    this.emit(`DEBUG`, `Got heartbeat request`);
                    this._heartbeat.send();
                    break;
                }
                case (7 /* Reconnect */): {
                    this.emit(`DEBUG`, `Got reconnect request`);
                    void this.restart();
                    break;
                }
                case (9 /* InvalidSession */): {
                    this.emit(`DEBUG`, `Got invalid session`);
                    if (payload.d)
                        void this.restart();
                    else {
                        this.kill(1000, `Received invalid session`);
                        void this.spawn();
                    }
                    break;
                }
                case (10 /* Hello */): {
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
                                token: this._token,
                            }
                        }, true).catch((error) => this.emit(`DEBUG`, `Failed to send identify: ${error.name} | ${error.message}`));
                    }
                    else if (this.state === GatewayShardState.RESUMING) {
                        if (this.sessionId && typeof this.lastSequence === `number`) {
                            this.send({
                                op: 6,
                                d: {
                                    token: this._token,
                                    session_id: this.sessionId,
                                    seq: this.lastSequence
                                }
                            }, true).catch((error) => this.emit(`DEBUG`, `Failed to send resume: ${error.name} | ${error.message}`));
                        }
                        else {
                            void this.kill(1012, `Respawning shard - no session ID or last sequence`);
                            void this.spawn();
                        }
                    }
                    break;
                }
                case (11 /* HeartbeatAck */): {
                    this.emit(`DEBUG`, `Got heartbeat ACK`);
                    this._heartbeat.waiting = false;
                    break;
                }
            }
        }
        catch (error) {
            this.emit(`DEBUG`, `Error in GatewayShard._onMessage(): ${error.name} | ${error.message}`);
        }
    }
}
exports.GatewayShard = GatewayShard;
