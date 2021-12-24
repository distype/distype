import { RestRequests } from './RestRequests';
import { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
/**
 * Data for a request.
 * Used by the `Rest#request()` method.
 */
export interface RestData {
    /**
     * The request body.
     */
    data?: Record<string, any> | FormData;
    /**
     * The request query.
     */
    params?: Record<string, any>;
    /**
     * The value for the X-Audit-Log-Reason header.
     */
    reason?: string;
}
/**
 * Rest request methods.
 */
export declare type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;
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
/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export declare class Rest extends RestRequests {
    /**
     * Options for the rest manager.
     */
    readonly options: RestOptions & {
        version: number;
    };
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options Rest options.
     */
    constructor(token: string, options?: RestOptions);
    request(method: RestMethod, route: string, options?: RestOptions & RestData): Promise<any>;
    private _make;
}
