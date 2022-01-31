"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
const RestBucket_1 = require("./RestBucket");
const RestRequests_1 = require("./RestRequests");
const DiscordConstants_1 = require("../constants/DiscordConstants");
const Logger_1 = require("../logger/Logger");
const SnowflakeUtils_1 = require("../utils/SnowflakeUtils");
const collection_1 = __importDefault(require("@discordjs/collection"));
/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
class Rest extends RestRequests_1.RestRequests {
    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param logger The {@link Logger logger} for the rest manager to use. If `false` is specified, no logger will be used.
     * @param options {@link RestOptions Rest options}.
     */
    constructor(token, logger, options) {
        super();
        /**
         * Rate limit {@link RestBucket buckets}.
         * Each bucket's key is it's {@link RestBucketIdLike ID}.
         */
        this.buckets = new collection_1.default();
        /**
         * The interval used for sweeping inactive {@link RestBucket buckets}.
         */
        this.bucketSweepInterval = null;
        /**
         * A unix millisecond timestamp at which the global ratelimit resets.
         */
        this.globalResetAt = -1;
        /**
         * A tally of the number of responses that returned a specific response code.
         * Note that response codes aren't included if they were never received.
         */
        this.responseCodeTally = {};
        /**
         * Cached route rate limit bucket hashes.
         * Keys are {@link RestRouteHashLike cached route hashes}, with their values being their corresponding {@link RestBucketHashLike bucket hash}.
         */
        this.routeHashCache = new collection_1.default();
        if (typeof token !== `string`)
            throw new TypeError(`A bot token must be specified`);
        if (!(logger instanceof Logger_1.Logger) && logger !== false)
            throw new TypeError(`A logger or false must be specified`);
        if (logger)
            this._logger = logger;
        this.options = options;
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        if (this.options.ratelimits.sweepInterval)
            this.bucketSweepInterval = setInterval(() => this.sweepBuckets(), this.options.ratelimits.sweepInterval);
        this.globalLeft = options.ratelimits.globalPerSecond;
        this._logger?.log(`Initialized rest manager`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
    }
    /**
     * Get the ratio of response codes.
     * Each code's value is the percentage it was received (`0` to `100`).
     * Note that response codes aren't included if they were never received.
     */
    get responseCodeRatio() {
        const total = Object.values(this.responseCodeTally).reduce((p, c) => p += c);
        const ratio = {};
        Object.keys(this.responseCodeTally).forEach((key) => ratio[key] = (this.responseCodeTally[key] / total) * 100);
        return ratio;
    }
    /**
     * Make a rest request.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns Response data.
     */
    async request(method, route, options = {}) {
        this._logger?.log(`Starting request ${method} ${route}`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
        const rawHash = route.replace(/\d{16,19}/g, `:id`).replace(/\/reactions\/(.*)/, `/reactions/:reaction`);
        const oldMessage = method === `DELETE` && rawHash === `/channels/:id/messages/:id` && (Date.now() - SnowflakeUtils_1.SnowflakeUtils.time(/\d{16,19}$/.exec(route)[0])) > DiscordConstants_1.DiscordConstants.OLD_MESSAGE_THRESHOLD ? `/old-message` : ``;
        const routeHash = `${method};${rawHash}${oldMessage}`;
        const bucketHash = this.routeHashCache.get(routeHash) ?? `global;${routeHash}`;
        const majorParameter = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(route)?.[1] ?? `global`;
        const bucketId = `${bucketHash}(${majorParameter})`;
        const bucket = this.buckets.get(bucketId) ?? this._createBucket(bucketId, bucketHash, majorParameter);
        return await bucket.request(method, route, routeHash, options);
    }
    /**
     * Cleans up inactive {@link RestBucket buckets} without active local rate limits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    sweepBuckets() {
        const sweeped = this.buckets.sweep((bucket) => !bucket.active && !bucket.ratelimited.local);
        this._logger?.log(`Sweeped ${sweeped} buckets`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
    }
    /**
     * Create a ratelimit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    _createBucket(bucketId, bucketHash, majorParameter) {
        const bucket = new RestBucket_1.RestBucket(this._token, this, bucketId, bucketHash, majorParameter, this._logger ?? false);
        this.buckets.set(bucketId, bucket);
        this._logger?.log(`Added bucket ${bucket.id} to rest manager bucket collection`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
        return bucket;
    }
}
exports.Rest = Rest;
