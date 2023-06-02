import { DiscordConstants } from '../constants/DiscordConstants';
import { APIOverwrite, Snowflake } from 'discord-api-types/v10';
/**
 * Properties of an `APIChannel` that are relevant to permissions.
 */
export interface PermissionsChannel {
    permission_overwrites?: APIOverwrite[];
}
/**
 * Permission flags.
 */
export type PermissionsFlags = number | bigint | keyof (typeof DiscordConstants.PERMISSION_FLAGS);
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
    communication_disabled_until?: string | null;
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
    static applyOverwrites(perms: number | bigint, overwrites: APIOverwrite | APIOverwrite[], id: Snowflake): bigint;
    /**
     * Compute a member's permissions in a channel.
     * @param member The member to get permissions for.
     * @param guild The guild the member is in.
     * @param channel The channel to compute overwrites for.
     */
    static channelPermissions(member: PermissionsMember, guild: PermissionsGuild, channel: PermissionsChannel): bigint;
    /**
     * Combine permission flags.
     * @param flags The flags to combine.
     */
    static combine(...flags: PermissionsFlags[]): bigint;
    /**
     * Compute a member's permissions in a guild.
     * @param member The member to get permissions for.
     * @param guild The guild the member is in.
     */
    static guildPermissions(member: PermissionsMember, guild: PermissionsGuild): bigint;
    /**
     * Check if a combination of permission flags includes a permission.
     * @param perms Permission flags to test for permissions.
     * @param test The permissions to test for.
     */
    static hasPerms(perms: number | bigint, ...test: PermissionsFlags[]): boolean;
    /**
     * Returns missing permissions.
     * @param perms Permission flags to test for permissions.
     * @param test The permissions to test for.
     */
    static missingPerms(perms: number | bigint, ...test: PermissionsFlags[]): bigint;
    /**
     * Remove permission flags.
     * @param baseFlags The base flags to subtract from.
     * @param flags The flags to subtract.
     */
    static remove(baseFlags: number | bigint, ...flags: PermissionsFlags[]): bigint;
    /**
     * Applies timeout overwrites to permission flags.
     * @param perms The permissions to convert.
     */
    static timeout(perms: number | bigint): bigint;
    /**
     * Converts permission flags to readable strings.
     * @param perms The permissions to convert.
     */
    static toReadable(perms: number | bigint): Array<keyof typeof DiscordConstants.PERMISSION_FLAGS>;
}
