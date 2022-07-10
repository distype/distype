import { DiscordConstants } from '../constants/DiscordConstants';

import { APIOverwrite, Snowflake } from 'discord-api-types/v10';

/**
 * Properties of an `APIChannel` that are relevant to permissions.
 */
export interface PermissionsChannel {
    permission_overwrites?: APIOverwrite[]
}

/**
 * Permission flags.
 */
export type PermissionsFlags = number | bigint | keyof (typeof DiscordConstants.PERMISSION_FLAGS);

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
    communication_disabled_until?: string | null
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
    public static applyOverwrites (perms: number | bigint, overwrites: APIOverwrite | APIOverwrite[], id: Snowflake): bigint {
        const filteredOverwrites = (overwrites instanceof Array ? overwrites : [overwrites]).filter((overwrite) => overwrite.id === id);
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
    public static channelPermissions (member: PermissionsMember, guild: PermissionsGuild, channel: PermissionsChannel): bigint {
        let perms = this.guildPermissions(member, guild);
        if (this.hasPerms(perms, `ADMINISTRATOR`)) return this.allPermissions;

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
    public static combine (...flags: PermissionsFlags[]): bigint {
        return flags.reduce((p: bigint, c) => p | BigInt(typeof c === `string` ? DiscordConstants.PERMISSION_FLAGS[c] : c), 0n);
    }

    /**
     * Compute a member's permissions in a guild.
     * @param member The member to get permissions for.
     * @param guild The guild the member is in.
     */
    public static guildPermissions (member: PermissionsMember, guild: PermissionsGuild): bigint {
        if (member.user.id === guild.owner_id) return this.allPermissions;

        // @everyone
        let perms = BigInt(guild.roles?.find((role) => role.id === guild.id)?.permissions ?? 0);

        // Role permissions
        member.roles?.forEach((role) => {
            perms = this.combine(perms, BigInt(guild.roles?.find((r) => r.id === role)?.permissions ?? 0));
        });

        if (this.hasPerms(perms, `ADMINISTRATOR`)) return this.allPermissions;

        return member.communication_disabled_until ? this.timeout(perms) : perms;
    }

    /**
     * Check if a combination of permission flags includes a permission.
     * @param perms Permission flags to test for permissions.
     * @param test The permissions to test for.
     */
    public static hasPerms (perms: number | bigint, ...test: PermissionsFlags[]): boolean {
        const permsFlags = BigInt(perms);
        const testFlags = this.combine(...test);

        if ((permsFlags & DiscordConstants.PERMISSION_FLAGS.ADMINISTRATOR) !== 0n) return true;
        return (permsFlags & testFlags) === testFlags;
    }

    /**
     * Returns missing permissions.
     * @param perms Permission flags to test for permissions.
     * @param test The permissions to test for.
     */
    public static missingPerms (perms: number | bigint, ...test: PermissionsFlags[]): bigint {
        const permsFlags = BigInt(perms);
        const testFlags = this.combine(...test);

        if ((permsFlags & DiscordConstants.PERMISSION_FLAGS.ADMINISTRATOR) !== 0n) return 0n;
        else return testFlags - (permsFlags & testFlags);
    }

    /**
     * Remove permission flags.
     * @param baseFlags The base flags to subtract from.
     * @param flags The flags to subtract.
     */
    public static remove (baseFlags: number | bigint, ...flags: PermissionsFlags[]): bigint {
        return BigInt(baseFlags) & ~this.combine(...flags);
    }

    /**
     * Applies timeout overwrites to permission flags.
     * @param perms The permissions to convert.
     */
    public static timeout (perms: number | bigint): bigint {
        const permsFlags = BigInt(perms);

        if (this.hasPerms(permsFlags, `ADMINISTRATOR`)) return permsFlags;
        return this.combine(...Object.values(DiscordConstants.PERMISSION_FLAGS_TIMEOUT)) & permsFlags;
    }

    /**
     * Converts permission flags to readable strings.
     * @param perms The permissions to convert.
     */
    public static toReadable (perms: number | bigint): Array<keyof typeof DiscordConstants.PERMISSION_FLAGS> {
        return (Object.keys(DiscordConstants.PERMISSION_FLAGS) as Array<keyof typeof DiscordConstants.PERMISSION_FLAGS>).filter((key) => BigInt(perms) & DiscordConstants.PERMISSION_FLAGS[key]);
    }
}
