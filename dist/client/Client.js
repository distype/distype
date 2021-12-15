"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const Cache_1 = require("../cache/Cache");
const Gateway_1 = require("../gateway/Gateway");
const Rest_1 = require("../rest/Rest");
/**
 * The Discord client.
 */
class Client {
    /**
     * Create a client.
     * @param token The bot's token.
     * @param options Client options.
     */
    constructor(token, options = {}) {
        if (!token)
            throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this.cache = new Cache_1.Cache(options.cache);
        this.rest = new Rest_1.Rest(token, options.rest);
        this.gateway = new Gateway_1.Gateway(token, this.cache, this.rest, options.gateway);
    }
}
exports.Client = Client;
