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
        sharding: {
            totalBotShards: options.sharding?.totalBotShards ?? `auto`,
            shards: (options.sharding?.shards ?? options.sharding?.totalBotShards) ?? `auto`,
            offset: options.sharding?.offset ?? 0
        },
        shardOptions: {
            attemptDelay: options.shardOptions?.attemptDelay ?? 2500,
            maxSpawnAttempts: options.shardOptions?.maxSpawnAttempts ?? 10,
            timeouts: options.shardOptions?.timeouts ?? {},
            wsOptions: options.shardOptions?.wsOptions ?? {},
        }
    };
};
exports.completeGatewayOptions = completeGatewayOptions;