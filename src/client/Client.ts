import { Cache, CacheOptions } from '../cache/Cache';
import { Gateway, GatewayOptions } from '../gateway/Gateway';
import { Rest, RestOptions } from '../rest/Rest';

/**
 * Options for the client.
 */
export interface ClientOptions {
    cache?: CacheOptions
    gateway?: GatewayOptions
    rest?: RestOptions
}

/**
 * The Discord client.
 */
export class Client {
    /**
     * The client's cache.
     */
    public cache: Cache;
    /**
     * The client's gateway manager.
     */
    public gateway: Gateway;
    /**
     * The client's rest manager.
     */
    public rest: Rest;

    /**
     * Options for the client.
     */
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
    public readonly options: {
        cache: Cache[`options`]
        gateway: Gateway[`options`]
        rest: Rest[`options`]
    };

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a client.
     * @param token The bot's token.
     * @param options Client options.
     */
    constructor(token: string, options: ClientOptions = {}) {
        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);
        
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Client[`_token`],
            writable: false
        });

        this.cache = new Cache(options.cache);
        this.rest = new Rest(token, options.rest);
        this.gateway = new Gateway(token, this.cache, this.rest, options.gateway);

        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze({
                cache: this.cache.options,
                gateway: this.gateway.options,
                rest: this.rest.options
            }) as Client[`options`],
            writable: false
        });
    }
}
