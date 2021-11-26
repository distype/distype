import { CacheOptions } from '../cache/Cache';
import { GatewayOptions } from '../gateway/Gateway';
import { RestOptions } from '../rest/Rest';

import { EventEmitter } from '@jpbberry/typed-emitter';

/**
 * Options for the client.
 */
export interface ClientOptions {
    cache?: CacheOptions
    gateway?: GatewayOptions
    rest?: RestOptions
}

/**
 * The discord client.
 */
export class Client extends EventEmitter<{

}> {
    public readonly options: ClientOptions;

    constructor(token: string, options: ClientOptions = {}) {
        super();
        if (!token) throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });

        this.options = options;
    }
}
