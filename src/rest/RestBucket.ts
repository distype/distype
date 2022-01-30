import { Rest, RestBucketHashLike, RestBucketIdLike, RestRequestData, RestMajorParameterLike, RestMethod, RestRouteHashLike, RestRouteLike } from './Rest';
import { RestRequestOptions } from './RestOptions';

import { DiscordConstants } from '../constants/DiscordConstants';
import { DistypeConstants } from '../constants/DistypeConstants';
import { Logger } from '../logger/Logger';

import FormData from 'form-data';
import { request } from 'undici';
import { URL, URLSearchParams } from 'url';

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
    // @ts-expect-error Property 'bucketHash' has no initializer and is not definitely assigned in the constructor.
    public readonly bucketHash: RestBucketHashLike;
    /**
     * The bucket's {@link RestBucketIdLike ID}.
     */
    // @ts-expect-error Property 'id' has no initializer and is not definitely assigned in the constructor.
    public readonly id: RestBucketIdLike;
    /**
     * The {@link RestMajorParameterLike major parameter} associated with the bucket.
     */
    // @ts-expect-error Property 'majorParameter' has no initializer and is not definitely assigned in the constructor.
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
     * Create a rest bucket.
     * @param manager The {@link Rest rest manager} the bucket is bound to.
     * @param id The bucket's {@link RestBucketIdLike ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHashLike hash}.
     * @param majorParameter The {@link RestMajorParameterLike major parameter} associated with the bucket.
     */
    constructor (manager: Rest, id: RestBucketIdLike, bucketHash: RestBucketHashLike, majorParameter: RestMajorParameterLike, logger: Logger | false) {
        if (!(manager instanceof Rest)) throw new TypeError(`A rest manager must be specified`);
        if (typeof id !== `string`) throw new TypeError(`A bucket ID must be specified`);
        if (typeof bucketHash !== `string`) throw new TypeError(`A bucket hash must be specified`);
        if (typeof majorParameter !== `string`) throw new TypeError(`A major parameter must be specified`);
        if (!(logger instanceof Logger) && logger !== false) throw new TypeError(`A logger or false must be specified`);

        Object.defineProperty(this, `bucketHash`, {
            configurable: false,
            enumerable: true,
            value: bucketHash as RestBucket[`bucketHash`],
            writable: false
        });
        Object.defineProperty(this, `id`, {
            configurable: false,
            enumerable: true,
            value: id as RestBucket[`id`],
            writable: false
        });
        Object.defineProperty(this, `majorParameter`, {
            configurable: false,
            enumerable: true,
            value: majorParameter as RestBucket[`majorParameter`],
            writable: false
        });

        this.manager = manager;
        if (logger) this._logger = logger;

        this._logger?.log(`Initialized rest bucket ${id} with hash ${bucketHash}`, {
            level: `DEBUG`, system: `Rest`
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
            global: this.manager.globalLeft <= 0 && Date.now() < this.manager.globalResetAt
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
    public async request (method: RestMethod, route: RestRouteLike, routeHash: RestRouteHashLike, options: RestRequestOptions & RestRequestData): Promise<any> {
        this._logger?.log(`Waiting for queue: request ${method} ${route}`, {
            level: `DEBUG`, system: `Rest`
        });
        await this._waitForQueue();
        return await this._make(method, route, routeHash, options).finally(() => this._shiftQueue());
    }

    /**
     * Waits for the bucket to no longer be rate limited.
     */
    private async _awaitRatelimit (): Promise<void> {
        if (!Object.values(this.ratelimited).some((r) => r)) return;
        const timeout = (this.ratelimited.global ? this.manager.globalResetAt : this.resetAt) + this.manager.options.ratelimits.pause - Date.now();
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
    private async _make(method: RestMethod, route: RestRouteLike, routeHash: RestRouteHashLike, options: RestRequestOptions & RestRequestData, attempt = 0): Promise<any> {
        this._logger?.log(`Waiting for ratelimit: request ${method} ${route}`, {
            level: `DEBUG`, system: `Rest`
        });
        await this._awaitRatelimit();

        this._logger?.log(`Making request ${method} ${route}`, {
            level: `DEBUG`, system: `Rest`
        });
        if (!this.manager.globalResetAt || this.manager.globalResetAt < Date.now()) {
            this.manager.globalResetAt = Date.now() + 1000;
            this.manager.globalLeft = this.manager.options.ratelimits.globalPerSecond;
        }
        this.manager.globalLeft--;

        const usingFormData: boolean = options.body instanceof FormData;

        const headers: Record<string, string> = {
            ...this.manager.options.headers,
            ...options.headers,
            ...(usingFormData ? options.body!.getHeaders() : undefined),
            // @ts-expect-error Property '_token' is private and only accessible within class 'Rest'.
            'Authorization': `Bot ${this.manager._token}`,
            'User-Agent': `DiscordBot (${DistypeConstants.URL}, v${DistypeConstants.VERSION})`
        };

        if (!usingFormData && options.body) headers[`Content-Type`] = `application/json`;
        if (options.reason) headers[`X-Audit-Log-Reason`] = options.reason;

        const url = new URL(`${DiscordConstants.BASE_URL}/v${options.version ?? this.manager.options.version}${route}`);
        url.search = new URLSearchParams(options.query).toString();

        const req = request(url, {
            ...this.manager.options,
            ...options,
            method,
            headers,
            body: usingFormData ? undefined : JSON.stringify(options.body),
            bodyTimeout: options.timeout ?? this.manager.options.timeout
        });

        if (usingFormData) options.body!.pipe(req);

        const res = await req.then(async (r) => ({
            ...r,
            body: await r.body.json(),
            limit: Number(r.headers[DiscordConstants.RATE_LIMIT_HEADERS.LIMIT] ?? Infinity),
            remaining: Number(r.headers[DiscordConstants.RATE_LIMIT_HEADERS.REMAINING] ?? 1),
            reset: Number(r.headers[DiscordConstants.RATE_LIMIT_HEADERS.RESET] ?? Date.now()) * 1000,
            resetAfter: Number(r.headers[DiscordConstants.RATE_LIMIT_HEADERS.RESET_AFTER] ?? 0) * 1000,
            bucket: r.headers[DiscordConstants.RATE_LIMIT_HEADERS.BUCKET] as string | undefined,
            global: r.headers[DiscordConstants.RATE_LIMIT_HEADERS.GLOBAL] === `true`,
            globalRetryAfter: Number(r.headers[DiscordConstants.RATE_LIMIT_HEADERS.GLOBAL_RETRY_AFTER] ?? 0) * 1000,
            scope: r.headers[DiscordConstants.RATE_LIMIT_HEADERS.SCOPE] as `global` | `shared` | `user` | undefined
        }));

        this._logger?.log(`Made request ${method} ${route}`, {
            level: `DEBUG`, system: `Rest`
        });

        if (res.globalRetryAfter > 0 && res.global) {
            this.manager.globalLeft = 0;
            this.manager.globalResetAt = res.globalRetryAfter + Date.now();
        }

        if (res.bucket && res.bucket !== this.bucketHash) {
            this.manager.routeHashCache.set(routeHash, res.bucket);
        }

        this.requestsLeft = res.remaining;
        this.resetAt = res.resetAfter + Date.now();
        this.allowedRequestsPerRatelimit = res.limit;

        this.manager.responseCodeTally[res.statusCode] = (this.manager.responseCodeTally[res.statusCode] ?? 0) + 1;
        if (res.statusCode >= 200 && res.statusCode < 300) {
            this._logger?.log(`Success: request ${method} ${route}`, {
                level: `DEBUG`, system: `Rest`
            });
            return res.body;
        } else if (res.statusCode === 429) {
            this._logger?.log(`429 Ratelimited: request ${method} ${route}`, {
                level: `DEBUG`, system: `Rest`
            });
            return this._make(method, route, routeHash, options);
        } else if (res.statusCode >= 400 && res.statusCode < 500 ) {
            this._logger?.log(`4xx Error: request ${method} ${route}`, {
                level: `DEBUG`, system: `Rest`
            });
            throw new Error(res.body);
        } else if (res.statusCode >= 500 && res.statusCode < 600) {
            this._logger?.log(`5xx Error: request ${method} ${route}`, {
                level: `DEBUG`, system: `Rest`
            });
            if (attempt === (options.code500retries ?? this.manager.options.code500retries) - 1) throw new Error(res.body);
            else return this._make(method, route, routeHash, options, attempt + 1);
        }
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
