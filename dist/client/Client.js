"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const Cache_1 = require("../cache/Cache");
const DistypeConstants_1 = require("../constants/DistypeConstants");
const Gateway_1 = require("../gateway/Gateway");
const Rest_1 = require("../rest/Rest");
/**
 * The Discord client.
 */
class Client {
    /**
     * Create a client.
     * @param token The bot's token.
     * @param options {@link ClientOptions Client options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally throughout the client.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token, options = {}, logCallback = () => { }, logThisArg) {
        /**
         * The version of [Distype](https://github.com/distype/distype) being used.
         */
        this.DISTYPE_VERSION = DistypeConstants_1.DistypeConstants.VERSION;
        if (typeof token !== `string`)
            throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this.cache = new Cache_1.Cache(options.cache, logCallback, logThisArg);
        this.rest = new Rest_1.Rest(token, options.rest, logCallback, logThisArg);
        this.gateway = new Gateway_1.Gateway(token, this.rest, this.cache, options.gateway, logCallback, logThisArg);
        this.options = {
            cache: this.cache.options,
            gateway: this.gateway.options,
            rest: this.rest.options
        };
        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized client`, {
            level: `DEBUG`, system: `Client`
        });
    }
}
exports.Client = Client;
