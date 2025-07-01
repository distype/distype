import { Snowflake } from './SnowflakeUtils';

import { RestRoute } from '../rest/Rest';

import { URL } from 'node:url';

/**
 * Image options.
 */
export interface CDNImageOptions<T extends (typeof CDNUtils.IMAGE_FORMATS)[number]> {
    /**
     * If the image is animated, automatically make it a gif.
     * @default true
     */
    dynamic?: T extends `gif` ? boolean : never;
    /**
     * The image's format.
     * @default `png`
     */
    format?: T;
    /**
     * The image's size.
     * @default undefined
     */
    size?: (typeof CDNUtils.IMAGE_SIZES)[number];
}

/**
 * Methods for constructing CDN links.
 * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting)
 */
export class CDNUtils {
    private constructor() {} // eslint-disable-line no-useless-constructor

    /**
     * Discord's CDN URL.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-base-url)
     */
    public static readonly BASE_URL = `https://cdn.discordapp.com`;
    /**
     * Allowed image formats.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-formats)
     */
    public static readonly IMAGE_FORMATS: [`gif`, `jpeg`, `jpg`, `json`, `png`, `webp`];
    /**
     * Allowed image sizes.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting)
     */
    public static readonly IMAGE_SIZES: [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

    /**
     * A custom emoji.
     * @param id The emoji's ID.
     * @param options Image options.
     */
    public static customEmoji(
        id: Snowflake,
        options: CDNImageOptions<`gif` | `jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/emojis/${id}`, options);
    }

    /**
     * A guild's icon.
     * @param id The guild's ID.
     * @param hash The [guild's icon hash](https://discord.com/developers/docs/resources/guild#guild-object).
     * @param options Image options.
     */
    public static guildIcon(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`gif` | `jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/icons/${id}/${hash}`, {
            ...options,
            hash,
        });
    }

    /**
     * A guild's splash image.
     * @param id The guild's ID.
     * @param hash The [guild's splash hash](https://discord.com/developers/docs/resources/guild#guild-object).
     * @param options Image options.
     */
    public static guildSplash(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/splashes/${id}/${hash}`, options);
    }

    /**
     * A guild's discovery splash image.
     * @param id The guild's ID.
     * @param hash The [guild's discovery splash hash](https://discord.com/developers/docs/resources/guild#guild-object).
     * @param options Image options.
     */
    public static guildDiscoverySplash(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/discovery-splashes/${id}/${hash}`, options);
    }

    /**
     * A guild's banner.
     * @param id The guild's ID.
     * @param hash The [guild's banner hash](https://discord.com/developers/docs/resources/guild#guild-object).
     * @param options Image options.
     */
    public static guildBanner(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`gif` | `jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/banners/${id}/${hash}`, {
            ...options,
            hash,
        });
    }

    /**
     * A user's banner.
     * @param id The user's ID.
     * @param hash The [user's banner hash](https://discord.com/developers/docs/resources/user#user-object).
     * @param options Image options.
     */
    public static userBanner(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`gif` | `jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/banners/${id}/${hash}`, {
            ...options,
            hash,
        });
    }

    /**
     * A default user avatar.
     * @param modulo The user's default avatar modulo.
     * @param options Image options.
     */
    public static defaultUserAvatar(modulo: number, options: Omit<CDNImageOptions<`png`>, `size`> = {}): string {
        return this._make(`/embed/avatars/${modulo}`, options);
    }

    /**
     * A user's avatar.
     * @param id The user's ID.
     * @param hash The [user's avatar hash](https://discord.com/developers/docs/resources/user#user-object).
     * @param options Image options.
     */
    public static userAvatar(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`gif` | `jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/avatars/${id}/${hash}`, {
            ...options,
            hash,
        });
    }

    /**
     * A guild member's avatar.
     * @param guildId The guild's ID.
     * @param memberId The member's ID.
     * @param hash The [member's avatar hash](https://discord.com/developers/docs/resources/guild#guild-member-object).
     * @param options Image options.
     */
    public static guildMemberAvatar(
        guildId: Snowflake,
        memberId: Snowflake,
        hash: string,
        options: CDNImageOptions<`gif` | `jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/guilds/${guildId}/users/${memberId}/avatars/${hash}`, {
            ...options,
            hash,
        });
    }

    /**
     * An application's icon.
     * @param id The application's ID.
     * @param hash The [application's icon hash](https://discord.com/developers/docs/resources/application#application-object).
     * @param options Image options.
     */
    public static applicationIcon(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/app-icons/${id}/${hash}`, options);
    }

    /**
     * An application's cover image.
     * @param id The application's ID.
     * @param hash The [application's cover image hash](https://discord.com/developers/docs/resources/application#application-object).
     * @param options Image options.
     */
    public static applicationCover(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/app-icons/${id}/${hash}`, options);
    }

    /**
     * An application asset.
     * @param id The application's ID.
     * @param hash The [application's asset hash](https://discord.com/developers/docs/topics/gateway#activity-object-activity-assets).
     * @param options Image options.
     */
    public static applicationAsset(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/app-assets/${id}/${hash}`, options);
    }

    /**
     * An achievement icon.
     * @param applicationId The application's ID.
     * @param achievementId The [achievement's ID](https://discord.com/developers/docs/game-sdk/achievements#data-models-user-achievement-struct).
     * @param hash The [achievement's icon hash](https://discord.com/developers/docs/game-sdk/achievements#data-models-achievement-struct).
     * @param options Image options.
     */
    public static achievementIcon(
        applicationId: Snowflake,
        achievementId: Snowflake,
        hash: string,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/app-assets/${applicationId}/achievements/${achievementId}/icons/${hash}`, options);
    }

    /**
     * A sticker pack's banner.
     * @param id The sticker pack's ID.
     * @param options Image options.
     */
    public static stickerPackBanner(
        id: Snowflake,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/app-assets/710982414301790216/store/${id}`, options);
    }

    /**
     * A team's icon.
     * @param id The team's ID.
     * @param hash The [team's icon hash](https://discord.com/developers/docs/topics/teams#data-models-team-object).
     * @param options Image options.
     */
    public static teamIcon(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/team-icons/${id}/${hash}`, options);
    }

    /**
     * A sticker.
     * @param id The sticker's ID.
     * @param options Image options.
     */
    public static sticker(id: Snowflake, options: Omit<CDNImageOptions<`json` | `png`>, `size`> = {}): string {
        return this._make(`/stickers/${id}`, options);
    }

    /**
     * A role's icon.
     * @param id The role's ID.
     * @param hash The [role's icon hash](https://discord.com/developers/docs/topics/permissions#role-object).
     * @param options Image options.
     */
    public static roleIcon(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/role-icons/${id}/${hash}`, options);
    }

    /**
     * A scheduled event's cover image.
     * @param id The event's ID.
     * @param hash The [cover hash](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object).
     * @param options Image options.
     */
    public static guildScheduledEventCover(
        id: Snowflake,
        hash: string,
        options: CDNImageOptions<`jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/guild-events/${id}/${hash}`, options);
    }

    /**
     * A guild member's banner.
     * @param guildId The guild's ID.
     * @param memberId The member's ID.
     * @param hash The [member's banner hash](https://discord.com/developers/docs/resources/guild#guild-member-object).
     * @param options Image options.
     */
    public static guildMemberBanner(
        guildId: Snowflake,
        memberId: Snowflake,
        hash: string,
        options: CDNImageOptions<`gif` | `jpeg` | `jpg` | `png` | `webp`> = {},
    ): string {
        return this._make(`/guilds/${guildId}/users/${memberId}/banners/${hash}`, options);
    }

    /**
     * Make an asset URL.
     * @param route The asset's route.
     * @param options Image options.
     */
    private static _make(
        route: RestRoute,
        options: {
            dynamic?: boolean;
            format?: (typeof CDNUtils.IMAGE_FORMATS)[number];
            hash?: string;
            size?: (typeof CDNUtils.IMAGE_SIZES)[number];
        },
    ): string {
        const url = new URL(
            `${this.BASE_URL}${route}.${options.dynamic && options.hash?.startsWith(`a_`) ? `gif` : (options.format ?? `png`)}`,
        );
        if (options.size) url.searchParams.set(`size`, `${options.size}`);
        return url.toString();
    }
}
