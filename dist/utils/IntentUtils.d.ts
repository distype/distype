/**
 * Dirty intents used in the intents factory.
 */
export type IntentUtilsFactoryDirty = number | bigint | Array<keyof typeof IntentUtils.INTENTS> | `all` | `nonPrivileged`;
/**
 * Utilities for gateway intents.
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
 */
export declare class IntentUtils {
    private constructor();
    /**
     * Named gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
     */
    static readonly INTENTS: {
        GUILDS: number;
        GUILD_MEMBERS: number;
        GUILD_MODERATION: number;
        GUILD_EMOJIS_AND_STICKERS: number;
        GUILD_INTEGRATIONS: number;
        GUILD_WEBHOOKS: number;
        GUILD_INVITES: number;
        GUILD_VOICE_STATES: number;
        GUILD_PRESENCES: number;
        GUILD_MESSAGES: number;
        GUILD_MESSAGE_REACTIONS: number;
        GUILD_MESSAGE_TYPING: number;
        DIRECT_MESSAGES: number;
        DIRECT_MESSAGE_REACTIONS: number;
        DIRECT_MESSAGE_TYPING: number;
        MESSAGE_CONTENT: number;
        GUILD_SCHEDULED_EVENTS: number;
        AUTO_MODERATION_CONFIGURATION: number;
        AUTO_MODERATION_EXECUTION: number;
    };
    /**
     * All gateway intents combined.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
     */
    static readonly COMBINED_INTENTS: number;
    /**
     * Privileged gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
     */
    static readonly PRIVILEGED_INTENTS: number;
    /**
     * Non privileged gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
     */
    static readonly NON_PRIVILEGED_INTENTS: number;
    /**
     * Intents factory.
     * Interprets intents from several data types.
     * @param intents The intents to interpret.
     * @returns Gateway intents.
     */
    static factory(intents: IntentUtilsFactoryDirty): number;
    /**
     * Converts intents to readable strings.
     * @param intents The intents to convert.
     */
    static toReadable(intents: number): Array<keyof typeof IntentUtils.INTENTS>;
}
