import { RestBucket } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';

import { DiscordConstants } from '../constants/DiscordConstants';
import { Logger } from '../logger/Logger';
import { SnowflakeUtils } from '../utils/SnowflakeUtils';

import Collection from '@discordjs/collection';
import { Snowflake } from 'discord-api-types/v9';
import FormData from 'form-data';

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
    public buckets: Collection<RestBucketIdLike, RestBucket> = new Collection();
    /**
     * The interval used for sweeping inactive {@link RestBucket buckets}.
     */
    public bucketSweepInterval: NodeJS.Timer | null = null;
    /**
     * The amount of requests left in the global ratelimit bucket.
     */
    public globalLeft: number;
    /**
     * A unix millisecond timestamp at which the global ratelimit resets.
     */
    public globalResetAt = -1;
    /**
     * A tally of the number of responses that returned a specific response code.
     * Note that response codes aren't included if they were never received.
     */
    public responseCodeTally: Record<string, number> = {};
    /**
     * Cached route rate limit bucket hashes.
     * Keys are {@link RestRouteHashLike cached route hashes}, with their values being their corresponding {@link RestBucketHashLike bucket hash}.
     */
    public routeHashCache: Collection<RestRouteHashLike, RestBucketHashLike> = new Collection();

    /**
     * {@link RestOptions Options} for the rest manager.
     */
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
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
    constructor(token: string, logger: Logger | false, options: RestOptions) {
        super();

        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);
        if (!(logger instanceof Logger) && logger !== false) throw new TypeError(`A logger or false must be specified`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Rest[`_token`],
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options) as Rest[`options`],
            writable: false
        });

        if (logger) this._logger = logger;

        // @ts-expect-error Property 'options' is used before being assigned.
        if (this.options.ratelimits.sweepInterval) this.bucketSweepInterval = setInterval(() => this.sweepBuckets(), this.options.ratelimits.sweepInterval);

        this.globalLeft = options.ratelimits.globalPerSecond;

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
        const total = Object.values(this.responseCodeTally).reduce((p, c) => p += c);
        const ratio: Record<string, number> = {};
        Object.keys(this.responseCodeTally).forEach((key) => ratio[key] = (this.responseCodeTally[key] / total) * 100);
        return ratio;
    }

    /**
     * Make a rest request.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns Response data.
     */
    public async request(method: RestMethod, route: RestRouteLike, options: RestRequestOptions & RestRequestData = {}): Promise<any> {
        this._logger?.log(`Starting request ${method} ${route}`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });

        const rawHash = route.replace(/\d{16,19}/g, `:id`).replace(/\/reactions\/(.*)/, `/reactions/:reaction`);
        const oldMessage = method === `DELETE` && rawHash === `/channels/:id/messages/:id` && (Date.now() - SnowflakeUtils.time(/\d{16,19}$/.exec(route)![0])) > DiscordConstants.OLD_MESSAGE_THRESHOLD ? `/old-message` : ``;

        const routeHash: RestRouteHashLike = `${method};${rawHash}${oldMessage}`;
        const bucketHash: RestBucketHashLike = this.routeHashCache.get(routeHash) ?? `global;${routeHash}`;
        const majorParameter: RestMajorParameterLike = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(route)?.[1] ?? `global`;
        const bucketId: RestBucketIdLike = `${bucketHash}(${majorParameter})`;

        const bucket = this.buckets.get(bucketId) ?? this._createBucket(bucketId, bucketHash, majorParameter);

        return await bucket.request(method, route, routeHash, options);
    }

    /**
     * Cleans up inactive {@link RestBucket buckets} without active local rate limits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    public sweepBuckets (): void {
        const sweeped = this.buckets.sweep((bucket) => !bucket.active && !bucket.ratelimited.local);
        this._logger?.log(`Sweeped ${sweeped} buckets`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
    }

    /**
     * Create a ratelimit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    private _createBucket (bucketId: RestBucketIdLike, bucketHash: RestBucketHashLike, majorParameter: RestMajorParameterLike): RestBucket {
        const bucket = new RestBucket(this, bucketId, bucketHash, majorParameter, this._logger ?? false);
        this.buckets.set(bucketId, bucket);
        this._logger?.log(`Added bucket ${bucket.id} to rest manager bucket collection`, {
            internal: true, level: `DEBUG`, system: `Rest`
        });
        return bucket;
    }
}
