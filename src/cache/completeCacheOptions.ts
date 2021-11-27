import { Cache, CacheOptions } from './Cache';
import { cacheEventHandler } from './CacheHandler';

/**
 * Completes specified options for the cache manager.
 * @param options Specified options for the manager.
 * @returns Complete options.
 */
export const completeCacheOptions = (options: CacheOptions): Cache[`options`] => ({
    cacheControl: options.cacheControl ?? {},
    cacheEventHandler: options.cacheEventHandler ?? cacheEventHandler
});
