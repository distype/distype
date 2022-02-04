"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestBucket = void 0;
const Rest_1 = require("./Rest");
const DiscordConstants_1 = require("../constants/DiscordConstants");
const DistypeConstants_1 = require("../constants/DistypeConstants");
const Logger_1 = require("../logger/Logger");
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
     * @param token The bot's token.
     * @param manager The {@link Rest rest manager} the bucket is bound to.
     * @param id The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     */
    constructor(token, manager, id, bucketHash, majorParameter, logger) {
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
        if (!(manager instanceof Rest_1.Rest))
            throw new TypeError(`A rest manager must be specified`);
        if (typeof id !== `string`)
            throw new TypeError(`A bucket ID must be specified`);
        if (typeof bucketHash !== `string`)
            throw new TypeError(`A bucket hash must be specified`);
        if (typeof majorParameter !== `string`)
            throw new TypeError(`A major parameter must be specified`);
        if (!(logger instanceof Logger_1.Logger) && logger !== false)
            throw new TypeError(`A logger or false must be specified`);
        this.manager = manager;
        this.id = id;
        this.bucketHash = bucketHash;
        this.majorParameter = majorParameter;
        if (logger)
            this._logger = logger;
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this._logger?.log(`Initialized rest bucket ${id} with hash ${bucketHash}`, {
            internal: true, level: `DEBUG`, system: `Rest`
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
        this._logger?.log(`Waiting for queue: request ${method} ${route}`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
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
        this._logger?.log(`Waiting for ratelimit: request ${method} ${route}`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
        await this._awaitRatelimit();
        this._logger?.log(`Making request ${method} ${route}`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
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
            'Authorization': `Bot ${this._token}`,
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
            body: r.statusCode !== 204 ? await r.body.json() : undefined,
            limit: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.LIMIT] ?? Infinity),
            remaining: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.REMAINING] ?? 1),
            reset: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.RESET] ?? Date.now()) * 1000,
            resetAfter: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.RESET_AFTER] ?? 0) * 1000,
            bucket: r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.BUCKET],
            global: r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.GLOBAL] === `true`,
            globalRetryAfter: Number(r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.GLOBAL_RETRY_AFTER] ?? 0) * 1000,
            scope: r.headers[DiscordConstants_1.DiscordConstants.RATE_LIMIT_HEADERS.SCOPE]
        }));
        this._logger?.log(`Made request ${method} ${route}`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
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
            this._logger?.log(`Success: request ${method} ${route}`, {
                internal: true, level: `DEBUG`, system: `Rest`
            });
            return res.body;
        }
        else if (res.statusCode === 429) {
            this._logger?.log(`429 Ratelimited: request ${method} ${route}`, {
                internal: true, level: `ERROR`, system: `Rest`
            });
            return this._make(method, route, routeHash, options);
        }
        else if (res.statusCode >= 400 && res.statusCode < 500) {
            this._logger?.log(`${res.statusCode} Error: rejected request ${method} ${route}`, {
                internal: true, level: `ERROR`, system: `Rest`
            });
            throw new Error(`${res.statusCode} Error: rejected request ${method} ${route} => ${JSON.stringify(res.body)}`);
        }
        else if (res.statusCode >= 500 && res.statusCode < 600) {
            if (attempt >= (options.code500retries ?? this.manager.options.code500retries)) {
                this._logger?.log(`${res.statusCode} Error: rejected request ${method} ${route} after ${this.manager.options.code500retries + 1} attempts`, {
                    internal: true, level: `ERROR`, system: `Rest`
                });
                throw new Error(`${res.statusCode} Error: rejected request ${method} ${route} after ${this.manager.options.code500retries + 1} attempts => Response body: ${JSON.stringify(res.body)}`);
            }
            else {
                this._logger?.log(`${res.statusCode} Error: request ${method} ${route} => retrying ${(options.code500retries ?? this.manager.options.code500retries) - attempt} more times...`, {
                    internal: true, level: `DEBUG`, system: `Rest`
                });
                return this._make(method, route, routeHash, options, attempt + 1);
            }
        }
        else {
            throw new Error(`Got unknown status code ${res.statusCode} => Response body: ${JSON.stringify(res.body)}`);
        }
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
