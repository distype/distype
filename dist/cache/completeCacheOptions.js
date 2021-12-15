"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeCacheOptions = void 0;
const CacheHandler_1 = require("./CacheHandler");
/**
 * Completes specified options for the cache manager.
 * @param options Specified options for the manager.
 * @returns Complete options.
 */
const completeCacheOptions = (options) => ({
    cacheControl: options.cacheControl ?? {},
    cacheEventHandler: options.cacheEventHandler ?? CacheHandler_1.cacheEventHandler
});
exports.completeCacheOptions = completeCacheOptions;
