import { DiscordConstants } from '../constants/DiscordConstants';

import { APIOverwrite, Snowflake } from 'discord-api-types/v10';

/**
 * Properties of an `APIChannel` that are relevant to permissions.
 */
export interface PermissionsChannel {
    permission_overwrites?: APIOverwrite[]
}

/**
 * Properties of an `APIGuild` that are relevant to permissions.
 */
export interface PermissionsGuild {
    id: Snowflake
    owner_id?: Snowflake
    roles?: Array<{
        id: Snowflake
        permissions: string | number | bigint
    }>
}

/**
 * Properties of an `APIGuildMember` that are relevant to permissions.
 */
export interface PermissionsMember {
    user: {
        id: Snowflake
    }
    roles?: Snowflake[]
}

/**
 * Utilities for permission flags.
 */
export class PermissionsUtils {
    /**
     * All permissions combined.
     */
    public static get allPermissions (): bigint {
        return this.combine(...Object.values(DiscordConstants.PERMISSION_FLAGS));
    }

    /**
     * Apply overwrites to permission flags.
     * @param perms The permissions to apply overwrites to.
     * @param overwrites Overwrites to apply.
     * @param id Only apply overwrites with this ID.
     */
    public static applyOverwrites (perms: number | bigint, overwrites: APIOverwrite | APIOverwrite[], id?: Snowflake): bigint {
        const filteredOverwrites = overwrites instanceof Array ? overwrites.filter((overwrite) => id ? overwrite.id === id : true) : [overwrites];
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
     * @param timedOut If the member is timed out.
     */
    public static channelPermissions (member: PermissionsMember, guild: PermissionsGuild, channel: PermissionsChannel, timedOut = false): bigint {
        const basePerms = this.guildPermissions(member, guild, timedOut);
        if (this.hasPerm(basePerms, `ADMINISTRATOR`)) return this.allPermissions;

        const overwrites = channel.permission_overwrites ?? [];
        let perms = BigInt(guild.roles?.find((role) => role.id === guild.id)?.permissions ?? 0);

        perms = this.applyOverwrites(perms, overwrites, guild.id);
        member.roles?.forEach((role) => {
            perms = this.applyOverwrites(perms, overwrites, role);
        });
        perms = this.applyOverwrites(perms, overwrites, member.user.id);

        return timedOut ? this.timeout(perms) : perms;
    }

    /**
     * Combine permission flags.
     * @param flags The flags to combine.
     */
    public static combine (...flags: Array<number | bigint | keyof (typeof DiscordConstants.PERMISSION_FLAGS)>): bigint {
        return flags.reduce((p, c) => BigInt(typeof p === `string` ? DiscordConstants.PERMISSION_FLAGS[p] : p) | BigInt(typeof c === `string` ? DiscordConstants.PERMISSION_FLAGS[c] : c)) as bigint;
    }

    /**
     * Compute a member's permissions in a guild.
     * @param member The member to get permissions for.
     * @param guild The guild the member is in.
     * @param timedOut If the member is timed out.
     */
    public static guildPermissions (member: PermissionsMember, guild: PermissionsGuild, timedOut = false): bigint {
        if (member.user.id === guild.owner_id) return this.allPermissions;

        let perms = BigInt(guild.roles?.find((role) => role.id === guild.id)?.permissions ?? 0);
        member.roles?.forEach((role) => {
            perms = this.combine(perms, BigInt(guild.roles?.find((r) => r.id === role)?.permissions ?? 0));
        });

        if (this.hasPerm(perms, `ADMINISTRATOR`)) return this.allPermissions;

        return timedOut ? this.timeout(perms) : perms;
    }

    /**
     * Check if a combination of permission flags includes a permission.
     * @param perms Combine permission flags to test for a permission.
     * @param perm The permission to test for.
     * @param timedOut If the user is timed out.
     */
    public static hasPerm (perms: number | bigint, perm: number | bigint | keyof (typeof DiscordConstants.PERMISSION_FLAGS), timedOut = false): boolean {
        const permsFlags = BigInt(perms);
        const permFlag = typeof perm === `string` ? DiscordConstants.PERMISSION_FLAGS[perm] : BigInt(perm);

        if ((permsFlags & DiscordConstants.PERMISSION_FLAGS.ADMINISTRATOR) !== 0n) return true;
        if (timedOut && (this.timeout(perms) & permFlag) !== 0n) return false;
        return (permsFlags & permFlag) !== 0n;
    }

    /**
     * Remove permission flags.
     * @param baseFlags The base flags to subtract from.
     * @param flags The flags to subtract.
     */
    public static remove (baseFlags: number | bigint, ...flags: Array<number | bigint | keyof (typeof DiscordConstants.PERMISSION_FLAGS)>): bigint {
        return BigInt(baseFlags) & ~this.combine(...flags);
    }

    /**
     * Applies timeout overwrites to permission flags.
     * @param perms The permissions to convert.
     */
    public static timeout (perms: number | bigint): bigint {
        const permsFlags = BigInt(perms);

        if (this.hasPerm(permsFlags, `ADMINISTRATOR`)) return permsFlags;
        return this.combine(...Object.values(DiscordConstants.PERMISSION_FLAGS_TIMEOUT)) & permsFlags;
    }
}
