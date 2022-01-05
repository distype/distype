import { cacheEventHandler } from '../cache/CacheEventHandler';

/**
 * Default options.
 */
export const DefaultOptions = {
    CACHE: {
        cacheControl: {},
        cacheEventHandler
    },
    GATEWAY: {
        largeGuildThreshold: undefined,
        presence: undefined,
        sharding: {},
        spawnAttemptDelay: 2500,
        spawnMaxAttempts: 10,
        spawnTimeout: 30000,
        version: 9,
        wsOptions: undefined
    },
    REST: {
        code500retries: 2,
        ratelimits: {
            globalPerSecond: 50,
            pause: 10
        },
        version: 9
    }
} as const;
