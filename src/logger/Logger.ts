import { LoggerOptions } from './LoggerOptions';

import { NodeConstants } from '../constants/NodeConstants';
import { TypedEmitter } from '../utils/TypedEmitter';

/**
 * Log events.
 */
export type LoggerEvents = Record<LoggerLevel, { msg: string, system: LoggerSystem }>

/**
 * A single logging format.
 */
export type LoggerFormat = keyof typeof NodeConstants[`LOG_FORMATS`];

/**
 * A single or multiple logging formats.
 */
export type LoggerFormats = LoggerFormat | LoggerFormat[];

/**
 * A logging level.
 */
export type LoggerLevel = `DEBUG` | `INFO` | `WARN` | `ERROR`;

/**
 * Options for a log message.
 */
export interface LoggerMessageOptions extends Partial<LoggerOptions> {
    /**
     * If the message is imitted internally from distype.
     * @default false
     * @internal
     */
    internal?: boolean
    /**
     * @default `INFO`
     */
    level?: LoggerLevel
    /**
     * @default `General`
     */
    system?: LoggerSystem
}

/**
 * A system that emitted a log.
 */
export type LoggerSystem = `General` | `Client` | `Cache` | `Gateway` | `Rest` | string;

/**
 * The logger.
 * Used to simplify detailed logging.
 */
export class Logger extends TypedEmitter<LoggerEvents> {
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
    public readonly options: LoggerOptions;

    constructor(options: LoggerOptions) {
        super();

        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options) as Logger[`options`],
            writable: false
        });
    }

    /**
     * Log a message.
     * @param msg The message to be logged.
     * @param options The options for the message.
     */
    public log (msg: string, options?: LoggerMessageOptions): void {
        const completeOptions: Required<LoggerMessageOptions> = {
            internal: false,
            level: `INFO`,
            system: `General`,
            ...this.options,
            ...options
        };

        if (completeOptions.internal && completeOptions.disableInternal) return;

        const reset = NodeConstants.LOG_FORMATS[`RESET`];
        const formats = this._convertFormats(completeOptions.format);

        if ((completeOptions.enabledOutput.log ?? [`INFO`, `WARN`, `ERROR`]).includes(completeOptions.level)) console.log([
            completeOptions.showTime ? `${formats.timestamp}${this._timestamp()}` : ``,
            `${formats.levels[completeOptions.level]}${completeOptions.level}`,
            `${formats.system}${completeOptions.system}`,
            `${formats.message}${msg}${reset}`
        ].join(` ${reset}${formats.divider}|${reset} `));

        if ((completeOptions.enabledOutput.events ?? [`DEBUG`, `INFO`, `WARN`, `ERROR`]).includes(completeOptions.level)) this.emit(completeOptions.level, {
            msg, system: completeOptions.system
        });
    }

    /**
     * Converts formats from options into physical console formats.
     * @param formats The formats to convert.
     */
    private _convertFormats (formats: LoggerOptions[`format`]): {
        divider: string
        timestamp: string
        levels: Record<LoggerLevel, string>
        system: string
        message: string
    } {
        const levelsAll = (formats.levels as Record<`ALL`, LoggerFormats> | undefined)?.ALL ?? `BRIGHT`;

        return {
            divider: this._combineFormats(formats.divider ?? `DIM`),
            timestamp: this._combineFormats(formats.timestamp ?? `WHITE`),
            levels: typeof formats.levels ===`string` ? Object.fromEntries([`DEBUG`, `INFO`, `WARN`, `ERROR`].map((l) => [l, this._combineFormats(formats.levels as LoggerFormat)])) as Record<LoggerLevel, string> : {
                DEBUG: this._combineFormats(([(formats.levels as Record<`DEBUG`, LoggerFormats> | undefined)?.DEBUG ?? `WHITE`, levelsAll].flat())),
                INFO: this._combineFormats(([(formats.levels as Record<`INFO`, LoggerFormats> | undefined)?.INFO ?? `CYAN`, levelsAll].flat())),
                WARN: this._combineFormats(([(formats.levels as Record<`WARN`, LoggerFormats> | undefined)?.WARN ?? `YELLOW`, levelsAll].flat())),
                ERROR: this._combineFormats(([(formats.levels as Record<`ERROR`, LoggerFormats> | undefined)?.ERROR ?? `RED`, levelsAll].flat()))
            },
            message: this._combineFormats(formats.message ?? `WHITE`),
            system: this._combineFormats(formats.system ?? [`BRIGHT`, `WHITE`])
        };
    }

    /**
     * Combines formats into a single string of physical console formats.
     * @param formats The formats to combine.
     */
    private _combineFormats (formats: LoggerFormats): string {
        return typeof formats === `string` ? NodeConstants.LOG_FORMATS[formats] : formats.reduce((p, c) => `${p}${NodeConstants.LOG_FORMATS[c]}`, ``);
    }

    /**
     * Creates a timestamp.
     * @param time The time for the timestamp.
     */
    private _timestamp (time: Date = new Date()): string {
        const millisecond: string = time.getUTCMilliseconds().toString().padStart(4, `0`);
        const second: string = time.getUTCSeconds().toString().padStart(2, `0`);
        const minute: string = time.getUTCMinutes().toString().padStart(2, `0`);
        const hour: string = time.getUTCHours().toString().padStart(2, `0`);
        const day: string = time.getUTCDate().toString().padStart(2, `0`);
        const month: string = (time.getUTCMonth() + 1).toString().padStart(2, `0`);
        const year: string = time.getUTCFullYear().toString();
        return `${month}-${day}-${year} ${hour}:${minute}:${second}.${millisecond}`;
    }
}
