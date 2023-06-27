import { DiscordConstants } from '../constants/DiscordConstants';

/**
 * Dirty intents used in the intents factory.
 */
export type IntentUtilsFactoryDirty = number | bigint | Array<keyof typeof DiscordConstants.GATEWAY.INTENTS> | `all` | `nonPrivileged`

/**
 * Utilities for gateway intents.
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
 */
export class IntentUtils {
    private constructor () {} // eslint-disable-line no-useless-constructor

    /**
     * All intents.
     */
    public static get allIntents (): number {
        return Object.values(DiscordConstants.GATEWAY.INTENTS).reduce((p, c) => p | c, 0);
    }

    /**
     * Privileged intents.
     */
    public static get privilegedIntents (): number {
        return Object.values(DiscordConstants.GATEWAY.PRIVILEGED_INTENTS).reduce((p, c) => p | c, 0);
    }

    /**
     * Non privileged intents.
     */
    public static get nonPrivilegedIntents (): number {
        return Object.values(DiscordConstants.GATEWAY.INTENTS).reduce((p, c) => p | c, 0) & ~Object.values(DiscordConstants.GATEWAY.PRIVILEGED_INTENTS).reduce((p, c) => p | c, 0);
    }

    /**
     * Intents factory.
     * Interprets intents from several data types.
     * @param intents The intents to interpret.
     * @returns Gateway intents.
     */
    public static factory (intents: IntentUtilsFactoryDirty): number {
        if (typeof intents === `number`) return intents;
        else if (typeof intents === `bigint`) return Number(intents);
        else if (intents instanceof Array) return intents.reduce((p, c) => p | DiscordConstants.GATEWAY.INTENTS[c], 0);
        else if (intents === `all`) return this.allIntents;
        else if (intents === `nonPrivileged`) return this.nonPrivilegedIntents;
        else return 0;
    }

    /**
     * Converts intents to readable strings.
     * @param intents The intents to convert.
     */
    public static toReadable (intents: number): Array<keyof typeof DiscordConstants.GATEWAY.INTENTS> {
        return (Object.keys(DiscordConstants.GATEWAY.INTENTS) as Array<keyof typeof DiscordConstants.GATEWAY.INTENTS>).filter((key) => intents & DiscordConstants.GATEWAY.INTENTS[key]);
    }
}
