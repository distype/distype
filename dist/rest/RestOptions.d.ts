import { AxiosRequestConfig } from 'axios';
/**
 * Options for the rest manager and premade request methods.
 * Extends axios request configuration.
 * @see [Axios Documentation](https://axios-http.com/docs/req_config)
 */
export interface RestOptions extends Omit<AxiosRequestConfig, `auth` | `baseURL` | `data` | `method` | `params` | `responseType` | `signal` | `transitional` | `url`> {
    /**
     * The API version to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-versioning-api-versions)
     * @default 9
     */
    version?: number;
}
