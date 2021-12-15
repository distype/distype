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
    readonly cache: Cache;
    /**
     * The client's gateway manager.
     */
    readonly gateway: Gateway;
    /**
     * The client's rest manager.
     */
    readonly rest: Rest;
    /**
     * The bot's token.
     */
    readonly token: string;
    /**
     * Create a client.
     * @param token The bot's token.
     * @param options Client options.
     */
    constructor(token: string, options?: ClientOptions);
}
