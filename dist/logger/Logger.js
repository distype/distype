"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const NodeConstants_1 = require("../constants/NodeConstants");
const TypedEmitter_1 = require("../utils/TypedEmitter");
/**
 * The logger.
 * Used to simplify detailed logging.
 */
class Logger extends TypedEmitter_1.TypedEmitter {
    constructor(options) {
        super();
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options),
            writable: false
        });
    }
    /**
     * Log a message.
     * @param msg The message to be logged.
     * @param options The options for the message.
     */
    log(msg, options) {
        const completeOptions = {
            internal: false,
            level: `INFO`,
            system: `General`,
            ...this.options,
            ...options
        };
        if (completeOptions.internal && completeOptions.disableInternal)
            return;
        const reset = NodeConstants_1.NodeConstants.LOG_FORMATS[`RESET`];
        const formats = this._convertFormats(completeOptions.format);
        if ((completeOptions.enabledOutput.log ?? [`INFO`, `WARN`, `ERROR`]).includes(completeOptions.level))
            console.log([
                completeOptions.showTime ? `${formats.timestamp}${this._timestamp()}` : ``,
                `${formats.levels[completeOptions.level]}${completeOptions.level}`,
                `${formats.system}${completeOptions.system}`,
                `${formats.message}${msg}${reset}`
            ].join(` ${reset}${formats.divider}|${reset} `));
        if ((completeOptions.enabledOutput.events ?? [`DEBUG`, `INFO`, `WARN`, `ERROR`]).includes(completeOptions.level))
            this.emit(completeOptions.level, {
                msg, system: completeOptions.system
            });
    }
    /**
     * Converts formats from options into physical console formats.
     * @param formats The formats to convert.
     */
    _convertFormats(formats) {
        const levelsAll = formats.levels?.ALL ?? `BRIGHT`;
        return {
            divider: this._combineFormats(formats.divider ?? `DIM`),
            timestamp: this._combineFormats(formats.timestamp ?? `WHITE`),
            levels: typeof formats.levels === `string` ? Object.fromEntries([`DEBUG`, `INFO`, `WARN`, `ERROR`].map((l) => [l, this._combineFormats(formats.levels)])) : {
                DEBUG: this._combineFormats(([formats.levels?.DEBUG ?? `WHITE`, levelsAll].flat())),
                INFO: this._combineFormats(([formats.levels?.INFO ?? `CYAN`, levelsAll].flat())),
                WARN: this._combineFormats(([formats.levels?.WARN ?? `YELLOW`, levelsAll].flat())),
                ERROR: this._combineFormats(([formats.levels?.ERROR ?? `RED`, levelsAll].flat()))
            },
            message: this._combineFormats(formats.message ?? `WHITE`),
            system: this._combineFormats(formats.system ?? [`BRIGHT`, `WHITE`])
        };
    }
    /**
     * Combines formats into a single string of physical console formats.
     * @param formats The formats to combine.
     */
    _combineFormats(formats) {
        return typeof formats === `string` ? NodeConstants_1.NodeConstants.LOG_FORMATS[formats] : formats.reduce((p, c) => `${p}${NodeConstants_1.NodeConstants.LOG_FORMATS[c]}`, ``);
    }
    /**
     * Creates a timestamp.
     * @param time The time for the timestamp.
     */
    _timestamp(time = new Date()) {
        const millisecond = time.getUTCMilliseconds().toString().padStart(4, `0`);
        const second = time.getUTCSeconds().toString().padStart(2, `0`);
        const minute = time.getUTCMinutes().toString().padStart(2, `0`);
        const hour = time.getUTCHours().toString().padStart(2, `0`);
        const day = time.getUTCDate().toString().padStart(2, `0`);
        const month = (time.getUTCMonth() + 1).toString().padStart(2, `0`);
        const year = time.getUTCFullYear().toString();
        return `${month}-${day}-${year} ${hour}:${minute}:${second}.${millisecond}`;
    }
}
exports.Logger = Logger;
