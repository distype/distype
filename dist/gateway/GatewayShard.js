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
         * The shard's session ID.
         */
        this.sessionId = null;
        /**
         * The state of the shard's connection.
         */
        this.state = GatewayShardState.DISCONNECTED;
        /**
         * Heartbeat properties.
         */
        this._heartbeat = {
            interval: null,
            lastSequence: null,
            send: () => {
                if (this._heartbeat.waiting) {
                    this.emit(`DEBUG`, `Not receiving heartbeat ACKs; restarting`);
                    void this.resume();
                }
                else {
                    this.send({
                        op: 1 /* Heartbeat */,
                        d: this._heartbeat.lastSequence
                    }).then(() => {
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
         * A timeout used when connecting or resuming the shard.
         */
        this._timeout = null;
        /**
         * The websocket used by the shard.
         */
        this._ws = null;
        if (!token)
            throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this.id = id;
        this.options = options;
        this.emit(`DEBUG`, `Created GatewayShard with id ${this.id}`);
    }
    /**
     * Connect to the gateway.
     * The shard must be in a `DISCONNECTED` state.
     * @returns The ready payload.
     */
    async spawn() {
        const spawn = new Promise((resolve, reject) => {
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
            if (this.options.timeouts?.connect)
                this._timeout = setTimeout(() => {
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
            const attempt = await spawn.catch((error) => error);
            this.emit(`DEBUG`, `Spawning attempt ${attempt instanceof Error ? `rejected` : `resolved`}`);
            if (!(attempt instanceof Error)) {
                this.emit(`DEBUG`, `Spawning attempts resolved with success; shard is ready`);
                return attempt;
            }
            else if (this.options.maxSpawnAttempts - 1 === i)
                await new Promise((resolve) => setTimeout(resolve, this.options.attemptDelay));
        }
        this.emit(`DEBUG`, `Unable to spawn shard after ${this.options.maxSpawnAttempts} attempts`);
        throw new Error(`Unable to spawn shard after ${this.options.maxSpawnAttempts} attempts`);
    }
    /**
     * Resume / restart the shard.
     */
    async resume() {
        const resume = new Promise((resolve, reject) => {
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
            if (this._ws)
                this.kill(1012, `Restarting shard`);
            this.state = GatewayShardState.RESUMING;
            this.emit(`STATE_RESUMING`, null);
            this.emit(`DEBUG`, `Entered "RESUMING" state`);
            if (this.options.timeouts?.resume)
                this._timeout = setTimeout(() => {
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
        for (;;) {
            const attempt = await resume.catch((error) => error);
            this.emit(`DEBUG`, `Resume attempt ${attempt instanceof Error ? `rejected` : `resolved`}`);
            if (!(attempt instanceof Error)) {
                this.emit(`DEBUG`, `Resume attempts resolved with success; shard is ready`);
                return attempt;
            }
            else
                await new Promise((resolve) => setTimeout(resolve, this.options.attemptDelay));
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
    async send(data) {
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
                }
                else {
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
    async _initConnection() {
        this.emit(`DEBUG`, `Initiating WebSocket connection`);
        if (this.state !== GatewayShardState.CONNECTING && this.state !== GatewayShardState.RESUMING) {
            const error = new Error(`Cannot initiate a connection when the shard isn't in a connecting or resuming state`);
            this.emit(`DEBUG`, `Failed to connect shard: ${error.name} | ${error.message}`);
            throw error;
        }
        return await new Promise((resolve, reject) => {
            this._ws = new ws_1.WebSocket(this.options.url, this.options.wsOptions);
            this.emit(`DEBUG`, `Created WebSocket`);
            this._ws.once(`error`, (error) => {
                if (this._timeout)
                    clearTimeout(this._timeout);
                this._ws?.removeAllListeners();
                this._ws = null;
                this.emit(`DEBUG`, `Failed to connect shard: ${error.name} | ${error.message}`);
                this.state = GatewayShardState.DISCONNECTED;
                this.emit(`STATE_DISCONNECTED`, null);
                this.emit(`DEBUG`, `Entered "DISCONNECTED" state`);
                reject(error);
            });
            this._ws.once(`open`, () => {
                this._ws.removeAllListeners();
                if (this._timeout)
                    clearTimeout(this._timeout);
                this.emit(`DEBUG`, `WebSocket open`);
                this._ws.on(`close`, this._onClose.bind(this));
                this._ws.on(`error`, this._onError.bind(this));
                this._ws.on(`message`, this._onMessage.bind(this));
                this.emit(`DEBUG`, `WebSocket events bound`);
                this.emit(`DEBUG`, `WebSocket connection initiated successfully`);
                resolve();
            });
        });
    }
    /**
     * Listener used for `GatewayShard#_ws#on('close')`
     */
    _onClose(code, reason) {
        try {
            this.emit(`DEBUG`, `WebSocket close: ${code} | ${reason.toString(`utf-8`)}`);
            this.state = GatewayShardState.DISCONNECTED;
            this.emit(`STATE_DISCONNECTED`, null);
            this.emit(`DEBUG`, `Entered "DISCONNECTED" state`);
            void this.resume();
        }
        catch (error) {
            this.emit(`DEBUG`, `Error in GatewayShard._onClose(): ${error.name} | ${error.message}`);
        }
    }
    /**
     * Listener used for `GatewayShard#_ws#on('error')`
     */
    _onError(error) {
        try {
            this.emit(`DEBUG`, `WebSocket error: ${error.name} | ${error.message}`);
        }
        catch (error) {
            this.emit(`DEBUG`, `Error in GatewayShard._onError(): ${error.name} | ${error.message}`);
        }
    }
    /**
     * Listener used for `GatewayShard#_ws#on('message')`
     */
    _onMessage(data) {
        try {
            this.emit(`DEBUG`, `WebSocket message`);
            if (Array.isArray(data))
                data = Buffer.concat(data);
            else if (data instanceof ArrayBuffer)
                data = Buffer.from(data);
            const payload = JSON.parse(data.toString());
            switch (payload.op) {
                case (10 /* Hello */): {
                    this.emit(`DEBUG`, `Got hello`);
                    this._heartbeat.waiting = false;
                    this._heartbeat.send();
                    if (this._heartbeat.interval)
                        clearInterval(this._heartbeat.interval);
                    this._heartbeat.interval = setInterval(() => this._heartbeat.send(), payload.d.heartbeat_interval);
                    break;
                }
                case (7 /* Reconnect */): {
                    this.emit(`DEBUG`, `Got reconnect request`);
                    break;
                }
                case (1 /* Heartbeat */): {
                    this.emit(`DEBUG`, `Got heartbeat request`);
                    this._heartbeat.send();
                    break;
                }
                case (11 /* HeartbeatAck */): {
                    this.emit(`DEBUG`, `Got heartbeat ACK`);
                    this._heartbeat.waiting = false;
                    break;
                }
                case (0 /* Dispatch */): {
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
                    this.emit(`*`, payload);
                }
            }
        }
        catch (error) {
            this.emit(`DEBUG`, `Error in GatewayShard._onMessage(): ${error.name} | ${error.message}`);
        }
    }
}
exports.GatewayShard = GatewayShard;
