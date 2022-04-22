import { Gateway } from './Gateway';
import { LogCallback } from '../types/Log';
import { TypedEmitter } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
/**
 * {@link GatewayShard Gateway shard} events.
 */
export interface GatewayShardEvents extends Record<string, (...args: any[]) => void> {
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
     * When the {@link GatewayShard shard} enters a {@link GatewayShardState disconnected state}.
     */
    DISCONNECTED: () => void;
}
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
     * - Waits for the [ready event](https://discord.com/developers/docs/topics/gateway#ready)
     */
    IDENTIFYING = 2,
    /**
     * The {@link GatewayShard shard} is resuming.
     * During this stage, the {@link GatewayShard shard}:
     * - Sends a [resume payload](https://discord.com/developers/docs/topics/gateway#resume)
     * - Waits for the [resumed event](https://discord.com/developers/docs/topics/gateway#resumed)
     */
    RESUMING = 3,
    /**
     * The {@link GatewayShard shard} is connected and is operating normally. A [ready](https://discord.com/developers/docs/topics/gateway#ready) or [resumed](https://discord.com/developers/docs/topics/gateway#resumed) event has been received.
     */
    RUNNING = 4,
    /**
     * The {@link GatewayShard shard} was disconnected.
     * Note that if the shard is not automatically reconnecting to the gateway, the shard will enter an `IDLE` state and will not enter a `DISCONNECTED` state.
     */
    DISCONNECTED = 5
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
     * The shard's ping.
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
     * The shard's ID.
     */
    readonly id: number;
    /**
     * {@link GatewayShardOptions Options} for the gateway shard.
     * Note that if you are using a {@link Client} or {@link ClientMaster} / {@link ClientWorker} and not manually creating a {@link Client} separately, these options may differ than the options specified when creating the client due to them being passed through the {@link clientOptionsFactory}.
     */
    readonly options: Gateway[`options`];
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    readonly system: `Gateway Shard ${number}`;
    /**
     * The heartbeat interval timer.
     */
    private _heartbeatIntervalTimer;
    /**
     * The time that the heartbeat timer has been waiting for the jitter to start for.
     */
    private _heartbeatJitterActive;
    /**
     * The time the heartbeat has been waiting for an ACK for.
     */
    private _heartbeatWaitingSince;
    /**
     * If the shard was killed. Set back to `false` when a new conection attempt is started.
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
     * The websocket used.
     */
    private _ws;
    /**
     * The value to pass to `num_shards` in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
     */
    private readonly _numShards;
    /**
     * The URL being used.
     */
    private readonly _url;
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
     * @param options {@link GatewayShardOptions Gateway shard options}.
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
     * Sends a heartbeat.
     * @param force If waiting for the ACK check should be omitted. Only use for responding to heartbeat requests.
     */
    private _heartbeat;
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
     */
    private _send;
    /**
     * Parses an incoming payload.
     * @param data The data to parse.
     * @returns The parsed data.
     */
    private _parsePayload;
    /**
     * When the socket emits a close event.
     */
    private _wsOnClose;
    /**
     * When the socket emits an error event.
     */
    private _wsOnError;
    /**
     * When the socket emits a message event.
     */
    private _wsOnMessage;
}
