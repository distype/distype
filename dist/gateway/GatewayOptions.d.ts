import * as DiscordTypes from 'discord-api-types/v10';
import { ClientOptions as WsClientOptions } from 'ws';
/**
 * {@link Gateway} options.
 */
export interface GatewayOptions extends GatewayShardOptions {
    /**
     * A custom socket URL to connect to.
     * Useful if you use a proxy to connect to the Discord gateway.
     * If `customGatewayBotEndpoint` is defined, its response's `url` parameter is overwritten by this.
     * Note that [gateway URL query parameters](https://discord.com/developers/docs/topics/gateway#connecting-gateway-url-query-string-params) will still be sent.
     */
    customGatewaySocketURL?: string;
    /**
     * A custom URL to use as a substitute for `GET` `/gateway/bot`.
     * Useful if you use a proxy to connect to the Discord gateway, and it handles bot instances / sharding.
     * This should be the full URL, not just a route (Example: `https://api.example.com/gateway`, not `/gateway`).
     * It is expected that making a request to this URL returns the [same response that Discord normally would](https://discord.com/developers/docs/topics/gateway#get-gateway-bot).
     * If the response returns your system's socket URL as the `url` parameter, there is no need to specify `customGatewaySocketURL`.
     * Additionally, if you use a custom base URL for the rest manager that returns custom information when `GET` `/gateway/bot` is called, this can be left undefined.
     */
    customGetGatewayBotURL?: string;
    /**
     * If the ratelimit on buckets (used for shard spawning) should be disabled.
     * **Only disable spawning ratelimits if you are using a seperate application to manage ratelimits** (`customGatewaySocketURL` and/or `customGatewayBotEndpoint` can be used to do so).
     * Note that shards are still spawned in the order that they would with ratelimiting enabled, just without a pause between bucket spawn calls.
     */
    disableBucketRatelimits?: boolean;
    /**
     * Gateway sharding options.
     */
    sharding: {
        /**
         * The number of shards the bot will have in total.
         * This value is used for the `num_shards` property sent in the [identify payload](https://discord.com/developers/docs/topics/gateway#identifying).
         * **This is NOT the amount of shards the process will spawn. For that option, specify `GatewayOptions#sharding#shards`.**
         * `auto` will use the [recommended number from Discord](https://discord.com/developers/docs/topics/gateway#get-gateway-bot).
         */
        totalBotShards?: number | `auto`;
        /**
         * The amount of shards to spawn.
         * By default, `GatewayOptions#sharding#totalBotShards` is used.
         */
        shards?: number;
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
         */
        offset?: number;
    };
    /**
     * The Gateway version to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateways-gateway-versions)
     */
    version: number;
}
/**
 * {@link GatewayShard} options.
 */
export interface GatewayShardOptions {
    /**
     * Gateway shard intents.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#gateway-intents)
     */
    intents: number;
    /**
     * The number of members in a guild to reach before the gateway stops sending offline members in the guild member list.
     * Must be between `50` and `250`.
     */
    largeGuildThreshold?: number;
    /**
     * The initial presence for the bot to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#update-presence-gateway-presence-update-structure)
     */
    presence?: Required<DiscordTypes.GatewayIdentifyData>[`presence`];
    /**
     * The number of milliseconds to wait between spawn and resume attempts.
     */
    spawnAttemptDelay: number;
    /**
     * The maximum number of spawn attempts before rejecting.
     */
    spawnMaxAttempts: number;
    /**
     * The time in milliseconds to wait until considering a spawn or resume attempt timed out.
     */
    spawnTimeout: number;
    /**
     * Advanced [ws](https://github.com/websockets/ws) options.
     * [`ws` API Reference](https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketaddress-protocols-options)
     */
    wsOptions?: WsClientOptions;
}
