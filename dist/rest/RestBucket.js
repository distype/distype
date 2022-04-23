"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestBucket = void 0;
const Rest_1 = require("./Rest");
const DiscordConstants_1 = require("../constants/DiscordConstants");
const node_utils_1 = require("@br88c/node-utils");
const DistypeError_1 = require("../errors/DistypeError");
/**
 * A {@link Rest rest} bucket.
 * Used for rate limiting requests.
 * @internal
 */
class RestBucket {
    /**
     * The number of allowed requests per a rate limit interval.
     */
    allowedRequestsPerRatelimit = Infinity;
    /**
     * The {@link Rest rest manager} the bucket is bound to.
     */
    manager;
    /**
     * The current number of requests left.
     */
    requestsLeft = 1;
    /**
     * A unix millisecond timestamp at which the rate limit resets.
     */
    resetAt = -1;
    /**
     * The bucket's unique {@link RestBucketHash hash}.
     */
    bucketHash;
    /**
     * The bucket's {@link RestBucketId ID}.
     */
    id;
    /**
     * The {@link RestMajorParameter major parameter} associated with the bucket.
     */
    majorParameter;
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    system = `Rest Bucket`;
    /**
     * The {@link LogCallback log callback} used by the rest bucket.
     */
    _log;
    /**
     * The request queue.
     */
    _queue = [];
    /**
     * Create a rest bucket.
     * @param id The bucket's {@link RestBucketId ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHash hash}.
     * @param majorParameter The {@link RestMajorParameter major parameter} associated with the bucket.
     * @param manager The {@link Rest rest manager} the bucket is bound to.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the rest manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(id, bucketHash, majorParameter, manager, logCallback = () => { }, logThisArg) {
        if (typeof id !== `string`)
            throw new TypeError(`Parameter "id" (string) not provided: got ${id} (${typeof id})`);
        if (typeof bucketHash !== `string`)
            throw new TypeError(`Parameter "bucketHash" (string) not provided: got ${bucketHash} (${typeof bucketHash})`);
        if (typeof majorParameter !== `string`)
            throw new TypeError(`Parameter "majorParameter" (string) not provided: got ${majorParameter} (${typeof majorParameter})`);
        if (!(manager instanceof Rest_1.Rest))
            throw new TypeError(`Parameter "manager" (Rest) not provided: got ${manager} (${typeof manager})`);
        if (typeof logCallback !== `function`)
            throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);
        this.id = id;
        this.bucketHash = bucketHash;
        this.majorParameter = majorParameter;
        this.manager = manager;
        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized rest bucket ${id} with hash ${bucketHash}`, {
            level: `DEBUG`, system: this.system
        });
    }
    /**
     * If the bucket is currently making a request.
     */
    get active() {
        return this._queue.length > 0;
    }
    /**
     * Get information on the bucket's current rate limit restrictions.
     */
    get ratelimited() {
        const ratelimits = {
            local: this.requestsLeft <= 0 && Date.now() < this.resetAt,
            global: this.manager.globalLeft <= 0 && Date.now() < this.manager.globalResetAt
        };
        return {
            ...ratelimits,
            any: Object.values(ratelimits).some((r) => r)
        };
    }
    /**
     * Make a rest request with this bucket's rate limits.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHash route hash}.
     * @param options Request options.
     * @returns Response data.
     */
    async request(method, route, routeHash, options) {
        if (this._queue.length)
            await this._waitForQueue();
        return await this._make(method, route, routeHash, options).finally(() => this._shiftQueue());
    }
    /**
     * Waits for the bucket to no longer be rate limited.
     */
    async _awaitRatelimit() {
        if (!this.ratelimited.any)
            return;
        const timeout = (this.ratelimited.global ? this.manager.globalResetAt ?? 0 : this.resetAt) + this.manager.options.ratelimitPause - Date.now();
        await (0, node_utils_1.wait)(timeout);
        return await this._awaitRatelimit();
    }
    /**
     * Lowest level request function that handles active rate limits, rate limit headers, and makes the request with `undici`.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHash route hash}.
     * @param options Request options.
     * @param attempt The current attempt value.
     * @returns Response data.
     */
    async _make(method, route, routeHash, options, attempt = 0) {
        if (this.ratelimited.any)
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
                throw new DistypeError_1.DistypeError(`${method} ${route} rejected after ${this.manager.options.code500retries + 1} attempts (Request returned status code 5xx errors)`, DistypeError_1.DistypeErrorType.REST_REQUEST_ERROR, this.system);
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
