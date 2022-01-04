"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOptions = void 0;
const CacheEventHandler_1 = require("../cache/CacheEventHandler");
/**
 * Default options.
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
        version: 9,
        wsOptions: undefined
    },
    REST: { version: 9 }
};
