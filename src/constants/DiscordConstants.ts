import * as DiscordTypes from 'discord-api-types/v10';

/**
 * Discord API constants.
 */
export const DiscordConstants = {
    /**
     * Application command limits.
     * @see [Discord API Types](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure)
     */
    APPLICATION_COMMAND_LIMITS: {
        NAME: 32,
        DESCRIPTION: 100,
        OPTION: {
            CHOICES: 25,
            DESCRIPTION: 100,
            NAME: 32
        },
        OPTIONS: 25
    },
    /**
     * The maximum number of choices an autocomplete response can specify.
     * @see [Discord API Types](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete)
     */
    AUTOCOMPLETE_MAX_CHOICES: 25,
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
     * Component limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components)
     */
    COMPONENT_LIMITS: {
        BUTTON: {
            CUSTOM_ID: 100,
            LABEL: 80
        },
        SELECT_MENU: {
            CUSTOM_ID: 100,
            MAX_VALUES: {
                MIN: 1,
                MAX: 25
            },
            MIN_VALUES: {
                MIN: 0,
                MAX: 25
            },
            OPTIONS: 25,
            OPTION: {
                DESCRIPTION: 100,
                LABEL: 100,
                VALUE: 100
            },
            PLACEHOLDER: 150
        },
        TEXT_INPUT: {
            CUSTOM_ID: 100,
            LABEL: 45,
            MAX_LENGTH: {
                MIN: 1,
                MAX: 4000
            },
            MIN_LENGTH: {
                MIN: 0,
                MAX: 4000
            },
            PLACEHOLDER: 100,
            VALUE: 4000
        }
    },
    /**
     * The Discord epoch as a unix millisecond timestamp.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right)
     */
    DISCORD_EPOCH: 1420070400000,
    /**
     * Gateway [close event codes](https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes).
     */
    GATEWAY_CLOSE_CODES: {
        /**
         * Close codes that a shard should attempt to reconnect after receiving.
         */
        RECONNECTABLE: [DiscordTypes.GatewayCloseCodes.UnknownError, DiscordTypes.GatewayCloseCodes.UnknownOpcode, DiscordTypes.GatewayCloseCodes.DecodeError, DiscordTypes.GatewayCloseCodes.NotAuthenticated, DiscordTypes.GatewayCloseCodes.AlreadyAuthenticated, DiscordTypes.GatewayCloseCodes.InvalidSeq, DiscordTypes.GatewayCloseCodes.RateLimited, DiscordTypes.GatewayCloseCodes.SessionTimedOut],
        /**
         * Close codes that a shard should not attempt to reconnect after receiving.
         */
        NOT_RECONNECTABLE: [DiscordTypes.GatewayCloseCodes.AuthenticationFailed, DiscordTypes.GatewayCloseCodes.InvalidShard, DiscordTypes.GatewayCloseCodes.ShardingRequired, DiscordTypes.GatewayCloseCodes.InvalidAPIVersion, DiscordTypes.GatewayCloseCodes.InvalidIntents, DiscordTypes.GatewayCloseCodes.DisallowedIntents]
    },
    /**
     * Gateway intents.
     * Includes privileged intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
     */
    GATEWAY_INTENTS: {
        GUILDS: DiscordTypes.GatewayIntentBits.Guilds,
        GUILD_MEMBERS: DiscordTypes.GatewayIntentBits.GuildMembers,
        GUILD_BANS: DiscordTypes.GatewayIntentBits.GuildBans,
        GUILD_EMOJIS_AND_STICKERS: DiscordTypes.GatewayIntentBits.GuildEmojisAndStickers,
        GUILD_INTEGRATIONS: DiscordTypes.GatewayIntentBits.GuildIntegrations,
        GUILD_WEBHOOKS: DiscordTypes.GatewayIntentBits.GuildWebhooks,
        GUILD_INVITES: DiscordTypes.GatewayIntentBits.GuildInvites,
        GUILD_VOICE_STATES: DiscordTypes.GatewayIntentBits.GuildVoiceStates,
        GUILD_PRESENCES: DiscordTypes.GatewayIntentBits.GuildPresences,
        GUILD_MESSAGES: DiscordTypes.GatewayIntentBits.GuildMessages,
        GUILD_MESSAGE_REACTIONS: DiscordTypes.GatewayIntentBits.GuildMessageReactions,
        GUILD_MESSAGE_TYPING: DiscordTypes.GatewayIntentBits.GuildMessageTyping,
        DIRECT_MESSAGES: DiscordTypes.GatewayIntentBits.DirectMessages,
        DIRECT_MESSAGE_REACTIONS: DiscordTypes.GatewayIntentBits.DirectMessageReactions,
        DIRECT_MESSAGE_TYPING: DiscordTypes.GatewayIntentBits.DirectMessageTyping,
        MESSAGE_CONTENT: DiscordTypes.GatewayIntentBits.MessageContent,
        GUILD_SCHEDULED_EVENTS: DiscordTypes.GatewayIntentBits.GuildScheduledEvents
    },
    /**
     * The maximum length in bytes allowed for the `nonce` property in a [request guild members](https://discord.com/developers/docs/topics/gateway#request-guild-members) payload.
     */
    GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH: 32,
    /**
     * Privileged gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
     */
    GATEWAY_PRIVILEGED_INTENTS: {
        GUILD_MEMBERS: DiscordTypes.GatewayIntentBits.GuildMembers,
        GUILD_PRESENCES: DiscordTypes.GatewayIntentBits.GuildPresences,
        MESSAGE_CONTENT: DiscordTypes.GatewayIntentBits.MessageContent
    },
    /**
     * Gateway rate limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#rate-limiting)
     */
    GATEWAY_RATELIMITS: {
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
     * The cooldown between spawning shards from the same bucket.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
     */
    GATEWAY_SHARD_SPAWN_COOLDOWN: 5000,
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
     * Limits for message embed fields.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#embed-limits)
     */
    MESSAGE_EMBED_LIMITS: {
        AUTHOR_NAME: 256,
        DESCRIPTION: 4096,
        FIELD: {
            NAME: 256,
            VALUE: 1024
        },
        FIELDS: 25,
        FOOTER_TEXT: 2048,
        MAX_TOTAL_IN_MESSAGE: 6000,
        TITLE: 256
    },
    /**
     * Limits for creating messages.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    MESSAGE_LIMITS: {
        ATTACHMENTS: 10,
        CONTENT: 2000,
        EMBEDS: 10,
        MAX_DEFAULT_ATTACHMENTS_SIZE: 8388608
    },
    /**
     * Limits for modals.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal)
     */
    MODAL_LIMITS: {
        COMPONENTS: 5,
        CUSTOM_ID: 100,
        TITLE: 45
    },
    /**
     * Bitwise permission flags.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
     */
    PERMISSION_FLAGS: {
        CREATE_INSTANT_INVITE: DiscordTypes.PermissionFlagsBits.CreateInstantInvite,
        KICK_MEMBERS: DiscordTypes.PermissionFlagsBits.KickMembers,
        BAN_MEMBERS: DiscordTypes.PermissionFlagsBits.BanMembers,
        ADMINISTRATOR: DiscordTypes.PermissionFlagsBits.Administrator,
        MANAGE_CHANNELS: DiscordTypes.PermissionFlagsBits.ManageChannels,
        MANAGE_GUILD: DiscordTypes.PermissionFlagsBits.ManageGuild,
        ADD_REACTIONS: DiscordTypes.PermissionFlagsBits.AddReactions,
        VIEW_AUDIT_LOG: DiscordTypes.PermissionFlagsBits.ViewAuditLog,
        PRIORITY_SPEAKER: DiscordTypes.PermissionFlagsBits.PrioritySpeaker,
        STREAM: DiscordTypes.PermissionFlagsBits.Stream,
        VIEW_CHANNEL: DiscordTypes.PermissionFlagsBits.ViewChannel,
        SEND_MESSAGES: DiscordTypes.PermissionFlagsBits.SendMessages,
        SEND_TTS_MESSAGES: DiscordTypes.PermissionFlagsBits.SendTTSMessages,
        MANAGE_MESSAGES: DiscordTypes.PermissionFlagsBits.ManageMessages,
        EMBED_LINKS: DiscordTypes.PermissionFlagsBits.EmbedLinks,
        ATTACH_FILES: DiscordTypes.PermissionFlagsBits.AttachFiles,
        READ_MESSAGE_HISTORY: DiscordTypes.PermissionFlagsBits.ReadMessageHistory,
        MENTION_EVERYONE: DiscordTypes.PermissionFlagsBits.MentionEveryone,
        USE_EXTERNAL_EMOJIS: DiscordTypes.PermissionFlagsBits.UseExternalEmojis,
        VIEW_GUILD_INSIGHTS: DiscordTypes.PermissionFlagsBits.ViewGuildInsights,
        CONNECT: DiscordTypes.PermissionFlagsBits.Connect,
        SPEAK: DiscordTypes.PermissionFlagsBits.Speak,
        MUTE_MEMBERS: DiscordTypes.PermissionFlagsBits.MuteMembers,
        DEAFEN_MEMBERS: DiscordTypes.PermissionFlagsBits.DeafenMembers,
        MOVE_MEMBERS: DiscordTypes.PermissionFlagsBits.MoveMembers,
        USE_VAD: DiscordTypes.PermissionFlagsBits.UseVAD,
        CHANGE_NICKNAME: DiscordTypes.PermissionFlagsBits.ChangeNickname,
        MANAGE_NICKNAMES: DiscordTypes.PermissionFlagsBits.ManageNicknames,
        MANAGE_ROLES: DiscordTypes.PermissionFlagsBits.ManageRoles,
        MANAGE_WEBHOOKS: DiscordTypes.PermissionFlagsBits.ManageWebhooks,
        MANAGE_EMOJIS_AND_STICKERS: DiscordTypes.PermissionFlagsBits.ManageEmojisAndStickers,
        USE_APPLICATION_COMMANDS: DiscordTypes.PermissionFlagsBits.UseApplicationCommands,
        REQUEST_TO_SPEAK: DiscordTypes.PermissionFlagsBits.RequestToSpeak,
        MANAGE_EVENTS: DiscordTypes.PermissionFlagsBits.ManageEvents,
        MANAGE_THREADS: DiscordTypes.PermissionFlagsBits.ManageThreads,
        CREATE_PUBLIC_THREADS: DiscordTypes.PermissionFlagsBits.CreatePublicThreads,
        CREATE_PRIVATE_THREADS: DiscordTypes.PermissionFlagsBits.CreatePrivateThreads,
        USE_EXTERNAL_STICKERS: DiscordTypes.PermissionFlagsBits.UseExternalStickers,
        SEND_MESSAGES_IN_THREADS: DiscordTypes.PermissionFlagsBits.SendMessagesInThreads,
        USE_EMBEDDED_ACTIVITIES: DiscordTypes.PermissionFlagsBits.UseEmbeddedActivities,
        MODERATE_MEMBERS: DiscordTypes.PermissionFlagsBits.ModerateMembers
    },
    /**
     * Bitwise permission flags for when a user is timed out.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-for-timed-out-members)
     */
    PERMISSION_FLAGS_TIMEOUT: {
        VIEW_CHANNEL: DiscordTypes.PermissionFlagsBits.ViewChannel,
        READ_MESSAGE_HISTORY: DiscordTypes.PermissionFlagsBits.ReadMessageHistory
    },
    /**
     * The ending key where an error array is defined on a rest error.
     */
    REST_ERROR_KEY: `_errors`,
    /**
     * The amount of milliseconds after a message is created where it causes issues with rate limiting.
     * @see [GitHub Issue](https://github.com/discord/discord-api-docs/issues/1295)
     */
    REST_OLD_MESSAGE_THRESHOLD: 1209600000,
    /**
     * Rest rate limit headers.
     * Headers are lowercase to allow for easier comparison (`receivedHeader.toLowerCase() === REST_RATELIMIT_HEADERS.HEADER`), as some http libraries return headers in all uppercase or all lowercase.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/rate-limits#header-format)
     */
    REST_RATELIMIT_HEADERS: {
        LIMIT: `x-ratelimit-limit`,
        REMAINING: `x-ratelimit-remaining`,
        RESET: `x-ratelimit-reset`,
        RESET_AFTER: `x-ratelimit-reset-after`,
        BUCKET: `x-ratelimit-bucket`,
        GLOBAL: `x-ratelimit-global`,
        GLOBAL_RETRY_AFTER: `retry-after`,
        SCOPE: `x-ratelimit-scope`
    }
} as const;
