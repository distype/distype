"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const ClientOptions_1 = require("./ClientOptions");
const Cache_1 = require("../cache/Cache");
const Gateway_1 = require("../gateway/Gateway");
const Logger_1 = require("../logger/Logger");
const Rest_1 = require("../rest/Rest");
/**
 * The Discord client.
 */
class Client {
    /**
     * Create a client.
     * @param token The bot's token.
     * @param options {@link ClientOptions Client options}.
     */
    constructor(token, options = {}) {
        if (typeof token !== `string`)
            throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze((0, ClientOptions_1.optionsFactory)(options)),
            writable: false
        });
        // @ts-expect-error Property 'options' is used before being assigned.
        if (options.logger !== false)
            this.logger = new Logger_1.Logger(this.options.logger);
        // @ts-expect-error Property 'options' is used before being assigned.
        this.cache = new Cache_1.Cache(this.logger ?? false, this.options.cache);
        // @ts-expect-error Property 'options' is used before being assigned.
        this.rest = new Rest_1.Rest(token, this.logger ?? false, this.options.rest);
        // @ts-expect-error Property 'options' is used before being assigned.
        this.gateway = new Gateway_1.Gateway(token, this.cache, this.logger ?? false, this.rest, this.options.gateway);
        this.logger?.log(`Initialized client`, {
            level: `DEBUG`, system: `Client`
        });
    }
}
exports.Client = Client;
