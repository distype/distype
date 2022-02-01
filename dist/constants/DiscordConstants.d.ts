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
     * Limits for embed fields.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#embed-limits)
     */
    readonly EMBED_LIMITS: {
        readonly TITLE: 256;
        readonly DESCRIPTION: 4096;
        readonly FIELDS: 25;
        readonly FIELD: {
            readonly NAME: 256;
            readonly VALUE: 1024;
        };
        readonly FOOTER_TEXT: 2048;
        readonly AUTHOR_NAME: 256;
        readonly MAX_TOTAL_IN_MESSAGE: 6000;
    };
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
     * Allowed image formats.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting-image-formats)
     */
    readonly IMAGE_FORMATS: readonly ["gif", "jpeg", "jpg", "json", "png", "webp"];
    /**
     * Allowed image sizes.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#image-formatting)
     */
    readonly IMAGE_SIZES: readonly [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
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
        readonly START_EMBEDDED_ACTIVITIES: bigint;
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
     * The cooldown between spawning shards from the same bucket.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
     */
    readonly SHARD_SPAWN_COOLDOWN: 5000;
};
