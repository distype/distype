import { ClientOptions } from 'ws';
import { EventEmitter } from '@jpbberry/typed-emitter';
import * as DiscordTypes from 'discord-api-types';
/**
 * Gateway shard events.
 */
export interface GatewayShardEvents {
    /**
     * When the shard receives a payload.
     */
    '*': DiscordTypes.GatewayDispatchPayload;
    /**
     * Debugging event.
     */
    DEBUG: string;
    /**
     * When the shard gets a ready dispatch.
     */
    READY: DiscordTypes.GatewayReadyDispatch;
    /**
     * When the shard gets a resumed dispatch.
     */
    RESUMED: DiscordTypes.GatewayResumedDispatch;
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
 * Gateway shard options.
 */
export interface GatewayShardOptions {
    /**
     * The number of milliseconds to wait between spawn and resume attempts.
     * @default 2500
     */
    attemptDelay?: number;
    /**
     * Gateway intents.
     */
    intents: number;
    /**
     * The number of members in a guild to reach before the gateway stops sending offline members in the guild member list.
     * Must be between 50 and 250.
     * @default 50
     */
    largeThreshold?: number;
    /**
     * The maximum number of spawn attempts before rejecting.
     * @default 10
     */
    maxSpawnAttempts?: number;
    /**
     * The total number of shards being spawned / the value to pass to `num_shards` in the identify payload.
     */
    numShards: number;
    /**
     * The initial presence for the bot to use.
     */
    presence?: Required<DiscordTypes.GatewayIdentifyData>[`presence`];
    /**
     * Socket timeouts.
     */
    timeouts?: {
        /**
         * The amonut of milliseconds to wait before deeming a connect attempt as timed out.
         */
        connect?: number;
        /**
         * The amonut of milliseconds to wait before deeming a resume attempt as timed out.
         */
        resume?: number;
        /**
         * The amonut of milliseconds to wait before deeming a send attempt as timed out.
         */
        send?: number;
    };
    /**
     * The URL for the socket to connect to.
     */
    url: string;
    /**
     * Advanced [ws](https://github.com/websockets/ws) options.
     * [`ws` API Reference](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketaddress-protocols-options)
     */
    wsOptions?: ClientOptions;
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
export declare class GatewayShard extends EventEmitter<GatewayShardEvents> {
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
     * Options for the gateway shard.
     */
    readonly options: Required<GatewayShardOptions>;
    /**
     * The bot's token.
     */
    readonly token: string;
    /**
     * Heartbeat properties.
     */
    private _heartbeat;
    /**
     * The pending reject callback for the promise starting the shard.
     */
    private _pendingStartReject;
    /**
     * A timeout used when connecting or resuming the shard.
     */
    private _connectionTimeout;
    /**
     * The websocket used by the shard.
     */
    private _ws;
    /**
     * Create a gateway shard.
     * @param token The bot's token.
     * @param id The shard's ID.
     * @param options Gateway shard options.
     */
    constructor(token: string, id: number, options: Required<GatewayShardOptions>);
    /**
     * Connect to the gateway.
     * The shard must be in a `DISCONNECTED` state.
     * @returns The ready payload.
     */
    spawn(): Promise<DiscordTypes.GatewayReadyDispatch>;
    /**
     * Resume / restart the shard.
     */
    resume(): Promise<DiscordTypes.GatewayResumedDispatch>;
    /**
     * Kill the shard.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code).
     * @param reason The reason the shard is being killed.
     */
    kill(code?: number, reason?: string): void;
    /**
     * Send a payload.
     * @param data The data to send.
     */
    send(data: DiscordTypes.GatewaySendPayload): Promise<void>;
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
     * Initiates the socket connection.
     * Creates `GatewayManager#_ws`, waits for open, binds events, then returns.
     * This method does not wait for a ready or resumed event.
     * Expects the shard to be in a "CONNECTING" or "RESUMING" state.
     */
    private _initConnection;
    /**
     * Listener used for `GatewayShard#_ws#on('close')`
     */
    private _onClose;
    /**
     * Listener used for `GatewayShard#_ws#on('error')`
     */
    private _onError;
    /**
     * Listener used for `GatewayShard#_ws#on('message')`
     */
    private _onMessage;
}
