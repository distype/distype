import { RestBucket, RestBucketHash, RestBucketId, RestRouteHash } from './RestBucket';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';
import { LogCallback } from '../types/Log';
import { ExtendedMap } from '../utils/ExtendedMap';
/**
 * {@link Rest} make responses.
 */
export type RestMakeResponse = Response & {
    parsedBody: any;
};
/**
 * {@link Rest} request methods.
 */
export type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;
/**
 * A {@link Rest rest} route.
 */
export type RestRoute = `/${string}`;
/**
 * Data for a {@link Rest rest} request.
 * Used by the `Rest#request()` method.
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
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export declare class Rest extends RestRequests {
    /**
     * The default REST API version used.
     */
    static readonly API_VERSION = 10;
    /**
     * Discord's base API URL.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-reference-base-url)
     */
    static readonly BASE_URL = "https://discord.com/api";
    /**
     * The ending key where an error array is defined on a rest error.
     */
    static readonly ERROR_KEY = "_errors";
    /**
     * The amount of milliseconds after a message is created where it causes issues with rate limiting.
     * @see [GitHub Issue](https://github.com/discord/discord-api-docs/issues/1295)
     */
    static readonly OLD_MESSAGE_THRESHOLD = 1209600000;
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
    readonly options: Required<RestOptions> & RestRequestOptions & {
        version: number;
    };
    /**
     * The system string used for logging.
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
     * Low level rest make method.
     * Used by {@link RestBucket rest buckets}, and the `Rest#request()` method if rate limits are turned off.
     * **Only use this method if you know exactly what you are doing.**
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param options Request options.
     * @returns The full response.
     */
    make(method: RestMethod, route: RestRoute, options: RestRequestData): Promise<RestMakeResponse>;
    /**
     * Cleans up inactive {@link RestBucket buckets} without active local rate limits. Useful for manually preventing potentially fatal memory leaks in large bots.
     */
    sweepBuckets(): void;
    /**
     * Create a rate limit {@link RestBucket bucket}.
     * @param bucketId The bucket's {@link RestBucketId ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHash hash}.
     * @param majorParameter The {@link RestMajorParameter major parameter} associated with the bucket.
     * @returns The created bucket.
     */
    private _createBucket;
    /**
     * Checks for errors in responses.
     */
    private _checkForResponseErrors;
    /**
     * Flattens errors returned from the API.
     * @returns The flattened errors.
     */
    private _flattenErrors;
}
