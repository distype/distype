import { Gateway } from './Gateway';
import { LogCallback } from '../types/Log';
import { TypedEmitter } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
/**
 * {@link GatewayShard Gateway shard} events.
 */
export interface GatewayShardEvents {
    /**
     * When the {@link GatewayShard shard} receives a payload. Data is the parsed payload.
     */
    '*': DiscordTypes.GatewayDispatchPayload;
    /**
     * When the {@link GatewayShard shard} gets a ready dispatch. Data is the [ready payload](https://discord.com/developers/docs/topics/gateway#ready).
     */
    READY: DiscordTypes.GatewayReadyDispatch;
    /**
     * When the {@link GatewayShard shard} gets a resumed dispatch. Data is the [resumed payload](https://discord.com/developers/docs/topics/gateway#resumed).
     */
    RESUMED: DiscordTypes.GatewayResumedDispatch;
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT: string;
    /**
     * When the {@link GatewayShard shard} enters a disconnected state.
     */
    STATE_DISCONNECTED: null;
    /**
     * When the {@link GatewayShard shard} enters a connecting state.
     */
    STATE_CONNECTING: null;
    /**
     * When the {@link GatewayShard shard} enters a resuming state.
     */
    STATE_RESUMING: null;
    /**
     * When the {@link GatewayShard shard} enters a connected state.
     */
    STATE_CONNECTED: null;
}
/**
 * {@link GatewayShard Gateway shard} states.
 */
export declare enum GatewayShardState {
    /**
     * The {@link GatewayShard shard} is disconnected.
     */
    DISCONNECTED = 0,
    /**
     * The {@link GatewayShard shard} is connecting. `GatewayShard#_ws` may be defined, however the connection process has not finished.
     * During this stage, the {@link GatewayShard shard}:
     * - Waits for an opcode 10 "hello" payload
     * - Responds with a heartbeat
     * - Waits for the first heartbeat ACK
     * - Sends an identify payload
     * - Waits for the ready event
     */
    CONNECTING = 1,
    /**
     * The {@link GatewayShard shard} is resuming. `GatewayShard#_ws` may be defined, however the resuming process has not finished.
     * During this stage, the {@link GatewayShard shard}:
     * - Sends a resume payload
     * - Waits for the resumed event
     */
    RESUMING = 2,
    /**
     * The {@link GatewayShard shard} is connected and is operating normally. A [ready](https://discord.com/developers/docs/topics/gateway#ready) or [resumed](https://discord.com/developers/docs/topics/gateway#resumed) event has been received.
     */
    CONNECTED = 3
}
/**
 * A gateway shard.
 * Handles the low level ws communication with Discord.
 */
export declare class GatewayShard extends TypedEmitter<GatewayShardEvents> {
    /**
     * The last [sequence number](https://discord.com/developers/docs/topics/gateway#resumed) received.
     */
    lastSequence: number | null;
    /**
     * The shard's [session ID](https://discord.com/developers/docs/topics/gateway#ready-ready-event-fields).
     */
    sessionId: string | null;
    /**
     * The {@link GatewayShardState state} of the shard's connection.
     */
    state: GatewayShardState;
    /**
     * The shard's ID.
     */
    readonly id: number;
    /**
     * The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     */
    readonly numShards: number;
    /**
     * The URL being used to connect to the gateway.
     */
    readonly url: string;
    /**
     * {@link GatewayShardOptions Options} for the gateway shard.
     * Note that if you are using a {@link Client} or {@link ClientMaster} / {@link ClientWorker} and not manually creating a {@link Client} separately, these options may differ than the options specified when creating the client due to them being passed through the {@link clientOptionsFactory}.
     */
    readonly options: Gateway[`options`];
    /**
     * A timeout used when connecting or resuming the shard.
     */
    private _connectionTimeout;
    /**
     * [Heartbeat](https://discord.com/developers/docs/topics/gateway#heartbeating) interval.
     */
    private _heartbeatInterval;
    /**
     * If the shard is waiting for a [heartbeat](https://discord.com/developers/docs/topics/gateway#heartbeating).
     */
    private _heartbeatWaiting;
    /**
     * The {@link LogCallback log callback} used by the shard.
     */
    private _log;
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
     * @param numShards The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     * @param url The URL being used to connect to the gateway.
     * @param options {@link GatewayShardOptions Gateway shard options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway shard.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token: string, id: number, numShards: number, url: string, options: Gateway[`options`], logCallback?: LogCallback, logThisArg?: any);
    /**
     * Connect to the gateway.
     * The shard must be in a {@link GatewayShardState DISCONNECTED} state.
     * @returns The [ready payload](https://discord.com/developers/docs/topics/gateway#ready).
     */
    spawn(): Promise<DiscordTypes.GatewayReadyDispatch>;
    /**
     * Restart / resume the shard.
     * @returns The [resumed payload](https://discord.com/developers/docs/topics/gateway#resumed).
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
     * @param force If the payload should bypass the send queue and always be sent immediately. Note that the queue is only used to cache `GatewayShard#send()` calls before the shard is in a {@link GatewayShardState CONNECTED} state, so this option will have no effect when the shard is spawned. The queue is flushed after the shard receives the [ready event](https://discord.com/developers/docs/topics/gateway#ready). This option is primarily used internally, for dispatches such as a heartbeat or identify.
     */
    send(data: DiscordTypes.GatewaySendPayload, force?: boolean): Promise<void>;
    /**
     * Clears timers on the shard.
     */
    private _clearTimers;
    /**
     * Set the shard's {@link GatewayShardState state}.
     * @param state The {@link GatewayShardState state} to set the shard to.
     */
    private _enterState;
    /**
     * Flushes the send queue.
     */
    private _flushQueue;
    /**
     * Initiates the socket connection.
     * Creates `GatewayManager#_ws`, waits for open, binds events, then returns.
     * This method does not wait for a [ready](https://discord.com/developers/docs/topics/gateway#ready) or [resumed](https://discord.com/developers/docs/topics/gateway#resumed) event.
     * Expects the shard to be in a {@link GatewayShardState CONNECTING} or {@link GatewayShardState RESUMING} state.
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
     * Sends a [heartbeat](https://discord.com/developers/docs/topics/gateway#heartbeating).
     */
    private _sendHeartbeat;
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
