import { DiscordConstants } from '../constants/DiscordConstants';
/**
 * Dirty intents used in the intents factory.
 */
export type IntentUtilsFactoryDirty = number | bigint | Array<keyof typeof DiscordConstants.GATEWAY.INTENTS> | `all` | `nonPrivileged`;
/**
 * Utilities for gateway intents.
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
 */
export declare class IntentUtils {
    private constructor();
    /**
     * All intents.
     */
    static get allIntents(): number;
    /**
     * Privileged intents.
     */
    static get privilegedIntents(): number;
    /**
     * Non privileged intents.
     */
    static get nonPrivilegedIntents(): number;
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
    static toReadable(intents: number): Array<keyof typeof DiscordConstants.GATEWAY.INTENTS>;
}
