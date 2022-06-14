"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDNUtils = void 0;
const DiscordConstants_1 = require("../constants/DiscordConstants");
const node_url_1 = require("node:url");
/**
 * Methods for constructing CDN links.
 * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting)
 */
class CDNUtils {
    /**
     * A custom emoji.
     * @param id The emoji's ID.
     * @param options Image options.
     */
    static customEmoji(id, options = {}) {
        return this._make(`/emojis/${id}`, options);
    }
    /**
     * A guild's icon.
     * @param id The guild's ID.
     * @param hash The [guild's icon hash](https://discord.com/developers/docs/resources/guild#guild-object).
     * @param options Image options.
     */
    static guildIcon(id, hash, options = {}) {
        return this._make(`/icons/${id}/${hash}`, {
            ...options, hash
        });
    }
    /**
     * A guild's splash image.
     * @param id The guild's ID.
     * @param hash The [guild's splash hash](https://discord.com/developers/docs/resources/guild#guild-object).
     * @param options Image options.
     */
    static guildSplash(id, hash, options = {}) {
        return this._make(`/splashes/${id}/${hash}`, options);
    }
    /**
     * A guild's discovery splash image.
     * @param id The guild's ID.
     * @param hash The [guild's discovery splash hash](https://discord.com/developers/docs/resources/guild#guild-object).
     * @param options Image options.
     */
    static guildDiscoverySplash(id, hash, options = {}) {
        return this._make(`/discovery-splashes/${id}/${hash}`, options);
    }
    /**
     * A guild's banner.
     * @param id The guild's ID.
     * @param hash The [guild's banner hash](https://discord.com/developers/docs/resources/guild#guild-object).
     * @param options Image options.
     */
    static guildBanner(id, hash, options = {}) {
        return this._make(`/banners/${id}/${hash}`, {
            ...options, hash
        });
    }
    /**
     * A user's banner.
     * @param id The user's ID.
     * @param hash The [user's banner hash](https://discord.com/developers/docs/resources/user#user-object).
     * @param options Image options.
     */
    static userBanner(id, hash, options = {}) {
        return this._make(`/banners/${id}/${hash}`, {
            ...options, hash
        });
    }
    /**
     * A default user avatar.
     * @param discrimModulo The [user's discriminator](https://discord.com/developers/docs/resources/user#user-object) modulo `5`.
     * @param options Image options.
     */
    static defaultUserAvatar(discrimModulo, options = {}) {
        return this._make(`/embed/avatars/${discrimModulo}`, options);
    }
    /**
     * A user's avatar.
     * @param id The user's ID.
     * @param hash The [user's avatar hash](https://discord.com/developers/docs/resources/user#user-object).
     * @param options Image options.
     */
    static userAvatar(id, hash, options = {}) {
        return this._make(`/avatars/${id}/${hash}`, {
            ...options, hash
        });
    }
    /**
     * A guild member's avatar.
     * @param guildId The guild's ID.
     * @param memberId The member's ID.
     * @param hash The [member's avatar hash](https://discord.com/developers/docs/resources/guild#guild-member-object).
     * @param options Image options.
     */
    static guildMemberAvatar(guildId, memberId, hash, options = {}) {
        return this._make(`/guilds/${guildId}/users/${memberId}/avatars/${hash}`, {
            ...options, hash
        });
    }
    /**
     * An application's icon.
     * @param id The application's ID.
     * @param hash The [application's icon hash](https://discord.com/developers/docs/resources/application#application-object).
     * @param options Image options.
     */
    static applicationIcon(id, hash, options = {}) {
        return this._make(`/app-icons/${id}/${hash}`, options);
    }
    /**
     * An application's cover image.
     * @param id The application's ID.
     * @param hash The [application's cover image hash](https://discord.com/developers/docs/resources/application#application-object).
     * @param options Image options.
     */
    static applicationCover(id, hash, options = {}) {
        return this._make(`/app-icons/${id}/${hash}`, options);
    }
    /**
     * An application asset.
     * @param id The application's ID.
     * @param hash The [application's asset hash](https://discord.com/developers/docs/topics/gateway#activity-object-activity-assets).
     * @param options Image options.
     */
    static applicationAsset(id, hash, options = {}) {
        return this._make(`/app-assets/${id}/${hash}`, options);
    }
    /**
     * An achievement icon.
     * @param applicationId The application's ID.
     * @param achievementId The [achievement's ID](https://discord.com/developers/docs/game-sdk/achievements#data-models-user-achievement-struct).
     * @param hash The [achievement's icon hash](https://discord.com/developers/docs/game-sdk/achievements#data-models-achievement-struct).
     * @param options Image options.
     */
    static achievementIcon(applicationId, achievementId, hash, options = {}) {
        return this._make(`/app-assets/${applicationId}/achievements/${achievementId}/icons/${hash}`, options);
    }
    /**
     * A sticker pack's banner.
     * @param id The sticker pack's ID.
     * @param options Image options.
     */
    static stickerPackBanner(id, options = {}) {
        return this._make(`/app-assets/710982414301790216/store/${id}`, options);
    }
    /**
     * A team's icon.
     * @param id The team's ID.
     * @param hash The [team's icon hash](https://discord.com/developers/docs/topics/teams#data-models-team-object).
     * @param options Image options.
     */
    static teamIcon(id, hash, options = {}) {
        return this._make(`/team-icons/${id}/${hash}`, options);
    }
    /**
     * A sticker.
     * @param id The sticker's ID.
     * @param options Image options.
     */
    static sticker(id, options = {}) {
        return this._make(`/stickers/${id}`, options);
    }
    /**
     * A role's icon.
     * @param id The role's ID.
     * @param hash The [role's icon hash](https://discord.com/developers/docs/topics/permissions#role-object).
     * @param options Image options.
     */
    static roleIcon(id, hash, options = {}) {
        return this._make(`/role-icons/${id}/${hash}`, options);
    }
    /**
     * A scheduled event's cover image.
     * @param id The event's ID.
     * @param hash The [cover hash](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object).
     * @param options Image options.
     */
    static guildScheduledEventCover(id, hash, options = {}) {
        return this._make(`/guild-events/${id}/${hash}`, options);
    }
    /**
     * A guild member's banner.
     * @param guildId The guild's ID.
     * @param memberId The member's ID.
     * @param hash The [member's banner hash](https://discord.com/developers/docs/resources/guild#guild-member-object).
     * @param options Image options.
     */
    static guildMemberBanner(guildId, memberId, hash, options = {}) {
        return this._make(`/guilds/${guildId}/users/${memberId}/banners/${hash}`, options);
    }
    /**
     * Make an asset URL.
     * @param route The asset's route.
     * @param options Image options.
     */
    static _make(route, options) {
        const url = new node_url_1.URL(`${DiscordConstants_1.DiscordConstants.CDN_URL}${route}.${options.dynamic && options.hash?.startsWith(`a_`) ? `gif` : (options.format ?? `png`)}`);
        if (options.size)
            url.searchParams.set(`size`, `${options.size}`);
        return url.toString();
    }
}
exports.CDNUtils = CDNUtils;
