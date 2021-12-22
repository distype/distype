"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeGatewayOptions = void 0;
const DiscordConstants_1 = require("../utils/DiscordConstants");
/**
 * Completes specified options for the gateway manager.
 * @param options Specified options for the manager.
 * @returns Complete options.
 */
const completeGatewayOptions = (options) => {
    let intents;
    if (typeof options.intents === `number`)
        intents = options.intents;
    else if (typeof options.intents === `bigint`)
        intents = Number(options.intents);
    else if (options.intents instanceof Array)
        intents = options.intents.reduce((p, c) => p | DiscordConstants_1.DiscordConstants.INTENTS[c], 0);
    else if (options.intents === `all`)
        intents = Object.values(DiscordConstants_1.DiscordConstants.INTENTS).reduce((p, c) => p | c, 0);
    else
        intents = Object.values(DiscordConstants_1.DiscordConstants.PRIVILEGED_INTENTS).reduce((p, c) => p & ~c, Object.values(DiscordConstants_1.DiscordConstants.INTENTS).reduce((p, c) => p | c, 0));
    return {
        intents,
        largeGuildThreshold: options.largeGuildThreshold ?? 50,
        presence: options.presence ?? {
            activities: [],
            afk: false,
            since: null,
            status: "online" /* Online */
        },
        sharding: options.sharding ?? {},
        spawnAttemptDelay: options.spawnAttemptDelay ?? 2500,
        spawnMaxAttempts: options.spawnMaxAttempts ?? 10,
        spawnTimeout: options.spawnTimeout ?? 30000,
        wsOptions: options.wsOptions ?? {}
    };
};
exports.completeGatewayOptions = completeGatewayOptions;
