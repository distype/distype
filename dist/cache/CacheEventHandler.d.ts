import { Cache } from './Cache';
import { GatewayEvents } from '../gateway/Gateway';
/**
 * A function that handles gateway events to update the cache.
 */
export declare type CacheEventHandler = typeof cacheEventHandler;
/**
 * The built in cache event handler function.
 * @param cache The cache to update.
 * @param data A dispatched payload to handle.
 * @internal
 */
export declare const cacheEventHandler: (cache: Cache, data: GatewayEvents[`*`]) => void;
