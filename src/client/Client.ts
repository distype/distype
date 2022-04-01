import { ClientOptions } from './ClientOptions';

import { Cache } from '../cache/Cache';
import { DistypeConstants } from '../constants/DistypeConstants';
import { Gateway } from '../gateway/Gateway';
import { Rest } from '../rest/Rest';
import { LogCallback } from '../types/Log';

/**
 * The Discord client.
 */
export class Client {
    /**
     * The client's {@link Cache cache}.
     */
    public cache: Cache;
    /**
     * The client's {@link Gateway gateway manager}.
     */
    public gateway: Gateway;
    /**
     * The client's {@link Rest rest manager}.
     */
    public rest: Rest;

    /**
     * The version of [Distype](https://github.com/distype/distype) being used.
     */
    public readonly DISTYPE_VERSION: string = DistypeConstants.VERSION;
    /**
     * {@link ClientOptions Options} for the client.
     * Note that any options not specified are set to a default value.
     */
    public readonly options: {
        cache: Cache[`options`]
        gateway: Gateway[`options`]
        rest: Rest[`options`]
    };

    /**
     * The {@link LogCallback log callback} used by the client.
     */
    private _log: LogCallback;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a client.
     * @param token The bot's token.
     * @param options {@link ClientOptions Client options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally throughout the client.
     */
    constructor (token: string, options: ClientOptions = {}, logCallback: LogCallback = (): void => {}) {
        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Client[`_token`],
            writable: false
        });

        this.cache = new Cache(options.cache, logCallback);
        this.rest = new Rest(token, options.rest, logCallback);
        this.gateway = new Gateway(token, this.rest, this.cache, options.gateway, logCallback);

        this.options = {
            cache: this.cache.options,
            gateway: this.gateway.options,
            rest: this.rest.options
        };

        this._log = logCallback;
        this._log(`Initialized client`, {
            level: `DEBUG`, system: `Client`
        });
    }
}
