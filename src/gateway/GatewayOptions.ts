import { GatewayPresenceUpdateData } from './Gateway';

import { IntentUtilsFactoryDirty } from '../utils/IntentUtils';

import * as DiscordTypes from 'discord-api-types/v10';
import { ClientOptions as WsClientOptions } from 'ws';

/**
 * {@link Gateway} options.
 */
export interface GatewayOptions {
    /**
     * A custom socket URL to connect to.
     * Useful if you use a proxy to connect to the Discord gateway.
     * If `customGatewayBotEndpoint` is defined, its response's `url` parameter is overwritten by this.
     * Note that [gateway URL query parameters](https://discord.com/developers/docs/topics/gateway#connecting-gateway-url-query-string-params) will still be sent.
     * @default null
     */
    customGatewaySocketURL?: string | null
    /**
     * If `customGatewaySocketURL` is defined and this is `true`, the `resume_gateway_url` field in the [READY](https://discord.com/developers/docs/topics/gateway#ready) dispatch is used instead of the `customGatewaySocketURL`.
     * Otherwise, if `customGatewaySocketURL` is defined, it's used for connecting and resuming.
     * @default null
     */
    customGatewaySocketURLOverwrittenByResumeURL?: boolean | null
    /**
     * A custom URL to use as a substitute for [`GET /gateway/bot`](https://discord.com/developers/docs/topics/gateway#get-gateway-bot).
     * Useful if you use a proxy to connect to the Discord gateway, and it handles bot instances / sharding.
     * This should be the full URL, not just a route (Example: `https://api.example.com/gateway`, not `/gateway`).
     * It is expected that making a request to this URL returns the [same response that Discord normally would](https://discord.com/developers/docs/topics/gateway#get-gateway-bot).
     * If the response returns your system's socket URL as the `url` parameter, there is no need to specify `customGatewaySocketURL`.
     * Additionally, if you use a custom base URL for the rest manager that returns custom information when [`GET /gateway/bot`](https://discord.com/developers/docs/topics/gateway#get-gateway-bot) is called, this can be left undefined.
     * @default null
     */
    customGetGatewayBotURL?: string | null
    /**
     * If the rate limit on buckets (used for shard spawning) should be disabled.
     * **Only disable spawning rate limits if you are using a separate application to manage rate limits** (`customGatewaySocketURL` and/or `customGatewayBotEndpoint` can be used to do so).
     * Note that shards are still spawned in the order that they would with rate limiting enabled, just without a pause between bucket spawn calls.
     * @default false
     */
    disableBucketRatelimits?: boolean
    /**
     * The time to wait in milliseconds after the last [GUILD_CREATE](https://discord.com/developers/docs/topics/gateway#guild-create) event to consider that guilds are ready.
     * @default 15000
     */
    guildsReadyTimeout?: number
    /**
     * Gateway intents.
     * A numerical value is simply passed to the identify payload.
     * An array of intent names will only enable the specified intents.
     * `all` enables all intents, including privileged intents.
     * `nonPrivileged` enables all non-privileged intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
     * @default 0
     */
    intents?: IntentUtilsFactoryDirty
    /**
     * The number of members in a guild to reach before the gateway stops sending offline members in the guild member list.
     * Must be between `50` and `250`.
     * @default 50
     */
    largeGuildThreshold?: number
    /**
     * The initial presence for the bot to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#update-presence-gateway-presence-update-structure)
     * @default null
     */
    presence?: GatewayPresenceUpdateData | DiscordTypes.GatewayPresenceUpdateData | null
    /**
     * Gateway sharding.
     * Unless you are using a custom scaling solution (for example, running your bot across numerous servers or processes), it is recommended that you leave all of these options undefined.
     * If you wish to manually specify the number of shards to spawn across your bot, you only need to set `GatewayOptions#sharding#totalBotShards`.
     *
     * When using a `Client`, specified options are passed directly to the gateway manager, without manipulation.
     *
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
     * @default {}
     */
    sharding?: {
        /**
         * The number of shards the bot will have in total.
         * This value is used for the `num_shards` property sent in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
         * **This is NOT the amount of shards the process will spawn. For that option, specify `GatewayOptions#sharding#shards`.**
         * `auto` will use the [recommended number from Discord](https://discord.com/developers/docs/topics/gateway#get-gateway-bot).
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
         * sharding: {
         *   totalBotShards: 4,
         *   shards: 2,
         *   offset: 2
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
     * Advanced [WebSocket](https://github.com/websockets/ws) options.
     * @see [WebSocket API Reference](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketaddress-protocols-options)
     * @default {}
     */
    wsOptions?: WsClientOptions
    /**
     * The Gateway version to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateways-gateway-versions)
     */
    version?: number
}
