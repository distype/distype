import { Cache, CacheOptions } from '../cache/Cache';
import { Gateway, GatewayOptions } from '../gateway/Gateway';
import { Rest, RestOptions } from '../rest/Rest';
/**
 * Options for the client.
 */
export interface ClientOptions {
    cache?: CacheOptions;
    gateway?: GatewayOptions;
    rest?: RestOptions;
}
/**
 * The Discord client.
 */
export declare class Client {
    /**
     * The client's cache.
     */
    cache: Cache;
    /**
     * The client's gateway manager.
     */
    gateway: Gateway;
    /**
     * The client's rest manager.
     */
    rest: Rest;
    /**
     * Options for the client.
     */
    readonly options: {
        cache: Cache[`options`];
        gateway: Gateway[`options`];
        rest: Rest[`options`];
    };
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a client.
     * @param token The bot's token.
     * @param options Client options.
     */
    constructor(token: string, options?: ClientOptions);
}
