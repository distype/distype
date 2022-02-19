"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityFunctions = void 0;
/**
 * Contains simple utility functions.
 * @internal
 */
class UtilityFunctions {
    /**
     * Get a guild's shard ID.
     * @param guildId The guild's ID.
     * @param numShards The `numShards` value sent in the identify payload.
     * @returns A shard ID.
     */
    static guildShard(guildId, numShards) {
        return Number((BigInt(guildId) >> 22n) % BigInt(numShards));
    }
    /**
     * Traverses through all elements and nested elements of an object.
     * @param obj The object to traverse.
     * @param callback A callback that fires for every element of the object.
     */
    static traverseObject(obj, callback) {
        callback(obj);
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === `object`)
                this.traverseObject(obj[key], callback);
        });
    }
    /**
     * Wait a specified number of milliseconds.
     * @param time The time to wait in milliseconds.
     */
    static async wait(time) {
        return await new Promise((resolve) => setTimeout(resolve, time));
    }
}
exports.UtilityFunctions = UtilityFunctions;
