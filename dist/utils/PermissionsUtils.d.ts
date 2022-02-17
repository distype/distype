import { DiscordConstants } from '../constants/DiscordConstants';
import { APIOverwrite, Snowflake } from 'discord-api-types/v10';
/**
 * Properties of an `APIChannel` that are relevant to permissions.
 */
export interface PermissionsChannel {
    permission_overwrites?: APIOverwrite[];
}
/**
 * Properties of an `APIGuild` that are relevant to permissions.
 */
export interface PermissionsGuild {
    id: Snowflake;
    owner_id?: Snowflake;
    roles?: Array<{
        id: Snowflake;
        permissions: string | number | bigint;
    }>;
}
/**
 * Properties of an `APIGuildMember` that are relevant to permissions.
 */
export interface PermissionsMember {
    user: {
        id: Snowflake;
    };
    roles?: Snowflake[];
}
/**
 * Utilities for permission flags.
 */
export declare class PermissionsUtils {
    /**
     * All permissions combined.
     */
    static get allPermissions(): bigint;
    /**
     * Apply overwrites to permission flags.
     * @param perms The permissions to apply overwrites to.
     * @param overwrites Overwrites to apply.
     * @param id Only apply overwrites with this ID.
     */
    static applyOverwrites(perms: number | bigint, overwrites: APIOverwrite | APIOverwrite[], id?: Snowflake): bigint;
    /**
     * Compute a member's permissions in a channel.
     * @param member The member to get permissions for.
     * @param guild The guild the member is in.
     * @param channel The channel to compute overwrites for.
     * @param timedOut If the member is timed out.
     */
    static channelPermissions(member: PermissionsMember, guild: PermissionsGuild, channel: PermissionsChannel, timedOut?: boolean): bigint;
    /**
     * Combine permission flags.
     * @param flags The flags to combine.
     */
    static combine(...flags: Array<number | bigint | keyof (typeof DiscordConstants.PERMISSION_FLAGS)>): bigint;
    /**
     * Compute a member's permissions in a guild.
     * @param member The member to get permissions for.
     * @param guild The guild the member is in.
     * @param timedOut If the member is timed out.
     */
    static guildPermissions(member: PermissionsMember, guild: PermissionsGuild, timedOut?: boolean): bigint;
    /**
     * Check if a combination of permission flags includes a permission.
     * @param perms Combine permission flags to test for a permission.
     * @param perm The permission to test for.
     * @param timedOut If the user is timed out.
     */
    static hasPerm(perms: number | bigint, perm: number | bigint | keyof (typeof DiscordConstants.PERMISSION_FLAGS), timedOut?: boolean): boolean;
    /**
     * Remove permission flags.
     * @param baseFlags The base flags to subtract from.
     * @param flags The flags to subtract.
     */
    static remove(baseFlags: number | bigint, ...flags: Array<number | bigint | keyof (typeof DiscordConstants.PERMISSION_FLAGS)>): bigint;
    /**
     * Applies timeout overwrites to permission flags.
     * @param perms The permissions to convert.
     */
    static timeout(perms: number | bigint): bigint;
}
