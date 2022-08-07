import { Gateway } from './Gateway';
import { LogCallback } from '../types/Log';
import { TypedEmitter } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/v10';
import { WebSocket } from 'ws';
/**
 * {@link GatewayShard Gateway shard} events.
 */
export declare type GatewayShardEvents = {
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT_PAYLOAD: (payload: string) => void;
    /**
     * When the {@link GatewayShard shard} receives a payload. Data is the parsed payload.
     */
    RECEIVED_PAYLOAD: (payload: DiscordTypes.GatewayDispatchPayload) => void;
    /**
     * When the {@link GatewayShard shard} enters an {@link GatewayShardState idle state}.
     */
    IDLE: () => void;
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState disconnected state}.
     */
    DISCONNECTED: () => void;
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState connecting state}.
     */
    CONNECTING: () => void;
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState ready state}.
     */
    READY: () => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState guilds ready state}.
     */
    GUILDS_READY: () => void;
};
/**
 * {@link GatewayShard Gateway shard} states.
 */
export declare enum GatewayShardState {
    /**
     * The {@link GatewayShard shard} is not running.
     */
    IDLE = 0,
    /**
     * The {@link GatewayShard shard} was disconnected.
     */
    DISCONNECTED = 1,
    /**
     * The {@link GatewayShard shard} is connecting to the gateway.
     * During this stage, the {@link GatewayShard shard}:
     * - Initiates the websocket connection
     * - Waits for a [hello payload](https://discord.com/developers/docs/topics/gateway#hello)
     * - Starts [heartbeating](https://discord.com/developers/docs/topics/gateway#heartbeating)
     * - The shard sends an [identify payload](https://discord.com/developers/docs/topics/gateway#identify)
     * - Waits for the [READY](https://discord.com/developers/docs/topics/gateway#ready) dispatch
     *
     * Alternatively, if the shard receives an [Invalid Session payload](https://discord.com/developers/docs/topics/gateway#invalid-session) and enters this state:
     * - The shard sends an [identify payload](https://discord.com/developers/docs/topics/gateway#identify) or a [resume payload](https://discord.com/developers/docs/topics/gateway#resume)
     * - Waits for the [READY](https://discord.com/developers/docs/topics/gateway#ready) or [RESUMED](https://discord.com/developers/docs/topics/gateway#resumed) dispatch
     */
    CONNECTING = 2,
    /**
     * The {@link GatewayShard shard} is connected and is operating normally. A [READY](https://discord.com/developers/docs/topics/gateway#ready) or [RESUMED](https://discord.com/developers/docs/topics/gateway#resumed) dispatch has been received.
     */
    READY = 3,
    /**
     * The {@link GatewayShard shard} has received all [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) dispatches (or has timed out).
     */
    GUILDS_READY = 4
}
/**
 * A gateway shard.
 * Handles the low level ws communication with Discord.
 */
export declare class GatewayShard extends TypedEmitter<GatewayShardEvents> {
    /**
     * Guilds that belong to the shard.
     * This is populated as the shard is receiving [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) payloads, and is accurate after the shard is in a {@link GatewayShardState guilds ready state}.
     */
    guilds: Set<Snowflake>;
    /**
     * The shard's heartbeat ping in milliseconds.
     */
    heartbeatPing: number;
    /**
     * The last [sequence number](https://discord.com/developers/docs/topics/gateway#resumed) received.
     */
    lastSequence: number | null;
    /**
     * The shard's [session ID](https://discord.com/developers/docs/topics/gateway#ready-ready-event-fields).
     */
    sessionId: string | null;
    /**
     * The shard's {@link GatewayShardState state}.
     */
    state: GatewayShardState;
    /**
     * Guilds expected to receive a [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) from.
     */
    waitingForGuilds: Set<Snowflake> | null;
    /**
     * The [WebSocket](https://github.com/websockets/ws) used by the shard.
     */
    ws: WebSocket | null;
    /**
     * The shard's ID.
     */
    readonly id: number;
    /**
     * The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     */
    readonly numShards: number;
    /**
     * Options for the gateway shard.
     */
    readonly options: Gateway[`options`];
    /**
     * The system string used for logging.
     */
    readonly system: `Gateway Shard ${number}`;
    /**
     * The URL being used.
     */
    readonly url: string;
    /**
     * The shard's text decoder.
     */
    private _textDecoder;
    /**
     * Timers used by the shard.
     */
    private _timers;
    /**
     * Timestamps used by the shard.
     */
    private _timestamps;
    /**
     * The {@link LogCallback log callback} used by the shard.
     */
    private _log;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a gateway shard.
     * @param token The bot's token.
     * @param id The shard's ID.
     * @param url The URL being used to connect to the gateway.
     * @param numShards The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     * @param options Gateway shard options.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway shard.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token: string, id: number, numShards: number, url: string, options: Gateway[`options`], logCallback?: LogCallback, logThisArg?: any);
    /**
     * Gets the shard's ping.
     * @returns The node's ping in milliseconds.
     */
    getPing(): Promise<number>;
    /**
     * Kills the shard.
     * @param reason The reason the shard is being killed. Defaults to `"Manual kill"`.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code) to send if the connection is still open. Defaults to `1000`.
     */
    kill(reason?: string, code?: number): void;
    /**
     * Sends a payload to the gateway.
     * @param paylaod The data to send.
     */
    send(payload: DiscordTypes.GatewaySendPayload): Promise<void>;
    /**
     * Spawns the shard.
     */
    spawn(): Promise<void>;
    /**
     * Checks if all [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) dispatches have been received.
     */
    private _checkGuilds;
    /**
     * Closes the connection and cleans up variables on the shard to spawn a new connection.
     */
    private _close;
    /**
     * Enter a state.
     * @param state The state to enter.
     */
    private _enterState;
    /**
     * Send the [identify payload](https://discord.com/developers/docs/topics/gateway#identify).
     */
    private _identify;
    /**
     * Send the [resume payload](https://discord.com/developers/docs/topics/gateway#resume).
     */
    private _resume;
    /**
     * Sends a heartbeat.
     * @param force If waiting for the ACK check should be omitted. Only use for responding to heartbeat requests.
     */
    private _sendHeartbeat;
    /**
     * Spawns the shard.
     * @param attempt The current attempt count.
     */
    private _spawn;
    /**
     * Unpack a payload.
     * @param payload The payload.
     * @param isBinary If the payload is binary.
     * @returns The unpacked payload.
     */
    private _unpackPayload;
    /**
     * When the WebSocket emits a close event.
     */
    private _wsOnClose;
    /**
     * When the WebSocket emits an error event.
     */
    private _wsOnError;
    /**
     * When the WebSocket emits a message event.
     */
    private _wsOnMessage;
}
