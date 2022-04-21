import { Rest, RestMethod, RestRequestData, RestRoute } from './Rest';

import { DiscordConstants } from '../constants/DiscordConstants';
import { LogCallback } from '../types/Log';

import { wait } from '@br88c/node-utils';
import { Snowflake } from 'discord-api-types/v10';
import { DistypeError, DistypeErrorType } from '../errors/DistypeError';


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
 * A major {@link Rest rest} ratelimit parameter.
 * @internal
 */
export type RestMajorParameter = `global` | Snowflake;

/**
 * A {@link RestRoute rest route} hash.
 */
export type RestRouteHash = `${RestMethod};${RestMajorParameter}`;

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
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    public readonly system = `Rest Bucket`;

    /**
     * The {@link LogCallback log callback} used by the rest bucket.
     */
    private _log: LogCallback;
    /**
     * The request queue.
     */
    private _queue: Array<{
        resolve: () => void
        promise: Promise<void>
    }> = [];

    /**
     * Create a rest bucket.
     * @param id The bucket's {@link RestBucketId ID}.
     * @param bucketHash The bucket's unique {@link RestBucketHash hash}.
     * @param majorParameter The {@link RestMajorParameter major parameter} associated with the bucket.
     * @param manager The {@link Rest rest manager} the bucket is bound to.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the rest manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor (id: RestBucketId, bucketHash: RestBucketHash, majorParameter: RestMajorParameter, manager: Rest, logCallback: LogCallback = (): void => {}, logThisArg?: any) {
        if (typeof id !== `string`) throw new TypeError(`Parameter "id" (string) not provided: got ${id} (${typeof id})`);
        if (typeof bucketHash !== `string`) throw new TypeError(`Parameter "bucketHash" (string) not provided: got ${bucketHash} (${typeof bucketHash})`);
        if (typeof majorParameter !== `string`) throw new TypeError(`Parameter "majorParameter" (string) not provided: got ${majorParameter} (${typeof majorParameter})`);
        if (!(manager instanceof Rest)) throw new TypeError(`Parameter "manager" (Rest) not provided: got ${manager} (${typeof manager})`);
        if (typeof logCallback !== `function`) throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);

        this.id = id;
        this.bucketHash = bucketHash;
        this.majorParameter = majorParameter;
        this.manager = manager;

        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized rest bucket ${id} with hash ${bucketHash}`, {
            level: `DEBUG`, system: this.system
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
    public get ratelimited (): { local: boolean, global: boolean, any: boolean } {
        const ratelimits = {
            local: this.requestsLeft <= 0 && Date.now() < this.resetAt,
            global: this.manager.globalLeft! <= 0 && Date.now() < this.manager.globalResetAt!
        };

        return {
            ...ratelimits,
            any: Object.values(ratelimits).some((r) => r)
        };
    }

    /**
     * Make a rest request with this bucket's ratelimits.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHash route hash}.
     * @param options Request options.
     * @returns Response data.
     */
    public async request (method: RestMethod, route: RestRoute, routeHash: RestRouteHash, options: RestRequestData): Promise<any> {
        if (this._queue.length) await this._waitForQueue();

        return await this._make(method, route, routeHash, options).finally(() => this._shiftQueue());
    }

    /**
     * Waits for the bucket to no longer be ratelimited.
     */
    private async _awaitRatelimit (): Promise<void> {
        if (!this.ratelimited.any) return;
        const timeout = (this.ratelimited.global ? this.manager.globalResetAt ?? 0 : this.resetAt) + this.manager.options.ratelimitPause - Date.now();
        await wait(timeout);
        return await this._awaitRatelimit();
    }

    /**
     * Lowest level request function that handles active ratelimits, ratelimit headers, and makes the request with `undici`.
     * @param method The request's {@link RestMethod method}.
     * @param route The requests's {@link RestRoute route}, relative to the base Discord API URL. (Example: `/channels/123456789000000000`)
     * @param routeHash The request's {@link RestRouteHash route hash}.
     * @param options Request options.
     * @param attempt The current attempt value.
     * @returns Response data.
     */
    private async _make (method: RestMethod, route: RestRoute, routeHash: RestRouteHash, options: RestRequestData, attempt = 0): Promise<any> {
        if (this.ratelimited.any) await this._awaitRatelimit();

        if (!this.manager.globalResetAt || this.manager.globalResetAt < Date.now()) {
            this.manager.globalResetAt = Date.now() + 1000;
            this.manager.globalLeft = this.manager.options.ratelimitGlobal;
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
            if (attempt >= this.manager.options.code500retries) throw new DistypeError(`${method} ${route} rejected after ${this.manager.options.code500retries + 1} attempts (Request returned status code 5xx errors)`, DistypeErrorType.REST_REQUEST_ERROR, this.system);
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
