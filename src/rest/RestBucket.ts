import { DiscordConstants } from '../utils/DiscordConstants';
import { DistypeConstants } from '../utils/DistypeConstants';
import { Rest, RestBucketHashLike, RestBucketIdLike, RestData, RestMajorParameterLike, RestMethod, RestRouteHashLike, RestRouteLike } from './Rest';
import { RestRequestOptions } from './RestOptions';

import FormData from 'form-data';
import { request } from 'undici';
import { URL, URLSearchParams } from 'url';

/**
 * A rest bucket.
 * Used for ratelimiting requests.
 */
export class RestBucket {
    /**
     * The number of allowed requests per a ratelimit interval.
     */
    public allowedRequestsPerRatelimit = Infinity;
    /**
     * The rest manager the bucket is bound to.
     */
    public manager: Rest;
    /**
     * The unix millisecond timestamp from the last time the bucket was used to make a request.
     */
    public lastUsed: number = Date.now();
    /**
     * The current number of requests left.
     */
    public requestsLeft = 1;
    /**
     * A unix millisecond timestamp at which the ratelimit resets.
     */
    public resetAt = -1;

    /**
     * The bucket's unique hash string.
     */
    // @ts-expect-error Property 'bucketHash' has no initializer and is not definitely assigned in the constructor.
    public readonly bucketHash: RestBucketHashLike;
    /**
     * The bucket's ID.
     */
    // @ts-expect-error Property 'id' has no initializer and is not definitely assigned in the constructor.
    public readonly id: RestBucketIdLike;
    /**
     * The major parameter associated with the bucket.
     */
    // @ts-expect-error Property 'majorParameter' has no initializer and is not definitely assigned in the constructor.
    public readonly majorParameter: RestMajorParameterLike;

    /**
     * The request queue.
     */
    private queue: Array<{
        resolve: () => void
        promise: Promise<void>
    }> = [];

    /**
     * Create a rest bucket.
     * @param manager The rest manager the bucket is bound to.
     * @param id The bucket's ID.
     * @param bucketHash The bucket's unique hash string.
     * @param majorParameter The major parameter associated with the bucket.
     */
    constructor (manager: Rest, id: RestBucketIdLike, bucketHash: RestBucketHashLike, majorParameter: RestMajorParameterLike) {
        this.manager = manager;

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
    }

    /**
     * If the bucket is currently making a request.
     */
    public get active (): boolean {
        return this.queue.length > 0;
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
     * @param method The request's method.
     * @param route The requests's route, relative to the base Discord API URL. (Example: `/channels/:id`)
     * @param routeHash The request's route hash.
     * @param options Request options.
     * @returns Response data.
     */
    public async request (method: RestMethod, route: RestRouteLike, routeHash: RestRouteHashLike, options: RestRequestOptions & RestData): Promise<any> {
        this.lastUsed = Date.now();
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
     * @param method The request's method.
     * @param route The requests's route, relative to the base Discord API URL. (Example: `/channels/:id`)
     * @param routeHash The request's route hash.
     * @param options Request options.
     * @param attempt The current attempt value.
     * @returns Response data.
     */
    private async _make(method: RestMethod, route: RestRouteLike, routeHash: RestRouteHashLike, options: RestRequestOptions & RestData, attempt = 0): Promise<any> {
        await this._awaitRatelimit();

        if (!this.manager.globalResetAt || this.manager.globalResetAt < Date.now()) {
            this.manager.globalResetAt = Date.now() + 1000;
            this.manager.globalLeft = this.manager.options.ratelimits.globalPerSecond;
        }
        this.manager.globalLeft--;

        const usingFormData: boolean = options.body instanceof FormData;

        const headers: Record<string, string> = {
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
            limit: Number(r.headers[DiscordConstants.RATE_LIMIT_HEADERS.limit] ?? Infinity),
            remaining: Number(r.headers[DiscordConstants.RATE_LIMIT_HEADERS.remaining] ?? 1),
            reset: Number(r.headers[DiscordConstants.RATE_LIMIT_HEADERS.reset] ?? Date.now()) * 1000,
            resetAfter: Number(r.headers[DiscordConstants.RATE_LIMIT_HEADERS.resetAfter] ?? 0) * 1000,
            bucket: r.headers[DiscordConstants.RATE_LIMIT_HEADERS.bucket] as string | undefined,
            global: r.headers[DiscordConstants.RATE_LIMIT_HEADERS.global] === `true`,
            scope: r.headers[DiscordConstants.RATE_LIMIT_HEADERS.scope] as `global` | `shared` | `user` | undefined,
            retryAfter: Number(r.headers[`retry-after`] ?? 0) * 1000
        }));

        if (res.retryAfter > 0 && res.global) {
            this.manager.globalLeft = 0;
            this.manager.globalResetAt = res.retryAfter + Date.now();
        }

        if (res.bucket && res.bucket !== this.bucketHash) {
            this.manager.routeHashCache.set(routeHash, res.bucket);
        }

        this.requestsLeft = res.remaining;
        this.resetAt = res.reset;
        this.allowedRequestsPerRatelimit = res.limit;

        this.manager.responseCodeTally[res.statusCode] = (this.manager.responseCodeTally[res.statusCode] ?? 0) + 1;
        if (res.statusCode >= 200 && res.statusCode < 300) {
            this.lastUsed = Date.now();
            return res.body;
        } else if (res.statusCode === 429) {
            return this._make(method, route, routeHash, options);
        } else if (res.statusCode >= 400 && res.statusCode < 500 ) {
            throw new Error(res.body);
        } else if (res.statusCode >= 500 && res.statusCode < 600) {
            if (attempt === (options.code500retries ?? this.manager.options.code500retries) - 1) throw new Error(res.body);
            else return this._make(method, route, routeHash, options, attempt + 1);
        }
    }

    /**
     * Shifts the queue.
     */
    private _shiftQueue (): void {
        const shift = this.queue.shift();
        if (shift) shift.resolve();
    }

    /**
     * Waits for the queue to be clear.
     */
    private _waitForQueue (): Promise<void> {
        const next = this.queue.length ? this.queue[this.queue.length - 1].promise : Promise.resolve();
        let resolve: () => void;
        const promise = new Promise<void>((r) => {
            resolve = r;
        });
        this.queue.push({
            resolve: resolve!,
            promise
        });
        return next;
    }
}
