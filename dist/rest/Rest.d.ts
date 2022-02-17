/// <reference types="node" />
import { RestBucket } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';
import { Logger } from '../logger/Logger';
import Collection from '@discordjs/collection';
import { Snowflake } from 'discord-api-types/v10';
import FormData from 'form-data';
import { Dispatcher } from 'undici';
/**
 * {@link Rest} request methods.
 */
export declare type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;
/**
 * A {@link Rest rest} bucket hash.
 */
export declare type RestBucketHashLike = `${string}` | `global;${RestRouteHashLike}`;
/**
 * A {@link RestBucket rest bucket} ID.
 */
export declare type RestBucketIdLike = `${RestBucketHashLike}(${RestMajorParameterLike})`;
/**
 * Internal request options.
 * @internal
 */
export declare type RestInternalRequestOptions = RestRequestOptions & RestRequestData;
/**
 * Internal request response.
 * @internal
 */
export declare type RestInternalRestResponse = Dispatcher.ResponseData & {
    body: any;
};
/**
 * A major {@link Rest rest} ratelimit parameter.
 */
export declare type RestMajorParameterLike = `global` | Snowflake;
/**
 * Data for a {@link Rest rest} request.
 * Used by the `Rest#request()` method.
 */
export interface RestRequestData {
    /**
     * The request body.
     */
    body?: Record<string, any> | FormData;
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
 * A {@link Rest rest} route.
 */
export declare type RestRouteLike = `/${string}`;
/**
 * A {@link RestRouteLike rest route} hash.
 */
export declare type RestRouteHashLike = `${RestMethod};${RestMajorParameterLike}`;
/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export declare class Rest extends RestRequests {
    /**
     * Rate limit {@link RestBucket buckets}.
     * Each bucket's key is it's {@link RestBucketIdLike ID}.
     */
    buckets: Collection<RestBucketIdLike, RestBucket> | null;
    /**
     * The interval used for sweeping inactive {@link RestBucket buckets}.
     */
    bucketSweepInterval: NodeJS.Timer | null;
    /**
     * The amount of requests left in the global ratelimit bucket.
     */
    globalLeft: number | null;
    /**
     * A unix millisecond timestamp at which the global ratelimit resets.
     */
    globalResetAt: number | null;
    /**
     * A tally of the number of responses that returned a specific response code.
     * Note that response codes aren't included if they were never received.
     */
    responseCodeTally: Record<string, number>;
    /**
     * Cached route rate limit bucket hashes.
     * Keys are {@link RestRouteHashLike cached route hashes}, with their values being their corresponding {@link RestBucketHashLike bucket hash}.
     */
    routeHashCache: Collection<RestRouteHashLike, RestBucketHashLike> | null;
    /**
     * {@link RestOptions Options} for the rest manager.
     */
    readonly options: RestOptions;
    /**
     * The {@link Logger logger} used by the rest manager.
     */
    private _logger?;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param logger The {@link Logger logger} for the rest manager to use. If `false` is specified, no logger will be used.
     * @param options {@link RestOptions Rest options}.
     */
    constructor(token: string, logger: Logger | false, options: RestOptions);
    /**
     * Get the ratio of response codes.
     * Each code's value is the percentage it was received (`0` to `100`).
     * Note that response codes aren't included if they were never received.
     */
    get responseCodeRatio(): Record<string, number>;
    /**
     * Make a rest request.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns Response body.
     */
    request(method: RestMethod, route: RestRouteLike, options?: RestInternalRequestOptions): Promise<any>;
    /**
     * The internal rest make method.
     * Used by {@link RestBucket rest buckets}, and the `Rest#request()` method if ratelimits are turned off.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns The full undici response.
     * @internal
     */
    make(method: RestMethod, route: RestRouteLike, options: RestInternalRequestOptions): Promise<RestInternalRestResponse>;
    /**
     * Cleans up inactive {@link RestBucket buckets} without active local rate limits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    sweepBuckets(): void;
    /**
     * Create a ratelimit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    private _createBucket;
    /**
     * Handles response codes.
     */
    private _handleResponseCodes;
}
