"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistypeError = exports.DistypeErrorType = void 0;
/**
 * The type of error that has occured.
 */
var DistypeErrorType;
(function (DistypeErrorType) {
    /**
     * The {@link GatewayShard shard} is already connecting.
     */
    DistypeErrorType["GATEWAY_SHARD_ALREADY_CONNECTING"] = "GATEWAY_SHARD_ALREADY_CONNECTING";
    /**
     * The {@link GatewayShard shard}'s connection attempts were interrupted by a call to kill the {@link GatewayShard shard.
     */
    DistypeErrorType["GATEWAY_SHARD_INTERRUPT_FROM_KILL"] = "GATEWAY_SHARD_INTERRUPT_FROM_KILL";
    /**
     * The {@link GatewayShard shard} was closed while initiating the socket.
     */
    DistypeErrorType["GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT"] = "GATEWAY_SHARD_CLOSED_DURING_SOCKET_INIT";
    /**
     * The {@link GatewayShard shard} reached the maximum number of spawn attempts specified.
     */
    DistypeErrorType["GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED"] = "GATEWAY_SHARD_MAX_SPAWN_ATTEMPTS_REACHED";
    /**
     * The {@link GatewayShard shard}'s sending queue was force flushed.
     */
    DistypeErrorType["GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED"] = "GATEWAY_SHARD_SEND_QUEUE_FORCE_FLUSHED";
    /**
     * The {@link GatewayShard shard} tried sending data to the gateway while the socket wasn't open.
     */
    DistypeErrorType["GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET"] = "GATEWAY_SHARD_SEND_WITHOUT_OPEN_SOCKET";
})(DistypeErrorType = exports.DistypeErrorType || (exports.DistypeErrorType = {}));
/**
 * An error emitted from distype.
 */
class DistypeError extends Error {
    /**
     * Create a gateway shard error.
     * @param message The error's message.
     * @param errorType The type of error that has occured.
     * @param system The system the error was emitted from.
     */
    constructor(message, errorType, system) {
        super(message);
        this.errorType = errorType;
        this.system = system;
    }
    /**
     * The name of the error.
     */
    get name() {
        return `DistypeError`;
    }
}
exports.DistypeError = DistypeError;
