import { ClientOptions } from './ClientOptions';
import { Cache } from '../cache/Cache';
import { Gateway } from '../gateway/Gateway';
import { Rest } from '../rest/Rest';
import { LogCallback } from '../types/Log';
/**
 * The Discord client.
 */
export declare class Client {
    /**
     * The client's {@link Cache cache}.
     */
    cache: Cache;
    /**
     * The client's {@link Gateway gateway manager}.
     */
    gateway: Gateway;
    /**
     * The client's {@link Rest rest manager}.
     */
    rest: Rest;
    /**
     * The version of [Distype](https://github.com/distype/distype) being used.
     */
    readonly DISTYPE_VERSION: string;
    /**
     * {@link ClientOptions Options} for the client.
     * Note that any options not specified are set to a default value.
     */
    readonly options: {
        cache: Cache[`options`];
        gateway: Gateway[`options`];
        rest: Rest[`options`];
    };
    /**
     * The {@link LogCallback log callback} used by the client.
     */
    private _log;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a client.
     * @param token The bot's token.
     * @param options {@link ClientOptions Client options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally throughout the client.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token: string, options?: ClientOptions, logCallback?: LogCallback, logThisArg?: any);
}
