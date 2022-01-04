"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsFactory = void 0;
const CacheEventHandler_1 = require("../cache/CacheEventHandler");
const DiscordConstants_1 = require("../utils/DiscordConstants");
const optionsFactory = (options) => {
    let intents;
    if (typeof options.gateway?.intents === `number`)
        intents = options.gateway?.intents;
    else if (typeof options.gateway?.intents === `bigint`)
        intents = Number(options.gateway?.intents);
    else if (options.gateway?.intents instanceof Array)
        intents = options.gateway?.intents.reduce((p, c) => p | DiscordConstants_1.DiscordConstants.INTENTS[c], 0);
    else if (options.gateway?.intents === `all`)
        intents = Object.values(DiscordConstants_1.DiscordConstants.INTENTS).reduce((p, c) => p | c, 0);
    else
        intents = Object.values(DiscordConstants_1.DiscordConstants.PRIVILEGED_INTENTS).reduce((p, c) => p & ~c, Object.values(DiscordConstants_1.DiscordConstants.INTENTS).reduce((p, c) => p | c, 0));
    return {
        cache: {
            cacheControl: options.cache?.cacheControl ?? {},
            cacheEventHandler: options.cache?.cacheEventHandler ?? CacheEventHandler_1.cacheEventHandler
        },
        gateway: {
            intents,
            largeGuildThreshold: options.gateway?.largeGuildThreshold ?? undefined,
            presence: options.gateway?.presence ?? undefined,
            sharding: options.gateway?.sharding ?? {},
            spawnAttemptDelay: options.gateway?.spawnAttemptDelay ?? 2500,
            spawnMaxAttempts: options.gateway?.spawnMaxAttempts ?? 10,
            spawnTimeout: options.gateway?.spawnTimeout ?? 30000,
            version: options.gateway?.version ?? 9,
            wsOptions: options.gateway?.wsOptions ?? undefined
        },
        rest: options.rest ?? {}
    };
};
exports.optionsFactory = optionsFactory;
