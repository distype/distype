import { BoogcordConstants } from '../utils/BoogcordConstants';
import { completeRestOptions } from './completeRestOptions';
import { DiscordConstants } from '../utils/DiscordConstants';
import { RestRequests } from './RestRequests';

import request, { AxiosResponse, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';

/**
 * Data for a request.
 * Used by the `Rest#request()` method.
 */
export interface RestData {
    /**
     * The request body.
     */
    data?: Record<string, any> | FormData
    /**
     * The request query.
     */
    params?: Record<string, any>
    /**
     * The value for the X-Audit-Log-Reason header.
     */
    reason?: string
}

/**
 * Rest request methods.
 */
export type RestMethod = `GET` | `POST` | `DELETE` | `PATCH` | `PUT`;

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
    version?: number
}

/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export class Rest extends RestRequests {
    /**
     * Options for the rest manager.
     */
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
    public readonly options: RestOptions & { version: number };

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options Rest options.
     */
    constructor(token: string, options: RestOptions = {}) {
        super();

        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Rest[`_token`],
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(completeRestOptions(options)) as Rest[`options`],
            writable: false
        });
    }

    public async request(method: RestMethod, route: string, options?: RestOptions & RestData): Promise<any> {
        return (await this._make(method, route, options)).data;
    }

    private async _make(method: RestMethod, route: string, options: RestOptions & RestData = {}): Promise<AxiosResponse> {
        const usingFormData: boolean = options.data instanceof FormData;

        const headers: Record<string, string> = {
            ...options.headers,
            ...(usingFormData ? options.data?.getHeaders() : undefined),
            'Authorization': `Bot ${this._token}`,
            'User-Agent': `DiscordBot (${BoogcordConstants.URL}, v${BoogcordConstants.VERSION})`
        };

        if (!usingFormData && options.data) headers[`Content-Type`] = `application/json`;
        if (options.reason) headers[`X-Audit-Log-Reason`] = options.reason;

        return await request({
            ...this.options,
            ...options,
            data: usingFormData ? options.data : options.data,
            baseURL: `${DiscordConstants.BASE_URL}/v${options.version ?? this.options.version}`,
            url: route,
            method,
            headers
        });
    }
}
