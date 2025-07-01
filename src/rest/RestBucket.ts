import { Rest, RestMethod, RestRequestData, RestMakeResponse, RestRoute } from './Rest';

import { Snowflake } from '../utils/SnowflakeUtils';

import { setTimeout as wait } from 'node:timers/promises';

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
export class RestBucket {
    /**
     * Rest rate limit headers.
     * Headers are lowercase to allow for easier comparison (`receivedHeader.toLowerCase() === REST_RATELIMIT_HEADERS.HEADER`), as some http libraries return headers in all uppercase or all lowercase.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/rate-limits#header-format)
     */
    public static readonly RATELIMIT_HEADERS = {
        LIMIT: `x-ratelimit-limit`,
        REMAINING: `x-ratelimit-remaining`,
        RESET: `x-ratelimit-reset`,
        RESET_AFTER: `x-ratelimit-reset-after`,
        BUCKET: `x-ratelimit-bucket`,
        GLOBAL: `x-ratelimit-global`,
        GLOBAL_RETRY_AFTER: `retry-after`,
        SCOPE: `x-ratelimit-scope`,
    };

    /**
     * The number of allowed requests per a rate limit interval.
     */
    public allowedRequestsPerRatelimit = Infinity;
    /**
     * The {@link Rest rest manager} the bucket is bound to.
     */
    public manager: Rest;
    /**
     * The current number of requests left.
     */
    public requestsLeft = 1;
    /**
     * A unix millisecond timestamp at which the rate limit resets.
     */
    public resetAt = -1;

    /**
     * The bucket's unique {@link RestBucketHash hash}.
     */
    public readonly bucketHash: RestBucketHash;
    /**
     * The bucket's {@link RestBucketId ID}.
     */
    public readonly id: RestBucketId;
    /**
     * The {@link RestMajorParameter major parameter} associated with the bucket.
     */
    public readonly majorParameter: RestMajorParameter;
    /**
     * The system string used for logging.
     */
    public readonly system = `Rest Bucket`;

    /**
     * The request queue.
     */
    private _queue: Array<{
        resolve: () => void;
        promise: Promise<void>;
    }> = [];

    /**
     * Create a rest bucket.
     * @param id The bucket's {@link RestBucketId ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHash hash}.
     * @param majorParameter The {@link RestMajorParameter major parameter} associated with the bucket.
     * @param manager The {@link Rest rest manager} the bucket is bound to.
     */
    constructor(id: RestBucketId, bucketHash: RestBucketHash, majorParameter: RestMajorParameter, manager: Rest) {
        if (typeof id !== `string`)
            throw new TypeError(`Parameter "id" (string) not provided: got ${id} (${typeof id})`);
        if (typeof bucketHash !== `string`)
            throw new TypeError(
                `Parameter "bucketHash" (string) not provided: got ${bucketHash} (${typeof bucketHash})`,
            );
        if (typeof majorParameter !== `string`)
            throw new TypeError(
                `Parameter "majorParameter" (string) not provided: got ${majorParameter} (${typeof majorParameter})`,
            );
        if (!(manager instanceof Rest))
            throw new TypeError(`Parameter "manager" (Rest) not provided: got ${manager} (${typeof manager})`);

        this.id = id;
        this.bucketHash = bucketHash;
        this.majorParameter = majorParameter;
        this.manager = manager;
    }

    /**
     * If the bucket is currently making a request.
     */
    public get active(): boolean {
        return this._queue.length > 0;
    }

    /**
     * Get information on the bucket's current rate limit restrictions.
     */
    public get ratelimited(): { local: boolean; global: boolean; any: boolean } {
        const ratelimits = {
            local: this.requestsLeft <= 0 && Date.now() < this.resetAt,
            global: this.manager.globalLeft! <= 0 && Date.now() < this.manager.globalResetAt!,
        };

        return {
            ...ratelimits,
            any: Object.values(ratelimits).some((r) => r),
        };
    }

    /**
     * Make a rest request with this bucket's rate limits.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHash route hash}.
     * @param options Request options.
     * @returns Response data.
     */
    public async request(
        method: RestMethod,
        route: RestRoute,
        routeHash: RestRouteHash,
        options: RestRequestData,
    ): Promise<RestMakeResponse> {
        if (this._queue.length) await this._waitForQueue();
        return await this._make(method, route, routeHash, options).finally(() => this._shiftQueue());
    }

    /**
     * Waits for the bucket to no longer be rate limited.
     */
    private async _awaitRatelimit(): Promise<void> {
        if (!this.ratelimited.any) return;
        const timeout =
            (this.ratelimited.global ? (this.manager.globalResetAt ?? 0) : this.resetAt) +
            this.manager.options.ratelimitPause -
            Date.now();
        await wait(timeout);
        return await this._awaitRatelimit();
    }

    /**
     * Lowest level request function that handles active rate limits, rate limit headers, and makes the request.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHash route hash}.
     * @param options Request options.
     * @param attempt The current attempt value.
     * @returns Response data.
     */
    private async _make(
        method: RestMethod,
        route: RestRoute,
        routeHash: RestRouteHash,
        options: RestRequestData,
        attempt = 0,
    ): Promise<RestMakeResponse> {
        if (this.ratelimited.any) await this._awaitRatelimit();

        if (!this.manager.globalResetAt || this.manager.globalResetAt < Date.now()) {
            this.manager.globalResetAt = Date.now() + 1000;
            this.manager.globalLeft = this.manager.options.ratelimitGlobal;
        }
        this.manager.globalLeft!--;

        const response = await this.manager.make(method, route, options);

        const bucket = response.headers?.get(RestBucket.RATELIMIT_HEADERS.BUCKET);
        const globalRetryAfter = +(response.headers?.get(RestBucket.RATELIMIT_HEADERS.GLOBAL_RETRY_AFTER) ?? 0) * 1000;

        if (globalRetryAfter > 0 && response.headers?.get(RestBucket.RATELIMIT_HEADERS.GLOBAL) === `true`) {
            this.manager.globalLeft = 0;
            this.manager.globalResetAt = globalRetryAfter + Date.now();
        }

        if (bucket && bucket !== this.bucketHash) {
            this.manager.routeHashCache!.set(routeHash, bucket);
        }

        this.requestsLeft = +(response.headers?.get(RestBucket.RATELIMIT_HEADERS.REMAINING) ?? 1);
        this.resetAt = +(response.headers?.get(RestBucket.RATELIMIT_HEADERS.RESET_AFTER) ?? 0) * 1000 + Date.now();
        this.allowedRequestsPerRatelimit = +(response.headers?.get(RestBucket.RATELIMIT_HEADERS.LIMIT) ?? Infinity);

        if (response.status === 429) {
            return this._make(method, route, routeHash, options);
        } else if (response.status >= 500 && response.status < 600) {
            if (attempt >= this.manager.options.code500retries)
                throw new Error(
                    `${method} ${route} rejected after ${this.manager.options.code500retries + 1} attempts (Request returned status code 5xx errors)`,
                );
            else return this._make(method, route, routeHash, options, attempt + 1);
        } else {
            return response;
        }
    }

    /**
     * Shifts the queue.
     */
    private _shiftQueue(): void {
        const shift = this._queue.shift();
        if (shift) shift.resolve();
    }

    /**
     * Waits for the queue to be clear.
     */
    private _waitForQueue(): Promise<void> {
        const next = this._queue.length ? this._queue[this._queue.length - 1].promise : Promise.resolve();
        let resolve: () => void;
        const promise = new Promise<void>((r) => {
            resolve = r;
        });
        this._queue.push({
            resolve: resolve!,
            promise,
        });
        return next;
    }
}
