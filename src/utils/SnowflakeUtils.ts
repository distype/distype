import { DiscordConstants } from '../constants/DiscordConstants';

import { Snowflake } from 'discord-api-types/v10';

/**
 * Utilities for Discord snowflakes.
 * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes)
 */
export class SnowflakeUtils {
    /**
     * For every ID that is generated on a process, this property of the snowflake is incremented.
     */
    public static increment (snowflake: Snowflake): number {
        return Number(BigInt(snowflake) & 0xFFFn);
    }

    /**
     * Internal Discord process ID the snowflake was created on.
     */
    public static processId (snowflake: Snowflake): number {
        return Number((BigInt(snowflake) & 0x1F000n) >> 12n);
    }

    /**
     * The time at which the snowflake was created as a unix millisecond timestamp.
     */
    public static time (snowflake: Snowflake): number {
        return Number((BigInt(snowflake) >> 22n) + BigInt(DiscordConstants.DISCORD_EPOCH));
    }

    /**
     * Internal Discord worker ID the snowflake was created on.
     */
    public static workerId (snowflake: Snowflake): number {
        return Number((BigInt(snowflake) & 0x3E0000n) >> 17n);
    }
}
