import { GatewayOptions } from './GatewayOptions';
import { GatewayShard, GatewayShardState } from './GatewayShard';

import { Cache } from '../cache/Cache';
import { DiscordConstants } from '../constants/DiscordConstants';
import { DistypeError, DistypeErrorType } from '../errors/DistypeError';
import { Rest } from '../rest/Rest';
import { LogCallback } from '../types/Log';

import { ExtendedMap, TypedEmitter, wait } from '@br88c/node-utils';
import * as DiscordTypes from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/v10';
import { URL, URLSearchParams } from 'url';

/**
 * {@link Gateway} events.
 * Note that with the exception of `SHARDS_READY`, all events are a relay of a {@link GatewayShard gateway shard}'s event emit (For example, `READY` signifies a single shard receiving a `READY` dispatch).
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events)
 */
export interface GatewayEvents extends Record<string, (...args: any[]) => void> {
    /**
     * When all {@link GatewayShard shards} are spawned and ready.
     */
    SHARDS_READY: (success: number, failed: number) => void

    /**
     * When a payload is sent.
     */
    SENT_PAYLOAD: (payload: string) => void
    /**
     * When a {@link GatewayShard shard} enters an {@link GatewayShardState idle state}.
     */
    SHARD_IDLE: (shard: GatewayShard) => void
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState connecting state}.
     */
    SHARD_CONNECTING: (shard: GatewayShard) => void
    /**
     * When a {@link GatewayShard shard} enters an {@link GatewayShardState identifying state}.
     */
    SHARD_IDENTIFYING: (shard: GatewayShard) => void
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState resuming state}.
     */
    SHARD_RESUMING: (shard: GatewayShard) => void
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState running state}.
     */
    SHARD_RUNNING: (shard: GatewayShard) => void
    /**
     * When a {@link GatewayShard shard} enters a {@link GatewayShardState disconnected state}.
     */
    SHARD_DISCONNECTED: (payload: GatewayShard) => void

    '*': (payload: DiscordTypes.GatewayDispatchPayload) => void // eslint-disable-line quotes
    READY: (payload: DiscordTypes.GatewayReadyDispatch) => void
    RESUMED: (payload: DiscordTypes.GatewayResumedDispatch) => void
    CHANNEL_CREATE: (payload: DiscordTypes.GatewayChannelCreateDispatch) => void
    CHANNEL_UPDATE: (payload: DiscordTypes.GatewayChannelUpdateDispatch) => void
    CHANNEL_DELETE: (payload: DiscordTypes.GatewayChannelDeleteDispatch) => void
    CHANNEL_PINS_UPDATE: (payload: DiscordTypes.GatewayChannelPinsUpdateDispatch) => void
    THREAD_CREATE: (payload: DiscordTypes.GatewayThreadCreateDispatch) => void
    THREAD_UPDATE: (payload: DiscordTypes.GatewayThreadUpdateDispatch) => void
    THREAD_DELETE: (payload: DiscordTypes.GatewayThreadDeleteDispatch) => void
    THREAD_LIST_SYNC: (payload: DiscordTypes.GatewayThreadListSyncDispatch) => void
    THREAD_MEMBER_UPDATE: (payload: DiscordTypes.GatewayThreadMemberUpdateDispatch) => void
    THREAD_MEMBERS_UPDATE: (payload: DiscordTypes.GatewayThreadMembersUpdateDispatch) => void
    GUILD_CREATE: (payload: DiscordTypes.GatewayGuildCreateDispatch) => void
    GUILD_UPDATE: (payload: DiscordTypes.GatewayGuildUpdateDispatch) => void
    GUILD_DELETE: (payload: DiscordTypes.GatewayGuildDeleteDispatch) => void
    GUILD_BAN_ADD: (payload: DiscordTypes.GatewayGuildBanAddDispatch) => void
    GUILD_BAN_REMOVE: (payload: DiscordTypes.GatewayGuildBanRemoveDispatch) => void
    GUILD_EMOJIS_UPDATE: (payload: DiscordTypes.GatewayGuildEmojisUpdateDispatch) => void
    GUILD_STICKERS_UPDATE: (payload: DiscordTypes.GatewayGuildStickersUpdateDispatch) => void
    GUILD_INTEGRATIONS_UPDATE: (payload: DiscordTypes.GatewayGuildIntegrationsUpdateDispatch) => void
    GUILD_MEMBER_ADD: (payload: DiscordTypes.GatewayGuildMemberAddDispatch) => void
    GUILD_MEMBER_REMOVE: (payload: DiscordTypes.GatewayGuildMemberRemoveDispatch) => void
    GUILD_MEMBER_UPDATE: (payload: DiscordTypes.GatewayGuildMemberUpdateDispatch) => void
    GUILD_MEMBERS_CHUNK: (payload: DiscordTypes.GatewayGuildMembersChunkDispatch) => void
    GUILD_ROLE_CREATE: (payload: DiscordTypes.GatewayGuildRoleCreateDispatch) => void
    GUILD_ROLE_UPDATE: (payload: DiscordTypes.GatewayGuildRoleUpdateDispatch) => void
    GUILD_ROLE_DELETE: (payload: DiscordTypes.GatewayGuildRoleDeleteDispatch) => void
    GUILD_SCHEDULED_EVENT_CREATE: (payload: DiscordTypes.GatewayGuildScheduledEventCreateDispatch) => void
    GUILD_SCHEDULED_EVENT_UPDATE: (payload: DiscordTypes.GatewayGuildScheduledEventUpdateDispatch) => void
    GUILD_SCHEDULED_EVENT_DELETE: (payload: DiscordTypes.GatewayGuildScheduledEventDeleteDispatch) => void
    GUILD_SCHEDULED_EVENT_USER_ADD: (payload: DiscordTypes.GatewayGuildScheduledEventUserAddDispatch) => void
    GUILD_SCHEDULED_EVENT_USER_REMOVE: (payload: DiscordTypes.GatewayGuildScheduledEventUserRemoveDispatch) => void
    INTEGRATION_CREATE: (payload: DiscordTypes.GatewayIntegrationCreateDispatch) => void
    INTEGRATION_UPDATE: (payload: DiscordTypes.GatewayIntegrationUpdateDispatch) => void
    INTEGRATION_DELETE: (payload: DiscordTypes.GatewayIntegrationDeleteDispatch) => void
    INTERACTION_CREATE: (payload: DiscordTypes.GatewayInteractionCreateDispatch) => void
    INVITE_CREATE: (payload: DiscordTypes.GatewayInviteCreateDispatch) => void
    INVITE_DELETE: (payload: DiscordTypes.GatewayInviteDeleteDispatch) => void
    MESSAGE_CREATE: (payload: DiscordTypes.GatewayMessageCreateDispatch) => void
    MESSAGE_UPDATE: (payload: DiscordTypes.GatewayMessageUpdateDispatch) => void
    MESSAGE_DELETE: (payload: DiscordTypes.GatewayMessageDeleteDispatch) => void
    MESSAGE_DELETE_BULK: (payload: DiscordTypes.GatewayMessageDeleteBulkDispatch) => void
    MESSAGE_REACTION_ADD: (payload: DiscordTypes.GatewayMessageReactionAddDispatch) => void
    MESSAGE_REACTION_REMOVE: (payload: DiscordTypes.GatewayMessageReactionRemoveDispatch) => void
    MESSAGE_REACTION_REMOVE_ALL: (payload: DiscordTypes.GatewayMessageReactionRemoveAllDispatch) => void
    MESSAGE_REACTION_REMOVE_EMOJI: (payload: DiscordTypes.GatewayMessageReactionRemoveEmojiDispatch) => void
    PRESENCE_UPDATE: (payload: DiscordTypes.GatewayPresenceUpdateDispatch) => void
    STAGE_INSTANCE_CREATE: (payload: DiscordTypes.GatewayStageInstanceCreateDispatch) => void
    STAGE_INSTANCE_DELETE: (payload: DiscordTypes.GatewayStageInstanceDeleteDispatch) => void
    STAGE_INSTANCE_UPDATE: (payload: DiscordTypes.GatewayStageInstanceUpdateDispatch) => void
    TYPING_START: (payload: DiscordTypes.GatewayTypingStartDispatch) => void
    USER_UPDATE: (payload: DiscordTypes.GatewayUserUpdateDispatch) => void
    VOICE_STATE_UPDATE: (payload: DiscordTypes.GatewayVoiceStateUpdateDispatch) => void
    VOICE_SERVER_UPDATE: (payload: DiscordTypes.GatewayVoiceServerUpdateDispatch) => void
    WEBHOOKS_UPDATE: (payload: DiscordTypes.GatewayWebhooksUpdateDispatch) => void
}

/**
 * The gateway manager.
 * Manages {@link GatewayShard shards}, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the {@link GatewayEvents `*`} event prior to being passed through the cache event handler.
 * After being handled by the {@link Cache cache manager}, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
export class Gateway extends TypedEmitter<GatewayEvents> {
    /**
     * {@link GatewayShard Gateway shards}.
     * Modifying this map externally may result in unexpected behavior.
     */
    public shards: ExtendedMap<number, GatewayShard> = new ExtendedMap();
    /**
     * The latest self user received from the gateway.
     */
    public user: DiscordTypes.APIUser | null = null;

    /**
     * {@link GatewayOptions Options} for the gateway manager.
     * Note that any options not specified are set to a default value.x
     */
    public readonly options: Required<GatewayOptions> & { intents: number };
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    public readonly system = `Gateway`;

    /**
     * The {@link Cache cache manager} to update from incoming events.
     */
    private _cache?: Cache;
    /**
     * The {@link LogCallback log callback} used by the gateway manager.
     */
    private _log: LogCallback;
    /**
     * A value to use as `this` in the `this#_log`.
     */
    private _logThisArg?: any;
    /**
     * An increment used for creating unique nonce values for [request guild member](https://discord.com/developers/docs/topics/gateway#request-guild-members) payloads.
     */
    private _requestGuildMembersNonceIncrement = 0;
    /**
     * The {@link Rest rest manager} to use for fetching gateway endpoints.
     */
    private _rest: Rest;
    /**
     * Stored calculated sharding options.
     */
    private _storedCalculatedShards: Required<Gateway[`options`][`sharding`]> & { totalBotShards: number } | null = null;
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
     * @param rest The {@link Rest rest manager} to use for fetching gateway endpoints.
     * @param cache The {@link Cache cache} to update from incoming events. If `false` is specified, {@link GatewayEvents gateway events} will not be passed to a cache event handler.
     * @param options {@link GatewayOptions Gateway options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor (token: string, rest: Rest, cache: Cache | false, options: GatewayOptions = {}, logCallback: LogCallback = (): void => {}, logThisArg?: any) {
        super();

        if (typeof token !== `string`) throw new TypeError(`Parameter "token" (string) not provided: got ${token} (${typeof token})`);
        if (!(rest instanceof Rest)) throw new TypeError(`Parameter "rest" (Rest) not provided: got ${rest} (${typeof rest})`);
        if (!(cache instanceof Cache) && cache !== false) throw new TypeError(`Parameter "cache" (Cache | false) not provided: got ${cache} (${typeof cache})`);
        if (typeof options !== `object`) throw new TypeError(`Parameter "options" (object) type mismatch: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`) throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Gateway[`_token`],
            writable: false
        });

        this._rest = rest;
        if (cache) this._cache = cache;

        this.options = {
            customGatewaySocketURL: options.customGatewaySocketURL ?? null,
            customGetGatewayBotURL: options.customGetGatewayBotURL ?? null,
            disableBucketRatelimits: options.disableBucketRatelimits ?? false,
            intents: this._intentsFactory(options.intents),
            largeGuildThreshold: options.largeGuildThreshold ?? 50,
            presence: options.presence ?? null,
            sharding: options.sharding ?? {},
            spawnAttemptDelay: options.spawnAttemptDelay ?? 2500,
            spawnMaxAttempts: options.spawnMaxAttempts ?? 10,
            version: options.version ?? 10,
            wsOptions: options.wsOptions ?? {}
        };

        this.on(`*`, (payload) => {
            if (this._cache) this._cache.handleEvent(payload);

            if (payload.t === `READY`) this.user = payload.d.user;
            if (payload.t === `USER_UPDATE` && payload.d.id === this.user?.id) this.user = payload.d;

            this.emit(payload.t, payload as any);
        });

        this._log = logCallback.bind(logThisArg);
        this._logThisArg = logThisArg;
        this._log(`Initialized gateway manager`, {
            level: `DEBUG`, system: this.system
        });
    }

    /**
     * If all shards are in a {@link GatewayShardState READY} state.
     */
    public get shardsRunning (): boolean {
        return this.shards.size > 0 && this.shards.every((shard) => shard.state === GatewayShardState.RUNNING);
    }

    /**
     * Connect to the gateway.
     * @param gatewayBot A pre-fetched `GET` `/gateway/bot`. Not required, as this method will fetch it if not specified.
     * @returns The results from {@link GatewayShard shard} spawns.
     */
    public async connect (gatewayBot?: DiscordTypes.APIGatewayBotInfo): Promise<Array<PromiseSettledResult<void>>> {
        if (this.shardsRunning) throw new DistypeError(`Shards are already connected`, DistypeErrorType.GATEWAY_ALREADY_CONNECTED, this.system);

        this._log(`Starting connection process`, {
            level: `DEBUG`, system: this.system
        });

        if (gatewayBot) this._storedGetGatewayBot = gatewayBot;
        else {
            const customGetGatewayBotURL = this.options.customGetGatewayBotURL ? new URL(this.options.customGetGatewayBotURL) : undefined;
            this._storedGetGatewayBot = customGetGatewayBotURL ? await this._rest.request(`GET`, customGetGatewayBotURL.pathname as `/${string}`, {
                customBaseURL: customGetGatewayBotURL.origin,
                query: Object.fromEntries(customGetGatewayBotURL.searchParams.entries())
            }) : await this._rest.getGatewayBot();
        }

        if (!this._storedGetGatewayBot?.session_start_limit || typeof this._storedGetGatewayBot?.shards !== `number` || (!this.options.customGatewaySocketURL && typeof this._storedGetGatewayBot.url !== `string`)) throw new DistypeError(`Invalid gateway bot response`, DistypeErrorType.GATEWAY_INVALID_REST_RESPONSE, this.system);

        const totalBotShards = this.options.sharding.totalBotShards === `auto` ? this._storedGetGatewayBot.shards : (this.options.sharding.totalBotShards ?? this._storedGetGatewayBot.shards);
        this._storedCalculatedShards = {
            totalBotShards,
            shards: this.options.sharding.shards ?? totalBotShards,
            offset: this.options.sharding.offset ?? 0
        };

        if (
            this._storedCalculatedShards.totalBotShards < this._storedCalculatedShards.shards
            || this._storedCalculatedShards.totalBotShards <= this._storedCalculatedShards.offset
            || this._storedCalculatedShards.totalBotShards < (this._storedCalculatedShards.shards + this._storedCalculatedShards.offset)
        ) throw new DistypeError(`Invalid shard configuration, got ${this._storedCalculatedShards.totalBotShards} total shards, with ${this._storedCalculatedShards.shards} to be spawned with an offset of ${this._storedCalculatedShards.offset}`, DistypeErrorType.GATEWAY_INVALID_SHARD_CONFIG, this.system);

        if (this._storedCalculatedShards.shards > this._storedGetGatewayBot.session_start_limit.remaining) {
            throw new DistypeError(`Session start limit reached; tried to spawn ${this._storedCalculatedShards.shards} shards when only ${this._storedGetGatewayBot.session_start_limit.remaining} more shards are allowed. Limit will reset in ${this._storedGetGatewayBot.session_start_limit.reset_after / 1000} seconds`, DistypeErrorType.GATEWAY_SESSION_START_LIMIT_REACHED, this.system);
        }

        this._log(`Spawning ${this._storedCalculatedShards.shards} shards`, {
            level: `INFO`, system: this.system
        });

        const buckets: ExtendedMap<number, ExtendedMap<number, GatewayShard | null>> = new ExtendedMap();
        for (let i = 0; i < this._storedCalculatedShards.shards; i++) {
            let shard: GatewayShard | null = null;
            if (i >= this._storedCalculatedShards.offset) {
                shard = new GatewayShard(this._token, i, this._storedCalculatedShards.totalBotShards, new URL(`?${new URLSearchParams({
                    v: `${this.options.version}`, encoding: `json`
                } as DiscordTypes.GatewayURLQuery as any).toString()}`, this.options.customGatewaySocketURL ?? this._storedGetGatewayBot.url).toString(), this.options, this._log, this._logThisArg);
                this.shards.set(i, shard);

                shard.on(`RECEIVED_MESSAGE`, (message) => this.emit(`*`, message));
                shard.on(`SENT_PAYLOAD`, (payload) => this.emit(`SENT_PAYLOAD`, payload));
                shard.on(`IDLE`, () => this.emit(`SHARD_IDLE`, shard!));
                shard.on(`CONNECTING`, () => this.emit(`SHARD_CONNECTING`, shard!));
                shard.on(`IDENTIFYING`, () => this.emit(`SHARD_IDENTIFYING`, shard!));
                shard.on(`RESUMING`, () => this.emit(`SHARD_RESUMING`, shard!));
                shard.on(`RUNNING`, () => this.emit(`SHARD_RUNNING`, shard!));
                shard.on(`DISCONNECTED`, () => this.emit(`SHARD_DISCONNECTED`, shard!));
            }

            const bucketId = i % this._storedGetGatewayBot.session_start_limit.max_concurrency;
            if (buckets.has(bucketId)) buckets.get(bucketId)?.set(i, shard);
            else buckets.set(bucketId, new ExtendedMap()).get(bucketId)!.set(i, shard);
        }

        const results: Array<PromiseSettledResult<void>> = [];
        const mostShards = Math.max(...buckets.map((bucket) => bucket.size));
        for (let i = 0; i < mostShards; i++) {
            this._log(`Starting spawn process for shard rate limit key ${i}`, {
                level: `DEBUG`, system: this.system
            });
            const bucketResult = await Promise.allSettled(buckets.filter((bucket) => bucket.get(i) instanceof GatewayShard).map((bucket) => bucket.get(i)!.spawn()));
            results.push(...bucketResult);
            if (i !== buckets.size - 1 && !this.options.disableBucketRatelimits) await wait(DiscordConstants.GATEWAY_SHARD_SPAWN_COOLDOWN);
        }

        const success = results.filter((result) => result.status === `fulfilled`).length;
        const failed = this._storedCalculatedShards.shards - success;

        this._log(`${success}/${success + failed} shards spawned`, {
            level: `INFO`, system: this.system
        });
        if (failed > 0) this._log(`${failed} shards failed to spawn`, {
            level: `WARN`, system: this.system
        });
        this._log(`Connected to Discord${this.user ? ` as "${this.user.username}#${this.user.discriminator}" (${this.user.id})` : ``}`, {
            level: `INFO`, system: this.system
        });

        this.emit(`SHARDS_READY`, success, failed);

        return results;
    }

    /**
     * Get a guild's shard.
     * @param guildId The guild's ID.
     * @param ensure If true, an error is thrown if a {@link GatewayShard} is not found.
     * @returns The guild's shard, or a shard ID if the shard is not in this manager.
     * @see [Discord API Reference]
     */
    public guildShard <T extends boolean> (guildId: Snowflake, ensure?: T): T extends true ? GatewayShard : GatewayShard | number {
        const shardId = this._guildShard(guildId, this._storedCalculatedShards?.totalBotShards ?? this._storedGetGatewayBot!.shards);
        const shard = this.shards.get(shardId);
        if (ensure && !(shard instanceof GatewayShard)) throw new DistypeError(`No shard with the specified guild ID found on this gateway manager`, DistypeErrorType.GATEWAY_NO_SHARD, this.system);
        return (shard ?? shardId) as any;
    }

    /**
     * Get members from a guild.
     * @param guildId The ID of the guild to get members from.
     * @param options Guild member request options.
     * @returns Received members, presences, and missing members.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#request-guild-members)
     */
    public getGuildMembers (guildId: Snowflake, options: Partial<Omit<DiscordTypes.GatewayRequestGuildMembersData, `guild_id` | `presences`>> = {}): Promise<{
        members: ExtendedMap<Snowflake, DiscordTypes.APIGuildMember>
        presences?: ExtendedMap<Snowflake, DiscordTypes.GatewayPresenceUpdate>
        notFound?: Snowflake[]
    }> {
        if (options.query && options.user_ids) throw new TypeError(`Cannot have both query and user_ids defined in a request guild members payload`);
        if (options.nonce && Buffer.byteLength(options.nonce, `utf-8`) > DiscordConstants.GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH) throw new DistypeError(`nonce length is greater than the allowed ${DiscordConstants.GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH} bytes`, DistypeErrorType.GATEWAY_MEMBER_NONCE_TOO_BIG, this.system);

        const shard = this.guildShard(guildId, true);

        const nonce = options.nonce ?? `${BigInt(this._requestGuildMembersNonceIncrement) % (10n ** BigInt(DiscordConstants.GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH))}`;
        this._requestGuildMembersNonceIncrement++;

        const members = new ExtendedMap<Snowflake, DiscordTypes.APIGuildMember>();
        const presences = new ExtendedMap<Snowflake, DiscordTypes.GatewayPresenceUpdate>();
        const notFound: Snowflake[] = [];

        return new Promise((resolve, reject) => {
            const listener = (data: DiscordTypes.GatewayGuildMembersChunkDispatch): void => {
                if (data.d.nonce !== nonce || data.d.guild_id !== guildId) return;
                data.d.members.filter((member) => member.user).forEach((member) => members.set(member.user!.id, member));
                data.d.presences?.forEach((presence) => presences.set(presence.user.id, presence));
                notFound.push(...(data.d.not_found as Snowflake[] ?? []));

                if (data.d.chunk_index === (data.d.chunk_count ?? 1) - 1) {
                    this.removeListener(`GUILD_MEMBERS_CHUNK`, listener);

                    resolve({
                        members,
                        presences: presences.size > 0 ? presences : undefined,
                        notFound: notFound.length > 0 ? notFound : undefined
                    });
                }
            };

            this.on(`GUILD_MEMBERS_CHUNK`, listener);
            shard.send({
                op: DiscordTypes.GatewayOpcodes.RequestGuildMembers,
                d: {
                    guild_id: guildId,
                    query: !options.query && !options.user_ids ? `` : options.query,
                    limit: options.limit ?? 0,
                    presences: (this.options.intents & DiscordConstants.GATEWAY_INTENTS.GUILD_PRESENCES) !== 0,
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
            op: DiscordTypes.GatewayOpcodes.VoiceStateUpdate,
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
    public async updatePresence (presence: {
        since: number | null
        activities: Array<{
            name: string
            type: number
            url?: string | null
        }>
        status: `online` | `dnd` | `idle` | `invisible` | `offline`
        afk: boolean
    } | DiscordTypes.GatewayPresenceUpdateData, shard: number | number[] | `all` = `all`): Promise<void> {
        const shards = typeof shard === `number` ? [this.shards.get(shard)] : ((shard instanceof Array) ? this.shards.filter((s) => shard.some((sh) => sh === s.id)) : this.shards).map((s) => s);
        await Promise.all(shards.map((s) => s?.send({
            op: DiscordTypes.GatewayOpcodes.PresenceUpdate,
            d: presence as any
        })));
    }

    /**
     * Get a guild's shard ID.
     * @param guildId The guild's ID.
     * @param numShards The `numShards` value sent in the identify payload.
     * @returns A shard ID.
     */
    private _guildShard (guildId: Snowflake, numShards: number): number {
        return Number((BigInt(guildId) >> 22n) % BigInt(numShards));
    }

    /**
     * Creates intents flags from intents specified in the constructor.
     * @param specified The specified intents.
     * @returns Intents flags.
     */
    private _intentsFactory (specified?: GatewayOptions[`intents`]): number {
        if (typeof specified === `number`) return specified;
        else if (typeof specified === `bigint`) return Number(specified);
        else if (specified instanceof Array) return specified.reduce((p, c) => p | DiscordConstants.GATEWAY_INTENTS[c], 0);
        else if (specified === `all`) return Object.values(DiscordConstants.GATEWAY_INTENTS).reduce((p, c) => p | c, 0);
        else return Object.values(DiscordConstants.GATEWAY_PRIVILEGED_INTENTS).reduce((p, c) => p & ~c, Object.values(DiscordConstants.GATEWAY_INTENTS).reduce((p, c) => p | c, 0 as number));
    }
}
