import { request } from 'undici';
/**
 * {@link Rest} options.
 */
export interface RestOptions extends RestRequestOptions {
    code500retries: number;
    /**
     * Ratelimit options.
     * If `false`, internal ratelimits are disabled. **Only disable ratelimits if you are using a seperate application to manage ratelimits** (`customBaseURL` can be used to do so).
     */
    ratelimits: {
        /**
         * The amount of requests to allow to be sent per second.
         * Note that this only applies to a single {@link ClientWorker} instance (If {@link ClientMaster} / {@link ClientWorker} are being used), meaning that you still may encounter `429` errors from global ratelimits.
         */
        globalPerSecond: number;
        /**
         * The amount of time in milliseconds to wait between ratelimited requests in the same bucket.
         */
        pause: number;
        /**
         * An interval in milliseconds in which to sweep inactive buckets.
         * False disables sweeping buckets automatically.
         */
        sweepInterval: number | false;
    } | false;
    version: number;
}
/**
 * Options for rest requests.
 * Extends undici request options.
 * @see [Undici Documentation](https://undici.nodejs.org/#/?id=undicirequesturl-options-promise)
 */
export interface RestRequestOptions extends Omit<NonNullable<Parameters<typeof request>[1]>, `body` | `bodyTimeout` | `method`> {
    /**
     * The amount of times to retry a request if it returns code `500`.
     */
    code500retries?: number;
    /**
     * A custom base URL to make requests to.
     * Useful for making requests through, for example, a proxy / multi-application ratelimiter.
     * Example: `https://api.example.com/discord`
     * Make sure this URL does **not** end with a `/`.
     */
    customBaseURL?: string;
    /**
     * If thrown errors should be in a more user friendly format.
     * Useful if you report thrown errors directly to users; the full error will still be reported on the logger.
     */
    friendlyErrors?: boolean;
    /**
     * The amount of time in milliseconds to wait before considering a request timed out.
     * Defaults to [undici's](https://undici.nodejs.org) `bodyTimeout` from [DispatchOptions](https://undici.nodejs.org/#/docs/api/Dispatcher?id=parameter-dispatchoptions).
     */
    timeout?: number;
    /**
     * The Discord API version to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-versioning-api-versions)
     */
    version?: number;
}
