"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestBucket = void 0;
const Rest_1 = require("./Rest");
const DiscordConstants_1 = require("../constants/DiscordConstants");
const node_utils_1 = require("@br88c/node-utils");
/**
 * A {@link Rest rest} bucket.
 * Used for ratelimiting requests.
 * @internal
 */
class RestBucket {
    /**
     * Create a rest bucket.
     * @param manager The {@link Rest rest manager} the bucket is bound to.
     * @param id The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the rest manager.
     */
    constructor(id, bucketHash, majorParameter, manager, logCallback = () => { }) {
        /**
         * The number of allowed requests per a ratelimit interval.
         */
        this.allowedRequestsPerRatelimit = Infinity;
        /**
         * The current number of requests left.
         */
        this.requestsLeft = 1;
        /**
         * A unix millisecond timestamp at which the ratelimit resets.
         */
        this.resetAt = -1;
        /**
         * The request queue.
         */
        this._queue = [];
        if (typeof id !== `string`)
            throw new TypeError(`A bucket ID must be specified`);
        if (typeof bucketHash !== `string`)
            throw new TypeError(`A bucket hash must be specified`);
        if (typeof majorParameter !== `string`)
            throw new TypeError(`A major parameter must be specified`);
        if (!(manager instanceof Rest_1.Rest))
            throw new TypeError(`A rest manager must be specified`);
        if (!manager.options.disableRatelimits)
            throw new Error(`The provided rest manager does not have ratelimits enabled`);
        this.id = id;
        this.bucketHash = bucketHash;
        this.majorParameter = majorParameter;
        this.manager = manager;
        this._log = logCallback;
        this._log(`Initialized rest bucket ${id} with hash ${bucketHash}`, {
            level: `DEBUG`, system: `Rest Bucket`
        });
    }
    /**
     * If the bucket is currently making a request.
     */
    get active() {
        return this._queue.length > 0;
    }
    /**
     * Get information on the bucket's current ratelimit restrictions.
     */
    get ratelimited() {
        return {
            local: this.requestsLeft <= 0 && Date.now() < this.resetAt,
            global: this.manager.globalLeft <= 0 && Date.now() < this.manager.globalResetAt
        };
    }
    /**
     * Make a rest request with this bucket's ratelimits.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHashLike route hash}.
     * @param options Request options.
     * @returns Response data.
     */
    async request(method, route, routeHash, options) {
        this._log(`${method} ${route} waiting for queue`, {
            level: `DEBUG`, system: `Rest Bucket`
        });
        await this._waitForQueue();
        return await this._make(method, route, routeHash, options).finally(() => this._shiftQueue());
    }
    /**
     * Waits for the bucket to no longer be ratelimited.
     */
    async _awaitRatelimit() {
        if (!Object.values(this.ratelimited).some((r) => r))
            return;
        const timeout = (this.ratelimited.global ? this.manager.globalResetAt ?? 0 : this.resetAt) + this.manager.options.ratelimitPause - Date.now();
        await (0, node_utils_1.wait)(timeout);
        return await this._awaitRatelimit();
    }
    /**
     * Lowest level request function that handles active ratelimits, ratelimit headers, and makes the request with `undici`.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHashLike route hash}.
     * @param options Request options.
     * @param attempt The current attempt value.
     * @returns Response data.
     */
    async _make(method, route, routeHash, options, attempt = 0) {
        this._log(`${method} ${route} waiting for ratelimit`, {
            level: `DEBUG`, system: `Rest Bucket`
        });
        await this._awaitRatelimit();
        if (!this.manager.globalResetAt || this.manager.globalResetAt < Date.now()) {
            this.manager.globalResetAt = Date.now() + 1000;
            this.manager.globalLeft = this.manager.options.ratelimitGlobal;
        }
        this.manager.globalLeft--;
        const res = await this.manager.make(method, route, options);
        const limit = Number(res.headers[DiscordConstants_1.DiscordConstants.REST_RATELIMIT_HEADERS.LIMIT] ?? Infinity);
        const remaining = Number(res.headers[DiscordConstants_1.DiscordConstants.REST_RATELIMIT_HEADERS.REMAINING] ?? 1);
        const resetAfter = Number(res.headers[DiscordConstants_1.DiscordConstants.REST_RATELIMIT_HEADERS.RESET_AFTER] ?? 0) * 1000;
        const bucket = res.headers[DiscordConstants_1.DiscordConstants.REST_RATELIMIT_HEADERS.BUCKET];
        const global = res.headers[DiscordConstants_1.DiscordConstants.REST_RATELIMIT_HEADERS.GLOBAL] === `true`;
        const globalRetryAfter = Number(res.headers[DiscordConstants_1.DiscordConstants.REST_RATELIMIT_HEADERS.GLOBAL_RETRY_AFTER] ?? 0) * 1000;
        if (globalRetryAfter > 0 && global) {
            this.manager.globalLeft = 0;
            this.manager.globalResetAt = globalRetryAfter + Date.now();
        }
        if (bucket && bucket !== this.bucketHash) {
            this.manager.routeHashCache.set(routeHash, bucket);
        }
        this.requestsLeft = remaining;
        this.resetAt = resetAfter + Date.now();
        this.allowedRequestsPerRatelimit = limit;
        if (res.statusCode === 429)
            return this._make(method, route, routeHash, options);
        else if (res.statusCode >= 500 && res.statusCode < 600) {
            if (attempt >= this.manager.options.code500retries)
                throw new Error(`${method} ${route} rejected after ${this.manager.options.code500retries + 1} attempts (Request returned status code 5xx errors)`);
            else
                return this._make(method, route, routeHash, options, attempt + 1);
        }
        else
            return res.body;
    }
    /**
     * Shifts the queue.
     */
    _shiftQueue() {
        const shift = this._queue.shift();
        if (shift)
            shift.resolve();
    }
    /**
     * Waits for the queue to be clear.
     */
    _waitForQueue() {
        const next = this._queue.length ? this._queue[this._queue.length - 1].promise : Promise.resolve();
        let resolve;
        const promise = new Promise((r) => {
            resolve = r;
        });
        this._queue.push({
            resolve: resolve,
            promise
        });
        return next;
    }
}
exports.RestBucket = RestBucket;
