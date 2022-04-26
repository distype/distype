"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsUtils = void 0;
const DiscordConstants_1 = require("../constants/DiscordConstants");
/**
 * Utilities for permission flags.
 */
class PermissionsUtils {
    /**
     * All permissions combined.
     */
    static get allPermissions() {
        return this.combine(...Object.values(DiscordConstants_1.DiscordConstants.PERMISSION_FLAGS));
    }
    /**
     * Apply overwrites to permission flags.
     * @param perms The permissions to apply overwrites to.
     * @param overwrites Overwrites to apply.
     * @param id Only apply overwrites with this ID.
     */
    static applyOverwrites(perms, overwrites, id) {
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
     * @param timedOut If the member is timed out.
     */
    static channelPermissions(member, guild, channel, timedOut = false) {
        let perms = this.guildPermissions(member, guild, timedOut);
        if (this.hasPerm(perms, `ADMINISTRATOR`))
            return this.allPermissions;
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
        return timedOut ? this.timeout(perms) : perms;
    }
    /**
     * Combine permission flags.
     * @param flags The flags to combine.
     */
    static combine(...flags) {
        return flags.reduce((p, c) => BigInt(typeof p === `string` ? DiscordConstants_1.DiscordConstants.PERMISSION_FLAGS[p] : p) | BigInt(typeof c === `string` ? DiscordConstants_1.DiscordConstants.PERMISSION_FLAGS[c] : c));
    }
    /**
     * Compute a member's permissions in a guild.
     * @param member The member to get permissions for.
     * @param guild The guild the member is in.
     * @param timedOut If the member is timed out.
     */
    static guildPermissions(member, guild, timedOut = false) {
        if (member.user.id === guild.owner_id)
            return this.allPermissions;
        // @everyone
        let perms = BigInt(guild.roles?.find((role) => role.id === guild.id)?.permissions ?? 0);
        // Role permissions
        member.roles?.forEach((role) => {
            perms = this.combine(perms, BigInt(guild.roles?.find((r) => r.id === role)?.permissions ?? 0));
        });
        if (this.hasPerm(perms, `ADMINISTRATOR`))
            return this.allPermissions;
        return timedOut ? this.timeout(perms) : perms;
    }
    /**
     * Check if a combination of permission flags includes a permission.
     * @param perms Combine permission flags to test for a permission.
     * @param perm The permission to test for.
     * @param timedOut If the user is timed out.
     */
    static hasPerm(perms, perm, timedOut = false) {
        const permsFlags = BigInt(perms);
        const permFlag = typeof perm === `string` ? DiscordConstants_1.DiscordConstants.PERMISSION_FLAGS[perm] : BigInt(perm);
        if ((permsFlags & DiscordConstants_1.DiscordConstants.PERMISSION_FLAGS.ADMINISTRATOR) !== 0n)
            return true;
        if (timedOut && (this.timeout(perms) & permFlag) !== 0n)
            return false;
        return (permsFlags & permFlag) !== 0n;
    }
    /**
     * Remove permission flags.
     * @param baseFlags The base flags to subtract from.
     * @param flags The flags to subtract.
     */
    static remove(baseFlags, ...flags) {
        return BigInt(baseFlags) & ~this.combine(...flags);
    }
    /**
     * Applies timeout overwrites to permission flags.
     * @param perms The permissions to convert.
     */
    static timeout(perms) {
        const permsFlags = BigInt(perms);
        if (this.hasPerm(permsFlags, `ADMINISTRATOR`))
            return permsFlags;
        return this.combine(...Object.values(DiscordConstants_1.DiscordConstants.PERMISSION_FLAGS_TIMEOUT)) & permsFlags;
    }
}
exports.PermissionsUtils = PermissionsUtils;
