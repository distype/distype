import { ClientOptions, optionsFactory } from './ClientOptions';

import { Cache } from '../cache/Cache';
import { Gateway } from '../gateway/Gateway';
import { Logger } from '../logger/Logger';
import { Rest } from '../rest/Rest';

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
     * The client's logger.
     */
    public logger?: Logger;
    /**
     * The client's {@link Rest rest manager}.
     */
    public rest: Rest;

    /**
     * {@link ClientOptions Options} for the client.
     * Note that these options may differ than the options specified when creating the client due to them being passed through the {@link optionsFactory}.
     */
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
    public readonly options: {
        cache: Cache[`options`]
        gateway: Gateway[`options`]
        logger: Logger[`options`] | false
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
     * @param options {@link ClientOptions Client options}.
     */
    constructor(token: string, options: ClientOptions = {}) {
        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Client[`_token`],
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(optionsFactory(options)) as Client[`options`],
            writable: false
        });

        // @ts-expect-error Property 'options' is used before being assigned.
        if (options.logger !== false) this.logger = new Logger(this.options.logger);
        // @ts-expect-error Property 'options' is used before being assigned.
        this.cache = new Cache(this.logger ?? false, this.options.cache);
        // @ts-expect-error Property 'options' is used before being assigned.
        this.rest = new Rest(token, this.logger ?? false, this.options.rest);
        // @ts-expect-error Property 'options' is used before being assigned.
        this.gateway = new Gateway(token, this.cache, this.logger ?? false, this.rest, this.options.gateway);

        this.logger?.log(`Initialized client`, {
            level: `DEBUG`, system: `Client`
        });
    }
}
