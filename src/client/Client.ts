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
    public readonly cache: Cache;
    /**
     * The client's gateway manager.
     */
    public readonly gateway: Gateway;
    /**
     * The client's rest manager.
     */
    public readonly rest: Rest;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property 'token' has no initializer and is not definitely assigned in the constructor.
    public readonly token: string;

    /**
     * Create a client.
     * @param token The bot's token.
     * @param options Client options.
     */
    constructor(token: string, options: ClientOptions = {}) {
        if (!token) throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });

        this.cache = new Cache(options.cache);
        this.rest = new Rest(token, options.rest);
        this.gateway = new Gateway(token, this.cache, this.rest, options.gateway);
    }
}
