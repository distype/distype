"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const GatewayShard_1 = require("./GatewayShard");
const Cache_1 = require("../cache/Cache");
const DiscordConstants_1 = require("../constants/DiscordConstants");
const Logger_1 = require("../logger/Logger");
const Rest_1 = require("../rest/Rest");
const TypedEmitter_1 = require("../utils/TypedEmitter");
const UtilityFunctions_1 = require("../utils/UtilityFunctions");
const collection_1 = __importDefault(require("@discordjs/collection"));
const url_1 = require("url");
/**
 * The gateway manager.
 * Manages {@link GatewayShard shards}, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the {@link GatewayEvents `*`} event prior to being passed through the {@link cacheEventHandler}.
 * After being handled by the {@link Cache cache manager}, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
class Gateway extends TypedEmitter_1.TypedEmitter {
    /**
     * Create a gateway manager.
     * @param token The bot's token.
     * @param cache The {@link Cache cache manager} to update from incoming events. If `false` is specified, {@link GatewayEvents gateway events} will not be passed to a {@link cacheEventHandler}.
     * @param logger The {@link Logger logger} for the gateway manager to use. If `false` is specified, no logger will be used.
     * @param rest The {@link Rest rest manager} to use for fetching gateway endpoints.
     * @param options {@link GatewayOptions Gateway options}.
     */
    constructor(token, cache, logger, rest, options) {
        super();
        /**
         * {@link GatewayShard Gateway shards}.
         * Modifying this collection externally may result in unexpected behavior.
         */
        this.shards = new collection_1.default();
        /**
         * The latest self user received from the gateway.
         */
        this.user = null;
        /**
         * An increment used for creating unique nonce values for [request guild member](https://discord.com/developers/docs/topics/gateway#request-guild-members) payloads.
         */
        this._requestGuildMembersNonceIncrement = 0;
        /**
         * Stored response from `Rest#getGatewayBot()`.
         */
        this._storedGetGatewayBot = null;
        if (typeof token !== `string`)
            throw new TypeError(`A bot token must be specified`);
        if (!(cache instanceof Cache_1.Cache) && cache !== false)
            throw new TypeError(`A cache manager or false must be specified`);
        if (!(logger instanceof Logger_1.Logger) && logger !== false)
            throw new TypeError(`A logger or false must be specified`);
        if (!(rest instanceof Rest_1.Rest))
            throw new TypeError(`A rest manager must be specified`);
        if (cache)
            this._cache = cache;
        if (logger)
            this._logger = logger;
        this._rest = rest;
        this.options = options;
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this.on(`*`, (data) => {
            if (this._cache)
                this._cache.options.cacheEventHandler(this._cache, data);
            if (data.t === `READY`)
                this.user = data.d.user;
            if (data.t === `USER_UPDATE` && data.d.id === this.user?.id)
                this.user = data.d;
            this.emit(data.t, data);
        });
        this._logger?.log(`Initialized gateway manager`, {
            internal: true, level: `DEBUG`, system: `Gateway`
        });
    }
    /**
     * If all shards are in a {@link GatewayShardState READY} state.
     */
    get shardsReady() {
        return this.shards.size > 0 && this.shards.every((shard) => shard.state === GatewayShard_1.GatewayShardState.CONNECTED);
    }
    /**
     * Connect to the gateway.
     * @param gatewayBot A pre-fetched `GET` `/gateway/bot`. Not required, as this method will fetch it if not specified.
     * @returns The results from {@link GatewayShard shard} spawns.
     */
    async connect(gatewayBot) {
        if (this.shardsReady)
            throw new Error(`Shards are already connected`);
        this._logger?.log(`Starting connection process`, {
            internal: true, level: `DEBUG`, system: `Gateway`
        });
        if (gatewayBot)
            this._storedGetGatewayBot = gatewayBot;
        else {
            const customGetGatewayBotURL = this.options.customGetGatewayBotURL ? new url_1.URL(this.options.customGetGatewayBotURL) : undefined;
            this._storedGetGatewayBot = customGetGatewayBotURL ? await this._rest.request(`GET`, customGetGatewayBotURL.pathname, {
                customBaseURL: customGetGatewayBotURL.origin,
                query: Object.fromEntries(customGetGatewayBotURL.searchParams.entries())
            }) : await this._rest.getGatewayBot();
        }
        if (!this._storedGetGatewayBot?.session_start_limit || typeof this._storedGetGatewayBot?.shards !== `number` || (!this.options.customGatewaySocketURL && typeof this._storedGetGatewayBot.url !== `string`))
            throw new Error(`Invalid gateway bot response`);
        this._logger?.log(`Got bot gateway information`, {
            internal: true, level: `DEBUG`, system: `Gateway`
        });
        this.options.sharding.totalBotShards = this.options.sharding.totalBotShards === `auto` ? this._storedGetGatewayBot.shards : (this.options.sharding.totalBotShards ?? this._storedGetGatewayBot.shards);
        this.options.sharding.shards = this.options.sharding.shards ?? this.options.sharding.totalBotShards;
        this.options.sharding.offset = this.options.sharding.offset ?? 0;
        if (this.options.sharding.totalBotShards < this.options.sharding.shards
            || this.options.sharding.totalBotShards <= this.options.sharding.offset
            || this.options.sharding.totalBotShards < (this.options.sharding.shards + this.options.sharding.offset))
            throw new Error(`Invalid shard configuration, got ${this.options.sharding.totalBotShards} total shards, with ${this.options.sharding.shards} to be spawned with an offset of ${this.options.sharding.offset}`);
        this._logger?.log(`Spawning ${this.options.sharding.shards} shards`, {
            internal: true, system: `Gateway`
        });
        if (this.options.sharding.shards > this._storedGetGatewayBot.session_start_limit.remaining) {
            const error = new Error(`Session start limit reached; tried to spawn ${this.options.sharding.shards} shards when only ${this._storedGetGatewayBot.session_start_limit.remaining} more shards are allowed. Limit will reset in ${this._storedGetGatewayBot.session_start_limit.reset_after / 1000} seconds`);
            this._logger?.log(`Unable to connect shards: ${error.message}`, {
                internal: true, level: `ERROR`, system: `Gateway`
            });
            throw error;
        }
        const buckets = new collection_1.default();
        for (let i = 0; i < this.options.sharding.shards; i++) {
            let shard = null;
            if (i >= this.options.sharding.offset) {
                this._logger?.log(`Creating shard ${i}`, {
                    internal: true, level: `DEBUG`, system: `Gateway`
                });
                shard = new GatewayShard_1.GatewayShard(this._token, i, this.options.sharding.totalBotShards, new url_1.URL(`?${new url_1.URLSearchParams({
                    v: `${this.options.version}`, encoding: `json`
                }).toString()}`, this.options.customGatewaySocketURL ?? this._storedGetGatewayBot.url).toString(), this._logger ?? false, this.options);
                this.shards.set(i, shard);
                shard.on(`*`, (data) => this.emit(`*`, data));
                shard.on(`SENT`, (payload) => this.emit(`SENT`, payload));
                shard.on(`STATE_DISCONNECTED`, () => this.emit(`SHARD_STATE_DISCONNECTED`, shard));
                shard.on(`STATE_CONNECTING`, () => this.emit(`SHARD_STATE_CONNECTING`, shard));
                shard.on(`STATE_RESUMING`, () => this.emit(`SHARD_STATE_RESUMING`, shard));
                shard.on(`STATE_CONNECTED`, () => this.emit(`SHARD_STATE_CONNECTED`, shard));
                this._logger?.log(`Created shard ${shard.id} and bound events`, {
                    internal: true, level: `DEBUG`, system: `Gateway`
                });
            }
            const bucketId = i % this._storedGetGatewayBot.session_start_limit.max_concurrency;
            if (buckets.has(bucketId))
                buckets.get(bucketId)?.set(i, shard);
            else
                buckets.set(bucketId, new collection_1.default()).get(bucketId).set(i, shard);
            if (shard !== null)
                this._logger?.log(`Pushed shard ${i} to bucket ${bucketId}`, {
                    internal: true, level: `DEBUG`, system: `Gateway`
                });
        }
        const results = [];
        for (let i = 0; i < Math.max(...buckets.map((bucket) => bucket.size)); i++) {
            this._logger?.log(`Starting spawn process for shard ratelimit key ${i}`, {
                internal: true, level: `DEBUG`, system: `Gateway`
            });
            const bucketResult = await Promise.allSettled(buckets.filter((bucket) => bucket.get(i) instanceof GatewayShard_1.GatewayShard).map((bucket) => bucket.get(i).spawn()));
            results.push(...bucketResult);
            this._logger?.log(`Finished spawn process for shard ratelimit key ${i}`, {
                internal: true, level: `DEBUG`, system: `Gateway`
            });
            if (i !== buckets.size - 1 && !this.options.disableBucketRatelimits)
                await UtilityFunctions_1.UtilityFunctions.wait(DiscordConstants_1.DiscordConstants.GATEWAY_SHARD_SPAWN_COOLDOWN);
        }
        const success = results.filter((result) => result.status === `fulfilled`).length;
        const failed = this.options.sharding.shards - success;
        this.emit(`SHARDS_READY`, {
            success, failed
        });
        this._logger?.log(`Finished connection process`, {
            internal: true, level: `DEBUG`, system: `Gateway`
        });
        this._logger?.log(`${success}/${success + failed} shards spawned`, { system: `Gateway` });
        if (failed > 0)
            this._logger?.log(`${failed} shards failed to spawn`, {
                internal: true, level: `WARN`, system: `Gateway`
            });
        this._logger?.log(`Connected to Discord${this.user ? ` as ${this.user.username}#${this.user.discriminator}` : ``}`, {
            internal: true, system: `Gateway`
        });
        return results;
    }
    /**
     * Get a guild's shard.
     * @param guildId The guild's ID.
     * @param ensure If true, an error is thrown if a {@link GatewayShard} is not found.
     * @returns The guild's shard, or a shard ID if the shard is not in this manager.
     * @see [Discord API Reference]
     */
    guildShard(guildId, ensure) {
        if (!this.shards.size || (typeof this.options.sharding.totalBotShards !== `number` && !this._storedGetGatewayBot?.shards))
            throw new Error(`Shards are not available.`);
        const shardId = UtilityFunctions_1.UtilityFunctions.guildShard(guildId, typeof this.options.sharding.totalBotShards === `number` ? this.options.sharding.totalBotShards : this._storedGetGatewayBot.shards);
        const shard = this.shards.get(shardId);
        if (ensure && !(shard instanceof GatewayShard_1.GatewayShard))
            throw new Error(`No shard with the specified guild ID found on this gateway manager`);
        return (shard ?? shardId);
    }
    /**
     * Get members from a guild.
     * @param guildId The ID of the guild to get members from.
     * @param options Guild member request options.
     * @returns Received members, presences, and unfound members.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#request-guild-members)
     */
    getGuildMembers(guildId, options = {}) {
        if (options.query && options.user_ids)
            throw new TypeError(`Cannot have both query and user_ids defined in a request guild members payload`);
        if (options.nonce && Buffer.byteLength(options.nonce, `utf-8`) > DiscordConstants_1.DiscordConstants.GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH)
            throw new Error(`nonce length is greater than the allowed ${DiscordConstants_1.DiscordConstants.GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH} bytes`);
        const shard = this.guildShard(guildId, true);
        const nonce = options.nonce ?? `${BigInt(this._requestGuildMembersNonceIncrement) % (10n ** BigInt(DiscordConstants_1.DiscordConstants.GATEWAY_MAX_REQUEST_GUILD_MEMBERS_NONCE_LENGTH))}`;
        this._requestGuildMembersNonceIncrement++;
        const members = new collection_1.default();
        const presences = new collection_1.default();
        const notFound = [];
        return new Promise((resolve, reject) => {
            const listener = (data) => {
                if (data.d.nonce !== nonce || data.d.guild_id !== guildId)
                    return;
                data.d.members.filter((member) => member.user).forEach((member) => members.set(member.user.id, member));
                data.d.presences?.forEach((presence) => presences.set(presence.user.id, presence));
                notFound.push(...(data.d.not_found ?? []));
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
                    presences: (this.options.intents & DiscordConstants_1.DiscordConstants.GATEWAY_INTENTS.GUILD_PRESENCES) !== 0,
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
    async updateVoiceState(guildId, channelId, mute = false, deafen = false) {
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
    async updatePresence(presence, shard = `all`) {
        const shards = typeof shard === `number` ? [this.shards.get(shard)] : ((shard instanceof Array) ? this.shards.filter((s) => shard.some((sh) => sh === s.id)) : this.shards).map((s) => s);
        await Promise.all(shards.map((s) => s?.send({
            op: 3,
            d: presence
        })));
    }
}
exports.Gateway = Gateway;
