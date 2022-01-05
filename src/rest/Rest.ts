import { DiscordConstants } from '../utils/DiscordConstants';
import { RestBucket } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';
import { SnowflakeUtils } from '../utils/SnowflakeUtils';

import Collection from '@discordjs/collection';
import FormData from 'form-data';
import { Snowflake } from 'discord-api-types';

/**
 * Data for a request.
 * Used by the `Rest#request()` method.
 */
export interface RestData {
    /**
     * The request body.
     */
    body?: Record<string, any> | FormData
    /**
     * The request query.
     */
    params?: Record<string, any>
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
 * Rest request methods.
 */
export type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;

/**
 * A rest bucket hash.
 */
export type RestBucketHashLike = `${string}` | `global;${RestRouteHashLike}`;

/**
 * A rest bucket ID.
 */
export type RestBucketIdLike = `${RestBucketHashLike}(${RestMajorParameterLike})`;

/**
 * A major rest ratelimit parameter.
 */
export type RestMajorParameterLike = `global` | Snowflake;

/**
 * A rest route.
 */
export type RestRouteLike = `/${string}`;

/**
 * A rest route hash.
 */
export type RestRouteHashLike = `${RestMethod};${RestMajorParameterLike}`;

/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export class Rest extends RestRequests {
    /**
     * Rate limit buckets.
     * Each bucket's key is it's ID.
     */
    public buckets: Collection<RestBucketIdLike, RestBucket> = new Collection();
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
     */
    public responseCodeTally: Record<string, number> = {};
    /**
     * Cached route rate limit bucket hashes.
     * Keys are cached route hashes, with their values being their corresponding bucket hash.
     */
    public routeHashCache: Collection<RestRouteHashLike, RestBucketHashLike> = new Collection();

    /**
     * Options for the rest manager.
     */
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
    public readonly options: RestOptions;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options Rest options.
     */
    constructor(token: string, options: RestOptions) {
        super();

        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);

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

        this.globalLeft = options.ratelimits.globalPerSecond;
    }

    /**
     * Make a rest request.
     * @param method The request's method.
     * @param route The requests's route, relative to the base Discord API URL. (Example: `/channels/:id`)
     * @param options Request options.
     * @returns Response data.
     */
    public async request(method: RestMethod, route: RestRouteLike, options: RestRequestOptions & RestData = {}): Promise<any> {
        const rawHash = route.replace(/\d{16,19}/g, `:id`).replace(/\/reactions\/(.*)/, `/reactions/:reaction`);
        const oldMessage = method === `DELETE` && rawHash === `/channels/:id/messages/:id` && (Date.now() - SnowflakeUtils.time(/\d{16,19}$/.exec(route)![0])) > DiscordConstants.OLD_MESSAGE_THRESHOLD ? `/old-message` : ``;

        const routeHash: RestRouteHashLike = `${method};${rawHash}${oldMessage}`;
        const bucketHash: RestBucketHashLike = this.routeHashCache.get(routeHash) ?? `global;${routeHash}`;
        const majorParameter: RestMajorParameterLike = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(route)?.[1] ?? `global`;
        const bucketId: RestBucketIdLike = `${bucketHash}(${majorParameter})`;

        const bucket = this.buckets.get(bucketId) ?? this._createBucket(bucketId, bucketHash, majorParameter);

        return await bucket.request(method, route, routeHash, options);
    }

    private _createBucket (bucketId: RestBucketIdLike, bucketHash: RestBucketHashLike, majorParameter: RestMajorParameterLike): RestBucket {
        const bucket = new RestBucket(this, bucketId, bucketHash, majorParameter);
        this.buckets.set(bucketId, bucket);
        return bucket;
    }
}
