import { GatewayIntentBits } from 'discord-api-types';

/**
 * Discord API constants.
 */
export const DiscordConstants = {
    /**
     * Discord's base API URL.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-reference-base-url)
     */
    BASE_URL: `https://discord.com/api`,
    /**
     * Discord's CDN URL.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-base-url)
     */
    CDN_URL: `https://cdn.discordapp.com`,
    /**
     * The Discord epoch as a unix millisecond timestamp.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right)
     */
    DISCORD_EPOCH: 1420070400000,
    /**
     * Gateway ratelimits.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#rate-limiting)
     */
    GATEWAY_RATELIMIT: {
        /**
         * The number of commands allowed to be sent every `RESET_AFTER` milliseconds.
         */
        LIMIT: 120,
        /**
         * The amount of time that `LIMIT` is specified for.
         */
        RESET_AFTER: 60000
    },
    /**
     * Gateway intents.
     * Includes privileged intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
     */
    INTENTS: {
        GUILDS: GatewayIntentBits.Guilds,
        GUILD_MEMBERS: GatewayIntentBits.GuildMembers,
        GUILD_BANS: GatewayIntentBits.GuildBans,
        GUILD_EMOJIS_AND_STICKERS: GatewayIntentBits.GuildEmojisAndStickers,
        GUILD_INTEGRATIONS: GatewayIntentBits.GuildIntegrations,
        GUILD_WEBHOOKS: GatewayIntentBits.GuildWebhooks,
        GUILD_INVITES: GatewayIntentBits.GuildInvites,
        GUILD_VOICE_STATES: GatewayIntentBits.GuildVoiceStates,
        GUILD_PRESENCES: GatewayIntentBits.GuildPresences,
        GUILD_MESSAGES: GatewayIntentBits.GuildMessages,
        GUILD_MESSAGE_REACTIONS: GatewayIntentBits.GuildMessageReactions,
        GUILD_MESSAGE_TYPING: GatewayIntentBits.GuildMessageTyping,
        DIRECT_MESSAGES: GatewayIntentBits.DirectMessages,
        DIRECT_MESSAGE_REACTIONS: GatewayIntentBits.DirectMessageReactions,
        DIRECT_MESSAGE_TYPING: GatewayIntentBits.DirectMessageTyping,
        GUILD_SCHEDULED_EVENTS: GatewayIntentBits.GuildScheduledEvents
    },
    /**
     * The amount of milliseconds after a message is created where it causes issues with rate limiting.
     * @see [GitHub Issue](https://github.com/discord/discord-api-docs/issues/1295)
     */
    OLD_MESSAGE_THRESHOLD: 1209600000,
    /**
     * Privileged gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
     */
    PRIVILEGED_INTENTS: {
        GUILD_MEMBERS: GatewayIntentBits.GuildMembers,
        GUILD_PRESENCES: GatewayIntentBits.GuildPresences
    },
    /**
     * Rest rate limit headers.
     */
    RATE_LIMIT_HEADERS: {
        limit: `x-ratelimit-limit`,
        remaining: `x-ratelimit-remaining`,
        reset: `x-ratelimit-reset`,
        resetAfter: `x-ratelimit-reset-after`,
        bucket: `x-ratelimit-bucket`,
        global: `x-ratelimit-global`,
        scope: `x-ratelimit-scope`
    },
    /**
     * The cooldown between spawning shards from the same bucket.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
     */
    SHARD_SPAWN_COOLDOWN: 5000
} as const;
