/**
 * Discord API constants.
 */
export declare const DiscordConstants: {
    /**
     * Discord's base API URL.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-reference-base-url)
     */
    readonly BASE_URL: "https://discord.com/api";
    /**
     * Discord's CDN URL.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-base-url)
     */
    readonly CDN_URL: "https://cdn.discordapp.com";
    /**
     * Gateway ratelimits.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#rate-limiting)
     */
    readonly GATEWAY_RATELIMIT: {
        /**
         * The number of commands allowed to be sent every `RESET_AFTER` milliseconds.
         */
        readonly LIMIT: 120;
        /**
         * The amount of time that `LIMIT` is specified for.
         */
        readonly RESET_AFTER: 60000;
    };
    /**
     * Gateway intents.
     * Includes privileged intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
     */
    readonly INTENTS: {
        readonly GUILDS: number;
        readonly GUILD_MEMBERS: number;
        readonly GUILD_BANS: number;
        readonly GUILD_EMOJIS_AND_STICKERS: number;
        readonly GUILD_INTEGRATIONS: number;
        readonly GUILD_WEBHOOKS: number;
        readonly GUILD_INVITES: number;
        readonly GUILD_VOICE_STATES: number;
        readonly GUILD_PRESENCES: number;
        readonly GUILD_MESSAGES: number;
        readonly GUILD_MESSAGE_REACTIONS: number;
        readonly GUILD_MESSAGE_TYPING: number;
        readonly DIRECT_MESSAGES: number;
        readonly DIRECT_MESSAGE_REACTIONS: number;
        readonly DIRECT_MESSAGE_TYPING: number;
        readonly GUILD_SCHEDULED_EVENTS: number;
    };
    /**
     * Privileged gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
     */
    readonly PRIVILEGED_INTENTS: {
        readonly GUILD_MEMBERS: number;
        readonly GUILD_PRESENCES: number;
    };
};
