/// <reference types="node" />
import { RestBucket } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';
import { LogCallback } from '../types/Log';
import { ExtendedMap } from '@br88c/node-utils';
import { Snowflake } from 'discord-api-types/v10';
import { Readable } from 'stream';
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
 * Note that if a {@link RestRequestDataBodyStream stream} is specified for the body, it is expected that you also implmenet the correct headers in your request.
 */
export interface RestRequestData {
    /**
     * The request body.
     */
    body?: Record<string, any> | RestRequestDataBodyStream;
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
 * A streamable body. Used for uploads.
 */
export declare type RestRequestDataBodyStream = Readable | Buffer | Uint8Array;
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
     * Ratelimit {@link RestBucket buckets}.
     * Each bucket's key is it's {@link RestBucketIdLike ID}.
     */
    buckets: ExtendedMap<RestBucketIdLike, RestBucket> | null;
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
     * Cached route ratelimit bucket hashes.
     * Keys are {@link RestRouteHashLike cached route hashes}, with their values being their corresponding {@link RestBucketHashLike bucket hash}.
     */
    routeHashCache: ExtendedMap<RestRouteHashLike, RestBucketHashLike> | null;
    /**
     * {@link RestOptions Options} for the rest manager.
     */
    readonly options: Required<RestOptions> & RestRequestOptions;
    /**
     * The {@link LogCallback log callback} used by the gateway manager.
     */
    private _log;
    /**
     * A value to use as `this` in the `this#_log`.
     */
    private _logThisArg?;
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
     * Cleans up inactive {@link RestBucket buckets} without active local ratelimits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    sweepBuckets(): void;
    /**
     * Converts specified headers with undici typings to a `Record<string, string>`.
     * @param headers The headers to convert.
     * @returns The formatted headers.
     */
    private _convertUndiciHeaders;
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
    /**
     * Parses errors from a response.
     * @param body The body in the response.
     * @returns A parsed error string, or `null` if no errors were found.
     */
    private _parseErrors;
}
