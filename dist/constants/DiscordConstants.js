"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordConstants = void 0;
const v10_1 = require("discord-api-types/v10");
/**
 * Discord API constants.
 */
exports.DiscordConstants = {
    /**
     * Application command limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure)
     */
    APPLICATION_COMMAND_LIMITS: {
        /**
         * The maximum number of choices an autocomplete response can specify.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete)
         */
        AUTOCOMPLETE_MAX_CHOICES: 25,
        /**
         * The maximum length for a command's name.
         */
        NAME: 32,
        /**
         * The maximum length for a command's description.
         */
        DESCRIPTION: 100,
        /**
         * Option limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
         */
        OPTION: {
            /**
             * The maximum length for an option's name.
             */
            NAME: 32,
            /**
             * The maximum length for an option's description.
             */
            DESCRIPTION: 100,
            /**
             * The maximum number of choices allowed.
             */
            CHOICES: 25
        },
        /**
         * The maximum number of options allowed.
         */
        OPTIONS: 25
    },
    /**
     * CDN constants.
     */
    CDN: {
        /**
         * Discord's CDN URL.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-base-url)
         */
        BASE_URL: `https://cdn.discordapp.com`,
        /**
         * Allowed image formats.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-formats)
         */
        IMAGE_FORMATS: [`gif`, `jpeg`, `jpg`, `json`, `png`, `webp`],
        /**
         * Allowed image sizes.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting)
         */
        IMAGE_SIZES: [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]
    },
    /**
     * The Discord epoch as a unix millisecond timestamp.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right)
     */
    DISCORD_EPOCH: 1420070400000,
    /**
     * Gateway related constants.
     */
    GATEWAY: {
        /**
         * Gateway intents.
         * Includes privileged intents.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
         */
        INTENTS: {
            GUILDS: v10_1.GatewayIntentBits.Guilds,
            GUILD_MEMBERS: v10_1.GatewayIntentBits.GuildMembers,
            GUILD_MODERATION: v10_1.GatewayIntentBits.GuildModeration,
            GUILD_EMOJIS_AND_STICKERS: v10_1.GatewayIntentBits.GuildEmojisAndStickers,
            GUILD_INTEGRATIONS: v10_1.GatewayIntentBits.GuildIntegrations,
            GUILD_WEBHOOKS: v10_1.GatewayIntentBits.GuildWebhooks,
            GUILD_INVITES: v10_1.GatewayIntentBits.GuildInvites,
            GUILD_VOICE_STATES: v10_1.GatewayIntentBits.GuildVoiceStates,
            GUILD_PRESENCES: v10_1.GatewayIntentBits.GuildPresences,
            GUILD_MESSAGES: v10_1.GatewayIntentBits.GuildMessages,
            GUILD_MESSAGE_REACTIONS: v10_1.GatewayIntentBits.GuildMessageReactions,
            GUILD_MESSAGE_TYPING: v10_1.GatewayIntentBits.GuildMessageTyping,
            DIRECT_MESSAGES: v10_1.GatewayIntentBits.DirectMessages,
            DIRECT_MESSAGE_REACTIONS: v10_1.GatewayIntentBits.DirectMessageReactions,
            DIRECT_MESSAGE_TYPING: v10_1.GatewayIntentBits.DirectMessageTyping,
            MESSAGE_CONTENT: v10_1.GatewayIntentBits.MessageContent,
            GUILD_SCHEDULED_EVENTS: v10_1.GatewayIntentBits.GuildScheduledEvents,
            AUTO_MODERATION_CONFIGURATION: v10_1.GatewayIntentBits.AutoModerationConfiguration,
            AUTO_MODERATION_EXECUTION: v10_1.GatewayIntentBits.AutoModerationExecution
        },
        /**
         * Privileged gateway intents.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
         */
        PRIVILEGED_INTENTS: {
            GUILD_MEMBERS: v10_1.GatewayIntentBits.GuildMembers,
            GUILD_PRESENCES: v10_1.GatewayIntentBits.GuildPresences,
            MESSAGE_CONTENT: v10_1.GatewayIntentBits.MessageContent
        },
        /**
         * Gateway rate limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#rate-limiting)
         */
        RATELIMITS: {
            /**
             * The number of commands allowed to be sent every `RESET_AFTER` milliseconds.
             */
            SEND_LIMIT: 120,
            /**
             * The amount of time in milliseconds that `SEND_LIMIT` is specified for.
             */
            SEND_RESET_AFTER: 60000,
            /**
             * The cooldown between spawning shards from the same bucket in milliseconds.
             * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
             */
            SHARD_SPAWN_COOLDOWN: 5000
        },
        /**
         * The maximum length in bytes allowed for the `nonce` property in a [request guild members](https://discord.com/developers/docs/topics/gateway#request-guild-members) payload.
         */
        REQUEST_GUILD_MEMBERS_MAX_NONCE_LENGTH: 32,
        /**
         * The default gateway API version used.
         */
        VERSION: 10
    },
    /**
     * Message component limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components)
     */
    MESSAGE_COMPONENT_LIMITS: {
        /**
         * Button limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components#button-object-button-structure)
         */
        BUTTON: {
            /**
             * The maximum length for a button's custom ID.
             */
            CUSTOM_ID: 100,
            /**
             * The maximum length for a button's label.
             */
            LABEL: 80
        },
        /**
         * Select menu limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components#select-menu-object)
         */
        SELECT_MENU: {
            /**
             * The maximum length for a select menu's custom ID.
             */
            CUSTOM_ID: 100,
            /**
             * Maximum value limits.
             */
            MAX_VALUES: {
                MIN: 1,
                MAX: 25
            },
            /**
             * Minimum value limits.
             */
            MIN_VALUES: {
                MIN: 0,
                MAX: 25
            },
            /**
             * Option limits.
             * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure)
             */
            OPTION: {
                /**
                 * The maximum length for an option's description.
                 */
                DESCRIPTION: 100,
                /**
                 * The maximum length for an option's label.
                 */
                LABEL: 100,
                /**
                 * The maximum length for an option's value.
                 */
                VALUE: 100
            },
            /**
             * The maximum number of options allowed.
             */
            OPTIONS: 25,
            /**
             * The maximum length for a select menu's placeholder.
             */
            PLACEHOLDER: 150
        },
        /**
         * Text input limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure)
         */
        TEXT_INPUT: {
            /**
             * The maximum length for a text input's custom ID.
             */
            CUSTOM_ID: 100,
            /**
             * The maximum length for a text input's label.
             */
            LABEL: 45,
            /**
             * Maximum value limits.
             */
            MAX_LENGTH: {
                MIN: 1,
                MAX: 4000
            },
            /**
             * Minimum value limits.
             */
            MIN_LENGTH: {
                MIN: 0,
                MAX: 4000
            },
            /**
             * The maximum length for a text input's placeholder.
             */
            PLACEHOLDER: 100,
            /**
             * The maximum length for a text input's value.
             */
            VALUE: 4000
        }
    },
    /**
     * Message limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    MESSAGE_LIMITS: {
        /**
         * The maximum number of attachments allowed.
         */
        ATTACHMENTS: 10,
        /**
         * The maximum length for a message's content.
         */
        CONTENT: 2000,
        /**
         * Embed limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#embed-limits)
         */
        EMBED: {
            /**
             * The maximum length for an embed's author.
             */
            AUTHOR_NAME: 256,
            /**
             * The maximum length for an embed's description.
             */
            DESCRIPTION: 4096,
            /**
             * Field limits.
             */
            FIELD: {
                /**
                 * The maximum length for a field's name.
                 */
                NAME: 256,
                /**
                 * The maximum length for a field's value.
                 */
                VALUE: 1024
            },
            /**
             * The maximum number of fields allowed.
             */
            FIELDS: 25,
            /**
             * The maximum length for an embed's footer.
             */
            FOOTER_TEXT: 2048,
            /**
             * The maximum length for an embed's title.
             */
            TITLE: 256
        },
        /**
         * The maximum number of embeds allowed.
         */
        EMBEDS: 10,
        /**
         * The maximum length allowed for the sum of all limited fields on all embeds in a single message.
         * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#embed-limits)
         */
        EMBEDS_LENGTH: 6000,
        /**
         * The maximum default attachment size.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#uploading-files)
         */
        MAX_DEFAULT_ATTACHMENTS_SIZE: 8388608
    },
    /**
     * Modal limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal)
     */
    MODAL_LIMITS: {
        /**
         * The maximum number of components allowed.
         */
        COMPONENTS: 5,
        /**
         * The maximum length for a modal's custom ID.
         */
        CUSTOM_ID: 100,
        /**
         * The maximum length for a modal's title.
         */
        TITLE: 45
    },
    /**
     * REST related constants.
     */
    REST: {
        /**
         * Discord's base API URL.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-reference-base-url)
         */
        BASE_URL: `https://discord.com/api`,
        /**
         * The ending key where an error array is defined on a rest error.
         */
        ERROR_KEY: `_errors`,
        /**
         * The amount of milliseconds after a message is created where it causes issues with rate limiting.
         * @see [GitHub Issue](https://github.com/discord/discord-api-docs/issues/1295)
         */
        OLD_MESSAGE_THRESHOLD: 1209600000,
        /**
         * Rest rate limit headers.
         * Headers are lowercase to allow for easier comparison (`receivedHeader.toLowerCase() === REST_RATELIMIT_HEADERS.HEADER`), as some http libraries return headers in all uppercase or all lowercase.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/rate-limits#header-format)
         */
        RATELIMIT_HEADERS: {
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
         * The default REST API version used.
         */
        VERSION: 10
    },
    /**
     * Bitwise permission flags.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
     */
    PERMISSION_FLAGS: {
        CREATE_INSTANT_INVITE: v10_1.PermissionFlagsBits.CreateInstantInvite,
        KICK_MEMBERS: v10_1.PermissionFlagsBits.KickMembers,
        BAN_MEMBERS: v10_1.PermissionFlagsBits.BanMembers,
        ADMINISTRATOR: v10_1.PermissionFlagsBits.Administrator,
        MANAGE_CHANNELS: v10_1.PermissionFlagsBits.ManageChannels,
        MANAGE_GUILD: v10_1.PermissionFlagsBits.ManageGuild,
        ADD_REACTIONS: v10_1.PermissionFlagsBits.AddReactions,
        VIEW_AUDIT_LOG: v10_1.PermissionFlagsBits.ViewAuditLog,
        PRIORITY_SPEAKER: v10_1.PermissionFlagsBits.PrioritySpeaker,
        STREAM: v10_1.PermissionFlagsBits.Stream,
        VIEW_CHANNEL: v10_1.PermissionFlagsBits.ViewChannel,
        SEND_MESSAGES: v10_1.PermissionFlagsBits.SendMessages,
        SEND_TTS_MESSAGES: v10_1.PermissionFlagsBits.SendTTSMessages,
        MANAGE_MESSAGES: v10_1.PermissionFlagsBits.ManageMessages,
        EMBED_LINKS: v10_1.PermissionFlagsBits.EmbedLinks,
        ATTACH_FILES: v10_1.PermissionFlagsBits.AttachFiles,
        READ_MESSAGE_HISTORY: v10_1.PermissionFlagsBits.ReadMessageHistory,
        MENTION_EVERYONE: v10_1.PermissionFlagsBits.MentionEveryone,
        USE_EXTERNAL_EMOJIS: v10_1.PermissionFlagsBits.UseExternalEmojis,
        VIEW_GUILD_INSIGHTS: v10_1.PermissionFlagsBits.ViewGuildInsights,
        CONNECT: v10_1.PermissionFlagsBits.Connect,
        SPEAK: v10_1.PermissionFlagsBits.Speak,
        MUTE_MEMBERS: v10_1.PermissionFlagsBits.MuteMembers,
        DEAFEN_MEMBERS: v10_1.PermissionFlagsBits.DeafenMembers,
        MOVE_MEMBERS: v10_1.PermissionFlagsBits.MoveMembers,
        USE_VAD: v10_1.PermissionFlagsBits.UseVAD,
        CHANGE_NICKNAME: v10_1.PermissionFlagsBits.ChangeNickname,
        MANAGE_NICKNAMES: v10_1.PermissionFlagsBits.ManageNicknames,
        MANAGE_ROLES: v10_1.PermissionFlagsBits.ManageRoles,
        MANAGE_WEBHOOKS: v10_1.PermissionFlagsBits.ManageWebhooks,
        MANAGE_EMOJIS_AND_STICKERS: v10_1.PermissionFlagsBits.ManageEmojisAndStickers,
        USE_APPLICATION_COMMANDS: v10_1.PermissionFlagsBits.UseApplicationCommands,
        REQUEST_TO_SPEAK: v10_1.PermissionFlagsBits.RequestToSpeak,
        MANAGE_EVENTS: v10_1.PermissionFlagsBits.ManageEvents,
        MANAGE_THREADS: v10_1.PermissionFlagsBits.ManageThreads,
        CREATE_PUBLIC_THREADS: v10_1.PermissionFlagsBits.CreatePublicThreads,
        CREATE_PRIVATE_THREADS: v10_1.PermissionFlagsBits.CreatePrivateThreads,
        USE_EXTERNAL_STICKERS: v10_1.PermissionFlagsBits.UseExternalStickers,
        SEND_MESSAGES_IN_THREADS: v10_1.PermissionFlagsBits.SendMessagesInThreads,
        USE_EMBEDDED_ACTIVITIES: v10_1.PermissionFlagsBits.UseEmbeddedActivities,
        MODERATE_MEMBERS: v10_1.PermissionFlagsBits.ModerateMembers
    },
    /**
     * Bitwise permission flags for when a user is timed out.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-for-timed-out-members)
     */
    PERMISSION_FLAGS_TIMEOUT: {
        VIEW_CHANNEL: v10_1.PermissionFlagsBits.ViewChannel,
        READ_MESSAGE_HISTORY: v10_1.PermissionFlagsBits.ReadMessageHistory
    }
};
