/**
 * A callback for logging events.
 */
export declare type LogCallback = (msg: string, options: LogMessageOptions) => void;
/**
 * A logging level.
 */
export declare type LogLevel = `DEBUG` | `INFO` | `WARN` | `ERROR`;
/**
 * Options for a log message.
 */
export interface LogMessageOptions {
    /**
     * The {@link LoggerLevel level} being logged at.
     */
    level: LogLevel;
    /**
     * The {@link LoggerSysten system} creating the log.
     */
    system: LogSystem;
}
/**
 * A system that created a log.
 */
export declare type LogSystem = `General` | `Client` | `Client Master` | `Client Worker ${number}` | `Cache` | `Gateway` | `Gateway Shard ${number}` | `Rest` | `Rest Bucket`;
