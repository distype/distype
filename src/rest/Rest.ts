import { RestBucket } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';

import { DiscordConstants } from '../constants/DiscordConstants';
import { DistypeConstants } from '../constants/DistypeConstants';
import { Logger, LoggerLevel } from '../logger/Logger';
import { SnowflakeUtils } from '../utils/SnowflakeUtils';

import Collection from '@discordjs/collection';
import { Snowflake } from 'discord-api-types/v10';
import FormData from 'form-data';
import { Dispatcher, request } from 'undici';
import { URL, URLSearchParams } from 'url';

/**
 * {@link Rest} request methods.
 */
export type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;

/**
 * A {@link Rest rest} bucket hash.
 */
export type RestBucketHashLike = `${string}` | `global;${RestRouteHashLike}`;

/**
 * A {@link RestBucket rest bucket} ID.
 */
export type RestBucketIdLike = `${RestBucketHashLike}(${RestMajorParameterLike})`;

/**
 * Internal request options.
 * @internal
 */
export type RestInternalRequestOptions = RestRequestOptions & RestRequestData;

/**
 * Internal request response.
 * @internal
 */
export type RestInternalRestResponse = Dispatcher.ResponseData & { body: any }

/**
 * A major {@link Rest rest} ratelimit parameter.
 */
export type RestMajorParameterLike = `global` | Snowflake;

/**
 * Data for a {@link Rest rest} request.
 * Used by the `Rest#request()` method.
 */
export interface RestRequestData {
    /**
     * The request body.
     */
    body?: Record<string, any> | FormData
    /**
     * The request query.
     */
    query?: Record<string, any>
    /**
     * The value for the X-Audit-Log-Reason header.
     */
    reason?: string
}

/**
 * A {@link Rest rest} route.
 */
export type RestRouteLike = `/${string}`;

/**
 * A {@link RestRouteLike rest route} hash.
 */
export type RestRouteHashLike = `${RestMethod};${RestMajorParameterLike}`;

/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export class Rest extends RestRequests {
    /**
     * Rate limit {@link RestBucket buckets}.
     * Each bucket's key is it's {@link RestBucketIdLike ID}.
     */
    public buckets: Collection<RestBucketIdLike, RestBucket> | null = null;
    /**
     * The interval used for sweeping inactive {@link RestBucket buckets}.
     */
    public bucketSweepInterval: NodeJS.Timer | null = null;
    /**
     * The amount of requests left in the global ratelimit bucket.
     */
    public globalLeft: number | null = null;
    /**
     * A unix millisecond timestamp at which the global ratelimit resets.
     */
    public globalResetAt: number | null = null;
    /**
     * A tally of the number of responses that returned a specific response code.
     * Note that response codes aren't included if they were never received.
     */
    public responseCodeTally: Record<string, number> = {};
    /**
     * Cached route rate limit bucket hashes.
     * Keys are {@link RestRouteHashLike cached route hashes}, with their values being their corresponding {@link RestBucketHashLike bucket hash}.
     */
    public routeHashCache: Collection<RestRouteHashLike, RestBucketHashLike> | null = null;

    /**
     * {@link RestOptions Options} for the rest manager.
     */
    public readonly options: RestOptions;

    /**
     * The {@link Logger logger} used by the rest manager.
     */
    private _logger?: Logger;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param logger The {@link Logger logger} for the rest manager to use. If `false` is specified, no logger will be used.
     * @param options {@link RestOptions Rest options}.
     */
    constructor (token: string, logger: Logger | false, options: RestOptions) {
        super();

        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);
        if (!(logger instanceof Logger) && logger !== false) throw new TypeError(`A logger or false must be specified`);

        if (logger) this._logger = logger;
        this.options = options;

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Rest[`_token`],
            writable: false
        });

        if (this.options.ratelimits) {
            this.buckets = new Collection();
            this.globalLeft = this.options.ratelimits.globalPerSecond;
            this.globalResetAt = -1;
            this.routeHashCache = new Collection();
            if (this.options.ratelimits.sweepInterval) this.bucketSweepInterval = setInterval(() => this.sweepBuckets(), this.options.ratelimits.sweepInterval);
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
    public get responseCodeRatio (): Record<string, number> {
        const total = Object.values(this.responseCodeTally).reduce((p, c) => p + c);
        const ratio: Record<string, number> = {};
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
    public async request (method: RestMethod, route: RestRouteLike, options: RestInternalRequestOptions = {}): Promise<any> {
        this._logger?.log(`${method} ${route} started`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });

        if (this.options.ratelimits) {
            const rawHash = route.replace(/\d{16,19}/g, `:id`).replace(/\/reactions\/(.*)/, `/reactions/:reaction`);
            const oldMessage = method === `DELETE` && rawHash === `/channels/:id/messages/:id` && (Date.now() - SnowflakeUtils.time(/\d{16,19}$/.exec(route)![0])) > DiscordConstants.OLD_MESSAGE_THRESHOLD ? `/old-message` : ``;

            const routeHash: RestRouteHashLike = `${method};${rawHash}${oldMessage}`;
            const bucketHash: RestBucketHashLike = this.routeHashCache!.get(routeHash) ?? `global;${routeHash}`;
            const majorParameter: RestMajorParameterLike = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(route)?.[1] ?? `global`;
            const bucketId: RestBucketIdLike = `${bucketHash}(${majorParameter})`;

            const bucket = this.buckets!.get(bucketId) ?? this._createBucket(bucketId, bucketHash, majorParameter);

            return await bucket.request(method, route, routeHash, options);
        } else return (await this.make(method, route, options)).body;
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
    public async make (method: RestMethod, route: RestRouteLike, options: RestInternalRequestOptions): Promise<RestInternalRestResponse> {
        this._logger?.log(`${method} ${route} being made`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });

        const usingFormData: boolean = options.body instanceof FormData;

        const headers: Record<string, string> = {
            ...this.options.headers,
            ...options.headers,
            ...(usingFormData ? options.body!.getHeaders() : undefined),
            'Authorization': `Bot ${this._token}`,
            'User-Agent': `DiscordBot (${DistypeConstants.URL}, v${DistypeConstants.VERSION})`
        };

        if (!usingFormData && options.body) headers[`Content-Type`] = `application/json`;
        if (options.reason) headers[`X-Audit-Log-Reason`] = options.reason;

        const url = new URL(`${(options.customBaseURL ?? this.options.customBaseURL) ?? `${DiscordConstants.BASE_URL}/v${options.version ?? this.options.version}`}${route}`);
        url.search = new URLSearchParams(options.query).toString();

        const req = request(url, {
            ...this.options,
            ...options,
            method,
            headers,
            body: usingFormData ? undefined : JSON.stringify(options.body),
            bodyTimeout: options.timeout ?? this.options.timeout
        });

        if (usingFormData) options.body!.pipe(req);

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
     * Cleans up inactive {@link RestBucket buckets} without active local rate limits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    public sweepBuckets (): void {
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
    private _createBucket (bucketId: RestBucketIdLike, bucketHash: RestBucketHashLike, majorParameter: RestMajorParameterLike): RestBucket {
        if (!this.buckets) throw new Error(`Buckets are not defined on this rest manager. Maybe ratelimits are disabled?`);
        const bucket = new RestBucket(this._token, this, bucketId, bucketHash, majorParameter, this._logger ?? false);
        this.buckets.set(bucketId, bucket);
        this._logger?.log(`Added bucket ${bucket.id} to rest manager bucket collection`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
        return bucket;
    }

    /**
     * Handles response codes.
     */
    private _handleResponseCodes (method: RestMethod, route: RestRouteLike, res: RestInternalRestResponse): void {
        let message = `Status code ${res.statusCode} (UNKNOWN STATUS CODE)`;
        let level: LoggerLevel = `WARN`;
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

        this._logger?.log(`${method} ${route} returned ${message}`, {
            internal: true, level, system: `REST`
        });
        if (shouldThrow) throw new Error(`${message} on ${method} ${route}`);
    }
}
