import { LoggerOptions } from './LoggerOptions';
import { NodeConstants } from '../constants/NodeConstants';
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
export declare type LoggerFormat = keyof typeof NodeConstants[`LOG_FORMATS`];
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
export declare type LoggerSystem = `General` | `Client` | `Cache` | `Gateway` | `Rest` | string;
/**
 * The logger.
 * Used to simplify detailed logging.
 */
export declare class Logger extends TypedEmitter<LoggerEvents> {
    readonly options: LoggerOptions;
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
