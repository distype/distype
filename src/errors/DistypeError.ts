/**
 * The system the error was emitted from.
 */
export type DistypeErrorSystem = `General` | `Client` | `Cache` | `Gateway` | `Gateway Shard ${number}` | `Gateway Shard Socket ${number}` | `Rest` | `Rest Bucket`;

/**
 * The type of error that has ocurred.
 */
export enum DistypeErrorType {
    /**
     * While getting self permissions, the {@link Gateway gateway} user was not defined.
     * Should be emitted by the {@link Client client}.
     */
    CLIENT_GET_SELF_PERMISSIONS_GATEWAY_USER_UNDEFINED = `CLIENT_GET_SELF_PERMISSIONS_GATEWAY_USER_UNDEFINED`,
    /**
     * Gateway {@link GatewayShard shards} are already running.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_ALREADY_CONNECTED = `GATEWAY_ALREADY_CONNECTED`,
    /**
     * A {@link GatewayShard shard} doesn't exist on the {@link Gateway gateway manager}.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_NO_SHARD = `GATEWAY_NO_SHARD`,
    /**
     * Shard calculations aren't stored on the {@link Gateway gateway manager}.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_NO_STORED_SHARD_CALCULATION = `GATEWAY_NO_STORED_SHARD_CALCULATION`,
    /**
     * The {@link Gateway gateway manager} hasn't received all [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) dispatches.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_MANAGER_NOT_READY = `GATEWAY_MANAGER_NOT_READY`,
    /**
     * A specified nonce for getting members via the {@link Gateway gateway manager} is too big.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_MEMBER_NONCE_TOO_BIG = `GATEWAY_MEMBER_NONCE_TOO_BIG`,
    /**
     * The {@link Gateway gateway manager} got an invalid response from [`GET /gateway/bot`](https://discord.com/developers/docs/topics/gateway#get-gateway-bot), or the custom specified URL.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_INVALID_REST_RESPONSE = `GATEWAY_INVALID_REST_RESPONSE`,
    /**
     * The {@link Gateway gateway manager} got an invalid shard configuration.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_INVALID_SHARD_CONFIG = `GATEWAY_INVALID_SHARD_CONFIG`,
    /**
     * The session start limit has been reached by the {@link Gateway gateway manager}.
     * Should be emitted by the {@link Gateway gateway manager}.
     */
    GATEWAY_SESSION_START_LIMIT_REACHED = `GATEWAY_SESSION_START_LIMIT_REACHED`,
    /**
     * The {@link GatewayShard shard} is already connecting.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_ALREADY_CONNECTING = `GATEWAY_SHARD_ALREADY_CONNECTING`,
    /**
     * The {@link GatewayShard shard}'s connection attempts were interrupted by a call to kill the {@link GatewayShard shard}.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_INTERRUPT_FROM_KILL = `GATEWAY_SHARD_INTERRUPT_FROM_KILL`,
    /**
     * The {@link GatewayShard shard} was closed while initiating the socket.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT = `GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT`,
    /**
     * The {@link GatewayShard shard} reached the maximum number of spawn attempts specified.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED = `GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED`,
    /**
     * The {@link GatewayShard shard}'s sending queue was force flushed.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED = `GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED`,
    /**
     * The {@link GatewayShard shard} tried sending data to the gateway while the socket wasn't open.
     * Should be emitted by a {@link GatewayShard gateway shard}.
     */
    GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET = `GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET`,
    /**
     * The {@link Rest rest manager} tried to create a {@link RestBucket rate limit bucket} while rate limits are disabled.
     * Should be emitted by the {@link Rest rest manager}.
     */
    REST_CREATE_BUCKET_WITH_DISABLED_RATELIMITS = `REST_CREATE_BUCKET_WITH_DISABLED_RATELIMITS`,
    /**
     * There was an error making a {@link Rest rest} request.
     * Should be emitted by the {@link Rest rest manager} or a {@link RestBucket rate limit bucket}.
     */
    REST_REQUEST_ERROR = `REST_REQUEST_ERROR`,
    /**
     * The {@link Rest rest manager} was unable to parse the response body.
     * Should be emitted by the {@link Rest rest manager}.
     */
    REST_UNABLE_TO_PARSE_RESPONSE_BODY = `REST_UNABLE_TO_PARSE_RESPONSE_BODY`
}

/**
 * An error emitted from Distype.
 */
export class DistypeError extends Error {
    /**
     * The type of error that has ocurred.
     */
    public readonly errorType: DistypeErrorType;
    /**
     * The system the error was emitted from.
     */
    public readonly system: DistypeErrorSystem;

    /**
     * Create a Distype error.
     * @param message The error's message.
     * @param errorType The type of error that has ocurred.
     * @param system The system the error was emitted from.
     */
    constructor (message: string, errorType: DistypeErrorType, system: DistypeErrorSystem) {
        super(message);

        this.errorType = errorType;
        this.system = system;
    }

    /**
     * The name of the error.
     */
    public override get name (): `DistypeError` {
        return `DistypeError`;
    }
}
