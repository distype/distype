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
    bucketSweepInterval?: number | false;
    /**
     * The amount of times to retry a request if it returns code `500`.
     * @default 3
     */
    code500retries?: number;
    /**
     * If `true`, internal ratelimits are disabled. **Only disable ratelimits if you are using a seperate application to manage ratelimits (`customBaseURL` can be used to do so), or know exactly what you are doing**.
     * @default false
     */
    disableRatelimits?: boolean;
    /**
     * The amount of requests to allow to be sent per second.
     * Note that this only applies to a single {@link ClientWorker} instance (If {@link ClientMaster} / {@link ClientWorker} are being used), meaning that you still may encounter `429` errors from global ratelimits.
     * @default 50
     */
    ratelimitGlobal?: number;
    /**
     * The amount of time in milliseconds to wait between ratelimited requests in the same bucket.
     * @default 10
     */
    ratelimitPause?: number;
    /**
     * The Discord API version to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-versioning-api-versions)
     * @default 10
     */
    version?: number;
}
/**
 * Options for rest requests.
 * Extends undici request options.
 * @see [Undici Documentation](https://undici.nodejs.org/#/?id=undicirequesturl-options-promise)
 */
export interface RestRequestOptions extends Omit<NonNullable<Parameters<typeof request>[1]>, `body` | `bodyTimeout` | `method`> {
    /**
     * A custom string to use as the authorization header.
     */
    authHeader?: string;
    /**
     * A custom base URL to make requests to.
     * Useful for making requests through, for example, a proxy / multi-application ratelimiter.
     * Example: `https://api.example.com/discord`
     * Make sure this URL does **not** end with a `/`.
     * Note that the rest manager will also omit the API version from the route (`.../v10/...`).
     */
    customBaseURL?: string;
    /**
     * The amount of time in milliseconds to wait before considering a request timed out.
     * Defaults to [undici's](https://undici.nodejs.org) `bodyTimeout` from [DispatchOptions](https://undici.nodejs.org/#/docs/api/Dispatcher?id=parameter-dispatchoptions).
     */
    timeout?: number;
}
