"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const completeGatewayOptions_1 = require("./completeGatewayOptions");
const GatewayShard_1 = require("./GatewayShard");
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
        Object.defineProperty(this, `_token`, {
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
     * @returns The results from shard spawns.
     */
    async connect() {
        this.emit(`DEBUG`, `Starting connection process`);
        const gatewayBot = await this._rest.getGatewayBot();
        this.emit(`DEBUG`, `Got bot gateway information`);
        this.options.sharding.totalBotShards = this.options.sharding.totalBotShards === `auto` ? gatewayBot.shards : (this.options.sharding.totalBotShards ?? gatewayBot.shards);
        this.options.sharding.shards = this.options.sharding.shards ?? this.options.sharding.totalBotShards;
        this.options.sharding.offset = this.options.sharding.offset ?? 0;
        if (this.options.sharding.shards > gatewayBot.session_start_limit.remaining) {
            const error = new Error(`Session start limit reached; tried to spawn ${this.options.sharding.shards} shards when only ${gatewayBot.session_start_limit.remaining} more shards are allowed. Limit will reset in ${gatewayBot.session_start_limit.reset_after / 1000} seconds`);
            this.emit(`DEBUG`, `Unable to connect shards: ${error.name} | ${error.message}`);
            throw error;
        }
        const buckets = new collection_1.default();
        for (let i = 0; i < this.options.sharding.shards; i++) {
            this.emit(`DEBUG`, `Creating shard ${i}`);
            const shard = new GatewayShard_1.GatewayShard(this._token, i, {
                intents: this.options.intents,
                largeGuildThreshold: this.options.largeGuildThreshold,
                numShards: this.options.sharding.totalBotShards,
                presence: this.options.presence,
                spawnAttemptDelay: this.options.spawnAttemptDelay,
                spawnMaxAttempts: this.options.spawnMaxAttempts,
                spawnTimeout: this.options.spawnTimeout,
                url: gatewayBot.url,
                wsOptions: this.options.wsOptions
            });
            this.shards.set(i, shard);
            this.emit(`DEBUG`, `Shard ${shard.id} created and pushed to Gateway#shards`);
            shard.on(`*`, (data) => this.emit(`*`, data));
            shard.on(`DEBUG`, (msg) => this.emit(`DEBUG`, `GatewayShard ${shard.id} | ${msg}`));
            this.emit(`DEBUG`, `Bound shard ${shard.id} events`);
            const bucketId = shard.id % gatewayBot.session_start_limit.max_concurrency;
            if (buckets.has(bucketId))
                buckets.get(bucketId)?.set(shard.id, shard);
            else
                buckets.set(bucketId, new collection_1.default()).get(bucketId).set(shard.id, shard);
            this.emit(`DEBUG`, `Pushed shard ${shard.id} to bucket ${bucketId}`);
        }
        const results = [];
        for (let i = 0; i < buckets.size; i++) {
            this.emit(`DEBUG`, `Starting spawn process for bucket ${i}`);
            const bucketResult = await Promise.allSettled(buckets.get(i).map((shard) => shard.spawn()));
            results.push(...bucketResult);
            this.emit(`DEBUG`, `Finished spawn process for bucket ${i}`);
            if (i !== buckets.size - 1)
                await new Promise((resolve) => setTimeout(() => resolve(void 0), 5000));
        }
        this.emit(`DEBUG`, `Finished connection process`);
        return results;
    }
}
exports.Gateway = Gateway;
