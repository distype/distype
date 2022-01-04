import { AxiosRequestConfig } from 'axios';

/**
 * Rest options.
 */
export interface RestOptions extends RestRequestOptions {
    code500retries: number
    ratelimits: {
        offset: number
        globalPerSecond: number
        reject: boolean
    }
    timeout: number
    version: number
}

/**
 * Options for rest requests.
 * Extends axios request configuration.
 * @see [Axios Documentation](https://axios-http.com/docs/req_config)
 */
export interface RestRequestOptions extends Omit<AxiosRequestConfig, `auth` | `baseURL` | `data` | `method` | `params` | `responseType` | `signal` | `transitional` | `url`> {
    /**
     * The API version to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-versioning-api-versions)
     * @default 9
     */
    version?: number
}
