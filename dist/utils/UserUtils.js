"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUtils = void 0;
const CDNUtils_1 = require("./CDNUtils");
/**
 * Utilities for users.
 */
class UserUtils {
    constructor() { } // eslint-disable-line no-useless-constructor
    /**
     * Get a user's name.
     * @param username The user's username.
     * @param globalName The user's global name (display name).
     * @param nick The user's nickname in a guild.
     * @param discriminator The user's discriminator.
     */
    static getName(username, globalName, nick, discriminator) {
        if (nick)
            return nick;
        else if (globalName)
            return globalName;
        else if (!discriminator || discriminator === `0`)
            return `@${username}`;
        else
            return `${username}#${discriminator}`;
    }
    /**
     * Get a user's avatar.
     * @param id The user's ID.
     * @param avatar The user's avatar hash.
     * @param guildAvatar The user's guild avatar hash.
     * @param guildId The guild ID of the guild avatar hash.
     * @param discriminator The user's discriminator.
     * @param options Avatar options. Note that if the user has a default avatar, size will be omitted and the format will be a png.
     */
    static getAvatar(id, avatar, guildAvatar, guildId, discriminator, options) {
        if (guildAvatar && guildId)
            return CDNUtils_1.CDNUtils.guildMemberAvatar(guildId, id, guildAvatar, options);
        else if (avatar)
            return CDNUtils_1.CDNUtils.userAvatar(id, avatar, options);
        const defaultOptions = {
            ...Object.fromEntries(Object.entries(options ?? {}).filter(([key]) => key !== `size`)),
            format: `png`
        };
        if (!discriminator || discriminator === `0`)
            return CDNUtils_1.CDNUtils.defaultUserAvatar(Number((BigInt(id) >> 22n) % 6n), defaultOptions);
        else
            return CDNUtils_1.CDNUtils.defaultUserAvatar(Number(discriminator), defaultOptions);
    }
}
exports.UserUtils = UserUtils;
