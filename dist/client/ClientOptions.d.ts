import { CacheOptions } from '../cache/CacheOptions';
import { GatewayOptions } from '../gateway/GatewayOptions';
import { RestOptions, RestRequestOptions } from '../rest/RestOptions';
/**
 * Options for the {@link Client client}.
 */
export interface ClientOptions {
    /**
     * {@link CacheOptions Options} for the {@link Cache cache manager}.
     */
    cache?: CacheOptions;
    /**
     * {@link GatewayOptions Options} for the {@link Gateway gateway manager}.
     */
    gateway?: GatewayOptions;
    /**
     * {@link RestOptions Options} for the {@link Rest rest manager}.
     */
    rest?: RestOptions & RestRequestOptions;
}
