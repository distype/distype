"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestBucket = void 0;
const DiscordConstants_1 = require("../constants/DiscordConstants");
const DistypeConstants_1 = require("../constants/DistypeConstants");
const form_data_1 = __importDefault(require("form-data"));
const undici_1 = require("undici");
const url_1 = require("url");
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
     */
    constructor(manager, id, bucketHash, majorParameter) {
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
        this.queue = [];
        this.manager = manager;
        Object.defineProperty(this, `bucketHash`, {
            configurable: false,
            enumerable: true,
            value: bucketHash,
            writable: false
        });
        Object.defineProperty(this, `id`, {
            configurable: false,
            enumerable: true,
            value: id,
            writable: false
        });
        Object.defineProperty(this, `majorParameter`, {
            configurable: false,
            enumerable: true,
            value: majorParameter,
            writable: false
        });
    }
    /**
     * If the bucket is currently making a request.
     */
    get active() {
        return this.queue.length > 0;
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
        await this._waitForQueue();
        return await this._make(method, route, routeHash, options).finally(() => this._shiftQueue());
    }
    /**
     * Waits for the bucket to no longer be rate limited.
     */
    async _awaitRatelimit() {
        if (!Object.values(this.ratelimited).some((r) => r))
            return;
        const timeout = (this.ratelimited.global ? this.manager.globalResetAt : this.resetAt) + this.manager.options.ratelimits.pause - Date.now();
        await new Promise((resolve) => setTimeout(resolve, timeout));
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
        await this._awaitRatelimit();
        if (!this.manager.globalResetAt || this.manager.globalResetAt < Date.now()) {
            this.manager.globalResetAt = Date.now() + 1000;
            this.manager.globalLeft = this.manager.options.ratelimits.globalPerSecond;
        }
        this.manager.globalLeft--;
        const usingFormData = options.body instanceof form_data_1.default;
        const headers = {
            ...this.manager.options.headers,
            ...options.headers,
            ...(usingFormData ? options.body.getHeaders() : undefined),
            // @ts-expect-error Property '_token' is private and only accessible within class 'Rest'.
            'Authorization': `Bot ${this.manager._token}`,
            'User-Agent': `DiscordBot (${DistypeConstants_1.DistypeConstants.URL}, v${DistypeConstants_1.DistypeConstants.VERSION})`
        };
        if (!usingFormData && options.body)
            headers[`Content-Type`] = `application/json`;
        if (options.reason)
            headers[`X-Audit-Log-Reason`] = options.reason;
        const url = new url_1.URL(`${DiscordConstants_1.DiscordConstants.BASE_URL}/v${options.version ?? this.manager.options.version}${route}`);
        url.search = new url_1.URLSearchParams(options.query).toString();
        const req = (0, undici_1.request)(url, {
            ...this.manager.options,
            ...options,
            method,
            headers,
            body: usingFormData ? undefined : JSON.stringify(options.body),
            bodyTimeout: options.timeout ?? this.manager.options.timeout
        });
        if (usingFormData)
            options.body.pipe(req);
        const res = await req.then(async (r) => ({
            ...r,
            body: await r.body.json(),
            limit: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.LIMIT] ?? Infinity),
            remaining: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.REMAINING] ?? 1),
            reset: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.RESET] ?? Date.now()) * 1000,
            resetAfter: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.RESET_AFTER] ?? 0) * 1000,
            bucket: r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.BUCKET],
            global: r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.GLOBAL] === `true`,
            globalRetryAfter: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.GLOBAL_RETRY_AFTER] ?? 0) * 1000,
            scope: r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.SCOPE]
        }));
        if (res.globalRetryAfter > 0 && res.global) {
            this.manager.globalLeft = 0;
            this.manager.globalResetAt = res.globalRetryAfter + Date.now();
        }
        if (res.bucket && res.bucket !== this.bucketHash) {
            this.manager.routeHashCache.set(routeHash, res.bucket);
        }
        this.requestsLeft = res.remaining;
        this.resetAt = res.resetAfter + Date.now();
        this.allowedRequestsPerRatelimit = res.limit;
        this.manager.responseCodeTally[res.statusCode] = (this.manager.responseCodeTally[res.statusCode] ?? 0) + 1;
        if (res.statusCode >= 200 && res.statusCode < 300) {
            return res.body;
        }
        else if (res.statusCode === 429) {
            return this._make(method, route, routeHash, options);
        }
        else if (res.statusCode >= 400 && res.statusCode < 500) {
            throw new Error(res.body);
        }
        else if (res.statusCode >= 500 && res.statusCode < 600) {
            if (attempt === (options.code500retries ?? this.manager.options.code500retries) - 1)
                throw new Error(res.body);
            else
                return this._make(method, route, routeHash, options, attempt + 1);
        }
    }
    /**
     * Shifts the queue.
     */
    _shiftQueue() {
        const shift = this.queue.shift();
        if (shift)
            shift.resolve();
    }
    /**
     * Waits for the queue to be clear.
     */
    _waitForQueue() {
        const next = this.queue.length ? this.queue[this.queue.length - 1].promise : Promise.resolve();
        let resolve;
        const promise = new Promise((r) => {
            resolve = r;
        });
        this.queue.push({
            resolve: resolve,
            promise
        });
        return next;
    }
}
exports.RestBucket = RestBucket;
