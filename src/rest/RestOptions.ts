import { request } from 'undici';

/**
 * {@link Rest} options.
 */
export interface RestOptions {
    /**
     * An interval in milliseconds in which to sweep inactive buckets.
     * False disables sweeping buckets automatically.
     * @default 300000
     */
    bucketSweepInterval?: number | false
    /**
     * The amount of times to retry a request if it returns code `500`.
     * @default 3
     */
    code500retries?: number
    /**
     * If `true`, internal rate limits are disabled. **Only disable rate limits if you are using a separate application to manage rate limits (`customBaseURL` can be used to do so), or know exactly what you are doing**.
     * @default false
     */
    disableRatelimits?: boolean
    /**
     * The amount of requests to allow to be sent per second.
     * @default 50
     */
    ratelimitGlobal?: number
    /**
     * The amount of time in milliseconds to wait between rate limited requests in the same bucket.
     * @default 10
     */
    ratelimitPause?: number
    /**
     * The Discord API version to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-versioning-api-versions)
     * @default 10
     */
    version?: number
}

/**
 * Options for rest requests.
 * Extends undici request options.
 * @see [Undici Documentation](https://undici.nodejs.org/#/?id=undicirequesturl-options-promise)
 */
export interface RestRequestOptions extends Omit<NonNullable<Parameters<typeof request>[1]>, `body` | `method` | `query`> {
    /**
     * A custom string to use as the authorization header.
     */
    authHeader?: string
    /**
     * A custom base URL to make requests to.
     * Useful for making requests through, for example, a proxy / multi-application rate limiter.
     * Example: `https://api.example.com/discord`
     * Make sure this URL does **not** end with a `/`.
     * Note that the rest manager will also omit the API version from the route (`.../v10/...`).
     */
    customBaseURL?: string
    /**
     * If only the specified headers should be included (including authHeader).
     */
    forceHeaders?: boolean
    /**
     * Request headers.
     * Overwrite hierarchy; default headers overwritten by manager, manager headers overwritten by request options.
     * The `X-Audit-Log-Reason` header is overwritten by the `reason` option.
     */
    headers?: Record<string, string> | null
}
