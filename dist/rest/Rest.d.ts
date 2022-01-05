import { RestBucket } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';
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
    body?: Record<string, any> | FormData;
    /**
     * The request query.
     */
    params?: Record<string, any>;
    /**
     * The request query.
     */
    query?: Record<string, any>;
    /**
     * The value for the X-Audit-Log-Reason header.
     */
    reason?: string;
}
/**
 * Rest request methods.
 */
export declare type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;
/**
 * A rest bucket hash.
 */
export declare type RestBucketHashLike = `${string}` | `global;${RestRouteHashLike}`;
/**
 * A rest bucket ID.
 */
export declare type RestBucketIdLike = `${RestBucketHashLike}(${RestMajorParameterLike})`;
/**
 * A major rest ratelimit parameter.
 */
export declare type RestMajorParameterLike = `global` | Snowflake;
/**
 * A rest route.
 */
export declare type RestRouteLike = `/${string}`;
/**
 * A rest route hash.
 */
export declare type RestRouteHashLike = `${RestMethod};${RestMajorParameterLike}`;
/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export declare class Rest extends RestRequests {
    /**
     * Rate limit buckets.
     * Each bucket's key is it's ID.
     */
    buckets: Collection<RestBucketIdLike, RestBucket>;
    /**
     * The amount of requests left in the global ratelimit bucket.
     */
    globalLeft: number;
    /**
     * A unix millisecond timestamp at which the global ratelimit resets.
     */
    globalResetAt: number;
    /**
     * A tally of the number of responses that returned a specific response code.
     * Note that response codes aren't included if they were never received.
     */
    responseCodeTally: Record<string, number>;
    /**
     * Cached route rate limit bucket hashes.
     * Keys are cached route hashes, with their values being their corresponding bucket hash.
     */
    routeHashCache: Collection<RestRouteHashLike, RestBucketHashLike>;
    /**
     * Options for the rest manager.
     */
    readonly options: RestOptions;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options Rest options.
     */
    constructor(token: string, options: RestOptions);
    /**
     * Get the ratio of response codes.
     * Each code's value is the percentage it was received (`0` to `100`).
     * Note that response codes aren't included if they were never received.
     */
    get responseCodeRatio(): Record<string, number>;
    /**
     * Make a rest request.
     * @param method The request's method.
     * @param route The requests's route, relative to the base Discord API URL. (Example: `/channels/:id`)
     * @param options Request options.
     * @returns Response data.
     */
    request(method: RestMethod, route: RestRouteLike, options?: RestRequestOptions & RestData): Promise<any>;
    private _createBucket;
}
