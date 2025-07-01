import { Snowflake } from './SnowflakeUtils';
import { APIOverwrite } from 'discord-api-types/v10';
/**
 * Properties of an `APIChannel` that are relevant to permissions.
 */
export interface PermissionsChannel {
    permission_overwrites?: APIOverwrite[];
}
/**
 * Permission flags.
 */
export type PermissionsFlags = number | bigint | keyof typeof PermissionsUtils.PERMISSIONS;
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
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions)
 */
export declare class PermissionsUtils {
    private constructor();
    /**
     * Named permission flags.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
     */
    static readonly PERMISSIONS: {
        CREATE_INSTANT_INVITE: bigint;
        KICK_MEMBERS: bigint;
        BAN_MEMBERS: bigint;
        ADMINISTRATOR: bigint;
        MANAGE_CHANNELS: bigint;
        MANAGE_GUILD: bigint;
        ADD_REACTIONS: bigint;
        VIEW_AUDIT_LOG: bigint;
        PRIORITY_SPEAKER: bigint;
        STREAM: bigint;
        VIEW_CHANNEL: bigint;
        SEND_MESSAGES: bigint;
        SEND_TTS_MESSAGES: bigint;
        MANAGE_MESSAGES: bigint;
        EMBED_LINKS: bigint;
        ATTACH_FILES: bigint;
        READ_MESSAGE_HISTORY: bigint;
        MENTION_EVERYONE: bigint;
        USE_EXTERNAL_EMOJIS: bigint;
        VIEW_GUILD_INSIGHTS: bigint;
        CONNECT: bigint;
        SPEAK: bigint;
        MUTE_MEMBERS: bigint;
        DEAFEN_MEMBERS: bigint;
        MOVE_MEMBERS: bigint;
        USE_VAD: bigint;
        CHANGE_NICKNAME: bigint;
        MANAGE_NICKNAMES: bigint;
        MANAGE_ROLES: bigint;
        MANAGE_WEBHOOKS: bigint;
        MANAGE_GUILD_EXPRESSIONS: bigint;
        USE_APPLICATION_COMMANDS: bigint;
        REQUEST_TO_SPEAK: bigint;
        MANAGE_EVENTS: bigint;
        MANAGE_THREADS: bigint;
        CREATE_PUBLIC_THREADS: bigint;
        CREATE_PRIVATE_THREADS: bigint;
        USE_EXTERNAL_STICKERS: bigint;
        SEND_MESSAGES_IN_THREADS: bigint;
        USE_EMBEDDED_ACTIVITIES: bigint;
        MODERATE_MEMBERS: bigint;
        VIEW_CREATOR_MONETIZATION_ANALYTICS: bigint;
        USE_SOUNDBOARD: bigint;
        USE_EXTERNAL_SOUNDS: bigint;
        SEND_VOICE_MESSAGES: bigint;
    };
    /**
     * All permission flags combined.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
     */
    static readonly COMBINED_PERMISSIONS: bigint;
    /**
     * Permission flags for when a user is timed out.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-for-timed-out-members)
     */
    static readonly TIMEOUT_PERMISSIONS: bigint;
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
    static toReadable(perms: number | bigint): Array<keyof typeof PermissionsUtils.PERMISSIONS>;
}
