"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayShard = exports.GatewayShardState = void 0;
const DiscordConstants_1 = require("../constants/DiscordConstants");
const DistypeError_1 = require("../errors/DistypeError");
const node_utils_1 = require("@br88c/node-utils");
const DiscordTypes = __importStar(require("discord-api-types/v10"));
const ws_1 = require("ws");
/**
 * {@link GatewayShard Gateway shard} states.
 */
var GatewayShardState;
(function (GatewayShardState) {
    /**
     * The {@link GatewayShard shard} is not running, and is not pending a reconnect.
     */
    GatewayShardState[GatewayShardState["IDLE"] = 0] = "IDLE";
    /**
     * The {@link GatewayShard shard} is connecting to the gateway.
     * During this stage, the {@link GatewayShard shard}:
     * - Initiates the websocket connection
     * - Starts [heartbeating](https://discord.com/developers/docs/topics/gateway#heartbeating)
     */
    GatewayShardState[GatewayShardState["CONNECTING"] = 1] = "CONNECTING";
    /**
     * The {@link GatewayShard shard} is identifying.
     * During this stage, the {@link GatewayShard shard}:
     * - Waits for a [hello payload](https://discord.com/developers/docs/topics/gateway#hello)
     * - The shard sends an [identify payload](https://discord.com/developers/docs/topics/gateway#identify)
     * - Waits for the [ready event](https://discord.com/developers/docs/topics/gateway#ready)
     */
    GatewayShardState[GatewayShardState["IDENTIFYING"] = 2] = "IDENTIFYING";
    /**
     * The {@link GatewayShard shard} is resuming.
     * During this stage, the {@link GatewayShard shard}:
     * - Sends a [resume payload](https://discord.com/developers/docs/topics/gateway#resume)
     * - Waits for the [resumed event](https://discord.com/developers/docs/topics/gateway#resumed)
     */
    GatewayShardState[GatewayShardState["RESUMING"] = 3] = "RESUMING";
    /**
     * The {@link GatewayShard shard} is connected and is operating normally. A [ready](https://discord.com/developers/docs/topics/gateway#ready) or [resumed](https://discord.com/developers/docs/topics/gateway#resumed) event has been received.
     */
    GatewayShardState[GatewayShardState["RUNNING"] = 4] = "RUNNING";
    /**
     * The {@link GatewayShard shard} was disconnected.
     * Note that if the shard is not automatically reconnecting to the gateway, the shard will enter an `IDLE` state and will not enter a `DISCONNECTED` state.
     */
    GatewayShardState[GatewayShardState["DISCONNECTED"] = 5] = "DISCONNECTED";
})(GatewayShardState = exports.GatewayShardState || (exports.GatewayShardState = {}));
/**
 * A gateway shard.
 * Handles the low level ws communication with Discord.
 */
class GatewayShard extends node_utils_1.TypedEmitter {
    /**
     * The last [sequence number](https://discord.com/developers/docs/topics/gateway#resumed) received.
     */
    lastSequence = null;
    /**
     * The shard's ping.
     */
    ping = 0;
    /**
     * The shard's [session ID](https://discord.com/developers/docs/topics/gateway#ready-ready-event-fields).
     */
    sessionId = null;
    /**
     * The shard's {@link GatewayShardState state}.
     */
    state = GatewayShardState.DISCONNECTED;
    /**
     * The shard's ID.
     */
    id;
    /**
     * {@link GatewayShardOptions Options} for the gateway shard.
     * Note that if you are using a {@link Client} or {@link ClientMaster} / {@link ClientWorker} and not manually creating a {@link Client} separately, these options may differ than the options specified when creating the client due to them being passed through the {@link clientOptionsFactory}.
     */
    options;
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    system;
    /**
     * The heartbeat interval timer.
     */
    _heartbeatIntervalTimer = null;
    /**
     * The time that the heartbeat timer has been waiting for the jitter to start for.
     */
    _heartbeatJitterActive = null;
    /**
     * The time the heartbeat has been waiting for an ACK for.
     */
    _heartbeatWaitingSince = null;
    /**
     * If the shard was killed. Set back to `false` when a new connection attempt is started.
     */
    _killed = false;
    /**
     * The {@link LogCallback log callback} used by the shard.
     */
    _log;
    /**
     * A queue of data to be sent after the socket opens.
     */
    _queue = [];
    /**
     * If the shard has an active spawn or restart loop.
     */
    _spinning = false;
    /**
     * The websocket used.
     */
    _ws = null;
    /**
     * The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     */
    _numShards;
    /**
     * The URL being used.
     */
    _url;
    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    _token;
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
    constructor(token, id, numShards, url, options, logCallback = () => { }, logThisArg) {
        super();
        if (typeof token !== `string`)
            throw new TypeError(`Parameter "token" (string) not provided: got ${token} (${typeof token})`);
        if (typeof id !== `number`)
            throw new TypeError(`Parameter "id" (number) not provided: got ${id} (${typeof id})`);
        if (typeof numShards !== `number`)
            throw new TypeError(`Parameter "numShards" (number) not provided: got ${numShards} (${typeof numShards})`);
        if (typeof url !== `string`)
            throw new TypeError(`Parameter "url" (string) not provided: got ${url} (${typeof url})`);
        if (typeof options !== `object`)
            throw new TypeError(`Parameter "options" (object) not provided: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`)
            throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
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
    get canResume() {
        return this.lastSequence !== null && this.sessionId !== null;
    }
    /**
     * Connect to the gateway.
     */
    async spawn() {
        if (this._spinning)
            throw new DistypeError_1.DistypeError(`Shard is already connecting to the gateway`, DistypeError_1.DistypeErrorType.GATEWAY_SHARD_ALREADY_CONNECTING, this.system);
        this._spinning = true;
        this._killed = false;
        for (let i = 0; i < this.options.spawnMaxAttempts; i++) {
            const attempt = await this._initSocket(false).then(() => true).catch((error) => {
                this._log(`Spawn attempt ${i + 1}/${this.options.spawnMaxAttempts} failed: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                    level: `ERROR`, system: this.system
                });
                return false;
            });
            if (attempt) {
                this._spinning = false;
                this._log(`Spawned after ${i + 1} attempts`, {
                    level: `DEBUG`, system: this.system
                });
                return;
            }
            if (this._killed) {
                this._enterState(GatewayShardState.IDLE);
                this._spinning = false;
                this._log(`Spawning interrupted by kill`, {
                    level: `DEBUG`, system: this.system
                });
                throw new DistypeError_1.DistypeError(`Shard spawn attempts interrupted by kill`, DistypeError_1.DistypeErrorType.GATEWAY_SHARD_INTERRUPT_FROM_KILL, this.system);
            }
            if (i < this.options.spawnMaxAttempts - 1)
                await (0, node_utils_1.wait)(this.options.spawnAttemptDelay);
        }
        this._spinning = false;
        this._enterState(GatewayShardState.IDLE);
        throw new DistypeError_1.DistypeError(`Failed to spawn shard after ${this.options.spawnMaxAttempts} attempts`, DistypeError_1.DistypeErrorType.GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED, this.system);
    }
    /**
     * Restart / resume the shard.
     */
    async restart() {
        if (this._spinning)
            throw new DistypeError_1.DistypeError(`Shard is already connecting to the gateway`, DistypeError_1.DistypeErrorType.GATEWAY_SHARD_ALREADY_CONNECTING, this.system);
        this._spinning = true;
        this._killed = false;
        for (let i = 1;; i++) {
            const attempt = await this._initSocket(true).then(() => true).catch((error) => {
                this._log(`Restart attempt ${i + 1} failed: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                    level: `ERROR`, system: this.system
                });
                return false;
            });
            if (attempt) {
                this._log(`Restarted after ${i} attempts`, {
                    level: `DEBUG`, system: this.system
                });
                this._spinning = false;
                return;
            }
            if (this._killed) {
                this._enterState(GatewayShardState.IDLE);
                this._log(`Restarting interrupted by kill`, {
                    level: `DEBUG`, system: this.system
                });
                throw new DistypeError_1.DistypeError(`Shard restart attempts interrupted by kill`, DistypeError_1.DistypeErrorType.GATEWAY_SHARD_INTERRUPT_FROM_KILL, this.system);
            }
            await (0, node_utils_1.wait)(this.options.spawnAttemptDelay);
        }
    }
    /**
     * Kill the shard.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code). Defaults to `1000`.
     * @param reason The reason the shard is being killed. Defaults to `"Manual kill"`.
     */
    kill(code = 1000, reason = `Manual kill`) {
        this._close(false, code, reason);
        this._enterState(GatewayShardState.IDLE);
        this._killed = true;
        this._log(`Shard killed with code ${code}, reason "${reason}"`, {
            level: `WARN`, system: this.system
        });
    }
    /**
     * Send data to the gateway.
     * @param data The data to send.
     */
    async send(data) {
        return await new Promise((resolve, reject) => {
            if (this.state !== GatewayShardState.RUNNING) {
                this._queue.push({
                    data: JSON.stringify(data), resolve, reject
                });
            }
            else {
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
    _close(resuming, code, reason) {
        this._log(`Closing... (Code ${code}, reason "${reason}")`, {
            level: `DEBUG`, system: this.system
        });
        this._flushQueue(true);
        this._ws?.removeAllListeners();
        if (this._ws?.readyState !== ws_1.WebSocket.CLOSED) {
            try {
                this._ws?.close(code, reason);
            }
            catch {
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
    _enterState(state) {
        if (this.state !== state) {
            this.state = state;
            this.emit(GatewayShardState[state]);
            this._log(GatewayShardState[state], {
                level: `DEBUG`, system: this.system
            });
        }
    }
    /**
     * Flushes the send queue.
     * @param reject If the queue shouldn't be sent, and all promises should be rejected.
     */
    async _flushQueue(reject = false) {
        do {
            const next = this._queue.shift();
            if (next) {
                if (reject)
                    next.reject(new DistypeError_1.DistypeError(`Send queue force flushed`, DistypeError_1.DistypeErrorType.GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED, this.system));
                else
                    await this._send(next.data).then(next.resolve, next.reject);
            }
        } while (this._queue.length);
        this._log(`Flushed send queue`, {
            level: `DEBUG`, system: this.system
        });
    }
    /**
     * Sends a heartbeat.
     * @param force If waiting for the ACK check should be omitted. Only use for responding to heartbeat requests.
     */
    _heartbeat(force = false) {
        if (this._heartbeatWaitingSince !== null && !force) {
            this._log(`Not receiving heartbeat ACKs (Zombified Connection), restarting...`, {
                level: `WARN`, system: this.system
            });
            this._close(true, 4009, `Did not receive heartbeat ACK`);
            this._enterState(GatewayShardState.DISCONNECTED);
            this._reconnect(true);
        }
        else {
            this._send(JSON.stringify({
                op: DiscordTypes.GatewayOpcodes.Heartbeat,
                d: this.lastSequence
            })).then(() => {
                this._heartbeatWaitingSince = Date.now();
            }).catch((error) => {
                this._heartbeatWaitingSince = null;
                this._log(`Failed to send heartbeat: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                    level: `WARN`, system: this.system
                });
            });
        }
    }
    /**
     * Initiate the socket.
     * @param resume If the shard is resuming.
     */
    async _initSocket(resume) {
        if (this.state !== GatewayShardState.IDLE && this.state !== GatewayShardState.DISCONNECTED) {
            this._close(resume, resume ? 4000 : 1000, `Restarting`);
            this._enterState(GatewayShardState.DISCONNECTED);
        }
        this._log(`Initiating socket... (Resuming: ${resume})`, {
            level: `DEBUG`, system: this.system
        });
        this._enterState(GatewayShardState.CONNECTING);
        const result = await new Promise((resolve, reject) => {
            const disconnectedListener = () => reject(new DistypeError_1.DistypeError(`Socket disconnected on socket init`, DistypeError_1.DistypeErrorType.GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT, this.system));
            this.once(`DISCONNECTED`, disconnectedListener);
            this.once(`IDLE`, disconnectedListener);
            this._ws = new ws_1.WebSocket(this._url, this.options.wsOptions);
            const closeListener = ((code, reason) => reject(new DistypeError_1.DistypeError(`Socket closed with code ${code}: "${this._parsePayload(reason)}"`, DistypeError_1.DistypeErrorType.GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT, this.system))).bind(this);
            this._ws.once(`close`, closeListener);
            const errorListener = ((error) => reject(error)).bind(this);
            this._ws.once(`error`, errorListener);
            this._ws.once(`open`, () => {
                this._log(`Socket open`, {
                    level: `DEBUG`, system: this.system
                });
                if (resume && this.canResume)
                    this._enterState(GatewayShardState.RESUMING);
                else
                    this._enterState(GatewayShardState.IDENTIFYING);
                this._ws.on(`close`, this._wsOnClose.bind(this));
                this._ws.on(`error`, this._wsOnError.bind(this));
                this._ws.on(`message`, this._wsOnMessage.bind(this));
                node_utils_1.TypedEmitter.once(this, `RUNNING`).then(() => {
                    this.removeListener(`DISCONNECTED`, disconnectedListener);
                    this.removeListener(`IDLE`, disconnectedListener);
                    this._ws.removeListener(`close`, closeListener);
                    this._ws.removeListener(`error`, errorListener);
                    resolve(true);
                });
            });
        }).catch((error) => {
            if (this.state !== GatewayShardState.DISCONNECTED && this.state !== GatewayShardState.IDLE) {
                this._close(resume, resume ? 4000 : 1000, `Failed to initialize shard`);
                this._enterState(GatewayShardState.DISCONNECTED);
            }
            return error;
        });
        if (result !== true)
            throw result;
    }
    /**
     * Reconnect the shard.
     * @param resume If the shard should be resumed.
     */
    _reconnect(resume) {
        if (this._spinning)
            return;
        this._log(`Reconnecting...`, {
            level: `INFO`, system: this.system
        });
        if (resume) {
            this.restart()
                .then(() => this._log(`Reconnected`, {
                level: `INFO`, system: this.system
            }))
                .catch((error) => this._log(`Error reconnecting (restarting): ${(error?.message ?? error) ?? `Unknown reason`}`, {
                level: `ERROR`, system: this.system
            }));
        }
        else {
            this.spawn()
                .then(() => this._log(`Reconnected`, {
                level: `INFO`, system: this.system
            }))
                .catch((error) => {
                this._log(`Error reconnecting (spawning): ${(error?.message ?? error) ?? `Unknown reason`}`, {
                    level: `ERROR`, system: this.system
                });
            });
        }
    }
    /**
     * Send data to the gateway.
     * @param data The data to send.
     */
    async _send(data) {
        if (typeof data !== `string`)
            throw new TypeError(`Parameter "data" (string) not provided: got ${data} (${typeof data})`);
        return await new Promise((resolve, reject) => {
            if (!this._ws || this._ws.readyState !== ws_1.WebSocket.OPEN) {
                reject(new DistypeError_1.DistypeError(`Cannot send data when the socket is not in an OPEN state`, DistypeError_1.DistypeErrorType.GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET, this.system));
            }
            else {
                this._ws.send(data, (error) => {
                    if (error)
                        reject(error);
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
    _parsePayload(data) {
        try {
            if (Array.isArray(data))
                data = Buffer.concat(data);
            else if (data instanceof ArrayBuffer)
                data = Buffer.from(data);
            return JSON.parse(data.toString());
        }
        catch (error) {
            if (typeof data === `string` || (typeof data.toString === `function` && typeof data.toString() === `string`))
                return data;
            this._log(`Payload parsing error: ${(error?.message ?? error) ?? `Unknown reason`}`, {
                level: `WARN`, system: this.system
            });
        }
    }
    /**
     * When the socket emits a close event.
     */
    _wsOnClose(code, reason) {
        const parsedReason = this._parsePayload(reason);
        this._log(`Received close code ${code} with reason "${parsedReason}"`, {
            level: `WARN`, system: this.system
        });
        if (DiscordConstants_1.DiscordConstants.GATEWAY_CLOSE_CODES.NOT_RECONNECTABLE.includes(code)) {
            this.kill(1000, parsedReason);
        }
        else {
            this._close(true, 4000, parsedReason);
            this._enterState(GatewayShardState.DISCONNECTED);
            this._reconnect(true);
        }
    }
    /**
     * When the socket emits an error event.
     */
    _wsOnError(error) {
        this._log((error?.message ?? error) ?? `Unknown reason`, {
            level: `ERROR`, system: this.system
        });
    }
    /**
     * When the socket emits a message event.
     */
    _wsOnMessage(data) {
        const payload = this._parsePayload(data);
        if (payload.s !== null)
            this.lastSequence = payload.s;
        switch (payload.op) {
            case DiscordTypes.GatewayOpcodes.Dispatch: {
                this.emit(`RECEIVED_MESSAGE`, payload);
                if (payload.t === DiscordTypes.GatewayDispatchEvents.Ready) {
                    this.sessionId = payload.d.session_id;
                    this._enterState(GatewayShardState.RUNNING);
                }
                else if (payload.t === DiscordTypes.GatewayDispatchEvents.Resumed) {
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
                if (!this._spinning)
                    (0, node_utils_1.wait)(2500).then(() => this._reconnect(!!payload.d));
                break;
            }
            case DiscordTypes.GatewayOpcodes.Hello: {
                this._log(`Got Hello`, {
                    level: `DEBUG`, system: this.system
                });
                const jitterActive = Date.now();
                this._heartbeatJitterActive = jitterActive;
                (0, node_utils_1.wait)(payload.d.heartbeat_interval * 0.5).then(() => {
                    if (jitterActive === this._heartbeatJitterActive && (this.state === GatewayShardState.IDENTIFYING || this.state === GatewayShardState.RESUMING || this.state === GatewayShardState.RUNNING)) {
                        this._heartbeatJitterActive = null;
                        this._heartbeat();
                        if (this._heartbeatIntervalTimer !== null)
                            clearInterval(this._heartbeatIntervalTimer);
                        this._heartbeatIntervalTimer = setInterval(() => this._heartbeat(), payload.d.heartbeat_interval).unref();
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
                    }));
                }
                else {
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
                    }));
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
exports.GatewayShard = GatewayShard;
