import { GatewayIntentBits } from 'discord-api-types/v10';
/**
 * Discord API constants.
 */
export declare const DiscordConstants: {
    /**
     * Application command limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure)
     */
    readonly APPLICATION_COMMAND_LIMITS: {
        /**
         * The maximum number of choices an autocomplete response can specify.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete)
         */
        readonly AUTOCOMPLETE_MAX_CHOICES: 25;
        /**
         * The maximum length for a command's name.
         */
        readonly NAME: 32;
        /**
         * The maximum length for a command's description.
         */
        readonly DESCRIPTION: 100;
        /**
         * Option limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure)
         */
        readonly OPTION: {
            /**
             * The maximum length for an option's name.
             */
            readonly NAME: 32;
            /**
             * The maximum length for an option's description.
             */
            readonly DESCRIPTION: 100;
            /**
             * The maximum number of choices allowed.
             */
            readonly CHOICES: 25;
        };
        /**
         * The maximum number of options allowed.
         */
        readonly OPTIONS: 25;
    };
    /**
     * CDN constants.
     */
    readonly CDN: {
        /**
         * Discord's CDN URL.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-base-url)
         */
        readonly BASE_URL: "https://cdn.discordapp.com";
        /**
         * Allowed image formats.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-formats)
         */
        readonly IMAGE_FORMATS: readonly ["gif", "jpeg", "jpg", "json", "png", "webp"];
        /**
         * Allowed image sizes.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting)
         */
        readonly IMAGE_SIZES: readonly [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
    };
    /**
     * The Discord epoch as a unix millisecond timestamp.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right)
     */
    readonly DISCORD_EPOCH: 1420070400000;
    /**
     * Gateway related constants.
     */
    readonly GATEWAY: {
        /**
         * Gateway intents.
         * Includes privileged intents.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
         */
        readonly INTENTS: {
            readonly GUILDS: GatewayIntentBits.Guilds;
            readonly GUILD_MEMBERS: GatewayIntentBits.GuildMembers;
            readonly GUILD_MODERATION: GatewayIntentBits.GuildModeration;
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
            readonly MESSAGE_CONTENT: GatewayIntentBits.MessageContent;
            readonly GUILD_SCHEDULED_EVENTS: GatewayIntentBits.GuildScheduledEvents;
            readonly AUTO_MODERATION_CONFIGURATION: GatewayIntentBits.AutoModerationConfiguration;
            readonly AUTO_MODERATION_EXECUTION: GatewayIntentBits.AutoModerationExecution;
        };
        /**
         * Privileged gateway intents.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
         */
        readonly PRIVILEGED_INTENTS: {
            readonly GUILD_MEMBERS: GatewayIntentBits.GuildMembers;
            readonly GUILD_PRESENCES: GatewayIntentBits.GuildPresences;
            readonly MESSAGE_CONTENT: GatewayIntentBits.MessageContent;
        };
        /**
         * Gateway rate limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#rate-limiting)
         */
        readonly RATELIMITS: {
            /**
             * The number of commands allowed to be sent every `RESET_AFTER` milliseconds.
             */
            readonly SEND_LIMIT: 120;
            /**
             * The amount of time in milliseconds that `SEND_LIMIT` is specified for.
             */
            readonly SEND_RESET_AFTER: 60000;
            /**
             * The cooldown between spawning shards from the same bucket in milliseconds.
             * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
             */
            readonly SHARD_SPAWN_COOLDOWN: 5000;
        };
        /**
         * The maximum length in bytes allowed for the `nonce` property in a [request guild members](https://discord.com/developers/docs/topics/gateway#request-guild-members) payload.
         */
        readonly REQUEST_GUILD_MEMBERS_MAX_NONCE_LENGTH: 32;
        /**
         * The default gateway API version used.
         */
        readonly VERSION: 10;
    };
    /**
     * Message component limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components)
     */
    readonly MESSAGE_COMPONENT_LIMITS: {
        /**
         * Button limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components#button-object-button-structure)
         */
        readonly BUTTON: {
            /**
             * The maximum length for a button's custom ID.
             */
            readonly CUSTOM_ID: 100;
            /**
             * The maximum length for a button's label.
             */
            readonly LABEL: 80;
        };
        /**
         * Select menu limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components#select-menu-object)
         */
        readonly SELECT_MENU: {
            /**
             * The maximum length for a select menu's custom ID.
             */
            readonly CUSTOM_ID: 100;
            /**
             * Maximum value limits.
             */
            readonly MAX_VALUES: {
                readonly MIN: 1;
                readonly MAX: 25;
            };
            /**
             * Minimum value limits.
             */
            readonly MIN_VALUES: {
                readonly MIN: 0;
                readonly MAX: 25;
            };
            /**
             * Option limits.
             * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure)
             */
            readonly OPTION: {
                /**
                 * The maximum length for an option's description.
                 */
                readonly DESCRIPTION: 100;
                /**
                 * The maximum length for an option's label.
                 */
                readonly LABEL: 100;
                /**
                 * The maximum length for an option's value.
                 */
                readonly VALUE: 100;
            };
            /**
             * The maximum number of options allowed.
             */
            readonly OPTIONS: 25;
            /**
             * The maximum length for a select menu's placeholder.
             */
            readonly PLACEHOLDER: 150;
        };
        /**
         * Text input limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-structure)
         */
        readonly TEXT_INPUT: {
            /**
             * The maximum length for a text input's custom ID.
             */
            readonly CUSTOM_ID: 100;
            /**
             * The maximum length for a text input's label.
             */
            readonly LABEL: 45;
            /**
             * Maximum value limits.
             */
            readonly MAX_LENGTH: {
                readonly MIN: 1;
                readonly MAX: 4000;
            };
            /**
             * Minimum value limits.
             */
            readonly MIN_LENGTH: {
                readonly MIN: 0;
                readonly MAX: 4000;
            };
            /**
             * The maximum length for a text input's placeholder.
             */
            readonly PLACEHOLDER: 100;
            /**
             * The maximum length for a text input's value.
             */
            readonly VALUE: 4000;
        };
    };
    /**
     * Message limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    readonly MESSAGE_LIMITS: {
        /**
         * The maximum number of attachments allowed.
         */
        readonly ATTACHMENTS: 10;
        /**
         * The maximum length for a message's content.
         */
        readonly CONTENT: 2000;
        /**
         * Embed limits.
         * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#embed-limits)
         */
        readonly EMBED: {
            /**
             * The maximum length for an embed's author.
             */
            readonly AUTHOR_NAME: 256;
            /**
             * The maximum length for an embed's description.
             */
            readonly DESCRIPTION: 4096;
            /**
             * Field limits.
             */
            readonly FIELD: {
                /**
                 * The maximum length for a field's name.
                 */
                readonly NAME: 256;
                /**
                 * The maximum length for a field's value.
                 */
                readonly VALUE: 1024;
            };
            /**
             * The maximum number of fields allowed.
             */
            readonly FIELDS: 25;
            /**
             * The maximum length for an embed's footer.
             */
            readonly FOOTER_TEXT: 2048;
            /**
             * The maximum length for an embed's title.
             */
            readonly TITLE: 256;
        };
        /**
         * The maximum number of embeds allowed.
         */
        readonly EMBEDS: 10;
        /**
         * The maximum length allowed for the sum of all limited fields on all embeds in a single message.
         * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#embed-limits)
         */
        readonly EMBEDS_LENGTH: 6000;
        /**
         * The maximum default attachment size.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#uploading-files)
         */
        readonly MAX_DEFAULT_ATTACHMENTS_SIZE: 8388608;
    };
    /**
     * Modal limits.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-modal)
     */
    readonly MODAL_LIMITS: {
        /**
         * The maximum number of components allowed.
         */
        readonly COMPONENTS: 5;
        /**
         * The maximum length for a modal's custom ID.
         */
        readonly CUSTOM_ID: 100;
        /**
         * The maximum length for a modal's title.
         */
        readonly TITLE: 45;
    };
    /**
     * REST related constants.
     */
    readonly REST: {
        /**
         * Discord's base API URL.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-reference-base-url)
         */
        readonly BASE_URL: "https://discord.com/api";
        /**
         * The ending key where an error array is defined on a rest error.
         */
        readonly ERROR_KEY: "_errors";
        /**
         * The amount of milliseconds after a message is created where it causes issues with rate limiting.
         * @see [GitHub Issue](https://github.com/discord/discord-api-docs/issues/1295)
         */
        readonly OLD_MESSAGE_THRESHOLD: 1209600000;
        /**
         * Rest rate limit headers.
         * Headers are lowercase to allow for easier comparison (`receivedHeader.toLowerCase() === REST_RATELIMIT_HEADERS.HEADER`), as some http libraries return headers in all uppercase or all lowercase.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/rate-limits#header-format)
         */
        readonly RATELIMIT_HEADERS: {
            readonly LIMIT: "x-ratelimit-limit";
            readonly REMAINING: "x-ratelimit-remaining";
            readonly RESET: "x-ratelimit-reset";
            readonly RESET_AFTER: "x-ratelimit-reset-after";
            readonly BUCKET: "x-ratelimit-bucket";
            readonly GLOBAL: "x-ratelimit-global";
            readonly GLOBAL_RETRY_AFTER: "retry-after";
            readonly SCOPE: "x-ratelimit-scope";
        };
        /**
         * The default REST API version used.
         */
        readonly VERSION: 10;
    };
    /**
     * Bitwise permission flags.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)
     */
    readonly PERMISSION_FLAGS: {
        readonly CREATE_INSTANT_INVITE: bigint;
        readonly KICK_MEMBERS: bigint;
        readonly BAN_MEMBERS: bigint;
        readonly ADMINISTRATOR: bigint;
        readonly MANAGE_CHANNELS: bigint;
        readonly MANAGE_GUILD: bigint;
        readonly ADD_REACTIONS: bigint;
        readonly VIEW_AUDIT_LOG: bigint;
        readonly PRIORITY_SPEAKER: bigint;
        readonly STREAM: bigint;
        readonly VIEW_CHANNEL: bigint;
        readonly SEND_MESSAGES: bigint;
        readonly SEND_TTS_MESSAGES: bigint;
        readonly MANAGE_MESSAGES: bigint;
        readonly EMBED_LINKS: bigint;
        readonly ATTACH_FILES: bigint;
        readonly READ_MESSAGE_HISTORY: bigint;
        readonly MENTION_EVERYONE: bigint;
        readonly USE_EXTERNAL_EMOJIS: bigint;
        readonly VIEW_GUILD_INSIGHTS: bigint;
        readonly CONNECT: bigint;
        readonly SPEAK: bigint;
        readonly MUTE_MEMBERS: bigint;
        readonly DEAFEN_MEMBERS: bigint;
        readonly MOVE_MEMBERS: bigint;
        readonly USE_VAD: bigint;
        readonly CHANGE_NICKNAME: bigint;
        readonly MANAGE_NICKNAMES: bigint;
        readonly MANAGE_ROLES: bigint;
        readonly MANAGE_WEBHOOKS: bigint;
        readonly MANAGE_EMOJIS_AND_STICKERS: bigint;
        readonly USE_APPLICATION_COMMANDS: bigint;
        readonly REQUEST_TO_SPEAK: bigint;
        readonly MANAGE_EVENTS: bigint;
        readonly MANAGE_THREADS: bigint;
        readonly CREATE_PUBLIC_THREADS: bigint;
        readonly CREATE_PRIVATE_THREADS: bigint;
        readonly USE_EXTERNAL_STICKERS: bigint;
        readonly SEND_MESSAGES_IN_THREADS: bigint;
        readonly USE_EMBEDDED_ACTIVITIES: bigint;
        readonly MODERATE_MEMBERS: bigint;
    };
    /**
     * Bitwise permission flags for when a user is timed out.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/permissions#permissions-for-timed-out-members)
     */
    readonly PERMISSION_FLAGS_TIMEOUT: {
        readonly VIEW_CHANNEL: bigint;
        readonly READ_MESSAGE_HISTORY: bigint;
    };
};
