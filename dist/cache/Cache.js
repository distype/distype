"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const Logger_1 = require("../logger/Logger");
const collection_1 = __importDefault(require("@discordjs/collection"));
/**
 * The cache manager.
 * Contains cached data, and {@link cacheEventHandler handles dispatched gateway events} to keep the cache up to date.
 * Keep in mind that there are many caveats to the gateway, and that real-world cache data may not directly reflect your {@link CacheOptions cache control options}.
 * It is recommended that you research [intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) and the [caveats](https://discord.com/developers/docs/topics/gateway#caveats) to the gateway, to make sure your bot receives sufficient data for your use case.
 * [Discord API Reference](https://discord.com/developers/docs/topics/gateway)
 */
class Cache {
    /**
     * Create a cache manager.
     * @param logger The {@link Logger logger} for the cache manager to use. If `false` is specified, no logger will be used.
     * @param options {@link CacheOptions Cache options}.
     */
    constructor(logger, options) {
        if (!(logger instanceof Logger_1.Logger) && logger !== false)
            throw new TypeError(`A logger or false must be specified`);
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options),
            writable: false
        });
        // @ts-expect-error Property 'options' is used before being assigned.
        Object.keys(this.options.cacheControl).forEach((key) => {
            if (this.options.cacheControl[key] instanceof Array)
                this[key] = new collection_1.default();
        });
        if (logger)
            this._logger = logger;
        this._logger?.log(`Initialized cache manager`, {
            level: `DEBUG`, system: `Cache`
        });
    }
}
exports.Cache = Cache;
