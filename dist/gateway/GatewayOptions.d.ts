import * as DiscordTypes from 'discord-api-types/v9';
import { ClientOptions as WsClientOptions } from 'ws';
/**
 * {@link Gateway} options.
 */
export interface GatewayOptions extends GatewayShardOptions {
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
