import { Rest, RestBucketHashLike, RestBucketIdLike, RestRequestData, RestMajorParameterLike, RestMethod, RestRouteHashLike, RestRouteLike } from './Rest';
import { RestRequestOptions } from './RestOptions';
import { Logger } from '../logger/Logger';
/**
 * A {@link Rest rest} bucket.
 * Used for ratelimiting requests.
 * @internal
 */
export declare class RestBucket {
    /**
     * The number of allowed requests per a ratelimit interval.
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
     * A unix millisecond timestamp at which the ratelimit resets.
     */
    resetAt: number;
    /**
     * The bucket's unique {@link RestBucketHashLike hash}.
     */
    readonly bucketHash: RestBucketHashLike;
    /**
     * The bucket's {@link RestBucketIdLike ID}.
     */
    readonly id: RestBucketIdLike;
    /**
     * The {@link RestMajorParameterLike major parameter} associated with the bucket.
     */
    readonly majorParameter: RestMajorParameterLike;
    /**
     * The {@link Logger logger} used by the rest bucket.
     */
    private _logger?;
    /**
     * The request queue.
     */
    private _queue;
    /**
     * Create a rest bucket.
     * @param manager The {@link Rest rest manager} the bucket is bound to.
     * @param id The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     */
    constructor(manager: Rest, id: RestBucketIdLike, bucketHash: RestBucketHashLike, majorParameter: RestMajorParameterLike, logger: Logger | false);
    /**
     * If the bucket is currently making a request.
     */
    get active(): boolean;
    /**
     * Get information on the bucket's current ratelimit restrictions.
     */
    get ratelimited(): {
        local: boolean;
        global: boolean;
    };
    /**
     * Make a rest request with this bucket's ratelimits.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHashLike route hash}.
     * @param options Request options.
     * @returns Response data.
     */
    request(method: RestMethod, route: RestRouteLike, routeHash: RestRouteHashLike, options: RestRequestOptions & RestRequestData): Promise<any>;
    /**
     * Waits for the bucket to no longer be rate limited.
     */
    private _awaitRatelimit;
    /**
     * Lowest level request function that handles active ratelimits, ratelimit headers, and makes the request with `undici`.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHashLike route hash}.
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
