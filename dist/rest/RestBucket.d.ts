import { Rest, RestBucketHashLike, RestBucketIdLike, RestData, RestMajorParameterLike, RestMethod, RestRouteHashLike, RestRouteLike } from './Rest';
import { RestRequestOptions } from './RestOptions';
export declare class RestBucket {
    /**
     * The number of allowed requests per a ratelimit interval.
     */
    allowedRequestsPerRatelimit: number;
    /**
     * The rest manager the bucket is bound to.
     */
    manager: Rest;
    /**
     * The unix millisecond timestamp from the last time the bucket was used to make a request.
     */
    lastUsed: number;
    /**
     * The current number of requests left.
     */
    requestsLeft: number;
    /**
     * A unix millisecond timestamp at which the ratelimit resets.
     */
    resetAt: number;
    /**
     * The bucket's unique hash string.
     */
    readonly bucketHash: RestBucketHashLike;
    /**
     * The bucket's ID.
     */
    readonly id: RestBucketIdLike;
    /**
     * The major parameter associated with the bucket.
     */
    readonly majorParameter: RestMajorParameterLike;
    /**
     * The request queue.
     */
    private queue;
    /**
     * Create a rest bucket.
     * @param manager The rest manager the bucket is bound to.
     * @param id The bucket's ID.
     * @param bucketHash The bucket's unique hash string.
     * @param majorParameter The major parameter associated with the bucket.
     */
    constructor(manager: Rest, id: RestBucketIdLike, bucketHash: RestBucketHashLike, majorParameter: RestMajorParameterLike);
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
     * @param method The request's method.
     * @param route The requests's route, relative to the base Discord API URL. (Example: `/channels/:id`)
     * @param routeHash The request's route hash.
     * @param options Request options.
     * @returns Response data.
     */
    request(method: RestMethod, route: RestRouteLike, routeHash: RestRouteHashLike, options: RestRequestOptions & RestData): Promise<any>;
    /**
     * Waits for the bucket to no longer be rate limited.
     */
    private _awaitRatelimit;
    /**
     * Lowest level request function that handles active ratelimits, ratelimit headers, and makes the request with `undici`.
     * @param method The request's method.
     * @param route The requests's route, relative to the base Discord API URL. (Example: `/channels/:id`)
     * @param routeHash The request's route hash.
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
