import { cacheEventHandler } from '../cache/CacheEventHandler';

/**
 * Default options.
 * @internal
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
        version: 10,
        wsOptions: undefined
    },
    LOGGER: {
        disableInternal: false,
        enabledOutput: {},
        format: {},
        showTime: true
    },
    REST: {
        code500retries: 2,
        ratelimits: {
            globalPerSecond: 50,
            pause: 10,
            sweepInterval: 300000
        },
        version: 10
    }
} as const;
