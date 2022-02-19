"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
const RestBucket_1 = require("./RestBucket");
const RestRequests_1 = require("./RestRequests");
const DiscordConstants_1 = require("../constants/DiscordConstants");
const DistypeConstants_1 = require("../constants/DistypeConstants");
const Logger_1 = require("../logger/Logger");
const SnowflakeUtils_1 = require("../utils/SnowflakeUtils");
const UtilityFunctions_1 = require("../utils/UtilityFunctions");
const collection_1 = __importDefault(require("@discordjs/collection"));
const form_data_1 = __importDefault(require("form-data"));
const undici_1 = require("undici");
const url_1 = require("url");
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
         * Ratelimit {@link RestBucket buckets}.
         * Each bucket's key is it's {@link RestBucketIdLike ID}.
         */
        this.buckets = null;
        /**
         * The interval used for sweeping inactive {@link RestBucket buckets}.
         */
        this.bucketSweepInterval = null;
        /**
         * The amount of requests left in the global ratelimit bucket.
         */
        this.globalLeft = null;
        /**
         * A unix millisecond timestamp at which the global ratelimit resets.
         */
        this.globalResetAt = null;
        /**
         * A tally of the number of responses that returned a specific response code.
         * Note that response codes aren't included if they were never received.
         */
        this.responseCodeTally = {};
        /**
         * Cached route ratelimit bucket hashes.
         * Keys are {@link RestRouteHashLike cached route hashes}, with their values being their corresponding {@link RestBucketHashLike bucket hash}.
         */
        this.routeHashCache = null;
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
        if (this.options.ratelimits) {
            this.buckets = new collection_1.default();
            this.globalLeft = this.options.ratelimits.globalPerSecond;
            this.globalResetAt = -1;
            this.routeHashCache = new collection_1.default();
            if (this.options.ratelimits.sweepInterval)
                this.bucketSweepInterval = setInterval(() => this.sweepBuckets(), this.options.ratelimits.sweepInterval);
        }
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
        const total = Object.values(this.responseCodeTally).reduce((p, c) => p + c);
        const ratio = {};
        Object.keys(this.responseCodeTally).forEach((key) => {
            ratio[key] = (this.responseCodeTally[key] / total) * 100;
        });
        return ratio;
    }
    /**
     * Make a rest request.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns Response body.
     */
    async request(method, route, options = {}) {
        this._logger?.log(`${method} ${route} started`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
        if (this.options.ratelimits) {
            const rawHash = route.replace(/\d{16,19}/g, `:id`).replace(/\/reactions\/(.*)/, `/reactions/:reaction`);
            const oldMessage = method === `DELETE` && rawHash === `/channels/:id/messages/:id` && (Date.now() - SnowflakeUtils_1.SnowflakeUtils.time(/\d{16,19}$/.exec(route)[0])) > DiscordConstants_1.DiscordConstants.REST_OLD_MESSAGE_THRESHOLD ? `/old-message` : ``;
            const routeHash = `${method};${rawHash}${oldMessage}`;
            const bucketHash = this.routeHashCache.get(routeHash) ?? `global;${routeHash}`;
            const majorParameter = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(route)?.[1] ?? `global`;
            const bucketId = `${bucketHash}(${majorParameter})`;
            const bucket = this.buckets.get(bucketId) ?? this._createBucket(bucketId, bucketHash, majorParameter);
            return await bucket.request(method, route, routeHash, options);
        }
        else
            return (await this.make(method, route, options)).body;
    }
    /**
     * The internal rest make method.
     * Used by {@link RestBucket rest buckets}, and the `Rest#request()` method if ratelimits are turned off.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns The full undici response.
     * @internal
     */
    async make(method, route, options) {
        this._logger?.log(`${method} ${route} being made`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
        const usingFormData = options.body instanceof form_data_1.default;
        const headers = {
            ...this.options.headers,
            ...options.headers,
            ...(usingFormData ? options.body.getHeaders() : undefined),
            'Authorization': `Bot ${this._token}`,
            'User-Agent': `DiscordBot (${DistypeConstants_1.DistypeConstants.URL}, v${DistypeConstants_1.DistypeConstants.VERSION})`
        };
        if (!usingFormData && options.body)
            headers[`Content-Type`] = `application/json`;
        if (options.reason)
            headers[`X-Audit-Log-Reason`] = options.reason;
        const url = new url_1.URL(`${(options.customBaseURL ?? this.options.customBaseURL) ?? `${DiscordConstants_1.DiscordConstants.BASE_URL}/v${options.version ?? this.options.version}`}${route}`);
        url.search = new url_1.URLSearchParams(options.query).toString();
        const req = (0, undici_1.request)(url, {
            ...this.options,
            ...options,
            method,
            headers,
            body: usingFormData ? undefined : JSON.stringify(options.body),
            bodyTimeout: options.timeout ?? this.options.timeout
        });
        if (usingFormData)
            options.body.pipe(req);
        const res = await req.then(async (r) => ({
            ...r,
            body: r.statusCode !== 204 ? await r.body.json().catch(() => this._logger?.log(`${method} ${route} unable to parse response body, returning undefined`, {
                internal: true, level: `WARN`, system: `Rest`
            })) : undefined
        }));
        this.responseCodeTally[res.statusCode] = (this.responseCodeTally[res.statusCode] ?? 0) + 1;
        this._handleResponseCodes(method, route, res);
        return res;
    }
    /**
     * Cleans up inactive {@link RestBucket buckets} without active local ratelimits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    sweepBuckets() {
        if (this.buckets) {
            const sweeped = this.buckets.sweep((bucket) => !bucket.active && !bucket.ratelimited.local);
            this._logger?.log(`Sweeped ${sweeped} buckets`, {
                internal: true, level: `DEBUG`, system: `Rest`
            });
        }
    }
    /**
     * Create a ratelimit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    _createBucket(bucketId, bucketHash, majorParameter) {
        if (!this.buckets)
            throw new Error(`Buckets are not defined on this rest manager. Maybe ratelimits are disabled?`);
        const bucket = new RestBucket_1.RestBucket(this._token, this, bucketId, bucketHash, majorParameter, this._logger ?? false);
        this.buckets.set(bucketId, bucket);
        this._logger?.log(`Added bucket ${bucket.id} to rest manager bucket collection`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
        return bucket;
    }
    /**
     * Handles response codes.
     */
    _handleResponseCodes(method, route, res) {
        let message = `Status code ${res.statusCode} (UNKNOWN STATUS CODE)`;
        let level = `WARN`;
        let shouldThrow = false;
        switch (res.statusCode) {
            case 200: {
                message = `Status code 200 (OK)`;
                level = `DEBUG`;
                break;
            }
            case 201: {
                message = `Status code 201 (CREATED)`;
                level = `DEBUG`;
                break;
            }
            case 204: {
                message = `Status code 204 (NO CONTENT)`;
                level = `DEBUG`;
                break;
            }
            case 304: {
                message = `Status code 304 (NOT MODIFIED)`;
                break;
            }
            case 400: {
                message = `Status code 400 (BAD REQUEST)`;
                level = `ERROR`;
                shouldThrow = true;
                break;
            }
            case 401: {
                message = `Status code 401 (UNAUTHORIZED)`;
                level = `ERROR`;
                shouldThrow = true;
                break;
            }
            case 403: {
                message = `Status code 403 (FORBIDDEN)`;
                level = `ERROR`;
                shouldThrow = true;
                break;
            }
            case 404: {
                message = `Status code 404 (NOT FOUND)`;
                level = `ERROR`;
                shouldThrow = true;
                break;
            }
            case 405: {
                message = `Status code 405 (METHOD NOT ALLOWED)`;
                level = `ERROR`;
                shouldThrow = true;
                break;
            }
            case 429: {
                message = `Status code 429 (TOO MANY REQUESTS)`;
                level = this.options.ratelimits ? `DEBUG` : `ERROR`;
                shouldThrow = !this.options.ratelimits;
                break;
            }
            case 502: {
                message = `Status code 502 (GATEWAY UNAVAILABLE)`;
                level = this.options.ratelimits ? `DEBUG` : `ERROR`;
                shouldThrow = !this.options.ratelimits;
                break;
            }
            default: {
                if (res.statusCode >= 500 && res.statusCode < 600) {
                    message = `Status code ${res.statusCode} (SERVER ERROR)`;
                    level = this.options.ratelimits ? `DEBUG` : `ERROR`;
                    shouldThrow = !this.options.ratelimits;
                }
                break;
            }
        }
        const errors = this._parseErrors(res.body);
        this._logger?.log(`${method} ${route} returned ${message}${errors ? ` ${errors}` : ``}`, {
            internal: true, level, system: `Rest`
        });
        if (shouldThrow)
            throw new Error(`${message}${errors ? ` ${errors}` : ``} on ${method} ${route}`);
    }
    /**
     * Parses errors from a response.
     * @param body The body in the response.
     * @returns A parsed error string, or `null` if no errors were found.
     */
    _parseErrors(body) {
        const errors = [];
        if (body.message)
            errors.push(body.message);
        if (body.errors) {
            const flattened = UtilityFunctions_1.UtilityFunctions.flattenObject(body.errors, DiscordConstants_1.DiscordConstants.REST_ERROR_KEY);
            errors.concat(Object.keys(flattened)
                .filter((key) => key.endsWith(`.${DiscordConstants_1.DiscordConstants.REST_ERROR_KEY}`) || key === DiscordConstants_1.DiscordConstants.REST_ERROR_KEY)
                .map((key) => flattened[key].map((error) => `${key !== DiscordConstants_1.DiscordConstants.REST_ERROR_KEY ? `[${key.slice(0, -(`.${DiscordConstants_1.DiscordConstants.REST_ERROR_KEY}`.length))}] ` : ``}(${error.code ?? `UNKNOWN`}) ${error.message ?? `Unknown Message`}`
                .trimEnd()
                .replace(/\.$/, ``)))
                .flat());
        }
        return errors.length ? errors.join(`, `) : null;
    }
}
exports.Rest = Rest;
