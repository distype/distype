/**
 * Dirty intents used in the intents factory.
 */
export type IntentUtilsFactoryDirty = number | bigint | Array<keyof typeof IntentUtils.INTENTS> | `all` | `nonPrivileged`

/**
 * Utilities for gateway intents.
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
 */
export class IntentUtils {
    private constructor () {} // eslint-disable-line no-useless-constructor

    /**
     * Named gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
     */
    public static readonly INTENTS = {
        GUILDS: 1 << 0,
        GUILD_MEMBERS: 1 << 1,
        GUILD_MODERATION: 1 << 2,
        GUILD_EMOJIS_AND_STICKERS: 1 << 3,
        GUILD_INTEGRATIONS: 1 << 4,
        GUILD_WEBHOOKS: 1 << 5,
        GUILD_INVITES: 1 << 6,
        GUILD_VOICE_STATES: 1 << 7,
        GUILD_PRESENCES: 1 << 8,
        GUILD_MESSAGES: 1 << 9,
        GUILD_MESSAGE_REACTIONS: 1 << 10,
        GUILD_MESSAGE_TYPING: 1 << 11,
        DIRECT_MESSAGES: 1 << 12,
        DIRECT_MESSAGE_REACTIONS: 1 << 13,
        DIRECT_MESSAGE_TYPING: 1 << 14,
        MESSAGE_CONTENT: 1 << 15,
        GUILD_SCHEDULED_EVENTS: 1 << 16,
        AUTO_MODERATION_CONFIGURATION: 1 << 20,
        AUTO_MODERATION_EXECUTION: 1 << 21
    };

    /**
     * All gateway intents combined.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
     */
    public static readonly COMBINED_INTENTS = Object.values(this.INTENTS).reduce((p, c) => p | c, 0);

    /**
     * Privileged gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
     */
    public static readonly PRIVILEGED_INTENTS = this.INTENTS.GUILD_MEMBERS & this.INTENTS.GUILD_PRESENCES & this.INTENTS.MESSAGE_CONTENT;

    /**
     * Non privileged gateway intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#privileged-intents)
     */
    public static readonly NON_PRIVILEGED_INTENTS = this.COMBINED_INTENTS & ~this.PRIVILEGED_INTENTS;

    /**
     * Intents factory.
     * Interprets intents from several data types.
     * @param intents The intents to interpret.
     * @returns Gateway intents.
     */
    public static factory (intents: IntentUtilsFactoryDirty): number {
        if (typeof intents === `number`) return intents;
        else if (typeof intents === `bigint`) return Number(intents);
        else if (intents instanceof Array) return intents.reduce((p, c) => p | this.INTENTS[c], 0);
        else if (intents === `all`) return this.COMBINED_INTENTS;
        else if (intents === `nonPrivileged`) return this.NON_PRIVILEGED_INTENTS;
        else return 0;
    }

    /**
     * Converts intents to readable strings.
     * @param intents The intents to convert.
     */
    public static toReadable (intents: number): Array<keyof typeof IntentUtils.INTENTS> {
        return (Object.keys(this.INTENTS) as Array<keyof typeof IntentUtils.INTENTS>).filter((key) => intents & IntentUtils.INTENTS[key]);
    }
}
