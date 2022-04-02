import { RestBucket } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';

import { DiscordConstants } from '../constants/DiscordConstants';
import { DistypeConstants } from '../constants/DistypeConstants';
import { LogCallback } from '../types/Log';
import { SnowflakeUtils } from '../utils/SnowflakeUtils';

import { ExtendedMap, flattenObject, LoggerLevel } from '@br88c/node-utils';
import { Snowflake } from 'discord-api-types/v10';
import { Readable } from 'stream';
import { Dispatcher, request } from 'undici';
import { URL, URLSearchParams } from 'url';
import { isUint8Array } from 'util/types';

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
 * Note that if a {@link RestRequestDataBodyStream stream} is specified for the body, it is expected that you also implmenet the correct headers in your request.
 */
export interface RestRequestData {
    /**
     * The request body.
     */
    body?: Record<string, any> | RestRequestDataBodyStream
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
 * A streamable body. Used for uploads.
 */
export type RestRequestDataBodyStream = Readable | Buffer | Uint8Array;

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
     * Ratelimit {@link RestBucket buckets}.
     * Each bucket's key is it's {@link RestBucketIdLike ID}.
     */
    public buckets: ExtendedMap<RestBucketIdLike, RestBucket> | null = null;
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
     * Cached route ratelimit bucket hashes.
     * Keys are {@link RestRouteHashLike cached route hashes}, with their values being their corresponding {@link RestBucketHashLike bucket hash}.
     */
    public routeHashCache: ExtendedMap<RestRouteHashLike, RestBucketHashLike> | null = null;

    /**
     * {@link RestOptions Options} for the rest manager.
     */
    public readonly options: Required<RestOptions> & RestRequestOptions;

    /**
     * The {@link LogCallback log callback} used by the gateway manager.
     */
    private _log: LogCallback;
    /**
     * A value to use as `this` in the `this#_log`.
     */
    private _logThisArg?: any;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options {@link RestOptions Rest options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the rest manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor (token: string, options: RestOptions & RestRequestOptions = {}, logCallback: LogCallback = (): void => {}, logThisArg?: any) {
        super();

        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Rest[`_token`],
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
            this.buckets = new ExtendedMap();
            this.globalLeft = this.options.ratelimitGlobal;
            this.globalResetAt = -1;
            this.routeHashCache = new ExtendedMap();
            if (this.options.bucketSweepInterval) this.bucketSweepInterval = setInterval(() => this.sweepBuckets(), this.options.bucketSweepInterval);
        }

        this._log = logCallback.bind(logThisArg);
        this._logThisArg = logThisArg;
        this._log(`Initialized rest manager`, {
            level: `DEBUG`, system: `Rest`
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
        this._log(`${method} ${route} started`, {
            level: `DEBUG`, system: `Rest`
        });

        if (!this.options.disableRatelimits) {
            const rawHash = route.replace(/\d{16,19}/g, `:id`).replace(/\/reactions\/(.*)/, `/reactions/:reaction`);
            const oldMessage = method === `DELETE` && rawHash === `/channels/:id/messages/:id` && (Date.now() - SnowflakeUtils.time(/\d{16,19}$/.exec(route)![0])) > DiscordConstants.REST_OLD_MESSAGE_THRESHOLD ? `/old-message` : ``;

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
        this._log(`${method} ${route} being made`, {
            level: `DEBUG`, system: `Rest`
        });

        const headers: Record<string, string> = {
            'Authorization': `Bot ${this._token}`,
            'Content-Type': `application/json`,
            'User-Agent': `DiscordBot (${DistypeConstants.URL}, v${DistypeConstants.VERSION})`,
            ...this._convertUndiciHeaders(this.options.headers),
            ...this._convertUndiciHeaders(options.headers)
        };

        if (options.reason) headers[`X-Audit-Log-Reason`] = options.reason;

        const url = new URL(`${(options.customBaseURL ?? this.options.customBaseURL) ?? `${DiscordConstants.BASE_URL}/v${this.options.version}`}${route}`);
        url.search = new URLSearchParams(options.query).toString();

        const req = request(url, {
            ...this.options,
            ...options,
            method,
            headers,
            body: options.body instanceof Readable || isUint8Array(options.body) || Buffer.isBuffer(options.body) ? options.body : JSON.stringify(options.body),
            bodyTimeout: options.timeout ?? this.options.timeout
        });

        const res = await req.then(async (r) => ({
            ...r,
            body: r.statusCode !== 204 ? await r.body.json().catch(() => this._log(`${method} ${route} unable to parse response body, returning undefined`, {
                level: `WARN`, system: `Rest`
            })) : undefined
        }));

        this.responseCodeTally[res.statusCode] = (this.responseCodeTally[res.statusCode] ?? 0) + 1;

        this._handleResponseCodes(method, route, res, this.options.friendlyErrors ?? options.friendlyErrors);

        return res;
    }

    /**
     * Cleans up inactive {@link RestBucket buckets} without active local ratelimits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    public sweepBuckets (): void {
        if (this.buckets) {
            const sweeped = this.buckets.sweep((bucket) => !bucket.active && !bucket.ratelimited.local);
            this._log(`Sweeped ${sweeped.size} buckets`, {
                level: `DEBUG`, system: `Rest`
            });
        }
    }

    /**
     * Converts specified headers with undici typings to a `Record<string, string>`.
     * @param headers The headers to convert.
     * @returns The formatted headers.
     */
    private _convertUndiciHeaders (headers: RestInternalRequestOptions[`headers`]): Record<string, string> {
        return Array.isArray(headers) ? Object.fromEntries(headers.map((header) => header.split(`:`).map((v) => v.trim()))) : { ...headers };
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
        const bucket = new RestBucket(bucketId, bucketHash, majorParameter, this, this._log, this._logThisArg);
        this.buckets.set(bucketId, bucket);
        this._log(`Added bucket ${bucket.id} to rest manager bucket collection`, {
            level: `DEBUG`, system: `Rest`
        });
        return bucket;
    }

    /**
     * Handles response codes.
     */
    private _handleResponseCodes (method: RestMethod, route: RestRouteLike, res: RestInternalRestResponse, friendlyErrors?: boolean): void {
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

        const errors = this._parseErrors(res.body);
        this._log(`${method} ${route} returned ${message}${errors ? ` ${errors}` : ``}`, {
            level, system: `Rest`
        });
        if (shouldThrow) throw new Error(friendlyErrors ? `${res.body.message ?? `Unknown rest error`}` : `${message}${errors ? ` ${errors}` : ``} on ${method} ${route}`);
    }

    /**
     * Parses errors from a response.
     * @param body The body in the response.
     * @returns A parsed error string, or `null` if no errors were found.
     */
    private _parseErrors (body: any): string | null {
        const errors: string[] = [];
        if (body?.message) errors.push(body.message);
        if (body?.errors) {
            const flattened = flattenObject(body.errors, DiscordConstants.REST_ERROR_KEY) as Record<string, Array<{ code: string, message: string }>>;
            errors.concat(
                Object.keys(flattened)
                    .filter((key) => key.endsWith(`.${DiscordConstants.REST_ERROR_KEY}`) || key === DiscordConstants.REST_ERROR_KEY)
                    .map((key) => flattened[key].map((error) =>
                        `${key !== DiscordConstants.REST_ERROR_KEY ? `[${key.slice(0, -(`.${DiscordConstants.REST_ERROR_KEY}`.length))}] ` : ``}(${error.code ?? `UNKNOWN`}) ${error.message ?? `Unknown Message`}`
                            .trimEnd()
                            .replace(/\.$/, ``)
                    ))
                    .flat()
            );
        }
        return errors.length ? errors.join(`, `) : null;
    }
}
