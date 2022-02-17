"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const ClientOptions_1 = require("./ClientOptions");
const Cache_1 = require("../cache/Cache");
const DistypeConstants_1 = require("../constants/DistypeConstants");
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
        /**
         * The version of [Distype](https://github.com/distype/distype) being used.
         */
        this.DISTYPE_VERSION = DistypeConstants_1.DistypeConstants.VERSION;
        if (typeof token !== `string`)
            throw new TypeError(`A bot token must be specified`);
        this.options = (0, ClientOptions_1.optionsFactory)(false, options);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this.logger = new Logger_1.Logger(this.options.logger);
        this.cache = new Cache_1.Cache(this.logger ?? false, this.options.cache);
        this.rest = new Rest_1.Rest(token, this.logger ?? false, this.options.rest);
        this.gateway = new Gateway_1.Gateway(token, this.cache, this.logger ?? false, this.rest, this.options.gateway);
        this.logger.log(`Initialized client`, {
            internal: true, level: `DEBUG`, system: `Client`
        });
    }
}
exports.Client = Client;
