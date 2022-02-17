import { ClientOptions } from './ClientOptions';
import { Cache } from '../cache/Cache';
import { Gateway } from '../gateway/Gateway';
import { Logger } from '../logger/Logger';
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
     * The client's logger.
     */
    logger: Logger;
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
     * Note that these options may differ than the options specified when creating the client due to them being passed through the {@link optionsFactory}.
     */
    readonly options: {
        cache: Cache[`options`];
        gateway: Gateway[`options`];
        logger: Logger[`options`];
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
