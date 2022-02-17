"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOptions = void 0;
const CacheEventHandler_1 = require("../cache/CacheEventHandler");
/**
 * Default options.
 * @internal
 */
exports.DefaultOptions = {
    CACHE: {
        cacheControl: {},
        cacheEventHandler: CacheEventHandler_1.cacheEventHandler
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
};
