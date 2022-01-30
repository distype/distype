import { GatewayOptions } from './GatewayOptions';
import { GatewayShard, GatewayShardState } from './GatewayShard';

import { Cache } from '../cache/Cache';
import { DiscordConstants } from '../constants/DiscordConstants';
import { Logger } from '../logger/Logger';
import { Rest } from '../rest/Rest';
import { TypedEmitter } from '../utils/TypedEmitter';

import Collection from '@discordjs/collection';
import * as DiscordTypes from 'discord-api-types/v9';
import { Snowflake } from 'discord-api-types/v9';
import { URL, URLSearchParams } from 'url';

/**
 * {@link Gateway} events.
 * Note that with the exception of `SHARDS_READY`, all events are a relay of a {@link GatewayShard} event emit (For example, `READY` signifies a single shard receiving a `READY` dispatch).
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events)
 */
export interface GatewayEvents {
    /**
     * When all {@link GatewayShard shards} are spawned and ready.
     */
    SHARDS_READY: null

    /**
     * When a payload is sent. Data is the sent payload.
     */
    SENT: string
    /**
     * When a {@link GatewayShard shard} enters a disconnected state.
     */
    SHARD_STATE_DISCONNECTED: GatewayShard
    /**
     * When a {@link GatewayShard shard} enters a connecting state.
     */
    SHARD_STATE_CONNECTING: GatewayShard
    /**
     * When a {@link GatewayShard shard} enters a resuming state.
     */
    SHARD_STATE_RESUMING: GatewayShard
    /**
     * When a {@link GatewayShard shard} enters a connected state.
     */
    SHARD_STATE_CONNECTED: GatewayShard

    '*': DiscordTypes.GatewayDispatchPayload // eslint-disable-line quotes
    READY: DiscordTypes.GatewayReadyDispatch
    RESUMED: DiscordTypes.GatewayResumedDispatch
    CHANNEL_CREATE: DiscordTypes.GatewayChannelCreateDispatch
    CHANNEL_UPDATE: DiscordTypes.GatewayChannelUpdateDispatch
    CHANNEL_DELETE: DiscordTypes.GatewayChannelDeleteDispatch
    CHANNEL_PINS_UPDATE: DiscordTypes.GatewayChannelPinsUpdateDispatch
    THREAD_CREATE: DiscordTypes.GatewayThreadCreateDispatch
    THREAD_UPDATE: DiscordTypes.GatewayThreadUpdateDispatch
    THREAD_DELETE: DiscordTypes.GatewayThreadDeleteDispatch
    THREAD_LIST_SYNC: DiscordTypes.GatewayThreadListSyncDispatch
    THREAD_MEMBER_UPDATE: DiscordTypes.GatewayThreadMemberUpdateDispatch
    THREAD_MEMBERS_UPDATE: DiscordTypes.GatewayThreadMembersUpdateDispatch
    GUILD_CREATE: DiscordTypes.GatewayGuildCreateDispatch
    GUILD_UPDATE: DiscordTypes.GatewayGuildUpdateDispatch
    GUILD_DELETE: DiscordTypes.GatewayGuildDeleteDispatch
    GUILD_BAN_ADD: DiscordTypes.GatewayGuildBanAddDispatch
    GUILD_BAN_REMOVE: DiscordTypes.GatewayGuildBanRemoveDispatch
    GUILD_EMOJIS_UPDATE: DiscordTypes.GatewayGuildEmojisUpdateDispatch
    GUILD_STICKERS_UPDATE: DiscordTypes.GatewayGuildStickersUpdateDispatch
    GUILD_INTEGRATIONS_UPDATE: DiscordTypes.GatewayGuildIntegrationsUpdateDispatch
    GUILD_MEMBER_ADD: DiscordTypes.GatewayGuildMemberAddDispatch
    GUILD_MEMBER_REMOVE: DiscordTypes.GatewayGuildMemberRemoveDispatch
    GUILD_MEMBER_UPDATE: DiscordTypes.GatewayGuildMemberUpdateDispatch
    GUILD_MEMBERS_CHUNK: DiscordTypes.GatewayGuildMembersChunkDispatch
    GUILD_ROLE_CREATE: DiscordTypes.GatewayGuildRoleCreateDispatch
    GUILD_ROLE_UPDATE: DiscordTypes.GatewayGuildRoleUpdateDispatch
    GUILD_ROLE_DELETE: DiscordTypes.GatewayGuildRoleDeleteDispatch
    GUILD_SCHEDULED_EVENT_CREATE: DiscordTypes.GatewayGuildScheduledEventCreateDispatch
    GUILD_SCHEDULED_EVENT_UPDATE: DiscordTypes.GatewayGuildScheduledEventUpdateDispatch
    GUILD_SCHEDULED_EVENT_DELETE: DiscordTypes.GatewayGuildScheduledEventDeleteDispatch
    GUILD_SCHEDULED_EVENT_USER_ADD: DiscordTypes.GatewayGuildScheduledEventUserAddDispatch
    GUILD_SCHEDULED_EVENT_USER_REMOVE: DiscordTypes.GatewayGuildScheduledEventUserRemoveDispatch
    INTEGRATION_CREATE: DiscordTypes.GatewayIntegrationCreateDispatch
    INTEGRATION_UPDATE: DiscordTypes.GatewayIntegrationUpdateDispatch
    INTEGRATION_DELETE: DiscordTypes.GatewayIntegrationDeleteDispatch
    INTERACTION_CREATE: DiscordTypes.GatewayInteractionCreateDispatch
    INVITE_CREATE: DiscordTypes.GatewayInviteCreateDispatch
    INVITE_DELETE: DiscordTypes.GatewayInviteDeleteDispatch
    MESSAGE_CREATE: DiscordTypes.GatewayMessageCreateDispatch
    MESSAGE_UPDATE: DiscordTypes.GatewayMessageUpdateDispatch
    MESSAGE_DELETE: DiscordTypes.GatewayMessageDeleteDispatch
    MESSAGE_DELETE_BULK: DiscordTypes.GatewayMessageDeleteBulkDispatch
    MESSAGE_REACTION_ADD: DiscordTypes.GatewayMessageReactionAddDispatch
    MESSAGE_REACTION_REMOVE: DiscordTypes.GatewayMessageReactionRemoveDispatch
    MESSAGE_REACTION_REMOVE_ALL: DiscordTypes.GatewayMessageReactionRemoveAllDispatch
    MESSAGE_REACTION_REMOVE_EMOJI: DiscordTypes.GatewayMessageReactionRemoveEmojiDispatch
    PRESENCE_UPDATE: DiscordTypes.GatewayPresenceUpdateDispatch
    STAGE_INSTANCE_CREATE: DiscordTypes.GatewayStageInstanceCreateDispatch
    STAGE_INSTANCE_DELETE: DiscordTypes.GatewayStageInstanceDeleteDispatch
    STAGE_INSTANCE_UPDATE: DiscordTypes.GatewayStageInstanceUpdateDispatch
    TYPING_START: DiscordTypes.GatewayTypingStartDispatch
    USER_UPDATE: DiscordTypes.GatewayUserUpdateDispatch
    VOICE_STATE_UPDATE: DiscordTypes.GatewayVoiceStateUpdateDispatch
    VOICE_SERVER_UPDATE: DiscordTypes.GatewayVoiceServerUpdateDispatch
    WEBHOOKS_UPDATE: DiscordTypes.GatewayWebhooksUpdateDispatch
}

/**
 * The gateway manager.
 * Manages {@link GatewayShard shards}, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the {@link GatewayEvents `*`} event prior to being passed through the {@link cacheEventHandler}.
 * After being handled by the {@link Cache cache manager}, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
export class Gateway extends TypedEmitter<GatewayEvents> {
    /**
     * {@link GatewayShard Gateway shards}.
     * Modifying this collection externally may result in unexpected behavior.
     */
    public shards: Collection<number, GatewayShard> = new Collection();
    /**
     * The latest self user received from the gateway.
     */
    public user: DiscordTypes.APIUser | null = null;

    /**
     * {@link GatewayOptions Options} for the gateway manager.
     * Note that if you are using a {@link Client} or {@link ClientMaster} / {@link ClientWorker} and not manually creating a {@link Client} separately, these options may differ than the options specified when creating the client due to them being passed through the {@link optionsFactory}.
     */
    // @ts-expect-error Property 'options' has no initializer and is not definitely assigned in the constructor.
    public readonly options: GatewayOptions;

    /**
     * The {@link Cache cache manager} to update from incoming events.
     */
    private _cache?: Cache;
    /**
     * The {@link Logger logger} used by the gateway manager.
     */
    private _logger?: Logger;
    /**
     * An increment used for creating unique nonce values for [request guild member](https://discord.com/developers/docs/topics/gateway#request-guild-members) payloads.
     */
    private _requestGuildMembersNonceIncrement = 0;
    /**
     * The {@link Rest rest manager} to use for fetching gateway endpoints.
     */
    private _rest: Rest;
    /**
     * Stored response from `Rest#getGatewayBot()`.
     */
    private _storedGetGatewayBot: DiscordTypes.APIGatewayBotInfo | null = null;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a gateway manager.
     * @param token The bot's token.
     * @param cache The {@link Cache cache manager} to update from incoming events. If `false` is specified, {@link GatewayEvents gateway events} will not be passed to a {@link cacheEventHandler}.
     * @param logger The {@link Logger logger} for the gateway manager to use. If `false` is specified, no logger will be used.
     * @param rest The {@link Rest rest manager} to use for fetching gateway endpoints.
     * @param options {@link GatewayOptions Gateway options}.
     */
    constructor(token: string, cache: Cache | false, logger: Logger | false, rest: Rest, options: GatewayOptions) {
        super();

        if (typeof token !== `string`) throw new TypeError(`A bot token must be specified`);
        if (!(cache instanceof Cache) && cache !== false) throw new TypeError(`A cache manager or false must be specified`);
        if (!(logger instanceof Logger) && logger !== false) throw new TypeError(`A logger or false must be specified`);
        if (!(rest instanceof Rest)) throw new TypeError(`A rest manager must be specified`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Gateway[`_token`],
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options) as Gateway[`options`],
            writable: false
        });

        if (cache) this._cache = cache;
        if (logger) this._logger = logger;
        this._rest = rest;

        this.on(`*`, (data) => {
            if (this._cache) this._cache.options.cacheEventHandler(this._cache, data);

            if (data.t === `READY`) this.user = data.d.user;
            if (data.t === `USER_UPDATE` && data.d.id === this.user?.id) this.user = data.d;

            this.emit(data.t, data as any);
        });

        this._logger?.log(`Initialized gateway manager`, {
            level: `DEBUG`, system: `Gateway`
        });
    }

    /**
     * If all shards are in a {@link GatewayShardState READY} state.
     */
    public get shardsReady (): boolean {
        return this.shards.every((shard) => shard.state === GatewayShardState.CONNECTED);
    }

    /**
     * Connect to the gateway.
     * @returns The results from {@link GatewayShard shard} spawns.
     */
    public async connect(): Promise<Array<PromiseSettledResult<DiscordTypes.GatewayReadyDispatch>>> {
        this._logger?.log(`Starting connection process`, {
            level: `DEBUG`, system: `Gateway`
        });

        this._storedGetGatewayBot = await this._rest.getGatewayBot();
        this._logger?.log(`Got bot gateway information`, {
            level: `DEBUG`, system: `Gateway`
        });

        this.options.sharding.totalBotShards = this.options.sharding.totalBotShards === `auto` ? this._storedGetGatewayBot.shards : (this.options.sharding.totalBotShards ?? this._storedGetGatewayBot.shards);
        this.options.sharding.shards = this.options.sharding.shards ?? this.options.sharding.totalBotShards;
        this.options.sharding.offset = this.options.sharding.offset ?? 0;

        if (this.options.sharding.shards > this._storedGetGatewayBot.session_start_limit.remaining) {
            const error = new Error(`Session start limit reached; tried to spawn ${this.options.sharding.shards} shards when only ${this._storedGetGatewayBot.session_start_limit.remaining} more shards are allowed. Limit will reset in ${this._storedGetGatewayBot.session_start_limit.reset_after / 1000} seconds`);
            this._logger?.log(`Unable to connect shards: ${error.name} | ${error.message}`, {
                level: `DEBUG`, system: `Gateway`
            });
            throw error;
        }

        this._logger?.log(`Spawning ${this.options.sharding.shards} shards`, { system: `Gateway` });

        const buckets: Collection<number, Collection<number, GatewayShard>> = new Collection();
        for (let i = 0; i < this.options.sharding.shards; i++) {
            this._logger?.log(`Creating shard ${i}`, {
                level: `DEBUG`, system: `Gateway`
            });
            const shard = new GatewayShard(this._token, i, this.options.sharding.totalBotShards, new URL(`?${new URLSearchParams({
                v: `${this.options.version}`, encoding: `json`
            } as DiscordTypes.GatewayURLQuery as any).toString()}`, this._storedGetGatewayBot.url).toString(), this._logger ?? false, this.options);
            this.shards.set(i, shard);
            this._logger?.log(`Shard ${shard.id} created and pushed to Gateway#shards`, {
                level: `DEBUG`, system: `Gateway`
            });

            shard.on(`*`, (data) => this.emit(`*`, data as any));
            shard.on(`SENT`, (payload) => this.emit(`SENT`, payload));
            shard.on(`STATE_DISCONNECTED`, () => this.emit(`SHARD_STATE_DISCONNECTED`, shard));
            shard.on(`STATE_CONNECTING`, () => this.emit(`SHARD_STATE_CONNECTING`, shard));
            shard.on(`STATE_RESUMING`, () => this.emit(`SHARD_STATE_RESUMING`, shard));
            shard.on(`STATE_CONNECTED`, () => this.emit(`SHARD_STATE_CONNECTED`, shard));
            this._logger?.log(`Bound shard ${shard.id} events`, {
                level: `DEBUG`, system: `Gateway`
            });

            const bucketId = shard.id % this._storedGetGatewayBot.session_start_limit.max_concurrency;
            if (buckets.has(bucketId)) buckets.get(bucketId)?.set(shard.id, shard);
            else buckets.set(bucketId, new Collection()).get(bucketId)!.set(shard.id, shard);
            this._logger?.log(`Pushed shard ${shard.id} to bucket ${bucketId}`, {
                level: `DEBUG`, system: `Gateway`
            });
        }

        const results: Array<PromiseSettledResult<DiscordTypes.GatewayReadyDispatch>> = [];
        for (let i = 0; i < Math.max(...buckets.map((bucket) => bucket.size)); i++) {
            this._logger?.log(`Starting spawn process for shard ratelimit key ${i}`, {
                level: `DEBUG`, system: `Gateway`
            });
            const bucketResult = await Promise.allSettled(buckets.filter((bucket) => bucket.get(i) instanceof GatewayShard).map((bucket) => bucket.get(i)!.spawn()));
            results.push(...bucketResult);
            this._logger?.log(`Finished spawn process for shard ratelimit key ${i}`, {
                level: `DEBUG`, system: `Gateway`
            });
            if (i !== buckets.size - 1) await new Promise((resolve) => setTimeout(() => resolve(void 0), DiscordConstants.SHARD_SPAWN_COOLDOWN));
        }

        this.emit(`SHARDS_READY`, null);
        this._logger?.log(`Finished connection process`, {
            level: `DEBUG`, system: `Gateway`
        });
        this._logger?.log(`${results.filter((result) => result.status === `fulfilled`).length} / ${this.options.sharding.shards} shards spawned`, { system: `Gateway` });
        this._logger?.log(`Connected to Discord${this.user ? ` as ${this.user.username}#${this.user.discriminator}` : ``}`, { system: `Gateway` });
        return results;
    }

    /**
     * Get a guild's shard.
     * @param guildId The guild's ID.
     * @param ensure If true, an error is thrown if a {@link GatewayShard} is not found.
     * @returns The guild's shard, or a shard ID if the shard is not in this manager.
     * @see [Discord API Reference]
     */
    public guildShard <T extends boolean>(guildId: Snowflake, ensure?: T): T extends true ? GatewayShard : GatewayShard | number {
        if (!this.shards.size || (typeof this.options.sharding.totalBotShards !== `number` && !this._storedGetGatewayBot?.shards)) throw new Error(`Shards are not available.`);
        const shardId = Number((BigInt(guildId) >> 22n) % BigInt(typeof this.options.sharding.totalBotShards === `number` ? this.options.sharding.totalBotShards : this._storedGetGatewayBot!.shards));
        const shard = this.shards.get(shardId);
        if (ensure && !(shard instanceof GatewayShard)) throw new Error(`No shard with the specified guild ID found on this gateway manager`);
        return (shard ?? shardId) as any;
    }

    /**
     * Get members from a guild.
     * @param guildId The ID of the guild to get members from.
     * @param options Guild member request options.
     * @returns Received members, presences, and unfound members.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#request-guild-members)
     */
    public getGuildMembers (guildId: Snowflake, options: Partial<Omit<DiscordTypes.GatewayRequestGuildMembersData, `guild_id` | `presences`>> = {}): Promise<{
        members: Collection<Snowflake, DiscordTypes.APIGuildMember>
        presences?: Collection<Snowflake, DiscordTypes.GatewayPresenceUpdate>
        notFound?: Snowflake[]
    }> {
        if (options.query && options.user_ids) throw new TypeError(`Cannot have both query and user_ids defined in a request guild members payload`);
        if (options.nonce && Buffer.byteLength(options.nonce, `utf-8`) > DiscordConstants.MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH) throw new Error(`nonce length is greater than the allowed ${DiscordConstants.MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH} bytes`);

        const shard = this.guildShard(guildId, true);

        const nonce = options.nonce ?? `${BigInt(this._requestGuildMembersNonceIncrement) % (10n ** BigInt(DiscordConstants.MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH))}`;
        this._requestGuildMembersNonceIncrement++;

        const members = new Collection<Snowflake, DiscordTypes.APIGuildMember>();
        const presences = new Collection<Snowflake, DiscordTypes.GatewayPresenceUpdate>();
        const notFound: Snowflake[] = [];

        return new Promise((resolve, reject) => {
            const listener = (data: DiscordTypes.GatewayGuildMembersChunkDispatch): void => {
                if (data.d.nonce !== nonce || data.d.guild_id !== guildId) return;
                data.d.members.filter((member) => member.user).forEach((member) => members.set(member.user!.id, member));
                data.d.presences?.forEach((presence) => presences.set(presence.user.id, presence));
                notFound.push(...(data.d.not_found as Snowflake[] ?? []));

                if (data.d.chunk_index === (data.d.chunk_count ?? 1) - 1) {
                    this.off(`GUILD_MEMBERS_CHUNK`, listener);

                    resolve({
                        members,
                        presences: presences.size > 0 ? presences : undefined,
                        notFound: notFound.length > 0 ? notFound : undefined
                    });
                }
            };

            this.on(`GUILD_MEMBERS_CHUNK`, listener);
            shard.send({
                op: 8,
                d: {
                    guild_id: guildId,
                    query: !options.query && !options.user_ids ? `` : options.query,
                    limit: options.limit ?? 0,
                    presences: (this.options.intents & DiscordConstants.INTENTS.GUILD_PRESENCES) !== 0,
                    user_ids: options.user_ids,
                    nonce
                }
            }).catch(reject);
        });
    }

    /**
     * Update the bot's voice state.
     * @param guildId The guild to set the voice state in.
     * @param channelId The channel to join. `null`disconnects the bot.
     * @param mute If the bot should self mute.
     * @param deafen If the bot should self deafen.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#update-voice-state)
     */
    public async updateVoiceState (guildId: Snowflake, channelId: Snowflake | null, mute = false, deafen = false): Promise<void> {
        return await this.guildShard(guildId, true).send({
            op: 4,
            d: {
                guild_id: guildId,
                channel_id: channelId,
                self_mute: mute,
                self_deaf: deafen
            }
        });
    }

    /**
     * Update the bot's presence.
     * @param presence Presence data.
     * @param shard A shard or shards to set the presence on. A number will set the presence on a single shard with a matching ID, a number array will set the presence on all shards matching am ID in the array, and `all` will set the presence on all shards.
     */
    public async updatePresence (presence: DiscordTypes.GatewayPresenceUpdateData, shard: number | number[] | `all` = `all`): Promise<void> {
        const shards = typeof shard === `number` ? [this.shards.get(shard)] : ((shard instanceof Array) ? this.shards.filter((s) => shard.some((sh) => sh === s.id)) : this.shards).map((s) => s);
        await Promise.all(shards.map((s) => s?.send({
            op: 3,
            d: presence
        })));
    }
}
