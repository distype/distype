import { Cache } from '../cache/Cache';
import { GatewayOptions } from './GatewayOptions';
import { GatewayShard } from './GatewayShard';
import { Rest } from '../rest/Rest';
import Collection from '@discordjs/collection';
import * as DiscordTypes from 'discord-api-types/v9';
import { EventEmitter } from '@jpbberry/typed-emitter';
/**
 * Gateway events.
 * Note that with the exception of `SHARDS_READY`, all events are a relay of a `GatewayShard` event emit (For example, `READY` signifies a single shard receiving a `READY` dispatch).
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events)
 */
export interface GatewayEvents {
    /**
     * When all shards are spawned and ready.
     */
    SHARDS_READY: null;
    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT: string;
    /**
     * When a shard enters a disconnected state.
     */
    SHARD_STATE_DISCONNECTED: GatewayShard;
    /**
     * When a shard enters a connecting state.
     */
    SHARD_STATE_CONNECTING: GatewayShard;
    /**
     * When a shard enters a resuming state.
     */
    SHARD_STATE_RESUMING: GatewayShard;
    /**
     * When a shard enters a connected state.
     */
    SHARD_STATE_CONNECTED: GatewayShard;
    '*': DiscordTypes.GatewayDispatchPayload;
    DEBUG: string;
    READY: DiscordTypes.GatewayReadyDispatch;
    RESUMED: DiscordTypes.GatewayResumedDispatch;
    CHANNEL_CREATE: DiscordTypes.GatewayChannelCreateDispatch;
    CHANNEL_UPDATE: DiscordTypes.GatewayChannelUpdateDispatch;
    CHANNEL_DELETE: DiscordTypes.GatewayChannelDeleteDispatch;
    CHANNEL_PINS_UPDATE: DiscordTypes.GatewayChannelPinsUpdateDispatch;
    THREAD_CREATE: DiscordTypes.GatewayThreadCreateDispatch;
    THREAD_UPDATE: DiscordTypes.GatewayThreadUpdateDispatch;
    THREAD_DELETE: DiscordTypes.GatewayThreadDeleteDispatch;
    THREAD_LIST_SYNC: DiscordTypes.GatewayThreadListSyncDispatch;
    THREAD_MEMBER_UPDATE: DiscordTypes.GatewayThreadMemberUpdateDispatch;
    THREAD_MEMBERS_UPDATE: DiscordTypes.GatewayThreadMembersUpdateDispatch;
    GUILD_CREATE: DiscordTypes.GatewayGuildCreateDispatch;
    GUILD_UPDATE: DiscordTypes.GatewayGuildUpdateDispatch;
    GUILD_DELETE: DiscordTypes.GatewayGuildDeleteDispatch;
    GUILD_BAN_ADD: DiscordTypes.GatewayGuildBanAddDispatch;
    GUILD_BAN_REMOVE: DiscordTypes.GatewayGuildBanRemoveDispatch;
    GUILD_EMOJIS_UPDATE: DiscordTypes.GatewayGuildEmojisUpdateDispatch;
    GUILD_STICKERS_UPDATE: DiscordTypes.GatewayGuildStickersUpdateDispatch;
    GUILD_INTEGRATIONS_UPDATE: DiscordTypes.GatewayGuildIntegrationsUpdateDispatch;
    GUILD_MEMBER_ADD: DiscordTypes.GatewayGuildMemberAddDispatch;
    GUILD_MEMBER_REMOVE: DiscordTypes.GatewayGuildMemberRemoveDispatch;
    GUILD_MEMBER_UPDATE: DiscordTypes.GatewayGuildMemberUpdateDispatch;
    GUILD_MEMBERS_CHUNK: DiscordTypes.GatewayGuildMembersChunkDispatch;
    GUILD_ROLE_CREATE: DiscordTypes.GatewayGuildRoleCreateDispatch;
    GUILD_ROLE_UPDATE: DiscordTypes.GatewayGuildRoleUpdateDispatch;
    GUILD_ROLE_DELETE: DiscordTypes.GatewayGuildRoleDeleteDispatch;
    GUILD_SCHEDULED_EVENT_CREATE: DiscordTypes.GatewayGuildScheduledEventCreateDispatch;
    GUILD_SCHEDULED_EVENT_UPDATE: DiscordTypes.GatewayGuildScheduledEventUpdateDispatch;
    GUILD_SCHEDULED_EVENT_DELETE: DiscordTypes.GatewayGuildScheduledEventDeleteDispatch;
    GUILD_SCHEDULED_EVENT_USER_ADD: DiscordTypes.GatewayGuildScheduledEventUserAddDispatch;
    GUILD_SCHEDULED_EVENT_USER_REMOVE: DiscordTypes.GatewayGuildScheduledEventUserRemoveDispatch;
    INTEGRATION_CREATE: DiscordTypes.GatewayIntegrationCreateDispatch;
    INTEGRATION_UPDATE: DiscordTypes.GatewayIntegrationUpdateDispatch;
    INTEGRATION_DELETE: DiscordTypes.GatewayIntegrationDeleteDispatch;
    INTERACTION_CREATE: DiscordTypes.GatewayInteractionCreateDispatch;
    INVITE_CREATE: DiscordTypes.GatewayInviteCreateDispatch;
    INVITE_DELETE: DiscordTypes.GatewayInviteDeleteDispatch;
    MESSAGE_CREATE: DiscordTypes.GatewayMessageCreateDispatch;
    MESSAGE_UPDATE: DiscordTypes.GatewayMessageUpdateDispatch;
    MESSAGE_DELETE: DiscordTypes.GatewayMessageDeleteDispatch;
    MESSAGE_DELETE_BULK: DiscordTypes.GatewayMessageDeleteBulkDispatch;
    MESSAGE_REACTION_ADD: DiscordTypes.GatewayMessageReactionAddDispatch;
    MESSAGE_REACTION_REMOVE: DiscordTypes.GatewayMessageReactionRemoveDispatch;
    MESSAGE_REACTION_REMOVE_ALL: DiscordTypes.GatewayMessageReactionRemoveAllDispatch;
    MESSAGE_REACTION_REMOVE_EMOJI: DiscordTypes.GatewayMessageReactionRemoveEmojiDispatch;
    PRESENCE_UPDATE: DiscordTypes.GatewayPresenceUpdateDispatch;
    STAGE_INSTANCE_CREATE: DiscordTypes.GatewayStageInstanceCreateDispatch;
    STAGE_INSTANCE_DELETE: DiscordTypes.GatewayStageInstanceDeleteDispatch;
    STAGE_INSTANCE_UPDATE: DiscordTypes.GatewayStageInstanceUpdateDispatch;
    TYPING_START: DiscordTypes.GatewayTypingStartDispatch;
    USER_UPDATE: DiscordTypes.GatewayUserUpdateDispatch;
    VOICE_STATE_UPDATE: DiscordTypes.GatewayVoiceStateUpdateDispatch;
    VOICE_SERVER_UPDATE: DiscordTypes.GatewayVoiceServerUpdateDispatch;
    WEBHOOKS_UPDATE: DiscordTypes.GatewayWebhooksUpdateDispatch;
}
/**
 * The gateway manager.
 * Manages shards, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the `*` event prior to being passed through the cache manager handler.
 * After being handled by the cache manager, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
export declare class Gateway extends EventEmitter<GatewayEvents> {
    /**
     * Gateway shards.
     * Modifying this collection externally may result in unexpected behavior.
     */
    shards: Collection<number, GatewayShard>;
    /**
     * Options for the gateway manager.
     * Note that if you are using a `Client` or `ClientWorker` / `ClientMaster` and not manually creating a `Gateway` separately, these options may differ than the options specified when creating the client due to them being passed through the options factory.
     */
    readonly options: GatewayOptions;
    /**
     * The cache manager to update from incoming events.
     */
    private _cache?;
    /**
     * The rest manager to use for fetching gateway endpoints.
     */
    private _rest;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a gateway manager.
     * @param token The bot's token.
     * @param cache The cache manager to update from incoming events. If `false` is specified, gateway events will not be passed to a cache handler.
     * @param rest The rest manager to use for fetching gateway endpoints.
     * @param options Gateway options.
     */
    constructor(token: string, cache: Cache | false, rest: Rest, options: GatewayOptions);
    /**
     * Connect to the gateway.
     * @returns The results from shard spawns.
     */
    connect(): Promise<Array<PromiseSettledResult<DiscordTypes.GatewayReadyDispatch>>>;
}
