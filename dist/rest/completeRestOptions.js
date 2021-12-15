"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeRestOptions = void 0;
/**
 * Completes specified options for the rest manager.
 * @param options Specified options for the manager.
 * @returns Complete options.
 */
const completeRestOptions = (options) => ({
    version: 9,
    ...options
});
exports.completeRestOptions = completeRestOptions;
