"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
const RestBucket_1 = require("./RestBucket");
const RestRequests_1 = require("./RestRequests");
const DiscordConstants_1 = require("../constants/DiscordConstants");
const DistypeConstants_1 = require("../constants/DistypeConstants");
const DistypeError_1 = require("../errors/DistypeError");
const SnowflakeUtils_1 = require("../utils/SnowflakeUtils");
const node_utils_1 = require("@br88c/node-utils");
const stream_1 = require("stream");
const undici_1 = require("undici");
const url_1 = require("url");
const types_1 = require("util/types");
/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
class Rest extends RestRequests_1.RestRequests {
    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options {@link RestOptions Rest options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the rest manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token, options = {}, logCallback = () => { }, logThisArg) {
        super();
        /**
         * Ratelimit {@link RestBucket buckets}.
         * Each bucket's key is it's {@link RestBucketId ID}.
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
         * Keys are {@link RestRouteHash cached route hashes}, with their values being their corresponding {@link RestBucketHash bucket hash}.
         */
        this.routeHashCache = null;
        /**
         * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
         */
        this.system = `Rest`;
        if (typeof token !== `string`)
            throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this.options = {
            ...options,
            bucketSweepInterval: options.bucketSweepInterval ?? 300000,
            code500retries: options.code500retries ?? 3,
            disableRatelimits: options.disableRatelimits ?? false,
            ratelimitGlobal: options.ratelimitGlobal ?? 50,
            ratelimitPause: options.ratelimitPause ?? 10,
            version: options.version ?? 10
        };
        if (!this.options.disableRatelimits) {
            this.buckets = new node_utils_1.ExtendedMap();
            this.globalLeft = this.options.ratelimitGlobal;
            this.globalResetAt = -1;
            this.routeHashCache = new node_utils_1.ExtendedMap();
            if (this.options.bucketSweepInterval)
                this.bucketSweepInterval = setInterval(() => this.sweepBuckets(), this.options.bucketSweepInterval).unref();
        }
        this._log = logCallback.bind(logThisArg);
        this._logThisArg = logThisArg;
        this._log(`Initialized rest manager`, {
            level: `DEBUG`, system: this.system
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
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns Response body.
     */
    async request(method, route, options = {}) {
        this._log(`${method} ${route} started`, {
            level: `DEBUG`, system: this.system
        });
        if (!this.options.disableRatelimits) {
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
     * **Only use this method if you know exactly what you are doing.**
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns The full undici response.
     * @internal
     */
    async make(method, route, options) {
        this._log(`${method} ${route} being made`, {
            level: `DEBUG`, system: this.system
        });
        const headers = {
            'Authorization': `Bot ${this._token}`,
            'Content-Type': `application/json`,
            'User-Agent': `DiscordBot (${DistypeConstants_1.DistypeConstants.URL}, v${DistypeConstants_1.DistypeConstants.VERSION})`,
            ...this._convertUndiciHeaders(this.options.headers),
            ...this._convertUndiciHeaders(options.headers)
        };
        if (options.reason)
            headers[`X-Audit-Log-Reason`] = options.reason;
        const url = new url_1.URL(`${(options.customBaseURL ?? this.options.customBaseURL) ?? `${DiscordConstants_1.DiscordConstants.BASE_URL}/v${this.options.version}`}${route}`);
        url.search = new url_1.URLSearchParams(options.query).toString();
        const req = (0, undici_1.request)(url, {
            ...this.options,
            ...options,
            method,
            headers,
            body: options.body instanceof stream_1.Readable || (0, types_1.isUint8Array)(options.body) || Buffer.isBuffer(options.body) ? options.body : JSON.stringify(options.body),
            bodyTimeout: options.timeout ?? this.options.timeout
        });
        let unableToParse = false;
        const res = await req.then(async (r) => ({
            ...r,
            body: r.statusCode !== 204 ? await r.body?.json().catch((error) => {
                unableToParse = (error?.message ?? error) ?? `Unknown reason`;
            }) : undefined
        }));
        if (typeof unableToParse === `string`)
            throw new DistypeError_1.DistypeError(`Unable to parse response body: "${unableToParse}"`, DistypeError_1.DistypeErrorType.REST_UNABLE_TO_PARSE_RESPONSE_BODY, this.system);
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
            this._log(`Sweeped ${sweeped.size} buckets`, {
                level: `DEBUG`, system: this.system
            });
        }
    }
    /**
     * Converts specified headers with undici typings to a `Record<string, string>`.
     * @param headers The headers to convert.
     * @returns The formatted headers.
     */
    _convertUndiciHeaders(headers) {
        return Array.isArray(headers) ? Object.fromEntries(headers.map((header) => header.split(`:`).map((v) => v.trim()))) : { ...headers };
    }
    /**
     * Create a ratelimit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketId ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHash hash}.
     * @param majorParameter The {@link RestMajorParameter major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    _createBucket(bucketId, bucketHash, majorParameter) {
        if (!this.buckets || this.options.disableRatelimits)
            throw new DistypeError_1.DistypeError(`Cannot create a bucket while ratelimits are disabled`, DistypeError_1.DistypeErrorType.REST_CREATE_BUCKET_WITH_DISABLED_RATELIMITS, this.system);
        const bucket = new RestBucket_1.RestBucket(bucketId, bucketHash, majorParameter, this, this._log, this._logThisArg);
        this.buckets.set(bucketId, bucket);
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
                level = this.options.disableRatelimits ? `ERROR` : `DEBUG`;
                shouldThrow = this.options.disableRatelimits;
                break;
            }
            case 502: {
                message = `Status code 502 (GATEWAY UNAVAILABLE)`;
                level = this.options.disableRatelimits ? `ERROR` : `DEBUG`;
                shouldThrow = this.options.disableRatelimits;
                break;
            }
            default: {
                if (res.statusCode >= 500 && res.statusCode < 600) {
                    message = `Status code ${res.statusCode} (SERVER ERROR)`;
                    level = this.options.disableRatelimits ? `ERROR` : `DEBUG`;
                    shouldThrow = this.options.disableRatelimits;
                }
                break;
            }
        }
        const errors = [];
        if (res.body?.message)
            errors.push(res.body.message);
        if (res.body?.errors) {
            const flattened = (0, node_utils_1.flattenObject)(res.body.errors, DiscordConstants_1.DiscordConstants.REST_ERROR_KEY);
            errors.concat(Object.keys(flattened)
                .filter((key) => key.endsWith(`.${DiscordConstants_1.DiscordConstants.REST_ERROR_KEY}`) || key === DiscordConstants_1.DiscordConstants.REST_ERROR_KEY)
                .map((key) => flattened[key].map((error) => `${key !== DiscordConstants_1.DiscordConstants.REST_ERROR_KEY ? `[${key.slice(0, -(`.${DiscordConstants_1.DiscordConstants.REST_ERROR_KEY}`.length))}] ` : ``}(${error.code ?? `UNKNOWN`}) ${(error?.message ?? error) ?? `Unknown Message`}`
                .trimEnd()
                .replace(/\.$/, ``)))
                .flat());
        }
        const errorString = `${message ? `${message} ` : ``}${errors.length ? ` "${errors.join(`, `)}"` : `${res.body?.message ? ` "${res.body.message}"` : ``}`}`;
        this._log(`${method} ${route} returned ${errorString}`, {
            level, system: this.system
        });
        if (shouldThrow) {
            throw new DistypeError_1.DistypeError(`${errorString} on ${method} ${route}`, DistypeError_1.DistypeErrorType.REST_REQUEST_ERROR, this.system);
        }
    }
}
exports.Rest = Rest;
