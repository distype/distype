import { RestBucket, RestBucketHash, RestBucketId, RestMajorParameter, RestRouteHash } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';

import { DiscordConstants } from '../constants/DiscordConstants';
import { DistypeConstants } from '../constants/DistypeConstants';
import { LogCallback } from '../types/Log';
import { SnowflakeUtils } from '../utils/SnowflakeUtils';

import { ExtendedMap } from '@br88c/extended-map';
import { URL, URLSearchParams } from 'node:url';

/**
 * Internal request response.
 * @internal
 */
export type RestInternalRestResponse = Response & { body: any }

/**
 * {@link Rest} request methods.
 */
export type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;

/**
 * Data for a {@link Rest rest} request.
 * Used by the `Rest#request()` method.
 * Note that if a {@link RestRequestDataBodyStream stream} is specified for the body, it is expected that you also implement the correct headers in your request.
 */
export interface RestRequestData extends RestRequestOptions {
    /**
     * The request body.
     */
    body?: Record<string, any> | FormData
    /**
     * The request query.
     */
    query?: Record<string, any>
    /**
     * The value for the `X-Audit-Log-Reason` header.
     */
    reason?: string
}

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
     * Rate limit {@link RestBucket buckets}.
     * Each bucket's key is it's {@link RestBucketId ID}.
     */
    public buckets: ExtendedMap<RestBucketId, RestBucket> | null = null;
    /**
     * The interval used for sweeping inactive {@link RestBucket buckets}.
     */
    public bucketSweepInterval: NodeJS.Timer | null = null;
    /**
     * The amount of requests left in the global rate limit bucket.
     */
    public globalLeft: number | null = null;
    /**
     * A unix millisecond timestamp at which the global rate limit resets.
     */
    public globalResetAt: number | null = null;
    /**
     * A tally of the number of responses that returned a specific response code.
     * Note that response codes aren't included if they were never received.
     */
    public responseCodeTally: Record<string, number> = {};
    /**
     * Cached route rate limit bucket hashes.
     * Keys are {@link RestRouteHash cached route hashes}, with their values being their corresponding {@link RestBucketHash bucket hash}.
     */
    public routeHashCache: ExtendedMap<RestRouteHash, RestBucketHash> | null = null;

    /**
     * {@link RestOptions Options} for the rest manager.
     */
    public readonly options: Required<RestOptions> & RestRequestOptions;
    /**
     * The system string used for logging.
     */
    public readonly system = `Rest`;

    /**
     * The {@link LogCallback log callback} used by the gateway manager.
     */
    private _log: LogCallback;

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

        if (typeof token !== `string`) throw new TypeError(`Parameter "token" (string) not provided: got ${token} (${typeof token})`);
        if (typeof options !== `object`) throw new TypeError(`Parameter "options" (object) type mismatch: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`) throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);

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
        if (!this.options.disableRatelimits) {
            const rawHash = route.replace(/\d{16,19}/g, `:id`).replace(/\/reactions\/(.*)/, `/reactions/:reaction`);
            const oldMessage = rawHash === `/channels/:id/messages/:id` && method === `DELETE` && (Date.now() - SnowflakeUtils.time(/\d{16,19}$/.exec(route)![0])) > DiscordConstants.REST.OLD_MESSAGE_THRESHOLD ? `/old-message` : ``;

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
     * Used by {@link RestBucket rest buckets}, and the `Rest#request()` method if rate limits are turned off.
     * **Only use this method if you know exactly what you are doing.**
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns The full undici response.
     * @internal
     */
    public async make (method: RestMethod, route: RestRoute, options: RestRequestData): Promise<RestInternalRestResponse> {
        const isForm = options.body instanceof FormData;

        const headers: Record<string, string> = (options.forceHeaders ?? this.options.forceHeaders) ? {
            ...this.options.headers,
            ...options.headers
        } : {
            'Authorization': (options.authHeader ?? this.options.authHeader) ?? `Bot ${this._token}`,
            'Content-Type': isForm ? `multipart/form-data` : `application/json`,
            'User-Agent': `DiscordBot (${DistypeConstants.URL}, v${DistypeConstants.VERSION})`,
            ...this.options.headers,
            ...options.headers
        };

        if ((options.forceHeaders ?? this.options.forceHeaders) && (options.authHeader ?? this.options.authHeader)) headers[`Authorization`] = (options.authHeader ?? this.options.authHeader)!;
        if (options.reason) headers[`X-Audit-Log-Reason`] = options.reason;

        const url = new URL(`${(options.customBaseURL ?? this.options.customBaseURL) ?? `${DiscordConstants.REST.BASE_URL}/v${this.options.version}`}${route}`);
        url.search = new URLSearchParams(options.query).toString();

        const reqResponse = await fetch(url, {
            ...this.options,
            ...options,
            body: isForm ? options.body as FormData : JSON.stringify(options.body),
            headers,
            method
        });
        const body = reqResponse.status !== 204 ? await reqResponse.json() : undefined;

        const response: RestInternalRestResponse = {
            ...reqResponse,
            body
        };

        this._handleResponseCodes(method, route, response);

        return response;
    }

    /**
     * Cleans up inactive {@link RestBucket buckets} without active local rate limits. Useful for manually preventing potentially fatal memory leaks in large bots.
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
     * Create a rate limit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketId ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHash hash}.
     * @param majorParameter The {@link RestMajorParameter major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    private _createBucket (bucketId: RestBucketId, bucketHash: RestBucketHash, majorParameter: RestMajorParameter): RestBucket {
        if (!this.buckets || this.options.disableRatelimits) throw new Error(`Cannot create a bucket while rate limits are disabled`);
        const bucket = new RestBucket(bucketId, bucketHash, majorParameter, this);
        this.buckets.set(bucketId, bucket);
        return bucket;
    }

    /**
     * Handles response codes.
     */
    private _handleResponseCodes (method: RestMethod, route: RestRoute, response: RestInternalRestResponse): void {
        this.responseCodeTally[response.status] = (this.responseCodeTally[response.status] ?? 0) + 1;

        const result = `${response.status} ${method} ${route}`;

        if (response.status < 400) {
            this._log(result, {
                level: `DEBUG`, system: this.system
            });
        } else {
            const errors: string[] = [];
            if (response.body?.message) errors.push(response.body.message);
            if (response.body?.errors) {
                const flattened = this._flattenErrors(response.body.errors);
                errors.push(
                    ...Object.keys(flattened)
                        .filter((key) => key.endsWith(`.${DiscordConstants.REST.ERROR_KEY}`) || key === DiscordConstants.REST.ERROR_KEY)
                        .map((key) => flattened[key].map((error) =>
                            `${key !== DiscordConstants.REST.ERROR_KEY ? `[${key.slice(0, -(`.${DiscordConstants.REST.ERROR_KEY}`.length))}] ` : ``}(${error.code ?? `UNKNOWN`}) ${(error?.message ?? error) ?? `Unknown reason`}`
                                .trimEnd()
                                .replace(/\.$/, ``)
                        ))
                        .flat()
                );
            }

            const errorMessage = `${result}${errors.length ? ` => "${errors.join(`, `)}"` : ``}`;

            if (!this.options.disableRatelimits ? (response.status !== 429 && response.status < 500) : true) {
                throw new Error(errorMessage);
            } else {
                this._log(errorMessage, {
                    level: `DEBUG`, system: this.system
                });
            }
        }
    }

    /**
     * Flattens errors returned from the API.
     * @returns The flattened errors.
     */
    private _flattenErrors (errors: Record<string, any>): Record<string, Array<{ code: string, message: string }>> {
        const flatten = (obj: Record<string, any>, map: Record<string, any> = {}, parent?: string): Record<string, any> => {
            for (const [k, v] of Object.entries(obj)) {
                const property = parent ? `${parent}.${k}` : k;
                if (k !== DiscordConstants.REST.ERROR_KEY && v && v !== null && typeof v === `object`) flatten(v, map, property);
                else map[property] = v;
            }
            return map;
        };
        return flatten(errors);
    }
}
