import { RestOptions } from './RestOptions';
import { RestRequestOptions, RestRequests } from './RestRequests';
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
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
export declare class Rest extends RestRequests {
    /**
     * Options for the rest manager.
     */
    readonly options: RestOptions;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options Rest options.
     */
    constructor(token: string, options: RestOptions);
    request(method: RestMethod, route: string, options?: RestRequestOptions & RestData): Promise<any>;
    private _make;
}
