"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentUtils = void 0;
const DiscordConstants_1 = require("../constants/DiscordConstants");
/**
 * Utilities for gateway intents.
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
 */
class IntentUtils {
    constructor() { } // eslint-disable-line no-useless-constructor
    /**
     * All intents.
     */
    static get allIntents() {
        return Object.values(DiscordConstants_1.DiscordConstants.GATEWAY.INTENTS).reduce((p, c) => p | c, 0);
    }
    /**
     * Privileged intents.
     */
    static get privilegedIntents() {
        return Object.values(DiscordConstants_1.DiscordConstants.GATEWAY.PRIVILEGED_INTENTS).reduce((p, c) => p | c, 0);
    }
    /**
     * Non privileged intents.
     */
    static get nonPrivilegedIntents() {
        return Object.values(DiscordConstants_1.DiscordConstants.GATEWAY.INTENTS).reduce((p, c) => p | c, 0) & ~Object.values(DiscordConstants_1.DiscordConstants.GATEWAY.PRIVILEGED_INTENTS).reduce((p, c) => p | c, 0);
    }
    /**
     * Intents factory.
     * Interprets intents from several data types.
     * @param intents The intents to interpret.
     * @returns Gateway intents.
     */
    static factory(intents) {
        if (typeof intents === `number`)
            return intents;
        else if (typeof intents === `bigint`)
            return Number(intents);
        else if (intents instanceof Array)
            return intents.reduce((p, c) => p | DiscordConstants_1.DiscordConstants.GATEWAY.INTENTS[c], 0);
        else if (intents === `all`)
            return this.allIntents;
        else if (intents === `nonPrivileged`)
            return this.nonPrivilegedIntents;
        else
            return 0;
    }
    /**
     * Converts intents to readable strings.
     * @param intents The intents to convert.
     */
    static toReadable(intents) {
        return Object.keys(DiscordConstants_1.DiscordConstants.GATEWAY.INTENTS).filter((key) => intents & DiscordConstants_1.DiscordConstants.GATEWAY.INTENTS[key]);
    }
}
exports.IntentUtils = IntentUtils;
