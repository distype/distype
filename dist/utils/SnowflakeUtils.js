"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnowflakeUtils = void 0;
const DiscordConstants_1 = require("../constants/DiscordConstants");
/**
 * Utilities for Discord snowflakes.
 * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes)
 */
class SnowflakeUtils {
    /**
     * For every ID that is generated on a process, this property of the snowflake is incremented.
     */
    static increment(snowflake) {
        return Number(BigInt(snowflake) & 0xfffn);
    }
    /**
     * Determines if a snowflake is valid.
     * @param snowflake The snowflake to test.
     */
    static isValid(snowflake) {
        return Number.isInteger(+snowflake) && BigInt(snowflake) > 4194304n && !isNaN(new Date(SnowflakeUtils.time(snowflake)).getTime());
    }
    /**
     * Internal Discord process ID the snowflake was created on.
     */
    static processId(snowflake) {
        return Number((BigInt(snowflake) & 0x1f000n) >> 12n);
    }
    /**
     * The time at which the snowflake was created as a unix millisecond timestamp.
     */
    static time(snowflake) {
        return Number((BigInt(snowflake) >> 22n) + BigInt(DiscordConstants_1.DiscordConstants.DISCORD_EPOCH));
    }
    /**
     * Internal Discord worker ID the snowflake was created on.
     */
    static workerId(snowflake) {
        return Number((BigInt(snowflake) & 0x3e0000n) >> 17n);
    }
}
exports.SnowflakeUtils = SnowflakeUtils;
