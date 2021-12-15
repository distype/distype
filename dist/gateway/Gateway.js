"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const completeGatewayOptions_1 = require("./completeGatewayOptions");
const collection_1 = __importDefault(require("@discordjs/collection"));
const typed_emitter_1 = require("@jpbberry/typed-emitter");
/**
 * The gateway manager.
 * Manages shards, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the `*` event prior to being passed through the cache manager.
 * After being handled by the cache manager, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
class Gateway extends typed_emitter_1.EventEmitter {
    /**
     * Create a gateway manager.
     * @param token The bot's token.
     * @param cache The cache manager to update from incoming events.
     * @param rest The rest manager to use for fetching gateway endpoints.
     * @param options Gateway options.
     */
    constructor(token, cache, rest, options = {}) {
        super();
        /**
         * Gateway shards.
         */
        this.shards = new collection_1.default();
        if (!token)
            throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this._cache = cache;
        this._rest = rest;
        this.options = (0, completeGatewayOptions_1.completeGatewayOptions)(options);
        this.on(`*`, (data) => this._cache.options.cacheEventHandler(this._cache, data));
    }
    /**
     * Connect to the gateway.
     */
    async connect() {
        this._rest.getGateway();
    }
}
exports.Gateway = Gateway;
