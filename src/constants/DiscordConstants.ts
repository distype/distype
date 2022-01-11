import { GatewayIntentBits, PermissionFlagsBits } from 'discord-api-types/v9';

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
        CREATE_INSTANT_INVITE: PermissionFlagsBits.CreateInstantInvite,
        KICK_MEMBERS: PermissionFlagsBits.KickMembers,
        BAN_MEMBERS: PermissionFlagsBits.BanMembers,
        ADMINISTRATOR: PermissionFlagsBits.Administrator,
        MANAGE_CHANNELS: PermissionFlagsBits.ManageChannels,
        MANAGE_GUILD: PermissionFlagsBits.ManageGuild,
        ADD_REACTIONS: PermissionFlagsBits.AddReactions,
        VIEW_AUDIT_LOG: PermissionFlagsBits.ViewAuditLog,
        PRIORITY_SPEAKER: PermissionFlagsBits.PrioritySpeaker,
        STREAM: PermissionFlagsBits.Stream,
        VIEW_CHANNEL: PermissionFlagsBits.ViewChannel,
        SEND_MESSAGES: PermissionFlagsBits.SendMessages,
        SEND_TTS_MESSAGES: PermissionFlagsBits.SendTTSMessages,
        MANAGE_MESSAGES: PermissionFlagsBits.ManageMessages,
        EMBED_LINKS: PermissionFlagsBits.EmbedLinks,
        ATTACH_FILES: PermissionFlagsBits.AttachFiles,
        READ_MESSAGE_HISTORY: PermissionFlagsBits.ReadMessageHistory,
        MENTION_EVERYONE: PermissionFlagsBits.MentionEveryone,
        USE_EXTERNAL_EMOJIS: PermissionFlagsBits.UseExternalEmojis,
        VIEW_GUILD_INSIGHTS: PermissionFlagsBits.ViewGuildInsights,
        CONNECT: PermissionFlagsBits.Connect,
        SPEAK: PermissionFlagsBits.Speak,
        MUTE_MEMBERS: PermissionFlagsBits.MuteMembers,
        DEAFEN_MEMBERS: PermissionFlagsBits.DeafenMembers,
        MOVE_MEMBERS: PermissionFlagsBits.MoveMembers,
        USE_VAD: PermissionFlagsBits.UseVAD,
        CHANGE_NICKNAME: PermissionFlagsBits.ChangeNickname,
        MANAGE_NICKNAMES: PermissionFlagsBits.ManageNicknames,
        MANAGE_ROLES: PermissionFlagsBits.ManageRoles,
        MANAGE_WEBHOOKS: PermissionFlagsBits.ManageWebhooks,
        MANAGE_EMOJIS_AND_STICKERS: PermissionFlagsBits.ManageEmojisAndStickers,
        USE_APPLICATION_COMMANDS: PermissionFlagsBits.UseApplicationCommands,
        REQUEST_TO_SPEAK: PermissionFlagsBits.RequestToSpeak,
        MANAGE_EVENTS: PermissionFlagsBits.ManageEvents,
        MANAGE_THREADS: PermissionFlagsBits.ManageThreads,
        CREATE_PUBLIC_THREADS: PermissionFlagsBits.CreatePublicThreads,
        CREATE_PRIVATE_THREADS: PermissionFlagsBits.CreatePrivateThreads,
        USE_EXTERNAL_STICKERS: PermissionFlagsBits.UseExternalStickers,
        SEND_MESSAGES_IN_THREADS: PermissionFlagsBits.SendMessagesInThreads,
        START_EMBEDDED_ACTIVITIES: PermissionFlagsBits.StartEmbeddedActivities,
        MODERATE_MEMBERS: PermissionFlagsBits.ModerateMembers
    },
    /**
     * Bitwise permission flags for when a user is timed out.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-for-timed-out-members)
     */
    PERMISSION_FLAGS_TIMEOUT: {
        VIEW_CHANNEL: PermissionFlagsBits.ViewChannel,
        READ_MESSAGE_HISTORY: PermissionFlagsBits.ReadMessageHistory
    },
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
} as const;
