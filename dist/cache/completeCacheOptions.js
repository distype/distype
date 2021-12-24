"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeCacheOptions = void 0;
const cacheEventHandler_1 = require("./cacheEventHandler");
/**
 * Completes specified options for the cache manager.
 * @param options Specified options for the manager.
 * @returns Complete options.
 */
const completeCacheOptions = (options) => ({
    cacheControl: options.cacheControl ?? {},
    cacheEventHandler: options.cacheEventHandler ?? cacheEventHandler_1.cacheEventHandler
});
exports.completeCacheOptions = completeCacheOptions;
