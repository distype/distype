import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from '../cache/CacheObjects';
import { CacheEventHandler } from '../cache/CacheEventHandler';
import { Client } from './Client';
import { DefaultOptions } from '../utils/DefaultOptions';
import { DiscordConstants } from '../utils/DiscordConstants';

import { AxiosRequestConfig } from 'axios';
import * as DiscordTypes from 'discord-api-types/v9';
import { ClientOptions as WsClientOptions } from 'ws';

/**
 * Options for the client.
 */
export interface ClientOptions {
    cache?: {
        /**
         * Cache control.
         * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
         * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
         * Defining an empty array (`[]`) will only cache the required data.
         * @default {}
         */
        cacheControl?: {
            channels?: Array<keyof Omit<CachedChannel, `id` | `guild_id`>>
            guilds?: Array<keyof Omit<CachedGuild, `id`>>
            members?: Array<keyof Omit<CachedMember, `user_id` | `guild_id`>>
            presences?: Array<keyof Omit<CachedPresence, `user_id` | `guild_id`>>
            roles?: Array<keyof Omit<CachedRole, `id` | `guild_id`>>
            users?: Array<keyof Omit<CachedUser, `id`>>
            voiceStates?: Array<keyof Omit<CachedVoiceState, `user_id` | `guild_id`>>
        }
        /**
         * A custom handler to use for updating the cache with incoming gateway events.
         * It is recommended that you leave this undefined, so that the built-in handler is used.
         */
        cacheEventHandler?: CacheEventHandler
    }
    gateway?: {
        /**
         * Gateway intents.
         * A numerical value is simply passed to the identify payload.
         * An array of intent names will only enable the specified intents.
         * `all` enables all intents, including privileged intents.
         * `nonPrivileged` enables all non-privileged intents.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
         * @default `nonPrivileged`
         */
        intents?: number | bigint | Array<keyof typeof DiscordConstants.INTENTS> | `all` | `nonPrivileged`
        /**
         * The number of members in a guild to reach before the gateway stops sending offline members in the guild member list.
         * Must be between `50` and `250`.
         * Note that if undefined, Discord automatically uses their default of `50`.
         * @default undefined
         */
        largeGuildThreshold?: number
        /**
         * The initial presence for the bot to use.
         * @default undefined
         */
        presence?: Required<DiscordTypes.GatewayIdentifyData>[`presence`]
        /**
         * Gateway sharding.
         * Unless you are using a custom scaling solution (for example, running your bot across numerous servers or processes), it is recommended that you leave all of these options undefined.
         * If you wish to manually specify the number of shards to spawn across your bot, you only need to set `GatewayOptions#sharding#totalBotShards`.
         *
         * When using a `Client`, specified options are passed directly to the gateway manager, without manipulation.
         *
         * When using a `ClientMaster` and `ClientWorker`, specified options are adapted internally to evenly distribute shards across workers.
         * Because these options are specified on `ClientMaster`, they act as if they're dictating 1 `Client` / `Gateway` instance.
         * This means that the options parameter of a `Gateway` instance may not exactly reflect the options specified.
         * - `GatewayOptions#sharding#totalBotShards` - Stays the same.
         * - `GatewayOptions#sharding#shards` - The amount of shards that will be spawned across all `ClientWorker`s. An individual `ClientWorker` will have `numWorkers / (totalBotShards - offset)` shards. This option does not have to be a multiple of the number of workers spawned; a non-multiple being specified will simply result in some workers having less shards. This is useful if you only wish to spawn a fraction of your bot's total shards on once instance.
         * - `GatewayOptions#sharding#offset` - The amount of shards to offset spawning by across all `ClientWorker`s. This option is adapted to have the "first" `ClientWorker` start at the specified offset, then following workers will be offset by the initial offset in addition to the number of shards spawned in previous workers. This option is useful if you are scaling your bot across numerous servers or processes.
         *
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
         */
         sharding: {
            /**
             * The number of shards the bot will have in total.
             * This value is used for the `num_shards` property sent in the identify payload.
             * **This is NOT the amount of shards the process will spawn. For that option, specify `GatewayOptions#sharding#shards`.**
             * `auto` will use the recommended number from Discord.
             */
            totalBotShards?: number | `auto`
            /**
             * The amount of shards to spawn.
             * By default, `GatewayOptions#sharding#totalBotShards` is used.
             */
            shards?: number
            /**
             * The number of shards to offset spawning by.
             *
             * For example, with the following configuration, the last 2 of the total 4 shards would be spawned.
             * ```ts
             * const gatewayOptions: GatewayOptions = {
             *   sharding: {
             *     totalBotShards: 4,
             *     shards: 2,
             *     offset: 2
             *   }
             * }
             * ```
             * This option should only be manually defined if you are using a custom scaling solution externally from the library and hosting multiple instances of your bot, to prevent unexpected behavior.
             */
            offset?: number
        }
        /**
         * The number of milliseconds to wait between spawn and resume attempts.
         * @default 2500
         */
        spawnAttemptDelay?: number
        /**
         * The maximum number of spawn attempts before rejecting.
         * @default 10
         */
        spawnMaxAttempts?: number
        /**
         * The time in milliseconds to wait until considering a spawn or resume attempt timed out.
         * @default 30000
         */
        spawnTimeout?: number
        /**
         * Advanced [ws](https://github.com/websockets/ws) options.
         * [`ws` API Reference](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketaddress-protocols-options)
         * @default undefined
         */
        wsOptions?: WsClientOptions
        /**
         * The Gateway version to use.
         * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateways-gateway-versions)
         * @default 9
         */
        version: number
    }
    rest?: Omit<AxiosRequestConfig, `auth` | `baseURL` | `data` | `method` | `params` | `responseType` | `signal` | `transitional` | `url`> & {
        /**
         * The API version to use.
         * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-versioning-api-versions)
         * @default 9
         */
        version?: number
    }
}

/**
 * Converts specified client options into complete client options.
 * @param options Provided options.
 * @returns Complete options.
 * @internal
 */
export const optionsFactory = (options: ClientOptions): Client[`options`] => {
    let intents: number;
    if (typeof options.gateway?.intents === `number`) intents = options.gateway?.intents;
    else if (typeof options.gateway?.intents === `bigint`) intents = Number(options.gateway?.intents);
    else if (options.gateway?.intents instanceof Array) intents = options.gateway?.intents.reduce((p, c) => p | DiscordConstants.INTENTS[c], 0);
    else if (options.gateway?.intents === `all`) intents = Object.values(DiscordConstants.INTENTS).reduce((p, c) => p | c, 0);
    else intents = Object.values(DiscordConstants.PRIVILEGED_INTENTS).reduce((p, c) => p & ~c, Object.values(DiscordConstants.INTENTS).reduce((p, c) => p | c, 0 as number));

    return {
        cache: {
            cacheControl: options.cache?.cacheControl ?? DefaultOptions.CACHE.cacheControl,
            cacheEventHandler: options.cache?.cacheEventHandler ?? DefaultOptions.CACHE.cacheEventHandler
        },
        gateway: {
            intents,
            largeGuildThreshold: options.gateway?.largeGuildThreshold ?? DefaultOptions.GATEWAY.largeGuildThreshold,
            presence: options.gateway?.presence ?? DefaultOptions.GATEWAY.presence,
            sharding: options.gateway?.sharding ?? DefaultOptions.GATEWAY.sharding,
            spawnAttemptDelay: options.gateway?.spawnAttemptDelay ?? DefaultOptions.GATEWAY.spawnAttemptDelay,
            spawnMaxAttempts: options.gateway?.spawnMaxAttempts ?? DefaultOptions.GATEWAY.spawnMaxAttempts,
            spawnTimeout: options.gateway?.spawnTimeout ?? DefaultOptions.GATEWAY.spawnTimeout,
            version: options.gateway?.version ?? DefaultOptions.GATEWAY.version,
            wsOptions: options.gateway?.wsOptions ?? DefaultOptions.GATEWAY.wsOptions
        },
        rest: {
            code500retries: 2,
            ratelimits: {
                globalPerSecond: 50,
                offset: 20,
                reject: false
            },
            timeout: 15000,
            version: options.rest?.version ?? DefaultOptions.REST.version
        }
    };
};
