/// <reference types="node" />
import { RestBucket, RestBucketHash, RestBucketId, RestRouteHash } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';
import { LogCallback } from '../types/Log';
import { ExtendedMap } from '@br88c/node-utils';
import { Dispatcher, FormData } from 'undici';
/**
 * Internal request response.
 * @internal
 */
export declare type RestInternalRestResponse = Dispatcher.ResponseData & {
    body: any;
};
/**
 * {@link Rest} request methods.
 */
export declare type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;
/**
 * Data for a {@link Rest rest} request.
 * Used by the `Rest#request()` method.
 * Note that if a {@link RestRequestDataBodyStream stream} is specified for the body, it is expected that you also implement the correct headers in your request.
 */
export interface RestRequestData extends RestRequestOptions {
    /**
     * The request body.
     */
    body?: Record<string, any> | FormData;
    /**
     * The request query.
     */
    query?: Record<string, any>;
    /**
     * The value for the `X-Audit-Log-Reason` header.
     */
    reason?: string;
}
/**
 * A {@link Rest rest} route.
 */
export declare type RestRoute = `/${string}`;
/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export declare class Rest extends RestRequests {
    /**
     * Rate limit {@link RestBucket buckets}.
     * Each bucket's key is it's {@link RestBucketId ID}.
     */
    buckets: ExtendedMap<RestBucketId, RestBucket> | null;
    /**
     * The interval used for sweeping inactive {@link RestBucket buckets}.
     */
    bucketSweepInterval: NodeJS.Timer | null;
    /**
     * The amount of requests left in the global rate limit bucket.
     */
    globalLeft: number | null;
    /**
     * A unix millisecond timestamp at which the global rate limit resets.
     */
    globalResetAt: number | null;
    /**
     * A tally of the number of responses that returned a specific response code.
     * Note that response codes aren't included if they were never received.
     */
    responseCodeTally: Record<string, number>;
    /**
     * Cached route rate limit bucket hashes.
     * Keys are {@link RestRouteHash cached route hashes}, with their values being their corresponding {@link RestBucketHash bucket hash}.
     */
    routeHashCache: ExtendedMap<RestRouteHash, RestBucketHash> | null;
    /**
     * {@link RestOptions Options} for the rest manager.
     */
    readonly options: Required<RestOptions> & RestRequestOptions;
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    readonly system = "Rest";
    /**
     * The {@link LogCallback log callback} used by the gateway manager.
     */
    private _log;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options {@link RestOptions Rest options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the rest manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token: string, options?: RestOptions & RestRequestOptions, logCallback?: LogCallback, logThisArg?: any);
    /**
     * Get the ratio of response codes.
     * Each code's value is the percentage it was received (`0` to `100`).
     * Note that response codes aren't included if they were never received.
     */
    get responseCodeRatio(): Record<string, number>;
    /**
     * Make a rest request.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns Response body.
     */
    request(method: RestMethod, route: RestRoute, options?: RestRequestData): Promise<any>;
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
    make(method: RestMethod, route: RestRoute, options: RestRequestData): Promise<RestInternalRestResponse>;
    /**
     * Cleans up inactive {@link RestBucket buckets} without active local rate limits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    sweepBuckets(): void;
    /**
     * Converts specified headers with undici typings to a `Record<string, string>`.
     * @param headers The headers to convert.
     * @returns The formatted headers.
     */
    private _convertUndiciHeaders;
    /**
     * Create a rate limit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketId ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHash hash}.
     * @param majorParameter The {@link RestMajorParameter major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    private _createBucket;
    /**
     * Handles response codes.
     */
    private _handleResponseCodes;
}
