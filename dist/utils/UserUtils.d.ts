import { CDNImageOptions } from './CDNUtils';
import { Snowflake } from 'discord-api-types/v10';
/**
 * Utilities for users.
 */
export declare class UserUtils {
    private constructor();
    /**
     * Get a user's name.
     * @param username The user's username.
     * @param globalName The user's global name (display name).
     * @param nick The user's nickname in a guild.
     * @param discriminator The user's discriminator.
     */
    static getName(username: string, globalName?: string | null, nick?: string | null, discriminator?: string | null): string;
    /**
     * Get a user's avatar.
     * @param id The user's ID.
     * @param avatar The user's avatar hash.
     * @param guildAvatar The user's guild avatar hash.
     * @param guildId The guild ID of the guild avatar hash.
     * @param discriminator The user's discriminator.
     * @param options Avatar options. Note that if the user has a default avatar, size will be omitted and the format will be a png.
     */
    static getAvatar(id: Snowflake, avatar?: string | null, guildAvatar?: string | null, guildId?: string | null, discriminator?: string | null, options?: CDNImageOptions<`gif` | `jpeg` | `jpg` | `png` | `webp`>): string;
}
