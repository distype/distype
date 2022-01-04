import { GatewayIntentBits } from 'discord-api-types';
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
     * Privileged gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
     */
    readonly PRIVILEGED_INTENTS: {
        readonly GUILD_MEMBERS: GatewayIntentBits.GuildMembers;
        readonly GUILD_PRESENCES: GatewayIntentBits.GuildPresences;
    };
    /**
     * The cooldown between spawning shards from the same bucket.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
     */
    readonly SHARD_SPAWN_COOLDOWN: 5000;
};
