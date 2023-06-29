import { CDNImageOptions, CDNUtils } from './CDNUtils';
import { Snowflake } from './SnowflakeUtils';

/**
 * Utilities for users.
 */
export class UserUtils {
    private constructor () {} // eslint-disable-line no-useless-constructor

    /**
     * Get a user's name.
     * @param username The user's username.
     * @param globalName The user's global name (display name).
     * @param nick The user's nickname in a guild.
     * @param discriminator The user's discriminator.
     */
    public static getName (username: string, globalName?: string | null, nick?: string | null, discriminator?: string | null): string {
        if (nick) return nick;
        else if (globalName) return globalName;
        else if (!discriminator || discriminator === `0`) return `@${username}`;
        else return `${username}#${discriminator}`;
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
    public static getAvatar (id: Snowflake, avatar?: string | null, guildAvatar?: string | null, guildId?: string | null, discriminator?: string | null, options?: CDNImageOptions<`gif` | `jpeg` | `jpg` | `png` | `webp`>): string {
        if (guildAvatar && guildId) return CDNUtils.guildMemberAvatar(guildId, id, guildAvatar, options);
        else if (avatar) return CDNUtils.userAvatar(id, avatar, options);

        const defaultOptions = {
            ...Object.fromEntries(Object.entries(options ?? {}).filter(([key]) => key !== `size`)),
            format: `png`
        } as Omit<CDNImageOptions<`png`>, `size`>;

        if (!discriminator || discriminator === `0`) return CDNUtils.defaultUserAvatar(Number((BigInt(id) >> 22n) % 6n), defaultOptions);
        else return CDNUtils.defaultUserAvatar(Number(discriminator), defaultOptions);
    }
}
