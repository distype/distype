"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordConstants = void 0;
const DiscordTypes = __importStar(require("discord-api-types/v10"));
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
         * Gateway [close event codes](https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes).
         */
        CLOSE_CODES: {
            /**
             * Close codes that a shard should attempt to reconnect after receiving.
             */
            RECONNECTABLE: [
                DiscordTypes.GatewayCloseCodes.UnknownError,
                DiscordTypes.GatewayCloseCodes.UnknownOpcode,
                DiscordTypes.GatewayCloseCodes.DecodeError,
                DiscordTypes.GatewayCloseCodes.NotAuthenticated,
                DiscordTypes.GatewayCloseCodes.AlreadyAuthenticated,
                DiscordTypes.GatewayCloseCodes.InvalidSeq,
                DiscordTypes.GatewayCloseCodes.RateLimited,
                DiscordTypes.GatewayCloseCodes.SessionTimedOut
            ],
            /**
             * Close codes that a shard should not attempt to reconnect after receiving.
             */
            NOT_RECONNECTABLE: [
                DiscordTypes.GatewayCloseCodes.AuthenticationFailed,
                DiscordTypes.GatewayCloseCodes.InvalidShard,
                DiscordTypes.GatewayCloseCodes.ShardingRequired,
                DiscordTypes.GatewayCloseCodes.InvalidAPIVersion,
                DiscordTypes.GatewayCloseCodes.InvalidIntents,
                DiscordTypes.GatewayCloseCodes.DisallowedIntents
            ]
        },
        /**
         * Gateway intents.
         * Includes privileged intents.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
         */
        INTENTS: {
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
         * Privileged gateway intents.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
         */
        PRIVILEGED_INTENTS: {
            GUILD_MEMBERS: DiscordTypes.GatewayIntentBits.GuildMembers,
            GUILD_PRESENCES: DiscordTypes.GatewayIntentBits.GuildPresences,
            MESSAGE_CONTENT: DiscordTypes.GatewayIntentBits.MessageContent
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
        REQUEST_GUILD_MEMBERS_MAX_NONCE_LENGTH: 32
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
        }
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
    }
};
