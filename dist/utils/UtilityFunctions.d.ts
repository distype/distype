import { Snowflake } from 'discord-api-types/v10';
/**
 * Contains simple utility functions.
 * @internal
 */
export declare class UtilityFunctions {
    /**
     * Get a guild's shard ID.
     * @param guildId The guild's ID.
     * @param numShards The `numShards` value sent in the identify payload.
     * @returns A shard ID.
     */
    static guildShard(guildId: Snowflake, numShards: number): number;
    /**
     * Traverses through all elements and nested elements of an object.
     * @param obj The object to traverse.
     * @param callback A callback that fires for every element of the object.
     */
    static traverseObject(obj: Record<string, any>, callback: (obj: {
        [key: string]: any;
    }) => void): void;
    /**
     * Wait a specified number of milliseconds.
     * @param time The time to wait in milliseconds.
     */
    static wait(time: number): Promise<void>;
}
