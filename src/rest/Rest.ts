import { DiscordConstants } from '../utils/DiscordConstants';
import { DistypeConstants } from '../utils/DistypeConstants';
import { RestOptions, RestRequestOptions } from './RestOptions';
import { RestRequests } from './RestRequests';

import { Dispatcher, request } from 'undici';
import FormData from 'form-data';
import { URL, URLSearchParams } from 'url';

/**
 * Data for a request.
 * Used by the `Rest#request()` method.
 */
export interface RestData {
    /**
     * The request body.
     */
    body?: Record<string, any> | FormData
    /**
     * The request query.
     */
    params?: Record<string, any>
    /**
     * The request query.
     */
    query?: Record<string, any>
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
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export class Rest extends RestRequests {
    /**
     * Options for the rest manager.
     */
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
    public readonly options: RestOptions;

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
    constructor(token: string, options: RestOptions) {
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
            value: Object.freeze(options) as Rest[`options`],
            writable: false
        });
    }

    public async request(method: RestMethod, route: string, options?: RestRequestOptions & RestData): Promise<any> {
        return await (await this._make(method, route, options)).body;
    }

    private async _make(method: RestMethod, route: string, options: RestRequestOptions & RestData = {}): Promise<Dispatcher.ResponseData & { body: any }> {
        const usingFormData: boolean = options.body instanceof FormData;

        const headers: Record<string, string> = {
            ...options.headers,
            ...(usingFormData ? options.body!.getHeaders() : undefined),
            'Authorization': `Bot ${this._token}`,
            'User-Agent': `DiscordBot (${DistypeConstants.URL}, v${DistypeConstants.VERSION})`
        };

        if (!usingFormData && options.body) headers[`Content-Type`] = `application/json`;
        if (options.reason) headers[`X-Audit-Log-Reason`] = options.reason;

        const url = new URL(`${DiscordConstants.BASE_URL}/v${options.version ?? this.options.version}${route.at(0) === `/` ? `` : `/`}${route}`);
        url.search = new URLSearchParams(options.query).toString();

        const req = request(url, {
            ...this.options,
            ...options,
            method,
            headers,
            body: usingFormData ? undefined : JSON.stringify(options.body),
            bodyTimeout: options.timeout ?? this.options.timeout
        });

        if (usingFormData) options.body!.pipe(req);

        const res = await req;
        return {
            ...res,
            body: await res.body.json()
        };
    }
}
