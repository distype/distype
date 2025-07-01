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
export class PermissionsUtils {
    private constructor() {} // eslint-disable-line no-useless-constructor

    /**
     * Named permission flags.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
     */
    public static readonly PERMISSIONS = {
        CREATE_INSTANT_INVITE: 1n << 0n,
        KICK_MEMBERS: 1n << 1n,
        BAN_MEMBERS: 1n << 2n,
        ADMINISTRATOR: 1n << 3n,
        MANAGE_CHANNELS: 1n << 4n,
        MANAGE_GUILD: 1n << 5n,
        ADD_REACTIONS: 1n << 6n,
        VIEW_AUDIT_LOG: 1n << 7n,
        PRIORITY_SPEAKER: 1n << 8n,
        STREAM: 1n << 9n,
        VIEW_CHANNEL: 1n << 10n,
        SEND_MESSAGES: 1n << 11n,
        SEND_TTS_MESSAGES: 1n << 12n,
        MANAGE_MESSAGES: 1n << 13n,
        EMBED_LINKS: 1n << 14n,
        ATTACH_FILES: 1n << 15n,
        READ_MESSAGE_HISTORY: 1n << 16n,
        MENTION_EVERYONE: 1n << 17n,
        USE_EXTERNAL_EMOJIS: 1n << 18n,
        VIEW_GUILD_INSIGHTS: 1n << 19n,
        CONNECT: 1n << 20n,
        SPEAK: 1n << 21n,
        MUTE_MEMBERS: 1n << 22n,
        DEAFEN_MEMBERS: 1n << 23n,
        MOVE_MEMBERS: 1n << 24n,
        USE_VAD: 1n << 25n,
        CHANGE_NICKNAME: 1n << 26n,
        MANAGE_NICKNAMES: 1n << 27n,
        MANAGE_ROLES: 1n << 28n,
        MANAGE_WEBHOOKS: 1n << 29n,
        MANAGE_GUILD_EXPRESSIONS: 1n << 30n,
        USE_APPLICATION_COMMANDS: 1n << 31n,
        REQUEST_TO_SPEAK: 1n << 32n,
        MANAGE_EVENTS: 1n << 33n,
        MANAGE_THREADS: 1n << 34n,
        CREATE_PUBLIC_THREADS: 1n << 35n,
        CREATE_PRIVATE_THREADS: 1n << 36n,
        USE_EXTERNAL_STICKERS: 1n << 37n,
        SEND_MESSAGES_IN_THREADS: 1n << 38n,
        USE_EMBEDDED_ACTIVITIES: 1n << 39n,
        MODERATE_MEMBERS: 1n << 40n,
        VIEW_CREATOR_MONETIZATION_ANALYTICS: 1n << 41n,
        USE_SOUNDBOARD: 1n << 42n,
        USE_EXTERNAL_SOUNDS: 1n << 45n,
        SEND_VOICE_MESSAGES: 1n << 46n,
    };

    /**
     * All permission flags combined.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
     */
    public static readonly COMBINED_PERMISSIONS = Object.values(this.PERMISSIONS).reduce((p, c) => p | c, 0n);

    /**
     * Permission flags for when a user is timed out.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-for-timed-out-members)
     */
    public static readonly TIMEOUT_PERMISSIONS = this.PERMISSIONS.VIEW_CHANNEL & this.PERMISSIONS.READ_MESSAGE_HISTORY;

    /**
     * Apply overwrites to permission flags.
     * @param perms The permissions to apply overwrites to.
     * @param overwrites Overwrites to apply.
     * @param id Only apply overwrites with this ID.
     */
    public static applyOverwrites(
        perms: number | bigint,
        overwrites: APIOverwrite | APIOverwrite[],
        id: Snowflake,
    ): bigint {
        const filteredOverwrites = (overwrites instanceof Array ? overwrites : [overwrites]).filter(
            (overwrite) => overwrite.id === id,
        );
        filteredOverwrites.forEach((overwrite) => {
            perms = this.remove(perms, BigInt(overwrite.deny));
            perms = this.combine(perms, BigInt(overwrite.allow));
        });
        return BigInt(perms);
    }

    /**
     * Compute a member's permissions in a channel.
     * @param member The member to get permissions for.
     * @param guild The guild the member is in.
     * @param channel The channel to compute overwrites for.
     */
    public static channelPermissions(
        member: PermissionsMember,
        guild: PermissionsGuild,
        channel: PermissionsChannel,
    ): bigint {
        let perms = this.guildPermissions(member, guild);
        if (this.hasPerms(perms, `ADMINISTRATOR`)) return this.COMBINED_PERMISSIONS;

        const overwrites = channel.permission_overwrites ?? [];

        // @everyone
        perms = this.applyOverwrites(perms, overwrites, guild.id);

        // Role overwrites
        let rolesDeny = 0n;
        let rolesAllow = 0n;
        member.roles?.forEach((roleId) => {
            const roleOverwrite = overwrites.find((overwrite) => overwrite.id === roleId);
            if (roleOverwrite) {
                rolesDeny = this.combine(perms, BigInt(roleOverwrite.deny));
                rolesAllow = this.combine(perms, BigInt(roleOverwrite.allow));
            }
        });
        perms = this.remove(perms, BigInt(rolesDeny));
        perms = this.combine(perms, BigInt(rolesAllow));

        // Member overwrites
        perms = this.applyOverwrites(perms, overwrites, member.user.id);

        return member.communication_disabled_until ? this.timeout(perms) : perms;
    }

    /**
     * Combine permission flags.
     * @param flags The flags to combine.
     */
    public static combine(...flags: PermissionsFlags[]): bigint {
        return flags.reduce((p: bigint, c) => p | BigInt(typeof c === `string` ? this.PERMISSIONS[c] : c), 0n);
    }

    /**
     * Compute a member's permissions in a guild.
     * @param member The member to get permissions for.
     * @param guild The guild the member is in.
     */
    public static guildPermissions(member: PermissionsMember, guild: PermissionsGuild): bigint {
        if (member.user.id === guild.owner_id) return this.COMBINED_PERMISSIONS;

        // @everyone
        let perms = BigInt(guild.roles?.find((role) => role.id === guild.id)?.permissions ?? 0);

        // Role permissions
        member.roles?.forEach((role) => {
            perms = this.combine(perms, BigInt(guild.roles?.find((r) => r.id === role)?.permissions ?? 0));
        });

        if (this.hasPerms(perms, `ADMINISTRATOR`)) return this.COMBINED_PERMISSIONS;

        return member.communication_disabled_until ? this.timeout(perms) : perms;
    }

    /**
     * Check if a combination of permission flags includes a permission.
     * @param perms Permission flags to test for permissions.
     * @param test The permissions to test for.
     */
    public static hasPerms(perms: number | bigint, ...test: PermissionsFlags[]): boolean {
        const permsFlags = BigInt(perms);
        const testFlags = this.combine(...test);

        if ((permsFlags & this.PERMISSIONS.ADMINISTRATOR) !== 0n) return true;
        return (permsFlags & testFlags) === testFlags;
    }

    /**
     * Returns missing permissions.
     * @param perms Permission flags to test for permissions.
     * @param test The permissions to test for.
     */
    public static missingPerms(perms: number | bigint, ...test: PermissionsFlags[]): bigint {
        const permsFlags = BigInt(perms);
        const testFlags = this.combine(...test);

        if ((permsFlags & this.PERMISSIONS.ADMINISTRATOR) !== 0n) return 0n;
        else return testFlags - (permsFlags & testFlags);
    }

    /**
     * Remove permission flags.
     * @param baseFlags The base flags to subtract from.
     * @param flags The flags to subtract.
     */
    public static remove(baseFlags: number | bigint, ...flags: PermissionsFlags[]): bigint {
        return BigInt(baseFlags) & ~this.combine(...flags);
    }

    /**
     * Applies timeout overwrites to permission flags.
     * @param perms The permissions to convert.
     */
    public static timeout(perms: number | bigint): bigint {
        const permsFlags = BigInt(perms);

        if (this.hasPerms(permsFlags, `ADMINISTRATOR`)) return permsFlags;
        return this.combine(...Object.values(this.TIMEOUT_PERMISSIONS)) & permsFlags;
    }

    /**
     * Converts permission flags to readable strings.
     * @param perms The permissions to convert.
     */
    public static toReadable(perms: number | bigint): Array<keyof typeof PermissionsUtils.PERMISSIONS> {
        return (Object.keys(this.PERMISSIONS) as Array<keyof typeof PermissionsUtils.PERMISSIONS>).filter(
            (key) => BigInt(perms) & this.PERMISSIONS[key],
        );
    }
}
