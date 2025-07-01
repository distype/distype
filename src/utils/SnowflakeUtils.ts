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
export class SnowflakeUtils {
    private constructor() {} // eslint-disable-line no-useless-constructor

    /**
     * The Discord epoch as a unix millisecond timestamp.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right)
     */
    public static readonly DISCORD_EPOCH = 1420070400000;

    /**
     * For every ID that is generated on a process, this property of the snowflake is incremented.
     */
    public static increment(snowflake: Snowflake): number {
        return Number(BigInt(snowflake) & 0xfffn);
    }

    /**
     * Determines if a snowflake is valid.
     * @param snowflake The snowflake to test.
     */
    public static isValid(snowflake: Snowflake): boolean {
        return (
            Number.isInteger(+snowflake) &&
            BigInt(snowflake) > 4194304n &&
            !isNaN(new Date(this.time(snowflake)).getTime())
        );
    }

    /**
     * Internal Discord process ID the snowflake was created on.
     */
    public static processId(snowflake: Snowflake): number {
        return Number((BigInt(snowflake) & 0x1f000n) >> 12n);
    }

    /**
     * The time at which the snowflake was created as a unix millisecond timestamp.
     */
    public static time(snowflake: Snowflake): number {
        return Number((BigInt(snowflake) >> 22n) + BigInt(this.DISCORD_EPOCH));
    }

    /**
     * Internal Discord worker ID the snowflake was created on.
     */
    public static workerId(snowflake: Snowflake): number {
        return Number((BigInt(snowflake) & 0x3e0000n) >> 17n);
    }
}
