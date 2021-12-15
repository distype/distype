"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const completeCacheOptions_1 = require("./completeCacheOptions");
const collection_1 = __importDefault(require("@discordjs/collection"));
/**
 * The cache manager.
 * Contains cached data, and handles dispatched gateway events to keep the cache up to date.
 * Keep in mind that there are many caveats to the gateway, and that real-world cache data may not directly reflect your cache control options.
 * It is recommended that you research intents and the caveats to the gateway, to make sure your bot receives sufficient data for your use case.
 * [Discord API Reference](https://discord.com/developers/docs/topics/gateway)
 */
class Cache {
    /**
     * Create a cache manager.
     * @param options Cache options.
     */
    constructor(options = {}) {
        this.options = (0, completeCacheOptions_1.completeCacheOptions)(options);
        Object.keys(this.options.cacheControl).forEach((key) => {
            // @ts-expect-error ts(2540)
            if (this.options.cacheControl[key] instanceof Array)
                this[key] = new collection_1.default();
        });
    }
}
exports.Cache = Cache;
