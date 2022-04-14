/**
 * The system the error was emitted from.
 */
export declare type DistypeErrorSystem = `General` | `Client` | `Client Master` | `Client Worker ${number}` | `Cache` | `Gateway` | `Gateway Shard ${number}` | `Gateway Shard Socket ${number}` | `Rest` | `Rest Bucket`;
/**
 * The type of error that has occured.
 */
export declare enum DistypeErrorType {
    /**
     * Gateway {@link GatewayShard shard}s are already running.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_ALREADY_CONNECTED = "GATEWAY_ALREADY_CONNECTED",
    /**
     * A {@link GatewayShard shard} doesn't exist on the {@link Gateway gateway manager}.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_NO_SHARD = "GATEWAY_NO_SHARD",
    /**
     * A specified nonce for getting members via the {@link Gateway gateway} is too big.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_MEMBER_NONCE_TOO_BIG = "GATEWAY_MEMBER_NONCE_TOO_BIG",
    /**
     * The {@link Gateway gateway manager} got an invalid response from `GET` `/gateway/bot`, or the custom specified URL.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_INVALID_REST_RESPONSE = "GATEWAY_INVALID_REST_RESPONSE",
    /**
     * The {@link Gateway gateway manager} got an invalid shard configuration.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_INVALID_SHARD_CONFIG = "GATEWAY_INVALID_SHARD_CONFIG",
    /**
     * The session start limit has been reached by the {@link Gateway gateway manager}.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_SESSION_START_LIMIT_REACHED = "GATEWAY_SESSION_START_LIMIT_REACHED",
    /**
     * The {@link GatewayShard shard} is already connecting.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_ALREADY_CONNECTING = "GATEWAY_SHARD_ALREADY_CONNECTING",
    /**
     * The {@link GatewayShard shard}'s connection attempts were interrupted by a call to kill the {@link GatewayShard shard}.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_INTERRUPT_FROM_KILL = "GATEWAY_SHARD_INTERRUPT_FROM_KILL",
    /**
     * The {@link GatewayShard shard} was closed while initiating the socket.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT = "GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT",
    /**
     * The {@link GatewayShard shard} reached the maximum number of spawn attempts specified.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED = "GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED",
    /**
     * The {@link GatewayShard shard}'s sending queue was force flushed.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED = "GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED",
    /**
     * The {@link GatewayShard shard} tried sending data to the gateway while the socket wasn't open.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET = "GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET"
}
/**
 * An error emitted from distype.
 */
export declare class DistypeError extends Error {
    /**
     * The type of error that has occured.
     */
    readonly errorType: DistypeErrorType;
    /**
     * The system the error was emitted from.
     */
    readonly system: DistypeErrorSystem;
    /**
     * Create a gateway shard error.
     * @param message The error's message.
     * @param errorType The type of error that has occured.
     * @param system The system the error was emitted from.
     */
    constructor(message: string, errorType: DistypeErrorType, system: DistypeErrorSystem);
    /**
     * The name of the error.
     */
    get name(): `DistypeError`;
}