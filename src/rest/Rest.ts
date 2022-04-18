import { RestBucket, RestBucketHash, RestBucketId, RestMajorParameter, RestRouteHash } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';

import { DiscordConstants } from '../constants/DiscordConstants';
import { DistypeConstants } from '../constants/DistypeConstants';
import { DistypeError, DistypeErrorType } from '../errors/DistypeError';
import { LogCallback } from '../types/Log';
import { SnowflakeUtils } from '../utils/SnowflakeUtils';

import { ExtendedMap, flattenObject, LoggerLevel } from '@br88c/node-utils';
import { Readable } from 'stream';
import { Dispatcher, request } from 'undici';
import { URL, URLSearchParams } from 'url';
import { isUint8Array } from 'util/types';

/**
 * Internal request response.
 * @internal
 */
export type RestInternalRestResponse = Dispatcher.ResponseData & { body: any }

/**
 * {@link Rest} request methods.
 */
export type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;

/**
 * Data for a {@link Rest rest} request.
 * Used by the `Rest#request()` method.
 * Note that if a {@link RestRequestDataBodyStream stream} is specified for the body, it is expected that you also implmenet the correct headers in your request.
 */
export interface RestRequestData extends RestRequestOptions {
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
export type RestRoute = `/${string}`;

/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export class Rest extends RestRequests {
    /**
     * Ratelimit {@link RestBucket buckets}.
     * Each bucket's key is it's {@link RestBucketId ID}.
     */
    public buckets: ExtendedMap<RestBucketId, RestBucket> | null = null;
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
     * Keys are {@link RestRouteHash cached route hashes}, with their values being their corresponding {@link RestBucketHash bucket hash}.
     */
    public routeHashCache: ExtendedMap<RestRouteHash, RestBucketHash> | null = null;

    /**
     * {@link RestOptions Options} for the rest manager.
     */
    public readonly options: Required<RestOptions> & RestRequestOptions;
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    public readonly system = `Rest`;

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
            if (this.options.bucketSweepInterval) this.bucketSweepInterval = setInterval(() => this.sweepBuckets(), this.options.bucketSweepInterval).unref();
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
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns Response body.
     */
    public async request (method: RestMethod, route: RestRoute, options: RestRequestData = {}): Promise<any> {
        this._log(`${method} ${route} started`, {
            level: `DEBUG`, system: this.system
        });

        if (!this.options.disableRatelimits) {
            const rawHash = route.replace(/\d{16,19}/g, `:id`).replace(/\/reactions\/(.*)/, `/reactions/:reaction`);
            const oldMessage = method === `DELETE` && rawHash === `/channels/:id/messages/:id` && (Date.now() - SnowflakeUtils.time(/\d{16,19}$/.exec(route)![0])) > DiscordConstants.REST_OLD_MESSAGE_THRESHOLD ? `/old-message` : ``;

            const routeHash: RestRouteHash = `${method};${rawHash}${oldMessage}`;
            const bucketHash: RestBucketHash = this.routeHashCache!.get(routeHash) ?? `global;${routeHash}`;
            const majorParameter: RestMajorParameter = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(route)?.[1] ?? `global`;
            const bucketId: RestBucketId = `${bucketHash}(${majorParameter})`;

            const bucket = this.buckets!.get(bucketId) ?? this._createBucket(bucketId, bucketHash, majorParameter);

            return await bucket.request(method, route, routeHash, options);
        } else return (await this.make(method, route, options)).body;
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
    public async make (method: RestMethod, route: RestRoute, options: RestRequestData): Promise<RestInternalRestResponse> {
        this._log(`${method} ${route} being made`, {
            level: `DEBUG`, system: this.system
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

        let unableToParse: string | boolean = false;
        const res: RestInternalRestResponse = await req.then(async (r) => ({
            ...r,
            body: r.statusCode !== 204 ? await r.body?.json().catch((error) => {
                unableToParse = (error?.message ?? error) ?? `Unknown reason`;
            }) : undefined
        }));

        if (typeof unableToParse === `string`) throw new DistypeError(`Unable to parse response body: "${unableToParse}"`, DistypeErrorType.REST_UNABLE_TO_PARSE_RESPONSE_BODY, this.system);

        this.responseCodeTally[res.statusCode] = (this.responseCodeTally[res.statusCode] ?? 0) + 1;

        this._handleResponseCodes(method, route, res);

        return res;
    }

    /**
     * Cleans up inactive {@link RestBucket buckets} without active local ratelimits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    public sweepBuckets (): void {
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
    private _convertUndiciHeaders (headers: RestRequestData[`headers`]): Record<string, string> {
        return Array.isArray(headers) ? Object.fromEntries(headers.map((header) => header.split(`:`).map((v) => v.trim()))) : { ...headers };
    }

    /**
     * Create a ratelimit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketId ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHash hash}.
     * @param majorParameter The {@link RestMajorParameter major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    private _createBucket (bucketId: RestBucketId, bucketHash: RestBucketHash, majorParameter: RestMajorParameter): RestBucket {
        if (!this.buckets || this.options.disableRatelimits) throw new DistypeError(`Cannot create a bucket while ratelimits are disabled`, DistypeErrorType.REST_CREATE_BUCKET_WITH_DISABLED_RATELIMITS, this.system);
        const bucket = new RestBucket(bucketId, bucketHash, majorParameter, this, this._log, this._logThisArg);
        this.buckets.set(bucketId, bucket);
        return bucket;
    }

    /**
     * Handles response codes.
     */
    private _handleResponseCodes (method: RestMethod, route: RestRoute, res: RestInternalRestResponse): void {
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

        const errors: string[] = [];
        if (res.body?.message) errors.push(res.body.message);
        if (res.body?.errors) {
            const flattened = flattenObject(res.body.errors, DiscordConstants.REST_ERROR_KEY) as Record<string, Array<{ code: string, message: string }>>;
            errors.concat(
                Object.keys(flattened)
                    .filter((key) => key.endsWith(`.${DiscordConstants.REST_ERROR_KEY}`) || key === DiscordConstants.REST_ERROR_KEY)
                    .map((key) => flattened[key].map((error) =>
                        `${key !== DiscordConstants.REST_ERROR_KEY ? `[${key.slice(0, -(`.${DiscordConstants.REST_ERROR_KEY}`.length))}] ` : ``}(${error.code ?? `UNKNOWN`}) ${(error?.message ?? error) ?? `Unknown Message`}`
                            .trimEnd()
                            .replace(/\.$/, ``)
                    ))
                    .flat()
            );
        }
        const errorString = `${message ? `${message} ` : ``}${errors.length ? ` "${errors.join(`, `)}"` : `${res.body?.message ? ` "${res.body.message}"` : ``}`}`;

        this._log(`${method} ${route} returned ${errorString}`, {
            level, system: this.system
        });

        if (shouldThrow) {
            throw new DistypeError(`${errorString} on ${method} ${route}`, DistypeErrorType.REST_REQUEST_ERROR, this.system);
        }
    }
}
