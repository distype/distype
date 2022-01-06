import { Cache } from '../cache/Cache';
import { ClientOptions } from './ClientOptions';
import { Gateway } from '../gateway/Gateway';
import { Rest } from '../rest/Rest';
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
     * {@link ClientOptions Options} for the client.
     * Note that these options may differ than the options specified when creating the client due to them being passed through the {@link optionsFactory}.
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
     * @param options {@link ClientOptions Client options}.
     */
    constructor(token: string, options?: ClientOptions);
}
