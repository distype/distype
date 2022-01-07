import { Snowflake } from 'discord-api-types/v9';
/**
 * Utilities for Discord snowflakes.
 * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes)
 */
export declare class SnowflakeUtils {
    /**
     * For every ID that is generated on a process, this property of the snowflake is incremented.
     */
    static increment(snowflake: Snowflake): number;
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
