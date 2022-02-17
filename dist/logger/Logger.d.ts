import { LoggerOptions } from './LoggerOptions';
import { LoggerRawFormats } from '../constants/LoggerRawFormats';
import { TypedEmitter } from '../utils/TypedEmitter';
/**
 * Log events.
 */
export declare type LoggerEvents = Record<LoggerLevel, {
    msg: string;
    system: LoggerSystem;
}>;
/**
 * A single logging format.
 */
export declare type LoggerFormat = keyof typeof LoggerRawFormats;
/**
 * A single or multiple logging formats.
 */
export declare type LoggerFormats = LoggerFormat | LoggerFormat[];
/**
 * A logging level.
 */
export declare type LoggerLevel = `DEBUG` | `INFO` | `WARN` | `ERROR`;
/**
 * Options for a log message.
 */
export interface LoggerMessageOptions extends Partial<LoggerOptions> {
    /**
     * If the message is imitted internally from distype.
     * @default false
     * @internal
     */
    internal?: boolean;
    /**
     * @default `INFO`
     */
    level?: LoggerLevel;
    /**
     * @default `General`
     */
    system?: LoggerSystem;
}
/**
 * A system that emitted a log.
 */
export declare type LoggerSystem = `General` | `Client` | `Client Master` | `Client Worker ${number}` | `Cache` | `Gateway` | `Gateway Shard ${number}` | `Rest` | `Rest Bucket`;
/**
 * The logger.
 * Used to simplify detailed logging.
 */
export declare class Logger extends TypedEmitter<LoggerEvents> {
    /**
     * {@link LoggerOptions Options} for the logger.
     */
    readonly options: LoggerOptions;
    /**
     * Create a logger.
     * @param options {@link LoggerOptions Logger options}.
     */
    constructor(options: LoggerOptions);
    /**
     * Log a message.
     * @param msg The message to be logged.
     * @param options The options for the message.
     */
    log(msg: string, options?: LoggerMessageOptions): void;
    /**
     * Converts formats from options into physical console formats.
     * @param formats The formats to convert.
     */
    private _convertFormats;
    /**
     * Combines formats into a single string of physical console formats.
     * @param formats The formats to combine.
     */
    private _combineFormats;
    /**
     * Creates a timestamp.
     * @param time The time for the timestamp.
     */
    private _timestamp;
}
