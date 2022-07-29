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
     * When the {@link GatewayShard shard} receives a payload. Data is the parsed payload.
     */
    RECEIVED_MESSAGE: (payload: DiscordTypes.GatewayDispatchPayload) => void;
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT_PAYLOAD: (payload: string) => void;
    /**
     * When the {@link GatewayShard shard} enters an {@link GatewayShardState idle state}.
     */
    IDLE: () => void;
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState connecting state}.
     */
    CONNECTING: () => void;
    /**
     * When the {@link GatewayShard shard} enters an {@link GatewayShardState identifying state}.
     */
    IDENTIFYING: () => void;
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState resuming state}.
     */
    RESUMING: () => void;
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState running state}.
     */
    RUNNING: () => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState guilds ready state}.
     */
    GUILDS_READY: () => void;
    /**
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState disconnected state}.
     */
    DISCONNECTED: () => void;
};
/**
 * {@link GatewayShard Gateway shard} states.
 */
export declare enum GatewayShardState {
    /**
     * The {@link GatewayShard shard} is not running, and is not pending a reconnect.
     */
    IDLE = 0,
    /**
     * The {@link GatewayShard shard} is connecting to the gateway.
     * During this stage, the {@link GatewayShard shard}:
     * - Initiates the websocket connection
     * - Starts [heartbeating](https://discord.com/developers/docs/topics/gateway#heartbeating)
     */
    CONNECTING = 1,
    /**
     * The {@link GatewayShard shard} is identifying.
     * During this stage, the {@link GatewayShard shard}:
     * - Waits for a [hello payload](https://discord.com/developers/docs/topics/gateway#hello)
     * - The shard sends an [identify payload](https://discord.com/developers/docs/topics/gateway#identify)
     * - Waits for the [READY](https://discord.com/developers/docs/topics/gateway#ready) dispatch
     */
    IDENTIFYING = 2,
    /**
     * The {@link GatewayShard shard} is resuming.
     * During this stage, the {@link GatewayShard shard}:
     * - Sends a [resume payload](https://discord.com/developers/docs/topics/gateway#resume)
     * - Waits for the [RESUME](https://discord.com/developers/docs/topics/gateway#resumed) dispatch
     */
    RESUMING = 3,
    /**
     * The {@link GatewayShard shard} is connected and is operating normally. A [READY](https://discord.com/developers/docs/topics/gateway#ready) or [RESUMED](https://discord.com/developers/docs/topics/gateway#resumed) dispatch has been received.
     */
    RUNNING = 4,
    /**
     * The {@link GatewayShard shard} has received all [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) dispatches (or has timed out).
     */
    GUILDS_READY = 5,
    /**
     * The {@link GatewayShard shard} was disconnected.
     * Note that if the shard is not automatically reconnecting to the gateway, the shard will enter an `IDLE` state and will not enter a `DISCONNECTED` state.
     */
    DISCONNECTED = 6
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
     * The last [sequence number](https://discord.com/developers/docs/topics/gateway#resumed) received.
     */
    lastSequence: number | null;
    /**
     * The shard's ping in milliseconds.
     */
    ping: number;
    /**
     * The shard's [session ID](https://discord.com/developers/docs/topics/gateway#ready-ready-event-fields).
     */
    sessionId: string | null;
    /**
     * The shard's {@link GatewayShardState state}.
     */
    state: GatewayShardState;
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
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    readonly system: `Gateway Shard ${number}`;
    /**
     * The URL being used.
     */
    readonly url: string;
    /**
     * Guilds expected to receive a [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) from.
     */
    private _expectedGuilds;
    /**
     * Heartbeat helpers.
     */
    private _heartbeat;
    /**
     * If the shard was killed. Set back to `false` when a new connection attempt is started.
     */
    private _killed;
    /**
     * The {@link LogCallback log callback} used by the shard.
     */
    private _log;
    /**
     * A queue of data to be sent after the socket opens.
     */
    private _queue;
    /**
     * If the shard has an active spawn or restart loop.
     */
    private _spinning;
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
     * If the shard can resume.
     */
    get canResume(): boolean;
    /**
     * Connect to the gateway.
     * Note that this method does not wait for guilds to be ready to resolve.
     */
    spawn(): Promise<void>;
    /**
     * Restart / resume the shard.
     */
    restart(): Promise<void>;
    /**
     * Kill the shard.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code). Defaults to `1000`.
     * @param reason The reason the shard is being killed. Defaults to `"Manual kill"`.
     */
    kill(code?: number, reason?: string): void;
    /**
     * Send data to the gateway.
     * @param data The data to send.
     */
    send(data: DiscordTypes.GatewaySendPayload): Promise<void>;
    /**
     * Checks if all [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) dispatches have been received.
     */
    private _checkGuildsReady;
    /**
     * Closes the connection, cleans up helper variables and flushes the queue.
     * @param resuming If the shard will be resuming after the close.
     * @param code A socket [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code).
     * @param reason The reason the shard is being closed.
     */
    private _close;
    /**
     * Enter a state.
     * @param state The state to enter.
     */
    private _enterState;
    /**
     * Flushes the send queue.
     * @param reject If the queue shouldn't be sent, and all promises should be rejected.
     */
    private _flushQueue;
    /**
     * Initiate the socket.
     * @param resume If the shard is resuming.
     */
    private _initSocket;
    /**
     * Reconnect the shard.
     * @param resume If the shard should be resumed.
     */
    private _reconnect;
    /**
     * Send data to the gateway.
     * @param data The data to send.
     * @param op The opcode in the payload (non-consequential, only used for logging).
     */
    private _send;
    /**
     * Sends a heartbeat.
     * @param force If waiting for the ACK check should be omitted. Only use for responding to heartbeat requests.
     */
    private _sendHeartbeat;
    /**
     * Parses an incoming payload.
     * @param data The data to parse.
     * @returns The parsed data.
     */
    private _parsePayload;
    /**
     * When the socket emits a close event.
     */
    private wsOnClose;
    /**
     * When the socket emits an error event.
     */
    private wsOnError;
    /**
     * When the socket emits a message event.
     */
    private wsOnMessage;
}
