"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnowflakeUtils = void 0;
/**
 * Utilities for Discord snowflakes.
 * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes)
 */
class SnowflakeUtils {
    constructor() { } // eslint-disable-line no-useless-constructor
    /**
     * The Discord epoch as a unix millisecond timestamp.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right)
     */
    static DISCORD_EPOCH = 1420070400000;
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
        return Number.isInteger(+snowflake) && BigInt(snowflake) > 4194304n && !isNaN(new Date(this.time(snowflake)).getTime());
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
        return Number((BigInt(snowflake) >> 22n) + BigInt(this.DISCORD_EPOCH));
    }
    /**
     * Internal Discord worker ID the snowflake was created on.
     */
    static workerId(snowflake) {
        return Number((BigInt(snowflake) & 0x3e0000n) >> 17n);
    }
}
exports.SnowflakeUtils = SnowflakeUtils;
