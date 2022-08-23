import { GatewayOptions } from './GatewayOptions';
import { GatewayShard } from './GatewayShard';
import { Cache } from '../cache/Cache';
import { Rest } from '../rest/Rest';
import { LogCallback } from '../types/Log';
import { ExtendedMap, TypedEmitter } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/v10';
/**
 * {@link Gateway} events.
 * Note that with the exception of `MANAGER_READY`, all events are a relay of a {@link GatewayShard gateway shard}'s event emit (For example, `READY` signifies a single shard receiving a `READY` dispatch).
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events)
 */
export declare type GatewayEvents = {
    /**
     * When all shards are ready.
     */
    MANAGER_READY: (successfulSpawns: number, unsuccessfulSpawns: number) => void;
    /**
     * When a payload is sent.
     */
    SENT_PAYLOAD: (payload: string) => void;
    /**
     * When a {@link GatewayShard shard} enters an {@link GatewayShardState idle state}.
     */
    SHARD_IDLE: (shard: GatewayShard) => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState disconnected state}.
     */
    SHARD_DISCONNECTED: (payload: GatewayShard) => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState connecting state}.
     */
    SHARD_CONNECTING: (shard: GatewayShard) => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState ready state}.
     */
    SHARD_READY: (shard: GatewayShard) => void;
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState guilds ready state}.
     */
    SHARD_GUILDS_READY: (shard: GatewayShard) => void;
    '*': (payload: DiscordTypes.GatewayDispatchPayload) => void;
    READY: (payload: DiscordTypes.GatewayReadyDispatch) => void;
    RESUMED: (payload: DiscordTypes.GatewayResumedDispatch) => void;
    APPLICATION_COMMAND_PERMISSIONS_UPDATE: (payload: DiscordTypes.APIGuildApplicationCommandPermissions) => void;
    CHANNEL_CREATE: (payload: DiscordTypes.GatewayChannelCreateDispatch) => void;
    CHANNEL_UPDATE: (payload: DiscordTypes.GatewayChannelUpdateDispatch) => void;
    CHANNEL_DELETE: (payload: DiscordTypes.GatewayChannelDeleteDispatch) => void;
    CHANNEL_PINS_UPDATE: (payload: DiscordTypes.GatewayChannelPinsUpdateDispatch) => void;
    THREAD_CREATE: (payload: DiscordTypes.GatewayThreadCreateDispatch) => void;
    THREAD_UPDATE: (payload: DiscordTypes.GatewayThreadUpdateDispatch) => void;
    THREAD_DELETE: (payload: DiscordTypes.GatewayThreadDeleteDispatch) => void;
    THREAD_LIST_SYNC: (payload: DiscordTypes.GatewayThreadListSyncDispatch) => void;
    THREAD_MEMBER_UPDATE: (payload: DiscordTypes.GatewayThreadMemberUpdateDispatch) => void;
    THREAD_MEMBERS_UPDATE: (payload: DiscordTypes.GatewayThreadMembersUpdateDispatch) => void;
    GUILD_CREATE: (payload: DiscordTypes.GatewayGuildCreateDispatch) => void;
    GUILD_UPDATE: (payload: DiscordTypes.GatewayGuildUpdateDispatch) => void;
    GUILD_DELETE: (payload: DiscordTypes.GatewayGuildDeleteDispatch) => void;
    GUILD_BAN_ADD: (payload: DiscordTypes.GatewayGuildBanAddDispatch) => void;
    GUILD_BAN_REMOVE: (payload: DiscordTypes.GatewayGuildBanRemoveDispatch) => void;
    GUILD_EMOJIS_UPDATE: (payload: DiscordTypes.GatewayGuildEmojisUpdateDispatch) => void;
    GUILD_STICKERS_UPDATE: (payload: DiscordTypes.GatewayGuildStickersUpdateDispatch) => void;
    GUILD_INTEGRATIONS_UPDATE: (payload: DiscordTypes.GatewayGuildIntegrationsUpdateDispatch) => void;
    GUILD_MEMBER_ADD: (payload: DiscordTypes.GatewayGuildMemberAddDispatch) => void;
    GUILD_MEMBER_REMOVE: (payload: DiscordTypes.GatewayGuildMemberRemoveDispatch) => void;
    GUILD_MEMBER_UPDATE: (payload: DiscordTypes.GatewayGuildMemberUpdateDispatch) => void;
    GUILD_MEMBERS_CHUNK: (payload: DiscordTypes.GatewayGuildMembersChunkDispatch) => void;
    GUILD_ROLE_CREATE: (payload: DiscordTypes.GatewayGuildRoleCreateDispatch) => void;
    GUILD_ROLE_UPDATE: (payload: DiscordTypes.GatewayGuildRoleUpdateDispatch) => void;
    GUILD_ROLE_DELETE: (payload: DiscordTypes.GatewayGuildRoleDeleteDispatch) => void;
    GUILD_SCHEDULED_EVENT_CREATE: (payload: DiscordTypes.GatewayGuildScheduledEventCreateDispatch) => void;
    GUILD_SCHEDULED_EVENT_UPDATE: (payload: DiscordTypes.GatewayGuildScheduledEventUpdateDispatch) => void;
    GUILD_SCHEDULED_EVENT_DELETE: (payload: DiscordTypes.GatewayGuildScheduledEventDeleteDispatch) => void;
    GUILD_SCHEDULED_EVENT_USER_ADD: (payload: DiscordTypes.GatewayGuildScheduledEventUserAddDispatch) => void;
    GUILD_SCHEDULED_EVENT_USER_REMOVE: (payload: DiscordTypes.GatewayGuildScheduledEventUserRemoveDispatch) => void;
    INTEGRATION_CREATE: (payload: DiscordTypes.GatewayIntegrationCreateDispatch) => void;
    INTEGRATION_UPDATE: (payload: DiscordTypes.GatewayIntegrationUpdateDispatch) => void;
    INTEGRATION_DELETE: (payload: DiscordTypes.GatewayIntegrationDeleteDispatch) => void;
    INTERACTION_CREATE: (payload: DiscordTypes.GatewayInteractionCreateDispatch) => void;
    INVITE_CREATE: (payload: DiscordTypes.GatewayInviteCreateDispatch) => void;
    INVITE_DELETE: (payload: DiscordTypes.GatewayInviteDeleteDispatch) => void;
    MESSAGE_CREATE: (payload: DiscordTypes.GatewayMessageCreateDispatch) => void;
    MESSAGE_UPDATE: (payload: DiscordTypes.GatewayMessageUpdateDispatch) => void;
    MESSAGE_DELETE: (payload: DiscordTypes.GatewayMessageDeleteDispatch) => void;
    MESSAGE_DELETE_BULK: (payload: DiscordTypes.GatewayMessageDeleteBulkDispatch) => void;
    MESSAGE_REACTION_ADD: (payload: DiscordTypes.GatewayMessageReactionAddDispatch) => void;
    MESSAGE_REACTION_REMOVE: (payload: DiscordTypes.GatewayMessageReactionRemoveDispatch) => void;
    MESSAGE_REACTION_REMOVE_ALL: (payload: DiscordTypes.GatewayMessageReactionRemoveAllDispatch) => void;
    MESSAGE_REACTION_REMOVE_EMOJI: (payload: DiscordTypes.GatewayMessageReactionRemoveEmojiDispatch) => void;
    PRESENCE_UPDATE: (payload: DiscordTypes.GatewayPresenceUpdateDispatch) => void;
    STAGE_INSTANCE_CREATE: (payload: DiscordTypes.GatewayStageInstanceCreateDispatch) => void;
    STAGE_INSTANCE_DELETE: (payload: DiscordTypes.GatewayStageInstanceDeleteDispatch) => void;
    STAGE_INSTANCE_UPDATE: (payload: DiscordTypes.GatewayStageInstanceUpdateDispatch) => void;
    TYPING_START: (payload: DiscordTypes.GatewayTypingStartDispatch) => void;
    USER_UPDATE: (payload: DiscordTypes.GatewayUserUpdateDispatch) => void;
    VOICE_STATE_UPDATE: (payload: DiscordTypes.GatewayVoiceStateUpdateDispatch) => void;
    VOICE_SERVER_UPDATE: (payload: DiscordTypes.GatewayVoiceServerUpdateDispatch) => void;
    WEBHOOKS_UPDATE: (payload: DiscordTypes.GatewayWebhooksUpdateDispatch) => void;
};
/**
 * Gateway presence activity data.
 */
export interface GatewayPresenceActivity {
    name: string;
    type: number;
    url?: string | null;
}
/**
 * Gateway presence update data.
 */
export interface GatewayPresenceUpdateData {
    since: number | null;
    activities: GatewayPresenceActivity[];
    status: `online` | `dnd` | `idle` | `invisible` | `offline`;
    afk: boolean;
}
/**
 * The gateway manager.
 * Manages {@link GatewayShard shards}, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the {@link GatewayEvents `*`} event prior to being passed through the cache event handler.
 * After being handled by the {@link Cache cache manager}, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
export declare class Gateway extends TypedEmitter<GatewayEvents> {
    /**
     * The shard counts the manager is controlling.
     */
    managingShards: {
        totalBotShards: number;
        shards: number;
        offset: number;
    } | null;
    /**
     * {@link GatewayShard Gateway shards}.
     * Modifying this map externally may result in unexpected behavior.
     */
    shards: ExtendedMap<number, GatewayShard>;
    /**
     * The latest self user received from the gateway.
     */
    user: DiscordTypes.APIUser | null;
    /**
     * {@link GatewayOptions Options} for the gateway manager.
     * Note that any options not specified are set to a default value.x
     */
    readonly options: Required<GatewayOptions> & {
        intents: number;
    };
    /**
     * The system string used for logging.
     */
    readonly system = "Gateway";
    /**
     * The {@link Cache cache manager} to update from incoming events.
     */
    private _cache?;
    /**
     * The {@link LogCallback log callback} used by the gateway manager.
     */
    private _log;
    /**
     * A value to use as `this` in the `this#_log`.
     */
    private _logThisArg?;
    /**
     * The {@link Rest rest manager} to use for fetching gateway endpoints.
     */
    private _rest;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a gateway manager.
     * @param token The bot's token.
     * @param rest The {@link Rest rest manager} to use for fetching gateway endpoints.
     * @param cache The {@link Cache cache} to update from incoming events. If `false` is specified, {@link GatewayEvents gateway events} will not be passed to a cache event handler.
     * @param options {@link GatewayOptions Gateway options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token: string, rest: Rest, cache: Cache | false, options?: GatewayOptions, logCallback?: LogCallback, logThisArg?: any);
    /**
     * The average heartbeat ping in milliseconds across all shards.
     */
    get averageHeartbeatPing(): number;
    /**
     * The total guild count across all shards.
     */
    get guildCount(): number;
    /**
     * If all shards are in a {@link GatewayShardState ready state} (or {@link GatewayShardState guilds ready}).
     */
    get shardsReady(): boolean;
    /**
     * If all shards are in a {@link GatewayShardState guilds ready}.
     */
    get shardsGuildsReady(): boolean;
    /**
     * Connect to the gateway.
     * @param gatewayBot A pre-fetched [`GET /gateway/bot`](https://discord.com/developers/docs/topics/gateway#get-gateway-bot). Not required, as this method will fetch it if not specified.
     * @returns The results from {@link GatewayShard shard} spawns; `[success, failed]`.
     */
    connect(gatewayBot?: DiscordTypes.APIGatewayBotInfo): Promise<[number, number]>;
    /**
     * Get the average ping across all shards.
     */
    getAveragePing(): Promise<number>;
    /**
     * Get a guild's shard.
     * @param guildId The guild's ID.
     * @param ensure If true, an error is thrown if a {@link GatewayShard} is not found.
     * @returns The guild's shard, or a shard ID if the shard is not in this manager.
     * @see [Discord API Reference]
     */
    guildShard<T extends boolean>(guildId: Snowflake, ensure?: T): T extends true ? GatewayShard : GatewayShard | number;
    /**
     * Get members from a guild.
     * @param guildId The ID of the guild to get members from.
     * @param options Guild member request options. By default, all members in the guild will be fetched.
     * @returns Received members, presences, and missing members.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#request-guild-members)
     */
    getGuildMembers(guildId: Snowflake, options?: Partial<Omit<DiscordTypes.GatewayRequestGuildMembersDataWithQuery, `guild_id` | `presences`>> & {
        user_ids?: Snowflake | Snowflake[];
    }): Promise<{
        members: ExtendedMap<Snowflake, DiscordTypes.APIGuildMember>;
        presences?: ExtendedMap<Snowflake, DiscordTypes.GatewayPresenceUpdate>;
        notFound?: Snowflake[];
    }>;
    /**
     * Update the bot's voice state.
     * @param guildId The guild to set the voice state in.
     * @param channelId The channel to join. `null`disconnects the bot.
     * @param mute If the bot should self mute.
     * @param deafen If the bot should self deafen.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#update-voice-state)
     */
    updateVoiceState(guildId: Snowflake, channelId: Snowflake | null, mute?: boolean, deafen?: boolean): Promise<void>;
    /**
     * Update the bot's presence.
     * @param presence Presence data.
     * @param shard A shard or shards to set the presence on. A number will set the presence on a single shard with a matching ID, a number array will set the presence on all shards matching am ID in the array, and `all` will set the presence on all shards.
     */
    updatePresence(presence: GatewayPresenceUpdateData | DiscordTypes.GatewayPresenceUpdateData, shard?: number | number[] | `all`): Promise<void>;
    /**
     * Binds a shard's events.
     * @param shard The shard to bind.
     */
    private _bindShardEvents;
    /**
     * Calculate the shards the gateway manager will be spawning.
     * @param gatewayBot [`GET /gateway/bot`](https://discord.com/developers/docs/topics/gateway#get-gateway-bot).
     */
    private _calculateShards;
    /**
     * Gets [`GET /gateway/bot`](https://discord.com/developers/docs/topics/gateway#get-gateway-bot) from Discord or from the custom URL.
     */
    private _getGatewayBot;
    /**
     * Get a guild's shard ID.
     * @param guildId The guild's ID.
     * @param numShards The `numShards` value sent in the identify payload.
     * @returns A shard ID.
     */
    private _guildShard;
    /**
     * Creates intents flags from intents specified in the constructor.
     * @param specified The specified intents.
     * @returns Intents flags.
     */
    private _intentsFactory;
    /**
     * Spawns shards.
     * @param buckets Shard buckets.
     * @returns The results from {@link GatewayShard shard} spawns; `[success, failed]`.
     */
    private _spawnShards;
}
