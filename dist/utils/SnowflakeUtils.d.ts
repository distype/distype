import { Snowflake as s } from 'discord-api-types/v10';
/**
 * A Snowflake.
 * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes)
 */
export type Snowflake = s;
/**
 * Utilities for Discord snowflakes.
 * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes)
 */
export declare class SnowflakeUtils {
    private constructor();
    /**
     * The Discord epoch as a unix millisecond timestamp.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right)
     */
    static readonly DISCORD_EPOCH = 1420070400000;
    /**
     * For every ID that is generated on a process, this property of the snowflake is incremented.
     */
    static increment(snowflake: Snowflake): number;
    /**
     * Determines if a snowflake is valid.
     * @param snowflake The snowflake to test.
     */
    static isValid(snowflake: Snowflake): boolean;
    /**
     * Internal Discord process ID the snowflake was created on.
     */
    static processId(snowflake: Snowflake): number;
    /**
     * The time at which the snowflake was created as a unix millisecond timestamp.
     */
    static time(snowflake: Snowflake): number;
    /**
     * Internal Discord worker ID the snowflake was created on.
     */
    static workerId(snowflake: Snowflake): number;
}
