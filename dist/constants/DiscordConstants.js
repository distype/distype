"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordConstants = void 0;
/**
 * Discord API constants.
 */
exports.DiscordConstants = {
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
        GUILDS: 1 /* Guilds */,
        GUILD_MEMBERS: 2 /* GuildMembers */,
        GUILD_BANS: 4 /* GuildBans */,
        GUILD_EMOJIS_AND_STICKERS: 8 /* GuildEmojisAndStickers */,
        GUILD_INTEGRATIONS: 16 /* GuildIntegrations */,
        GUILD_WEBHOOKS: 32 /* GuildWebhooks */,
        GUILD_INVITES: 64 /* GuildInvites */,
        GUILD_VOICE_STATES: 128 /* GuildVoiceStates */,
        GUILD_PRESENCES: 256 /* GuildPresences */,
        GUILD_MESSAGES: 512 /* GuildMessages */,
        GUILD_MESSAGE_REACTIONS: 1024 /* GuildMessageReactions */,
        GUILD_MESSAGE_TYPING: 2048 /* GuildMessageTyping */,
        DIRECT_MESSAGES: 4096 /* DirectMessages */,
        DIRECT_MESSAGE_REACTIONS: 8192 /* DirectMessageReactions */,
        DIRECT_MESSAGE_TYPING: 16384 /* DirectMessageTyping */,
        GUILD_SCHEDULED_EVENTS: 65536 /* GuildScheduledEvents */
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
        GUILD_MEMBERS: 2 /* GuildMembers */,
        GUILD_PRESENCES: 256 /* GuildPresences */
    },
    /**
     * Rest rate limit headers.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/rate-limits#header-format)
     */
    RATE_LIMIT_HEADERS: {
        limit: `x-ratelimit-limit`,
        remaining: `x-ratelimit-remaining`,
        reset: `x-ratelimit-reset`,
        resetAfter: `x-ratelimit-reset-after`,
        bucket: `x-ratelimit-bucket`,
        global: `x-ratelimit-global`,
        globalRetryAfter: `retry-after`,
        scope: `x-ratelimit-scope`
    },
    /**
     * The cooldown between spawning shards from the same bucket.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
     */
    SHARD_SPAWN_COOLDOWN: 5000
};
