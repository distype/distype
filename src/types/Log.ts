/**
 * A callback for logging events.
 */
export type LogCallback = (msg: string, options: LogMessageOptions) => void;

/**
 * A logging level.
 */
export type LogLevel = `DEBUG` | `INFO` | `WARN` | `ERROR`;

/**
 * Options for a log message.
 */
export interface LogMessageOptions {
    /**
     * The {@link LogLevel level} being logged at.
     */
    level: LogLevel;
    /**
     * The system creating the log.
     */
    system: string;
}
