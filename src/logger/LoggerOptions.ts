import { LoggerFormats, LoggerLevel } from './Logger';

/**
 * {@link Logger} options.
 */
export interface LoggerOptions {
    /**
     * The logger's enabled output.
     */
    enabledOutput: {
        /**
         * The levels to output from `console.log()`.
         * @default [`INFO`, `WARN`, `ERROR`]
         */
        log?: LoggerLevel[],
        /**
         * The levels to output from the logger's event emitter.
         * @default [`DEBUG`, `INFO`, `WARN`, `ERROR`]
         */
        events?: LoggerLevel[]
    }
    /**
     * The format for the logger to use.
     * Note these only apply to the `console.log()`.
     */
    format: {
        /**
         * The format for the dividers.
         * @default `DIM`
         */
        divider?: LoggerFormats
        /**
         * The format for the timestamp.
         * @default `WHITE`
         */
        timestamp?: LoggerFormats
        /**
         * The format for the logging level.
         * @default {
         *   ALL: `BRIGHT`,
         *   DEBUG: `WHITE`,
         *   INFO: `CYAN`,
         *   WARN: `YELLOW`,
         *   ERROR: `RED`
         * }
         */
        levels?: Record<LoggerLevel | `ALL`, LoggerFormats> | LoggerFormats
        /**
         * The format for the system.
         * @default [`BRIGHT`, `WHITE`]
         */
        system?: LoggerFormats
        /**
         * The format for the message.
         * @default `WHITE`
         */
        message?: LoggerFormats
    }
    /**
     * If the timestamp should be included in the `console.log()` message.
     */
    showTime: boolean
}
