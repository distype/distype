"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordConstants = void 0;
const v9_1 = require("discord-api-types/v9");
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
     * Allowed image formats.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-formats)
     */
    IMAGE_FORMATS: [`gif`, `jpeg`, `jpg`, `json`, `png`, `webp`],
    /**
     * Allowed image sizes.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting)
     */
    IMAGE_SIZES: [16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
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
     * The maximum length in bytes allowed for the `nonce` property in a [request guild members](https://discord.com/developers/docs/topics/gateway#request-guild-members) payload.
     */
    MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH: 32,
    /**
     * The amount of milliseconds after a message is created where it causes issues with rate limiting.
     * @see [GitHub Issue](https://github.com/discord/discord-api-docs/issues/1295)
     */
    OLD_MESSAGE_THRESHOLD: 1209600000,
    /**
     * Bitwise permission flags.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
     */
    PERMISSION_FLAGS: {
        CREATE_INSTANT_INVITE: v9_1.PermissionFlagsBits.CreateInstantInvite,
        KICK_MEMBERS: v9_1.PermissionFlagsBits.KickMembers,
        BAN_MEMBERS: v9_1.PermissionFlagsBits.BanMembers,
        ADMINISTRATOR: v9_1.PermissionFlagsBits.Administrator,
        MANAGE_CHANNELS: v9_1.PermissionFlagsBits.ManageChannels,
        MANAGE_GUILD: v9_1.PermissionFlagsBits.ManageGuild,
        ADD_REACTIONS: v9_1.PermissionFlagsBits.AddReactions,
        VIEW_AUDIT_LOG: v9_1.PermissionFlagsBits.ViewAuditLog,
        PRIORITY_SPEAKER: v9_1.PermissionFlagsBits.PrioritySpeaker,
        STREAM: v9_1.PermissionFlagsBits.Stream,
        VIEW_CHANNEL: v9_1.PermissionFlagsBits.ViewChannel,
        SEND_MESSAGES: v9_1.PermissionFlagsBits.SendMessages,
        SEND_TTS_MESSAGES: v9_1.PermissionFlagsBits.SendTTSMessages,
        MANAGE_MESSAGES: v9_1.PermissionFlagsBits.ManageMessages,
        EMBED_LINKS: v9_1.PermissionFlagsBits.EmbedLinks,
        ATTACH_FILES: v9_1.PermissionFlagsBits.AttachFiles,
        READ_MESSAGE_HISTORY: v9_1.PermissionFlagsBits.ReadMessageHistory,
        MENTION_EVERYONE: v9_1.PermissionFlagsBits.MentionEveryone,
        USE_EXTERNAL_EMOJIS: v9_1.PermissionFlagsBits.UseExternalEmojis,
        VIEW_GUILD_INSIGHTS: v9_1.PermissionFlagsBits.ViewGuildInsights,
        CONNECT: v9_1.PermissionFlagsBits.Connect,
        SPEAK: v9_1.PermissionFlagsBits.Speak,
        MUTE_MEMBERS: v9_1.PermissionFlagsBits.MuteMembers,
        DEAFEN_MEMBERS: v9_1.PermissionFlagsBits.DeafenMembers,
        MOVE_MEMBERS: v9_1.PermissionFlagsBits.MoveMembers,
        USE_VAD: v9_1.PermissionFlagsBits.UseVAD,
        CHANGE_NICKNAME: v9_1.PermissionFlagsBits.ChangeNickname,
        MANAGE_NICKNAMES: v9_1.PermissionFlagsBits.ManageNicknames,
        MANAGE_ROLES: v9_1.PermissionFlagsBits.ManageRoles,
        MANAGE_WEBHOOKS: v9_1.PermissionFlagsBits.ManageWebhooks,
        MANAGE_EMOJIS_AND_STICKERS: v9_1.PermissionFlagsBits.ManageEmojisAndStickers,
        USE_APPLICATION_COMMANDS: v9_1.PermissionFlagsBits.UseApplicationCommands,
        REQUEST_TO_SPEAK: v9_1.PermissionFlagsBits.RequestToSpeak,
        MANAGE_EVENTS: v9_1.PermissionFlagsBits.ManageEvents,
        MANAGE_THREADS: v9_1.PermissionFlagsBits.ManageThreads,
        CREATE_PUBLIC_THREADS: v9_1.PermissionFlagsBits.CreatePublicThreads,
        CREATE_PRIVATE_THREADS: v9_1.PermissionFlagsBits.CreatePrivateThreads,
        USE_EXTERNAL_STICKERS: v9_1.PermissionFlagsBits.UseExternalStickers,
        SEND_MESSAGES_IN_THREADS: v9_1.PermissionFlagsBits.SendMessagesInThreads,
        START_EMBEDDED_ACTIVITIES: v9_1.PermissionFlagsBits.StartEmbeddedActivities,
        MODERATE_MEMBERS: v9_1.PermissionFlagsBits.ModerateMembers
    },
    /**
     * Bitwise permission flags for when a user is timed out.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-for-timed-out-members)
     */
    PERMISSION_FLAGS_TIMEOUT: {
        VIEW_CHANNEL: v9_1.PermissionFlagsBits.ViewChannel,
        READ_MESSAGE_HISTORY: v9_1.PermissionFlagsBits.ReadMessageHistory
    },
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
        LIMIT: `x-ratelimit-limit`,
        REMAINING: `x-ratelimit-remaining`,
        RESET: `x-ratelimit-reset`,
        RESET_AFTER: `x-ratelimit-reset-after`,
        BUCKET: `x-ratelimit-bucket`,
        GLOBAL: `x-ratelimit-global`,
        GLOBAL_RETRY_AFTER: `retry-after`,
        SCOPE: `x-ratelimit-scope`
    },
    /**
     * The cooldown between spawning shards from the same bucket.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
     */
    SHARD_SPAWN_COOLDOWN: 5000
};
