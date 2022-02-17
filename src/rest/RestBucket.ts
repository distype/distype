import { Rest, RestBucketHashLike, RestBucketIdLike, RestInternalRequestOptions, RestMajorParameterLike, RestMethod, RestRouteHashLike, RestRouteLike } from './Rest';

import { DiscordConstants } from '../constants/DiscordConstants';
import { Logger } from '../logger/Logger';

/**
 * A {@link Rest rest} bucket.
 * Used for ratelimiting requests.
 * @internal
 */
export class RestBucket {
    /**
     * The number of allowed requests per a ratelimit interval.
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
     * A unix millisecond timestamp at which the ratelimit resets.
     */
    public resetAt = -1;

    /**
     * The bucket's unique {@link RestBucketHashLike hash}.
     */
    public readonly bucketHash: RestBucketHashLike;
    /**
     * The bucket's {@link RestBucketIdLike ID}.
     */
    public readonly id: RestBucketIdLike;
    /**
     * The {@link RestMajorParameterLike major parameter} associated with the bucket.
     */
    public readonly majorParameter: RestMajorParameterLike;

    /**
     * The {@link Logger logger} used by the rest bucket.
     */
    private _logger?: Logger;
    /**
     * The request queue.
     */
    private _queue: Array<{
        resolve: () => void
        promise: Promise<void>
    }> = [];

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a rest bucket.
     * @param token The bot's token.
     * @param manager The {@link Rest rest manager} the bucket is bound to.
     * @param id The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     */
    constructor (token: string, manager: Rest, id: RestBucketIdLike, bucketHash: RestBucketHashLike, majorParameter: RestMajorParameterLike, logger: Logger | false) {
        if (!(manager instanceof Rest)) throw new TypeError(`A rest manager must be specified`);
        if (typeof id !== `string`) throw new TypeError(`A bucket ID must be specified`);
        if (typeof bucketHash !== `string`) throw new TypeError(`A bucket hash must be specified`);
        if (typeof majorParameter !== `string`) throw new TypeError(`A major parameter must be specified`);
        if (!(logger instanceof Logger) && logger !== false) throw new TypeError(`A logger or false must be specified`);

        if (!manager.options.ratelimits) throw new Error(`The provided rest manager does not have ratelimits enabled`);

        this.manager = manager;
        this.id = id;
        this.bucketHash = bucketHash;
        this.majorParameter = majorParameter;
        if (logger) this._logger = logger;

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Rest[`_token`],
            writable: false
        });

        this._logger?.log(`Initialized rest bucket ${id} with hash ${bucketHash}`, {
            internal: true, level: `DEBUG`, system: `Rest Bucket`
        });
    }

    /**
     * If the bucket is currently making a request.
     */
    public get active (): boolean {
        return this._queue.length > 0;
    }

    /**
     * Get information on the bucket's current ratelimit restrictions.
     */
    public get ratelimited (): { local: boolean, global: boolean } {
        return {
            local: this.requestsLeft <= 0 && Date.now() < this.resetAt,
            global: this.manager.globalLeft! <= 0 && Date.now() < this.manager.globalResetAt!
        };
    }

    /**
     * Make a rest request with this bucket's ratelimits.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHashLike route hash}.
     * @param options Request options.
     * @returns Response data.
     */
    public async request (method: RestMethod, route: RestRouteLike, routeHash: RestRouteHashLike, options: RestInternalRequestOptions): Promise<any> {
        this._logger?.log(`${method} ${route} waiting for queue`, {
            internal: true, level: `DEBUG`, system: `Rest Bucket`
        });
        await this._waitForQueue();
        return await this._make(method, route, routeHash, options).finally(() => this._shiftQueue());
    }

    /**
     * Waits for the bucket to no longer be ratelimited.
     */
    private async _awaitRatelimit (): Promise<void> {
        if (!Object.values(this.ratelimited).some((r) => r)) return;
        const timeout = (this.ratelimited.global ? this.manager.globalResetAt ?? 0 : this.resetAt) + (this.manager.options.ratelimits !== false ? this.manager.options.ratelimits.pause : 0) - Date.now();
        await new Promise((resolve) => setTimeout(resolve, timeout));
        return await this._awaitRatelimit();
    }

    /**
     * Lowest level request function that handles active ratelimits, ratelimit headers, and makes the request with `undici`.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRouteLike route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHashLike route hash}.
     * @param options Request options.
     * @param attempt The current attempt value.
     * @returns Response data.
     */
    private async _make (method: RestMethod, route: RestRouteLike, routeHash: RestRouteHashLike, options: RestInternalRequestOptions, attempt = 0): Promise<any> {
        this._logger?.log(`${method} ${route} waiting for ratelimit`, {
            internal: true, level: `DEBUG`, system: `Rest Bucket`
        });
        await this._awaitRatelimit();

        if (!this.manager.globalResetAt || this.manager.globalResetAt < Date.now()) {
            this.manager.globalResetAt = Date.now() + 1000;
            this.manager.globalLeft = this.manager.options.ratelimits !== false ? this.manager.options.ratelimits.globalPerSecond : null;
        }
        this.manager.globalLeft!--;

        const res = await this.manager.make(method, route, options);

        const limit = Number(res.headers[DiscordConstants.REST_RATELIMIT_HEADERS.LIMIT] ?? Infinity);
        const remaining = Number(res.headers[DiscordConstants.REST_RATELIMIT_HEADERS.REMAINING] ?? 1);
        const resetAfter = Number(res.headers[DiscordConstants.REST_RATELIMIT_HEADERS.RESET_AFTER] ?? 0) * 1000;
        const bucket = res.headers[DiscordConstants.REST_RATELIMIT_HEADERS.BUCKET] as string | undefined;
        const global = res.headers[DiscordConstants.REST_RATELIMIT_HEADERS.GLOBAL] === `true`;
        const globalRetryAfter = Number(res.headers[DiscordConstants.REST_RATELIMIT_HEADERS.GLOBAL_RETRY_AFTER] ?? 0) * 1000;

        if (globalRetryAfter > 0 && global) {
            this.manager.globalLeft = 0;
            this.manager.globalResetAt = globalRetryAfter + Date.now();
        }

        if (bucket && bucket !== this.bucketHash) {
            this.manager.routeHashCache!.set(routeHash, bucket);
        }

        this.requestsLeft = remaining;
        this.resetAt = resetAfter + Date.now();
        this.allowedRequestsPerRatelimit = limit;

        if (res.statusCode === 429) return this._make(method, route, routeHash, options);
        else if (res.statusCode >= 500 && res.statusCode < 600) {
            if (attempt >= (options.code500retries ?? this.manager.options.code500retries)) throw new Error(`${method} ${route} rejected after ${this.manager.options.code500retries + 1} attempts (Request returned status code 5xx errors)`);
            else return this._make(method, route, routeHash, options, attempt + 1);
        } else return res.body;
    }

    /**
     * Shifts the queue.
     */
    private _shiftQueue (): void {
        const shift = this._queue.shift();
        if (shift) shift.resolve();
    }

    /**
     * Waits for the queue to be clear.
     */
    private _waitForQueue (): Promise<void> {
        const next = this._queue.length ? this._queue[this._queue.length - 1].promise : Promise.resolve();
        let resolve: () => void;
        const promise = new Promise<void>((r) => {
            resolve = r;
        });
        this._queue.push({
            resolve: resolve!,
            promise
        });
        return next;
    }
}
