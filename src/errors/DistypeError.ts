/**
 * The system the error was emitted from.
 */
export type DistypeErrorSystem = `General` | `Client` | `Client Master` | `Client Worker ${number}` | `Cache` | `Gateway` | `Gateway Shard ${number}` | `Gateway Shard Socket ${number}` | `Rest` | `Rest Bucket`;

/**
 * The type of error that has occured.
 */
export enum DistypeErrorType {
    /**
     * The {@link GatewayShard shard} is already connecting.
     */
    GATEWAY_SHARD_ALREADY_CONNECTING = `GATEWAY_SHARD_ALREADY_CONNECTING`,
    /**
     * The {@link GatewayShard shard}'s connection attempts were interrupted by a call to kill the {@link GatewayShard shard.
     */
    GATEWAY_SHARD_INTERRUPT_FROM_KILL = `GATEWAY_SHARD_INTERRUPT_FROM_KILL`,
    /**
     * The {@link GatewayShard shard} was closed while initiating the socket.
     */
    GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT = `GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT`,
    /**
     * The {@link GatewayShard shard} reached the maximum number of spawn attempts specified.
     */
    GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED = `GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED`,
    /**
     * The {@link GatewayShard shard}'s sending queue was force flushed.
     */
    GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED = `GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED`,
    /**
     * The {@link GatewayShard shard} tried sending data to the gateway while the socket wasn't open.
     */
    GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET = `GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET`
}

/**
 * An error emitted from distype.
 */
export class DistypeError extends Error {
    /**
     * The type of error that has occured.
     */
    public readonly errorType: DistypeErrorType;
    /**
     * The system the error was emitted from.
     */
    public readonly system: DistypeErrorSystem;

    /**
     * Create a gateway shard error.
     * @param message The error's message.
     * @param errorType The type of error that has occured.
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
