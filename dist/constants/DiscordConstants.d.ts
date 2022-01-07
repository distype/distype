import { GatewayIntentBits } from 'discord-api-types/v9';
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
     * The Discord epoch as a unix millisecond timestamp.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right)
     */
    readonly DISCORD_EPOCH: 1420070400000;
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
        readonly GUILDS: GatewayIntentBits.Guilds;
        readonly GUILD_MEMBERS: GatewayIntentBits.GuildMembers;
        readonly GUILD_BANS: GatewayIntentBits.GuildBans;
        readonly GUILD_EMOJIS_AND_STICKERS: GatewayIntentBits.GuildEmojisAndStickers;
        readonly GUILD_INTEGRATIONS: GatewayIntentBits.GuildIntegrations;
        readonly GUILD_WEBHOOKS: GatewayIntentBits.GuildWebhooks;
        readonly GUILD_INVITES: GatewayIntentBits.GuildInvites;
        readonly GUILD_VOICE_STATES: GatewayIntentBits.GuildVoiceStates;
        readonly GUILD_PRESENCES: GatewayIntentBits.GuildPresences;
        readonly GUILD_MESSAGES: GatewayIntentBits.GuildMessages;
        readonly GUILD_MESSAGE_REACTIONS: GatewayIntentBits.GuildMessageReactions;
        readonly GUILD_MESSAGE_TYPING: GatewayIntentBits.GuildMessageTyping;
        readonly DIRECT_MESSAGES: GatewayIntentBits.DirectMessages;
        readonly DIRECT_MESSAGE_REACTIONS: GatewayIntentBits.DirectMessageReactions;
        readonly DIRECT_MESSAGE_TYPING: GatewayIntentBits.DirectMessageTyping;
        readonly GUILD_SCHEDULED_EVENTS: GatewayIntentBits.GuildScheduledEvents;
    };
    /**
     * The maximum length in bytes allowed for the `nonce` property in a [request guild members](https://discord.com/developers/docs/topics/gateway#request-guild-members) payload.
     */
    readonly MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH: 32;
    /**
     * The amount of milliseconds after a message is created where it causes issues with rate limiting.
     * @see [GitHub Issue](https://github.com/discord/discord-api-docs/issues/1295)
     */
    readonly OLD_MESSAGE_THRESHOLD: 1209600000;
    /**
     * Privileged gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
     */
    readonly PRIVILEGED_INTENTS: {
        readonly GUILD_MEMBERS: GatewayIntentBits.GuildMembers;
        readonly GUILD_PRESENCES: GatewayIntentBits.GuildPresences;
    };
    /**
     * Rest rate limit headers.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/rate-limits#header-format)
     */
    readonly RATE_LIMIT_HEADERS: {
        readonly limit: "x-ratelimit-limit";
        readonly remaining: "x-ratelimit-remaining";
        readonly reset: "x-ratelimit-reset";
        readonly resetAfter: "x-ratelimit-reset-after";
        readonly bucket: "x-ratelimit-bucket";
        readonly global: "x-ratelimit-global";
        readonly globalRetryAfter: "retry-after";
        readonly scope: "x-ratelimit-scope";
    };
    /**
     * The cooldown between spawning shards from the same bucket.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
     */
    readonly SHARD_SPAWN_COOLDOWN: 5000;
};
