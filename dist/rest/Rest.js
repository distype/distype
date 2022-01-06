"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
const DiscordConstants_1 = require("../utils/DiscordConstants");
const RestBucket_1 = require("./RestBucket");
const RestRequests_1 = require("./RestRequests");
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
     * @param options {@link RestOptions Rest options}.
     */
    constructor(token, options) {
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
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options),
            writable: false
        });
        // @ts-expect-error Property 'options' is used before being assigned.
        if (this.options.ratelimits.sweepInterval)
            this.bucketSweepInterval = setInterval(() => this.sweepBuckets(), this.options.ratelimits.sweepInterval);
        this.globalLeft = options.ratelimits.globalPerSecond;
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
        this.buckets.sweep((bucket) => !bucket.active && !bucket.ratelimited.local);
    }
    /**
     * Create a ratelimit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    _createBucket(bucketId, bucketHash, majorParameter) {
        const bucket = new RestBucket_1.RestBucket(this, bucketId, bucketHash, majorParameter);
        this.buckets.set(bucketId, bucket);
        return bucket;
    }
}
exports.Rest = Rest;
