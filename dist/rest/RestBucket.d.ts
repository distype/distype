import { Rest, RestMethod, RestRequestData, RestResponse, RestRoute } from './Rest';
import { Snowflake } from 'discord-api-types/v10';
/**
 * A {@link Rest rest} bucket hash.
 * @internal
 */
export type RestBucketHash = `${string}` | `global;${RestRouteHash}`;
/**
 * A {@link RestBucket rest bucket} ID.
 */
export type RestBucketId = `${RestBucketHash}(${RestMajorParameter})`;
/**
 * A major {@link Rest rest} rate limit parameter.
 * @internal
 */
export type RestMajorParameter = `global` | Snowflake;
/**
 * A {@link RestRoute rest route} hash.
 */
export type RestRouteHash = `${RestMethod};${RestMajorParameter}`;
/**
 * A {@link Rest rest} bucket.
 * Used for rate limiting requests.
 * @internal
 */
export declare class RestBucket {
    /**
     * The number of allowed requests per a rate limit interval.
     */
    allowedRequestsPerRatelimit: number;
    /**
     * The {@link Rest rest manager} the bucket is bound to.
     */
    manager: Rest;
    /**
     * The current number of requests left.
     */
    requestsLeft: number;
    /**
     * A unix millisecond timestamp at which the rate limit resets.
     */
    resetAt: number;
    /**
     * The bucket's unique {@link RestBucketHash hash}.
     */
    readonly bucketHash: RestBucketHash;
    /**
     * The bucket's {@link RestBucketId ID}.
     */
    readonly id: RestBucketId;
    /**
     * The {@link RestMajorParameter major parameter} associated with the bucket.
     */
    readonly majorParameter: RestMajorParameter;
    /**
     * The system string used for logging.
     */
    readonly system = "Rest Bucket";
    /**
     * The request queue.
     */
    private _queue;
    /**
     * Create a rest bucket.
     * @param id The bucket's {@link RestBucketId ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHash hash}.
     * @param majorParameter The {@link RestMajorParameter major parameter} associated with the bucket.
     * @param manager The {@link Rest rest manager} the bucket is bound to.
     */
    constructor(id: RestBucketId, bucketHash: RestBucketHash, majorParameter: RestMajorParameter, manager: Rest);
    /**
     * If the bucket is currently making a request.
     */
    get active(): boolean;
    /**
     * Get information on the bucket's current rate limit restrictions.
     */
    get ratelimited(): {
        local: boolean;
        global: boolean;
        any: boolean;
    };
    /**
     * Make a rest request with this bucket's rate limits.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHash route hash}.
     * @param options Request options.
     * @returns Response data.
     */
    request(method: RestMethod, route: RestRoute, routeHash: RestRouteHash, options: RestRequestData): Promise<RestResponse>;
    /**
     * Waits for the bucket to no longer be rate limited.
     */
    private _awaitRatelimit;
    /**
     * Lowest level request function that handles active rate limits, rate limit headers, and makes the request.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHash route hash}.
     * @param options Request options.
     * @param attempt The current attempt value.
     * @returns Response data.
     */
    private _make;
    /**
     * Shifts the queue.
     */
    private _shiftQueue;
    /**
     * Waits for the queue to be clear.
     */
    private _waitForQueue;
}
