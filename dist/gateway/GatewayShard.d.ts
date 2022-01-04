import { GatewayShardOptions } from './GatewayOptions';
import { TypedEmitter } from '../utils/TypedEmitter';
import * as DiscordTypes from 'discord-api-types/v9';
/**
 * Gateway shard events.
 */
export interface GatewayShardEvents {
    /**
     * When the shard receives a payload. Data is the parsed payload.
     */
    '*': DiscordTypes.GatewayDispatchPayload;
    /**
     * Debugging event. Data is the message.
     */
    DEBUG: string;
    /**
     * When the shard gets a ready dispatch. Data is the `READY` payload.
     */
    READY: DiscordTypes.GatewayReadyDispatch;
    /**
     * When the shard gets a resumed dispatch. Data is the `RESUMED` payload.
     */
    RESUMED: DiscordTypes.GatewayResumedDispatch;
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT: string;
    /**
     * When the shard enters a disconnected state.
     */
    STATE_DISCONNECTED: null;
    /**
     * When the shard enters a connecting state.
     */
    STATE_CONNECTING: null;
    /**
     * When the shard enters a resuming state.
     */
    STATE_RESUMING: null;
    /**
     * When the shard enters a connected state.
     */
    STATE_CONNECTED: null;
}
/**
 * Gateway shard states.
 */
export declare enum GatewayShardState {
    /**
     * The shard is disconnected.
     */
    DISCONNECTED = 0,
    /**
     * The shard is connecting. `GatewayShard#_ws` may be defined, however the connection process has not finished.
     * During this stage, the `GatewayShard`:
     * - Waits for an opcode 10 "hello" payload
     * - Responds with a heartbeat
     * - Waits for the first heartbeat ACK
     * - Sends an identify payload
     * - Waits for the ready event
     */
    CONNECTING = 1,
    /**
     * The shard is resuming. `GatewayShard#_ws` may be defined, however the resuming process has not finished.
     * During this stage, the `GatewayShard`:
     * - Sends a resume payload
     * - Waits for the resumed event
     */
    RESUMING = 2,
    /**
     * The shard is connected and is operating normally. A ready or resume event has been received.
     */
    CONNECTED = 3
}
/**
 * A single gateway shard.
 * Handles the low level ws communication with Discord.
 */
export declare class GatewayShard extends TypedEmitter<GatewayShardEvents> {
    /**
     * The last sequence number received.
     */
    lastSequence: number | null;
    /**
     * The shard's session ID.
     */
    sessionId: string | null;
    /**
     * The state of the shard's connection.
     */
    state: GatewayShardState;
    /**
     * The shard's ID.
     */
    readonly id: number;
    /**
     * The value to pass to `num_shards` in the identify payload.
     */
    readonly numShards: number;
    /**
     * The URL being used to connect to the gateway.
     */
    readonly url: string;
    /**
     * Options for the gateway shard.
     * Note that if you are using a `Client` or `ClientWorker` / `ClientMaster` and not manually creating a `GatewayShard` separately, these options may differ than the options specified when creating the client due to them being passed through the options factory.
     */
    readonly options: GatewayShardOptions;
    /**
     * A timeout used when connecting or resuming the shard.
     */
    private _connectionTimeout;
    /**
     * Heartbeat properties.
     */
    private _heartbeat;
    /**
     * The pending reject callback for the promise starting the shard.
     */
    private _pendingStartReject;
    /**
     * A queue of payloads to be sent after the shard has spawned. Pushed to when the shard has not spawned, and flushed after the READY event is dispatched.
     */
    private _spawnSendQueue;
    /**
     * The websocket used by the shard.
     */
    private _ws;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a gateway shard.
     * @param token The bot's token.
     * @param id The shard's ID.
     * @param numShards The value to pass to `num_shards` in the identify payload.
     * @param url The URL being used to connect to the gateway.
     * @param options Gateway shard options.
     */
    constructor(token: string, id: number, numShards: number, url: string, options: GatewayShardOptions);
    /**
     * Connect to the gateway.
     * The shard must be in a `DISCONNECTED` state.
     * @returns The ready payload.
     */
    spawn(): Promise<DiscordTypes.GatewayReadyDispatch>;
    /**
     * Restart / resume the shard.
     */
    restart(): Promise<DiscordTypes.GatewayResumedDispatch>;
    /**
     * Kill the shard.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code).
     * @param reason The reason the shard is being killed.
     */
    kill(code?: number, reason?: string): void;
    /**
     * Send a payload.
     * @param data The data to send.
     * @param force If the payload should bypass the send queue and always be sent immediately. Note that the queue is only used to cache `GatewayShard#send()` calls before the shard is in a `CONNECTED` state, so this option will have no effect when the shard is spawned. The queue is flushed after the shard receives the `READY` event. This option is primarily used internally, for dispatches such as a heartbeat or identify.
     */
    send(data: DiscordTypes.GatewaySendPayload, force?: boolean): Promise<void>;
    /**
     * Clears timers on the shard.
     */
    private _clearTimers;
    /**
     * Set the shard's state.
     * @param state The state to set the shard to.
     */
    private _enterState;
    /**
     * Flushes the send queue.
     */
    private _flushQueue;
    /**
     * Initiates the socket connection.
     * Creates `GatewayManager#_ws`, waits for open, binds events, then returns.
     * This method does not wait for a ready or resumed event.
     * Expects the shard to be in a "CONNECTING" or "RESUMING" state.
     * @param resume If the shard is being resumed.
     */
    private _initConnection;
    /**
     * Sends a payload to the gateway. Used internally for `GatewayShard#send` and when flushing the queue in `GatewayShard#_flushQueue()`.
     * @param payload The payload to send.
     * @internal
     */
    private _send;
    /**
     * Listener used for `GatewayShard#_ws#on('close')`
     * @internal
     */
    private _onClose;
    /**
     * Listener used for `GatewayShard#_ws#on('error')`
     * @internal
     */
    private _onError;
    /**
     * Listener used for `GatewayShard#_ws#on('message')`
     * @internal
     */
    private _onMessage;
}
