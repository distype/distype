import { Cache } from './Cache';
import { GatewayEvents } from '../gateway/Gateway';
/**
 * The built in cache event handler function.
 * @param cache The {@link Cache cache} to update.
 * @param data A {@link GatewayEvents dispatched payload} to handle.
 * @internal
 */
export declare const cacheEventHandler: (cache: Cache, data: GatewayEvents[`*`]) => void;
