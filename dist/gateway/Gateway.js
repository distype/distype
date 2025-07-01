"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const GatewayShard_1 = require("./GatewayShard");
const Cache_1 = require("../cache/Cache");
const Rest_1 = require("../rest/Rest");
const ExtendedMap_1 = require("../utils/ExtendedMap");
const IntentUtils_1 = require("../utils/IntentUtils");
const typed_emitter_1 = require("@br88c/typed-emitter");
const DiscordTypes = __importStar(require("discord-api-types/v10"));
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:timers/promises");
const node_url_1 = require("node:url");
/**
 * The gateway manager.
 * Manages {@link GatewayShard shards}, handles incoming payloads, and sends commands to the Discord gateway.
 *
 * All events are emitted with their entire payload; [Discord API Reference](https://discord.com/developers/docs/topics/gateway#payloads-gateway-payload-structure).
 * Dispatched events are emitted under the {@link GatewayEvents `*`} event prior to being passed through the cache event handler.
 * After being handled by the {@link Cache cache manager}, they are emitted again under their individual event name (example: `GUILD_CREATE`).
 */
class Gateway extends typed_emitter_1.TypedEmitter {
    /**
     * The default gateway API version used.
     */
    static API_VERSION = 10;
    /**
     * The maximum length in bytes allowed for the `nonce` property in a [request guild members](https://discord.com/developers/docs/topics/gateway#request-guild-members) payload.
     */
    static REQUEST_GUILD_MEMBERS_MAX_NONCE_LENGTH = 32;
    /**
     * The cooldown between spawning shards from the same bucket in milliseconds.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#sharding)
     */
    static SHARD_SPAWN_COOLDOWN = 5000;
    /**
     * The shard counts the manager is controlling.
     */
    managingShards = null;
    /**
     * {@link GatewayShard Gateway shards}.
     * Modifying this map externally may result in unexpected behavior.
     */
    shards = new ExtendedMap_1.ExtendedMap();
    /**
     * The latest self user received from the gateway.
     */
    user = null;
    /**
     * {@link GatewayOptions Options} for the gateway manager.
     * Note that any options not specified are set to a default value.
     */
    options;
    /**
     * The system string used for logging.
     */
    system = `Gateway`;
    /**
     * The {@link Cache cache manager} to update from incoming events.
     */
    _cache;
    /**
     * The {@link LogCallback log callback} used by the gateway manager.
     */
    _log;
    /**
     * A value to use as `this` in the `this#_log`.
     */
    _logThisArg;
    /**
     * The {@link Rest rest manager} to use for fetching gateway endpoints.
     */
    _rest;
    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    _token;
    /**
     * Create a gateway manager.
     * @param token The bot's token.
     * @param rest The {@link Rest rest manager} to use for fetching gateway endpoints.
     * @param cache The {@link Cache cache} to update from incoming events. If `false` is specified, {@link GatewayEvents gateway events} will not be passed to a cache event handler.
     * @param options {@link GatewayOptions Gateway options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the gateway manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token, rest, cache, options = {}, logCallback = () => { }, logThisArg) {
        super();
        if (typeof token !== `string`)
            throw new TypeError(`Parameter "token" (string) not provided: got ${token} (${typeof token})`);
        if (!(rest instanceof Rest_1.Rest))
            throw new TypeError(`Parameter "rest" (Rest) not provided: got ${rest} (${typeof rest})`);
        if (!(cache instanceof Cache_1.Cache) && cache !== false)
            throw new TypeError(`Parameter "cache" (Cache | false) not provided: got ${cache} (${typeof cache})`);
        if (typeof options !== `object`)
            throw new TypeError(`Parameter "options" (object) type mismatch: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`)
            throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false,
        });
        this._rest = rest;
        if (cache)
            this._cache = cache;
        this.options = {
            customGatewaySocketURL: options.customGatewaySocketURL ?? null,
            customGatewaySocketURLOverwrittenByResumeURL: options.customGatewaySocketURLOverwrittenByResumeURL ?? null,
            customGetGatewayBotURL: options.customGetGatewayBotURL ?? null,
            disableBucketRatelimits: options.disableBucketRatelimits ?? false,
            guildsReadyTimeout: options.guildsReadyTimeout ?? 15000,
            intents: IntentUtils_1.IntentUtils.factory(options.intents ?? 0),
            largeGuildThreshold: options.largeGuildThreshold ?? 50,
            presence: options.presence ?? null,
            sharding: options.sharding ?? {},
            spawnAttemptDelay: options.spawnAttemptDelay ?? 2500,
            version: options.version ?? Gateway.API_VERSION,
            wsOptions: options.wsOptions ?? {},
        };
        this.on(`*`, (payload) => {
            if (this._cache)
                this._cache.handleEvent(payload);
            switch (payload.t) {
                case DiscordTypes.GatewayDispatchEvents.Ready: {
                    this.user = payload.d.user;
                    break;
                }
                case DiscordTypes.GatewayDispatchEvents.UserUpdate: {
                    this.user = payload.d;
                    break;
                }
            }
            this.emit(payload.t, payload);
        });
        this._log = logCallback.bind(logThisArg);
        this._logThisArg = logThisArg;
        this._log(`Initialized gateway manager`, {
            level: `DEBUG`,
            system: this.system,
        });
    }
    /**
     * The average heartbeat ping in milliseconds across all shards.
     */
    get averageHeartbeatPing() {
        if (!this.shardsReady)
            return 0;
        else
            return this.shards.reduce((p, c) => p + c.heartbeatPing, 0) / this.shards.size;
    }
    /**
     * The total guild count across all shards.
     */
    get guildCount() {
        return this.shards.reduce((p, c) => p + c.guilds.size, 0);
    }
    /**
     * If all shards are in a {@link GatewayShardState ready state} (or {@link GatewayShardState guilds ready}).
     */
    get shardsReady() {
        return this.shards.size > 0 && this.shards.every((shard) => shard.state >= GatewayShard_1.GatewayShardState.READY);
    }
    /**
     * If all shards are in a {@link GatewayShardState guilds ready}.
     */
    get shardsGuildsReady() {
        return this.shards.size > 0 && this.shards.every((shard) => shard.state === GatewayShard_1.GatewayShardState.GUILDS_READY);
    }
    /**
     * Connect to the gateway.
     * @param gatewayBot A pre-fetched [`GET /gateway/bot`](https://discord.com/developers/docs/topics/gateway#get-gateway-bot). Not required, as this method will fetch it if not specified.
     * @returns The results from {@link GatewayShard shard} spawns; `[success, failed]`.
     */
    async connect(gatewayBot) {
        if (this.shardsReady)
            throw new Error(`Shards are already connected`);
        this._log(`Starting connection process`, {
            level: `DEBUG`,
            system: this.system,
        });
        this._log(`Using intents: ${this.options.intents !== 0 ? IntentUtils_1.IntentUtils.toReadable(this.options.intents).join(`, `) : `None`}`, {
            level: `DEBUG`,
            system: this.system,
        });
        gatewayBot ??= await this._getGatewayBot();
        this.managingShards = this._calculateShards(gatewayBot);
        this._log(`Spawning ${this.managingShards.shards} shards`, {
            level: `INFO`,
            system: this.system,
        });
        const url = new node_url_1.URL(`?${new node_url_1.URLSearchParams({
            v: `${this.options.version}`,
            encoding: `json`,
        }).toString()}`, this.options.customGatewaySocketURL ?? gatewayBot.url).toString();
        const buckets = new ExtendedMap_1.ExtendedMap();
        for (let i = 0; i < this.managingShards.shards; i++) {
            let shard = null;
            if (i >= this.managingShards.offset) {
                shard = new GatewayShard_1.GatewayShard(this._token, i, this.managingShards.totalBotShards, url, this.options, this._log, this._logThisArg);
                this.shards.set(i, shard);
                this._bindShardEvents(shard);
            }
            const bucketId = i % gatewayBot.session_start_limit.max_concurrency;
            if (buckets.has(bucketId))
                buckets.get(bucketId)?.set(i, shard);
            else
                buckets.set(bucketId, new ExtendedMap_1.ExtendedMap()).get(bucketId).set(i, shard);
        }
        const results = await this._spawnShards(buckets).catch((error) => {
            this.shards.forEach((shard) => {
                shard.kill();
                shard.removeAllListeners();
            });
            this.shards.clear();
            return error;
        });
        if (results instanceof Error)
            throw results;
        this._log(`Connected to Discord${this.user ? ` as "${this.user.username}#${this.user.discriminator}" (${this.user.id})` : ``}`, {
            level: `INFO`,
            system: this.system,
        });
        this.emit(`MANAGER_READY`, results[0], results[1]);
        return results;
    }
    /**
     * Get the average ping across all shards.
     */
    async getAveragePing() {
        if (!this.shardsReady) {
            return 0;
        }
        else {
            const ping = await Promise.all(this.shards.map((shard) => shard.getPing()));
            return ping.reduce((p, c) => p + c) / this.shards.size;
        }
    }
    /**
     * Get a guild's shard.
     * @param guildId The guild's ID.
     * @param ensure If true, an error is thrown if a {@link GatewayShard} is not found.
     * @returns The guild's shard, or a shard ID if the shard is not in this manager.
     * @see [Discord API Reference]
     */
    guildShard(guildId, ensure) {
        if (!this.managingShards)
            throw new Error(`No stored shard calculation (managingShards)`);
        const shardId = this._guildShard(guildId, this.managingShards.totalBotShards);
        const shard = this.shards.get(shardId);
        if (ensure && !(shard instanceof GatewayShard_1.GatewayShard))
            throw new Error(`No shard with the specified guild ID found on this gateway manager`);
        return (shard ?? shardId);
    }
    /**
     * Get members from a guild.
     * @param guildId The ID of the guild to get members from.
     * @param options Guild member request options. By default, all members in the guild will be fetched.
     * @returns Received members, presences, and missing members.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#request-guild-members)
     */
    getGuildMembers(guildId, options = {}) {
        if (options.query && options.user_ids)
            throw new TypeError(`Cannot have both query and user_ids defined in a request guild members payload`);
        if (options.nonce && Buffer.byteLength(options.nonce, `utf-8`) > Gateway.REQUEST_GUILD_MEMBERS_MAX_NONCE_LENGTH)
            throw new Error(`nonce length is greater than the allowed ${Gateway.REQUEST_GUILD_MEMBERS_MAX_NONCE_LENGTH} bytes`);
        const shard = this.guildShard(guildId, true);
        const nonce = options.nonce ?? (0, node_crypto_1.randomUUID)().replaceAll(`-`, ``);
        const members = new ExtendedMap_1.ExtendedMap();
        const presences = new ExtendedMap_1.ExtendedMap();
        const notFound = [];
        return new Promise((resolve, reject) => {
            const listener = (data) => {
                if (data.d.nonce !== nonce || data.d.guild_id !== guildId)
                    return;
                data.d.members
                    .filter((member) => member.user)
                    .forEach((member) => members.set(member.user.id, member));
                data.d.presences?.forEach((presence) => presences.set(presence.user.id, {
                    ...presence,
                    guild_id: data.d.guild_id,
                }));
                notFound.push(...(data.d.not_found ?? []));
                if (data.d.chunk_index === (data.d.chunk_count ?? 1) - 1) {
                    this.removeListener(`GUILD_MEMBERS_CHUNK`, listener);
                    resolve({
                        members,
                        presences: presences.size > 0 ? presences : undefined,
                        notFound: notFound.length > 0 ? notFound : undefined,
                    });
                }
            };
            this.on(`GUILD_MEMBERS_CHUNK`, listener);
            shard
                .send({
                op: DiscordTypes.GatewayOpcodes.RequestGuildMembers,
                d: {
                    guild_id: guildId,
                    query: (!options.query && !options.user_ids ? `` : options.query),
                    limit: options.limit ?? 0,
                    presences: (this.options.intents & IntentUtils_1.IntentUtils.INTENTS.GUILD_PRESENCES) !== 0,
                    user_ids: options.user_ids,
                    nonce,
                },
            })
                .catch(reject);
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
            op: DiscordTypes.GatewayOpcodes.VoiceStateUpdate,
            d: {
                guild_id: guildId,
                channel_id: channelId,
                self_mute: mute,
                self_deaf: deafen,
            },
        });
    }
    /**
     * Update the bot's presence.
     * @param presence Presence data.
     * @param shard A shard or shards to set the presence on. A number will set the presence on a single shard with a matching ID, a number array will set the presence on all shards matching am ID in the array, and `all` will set the presence on all shards.
     */
    async updatePresence(presence, shard = `all`) {
        const shards = typeof shard === `number`
            ? [this.shards.get(shard)]
            : (shard instanceof Array
                ? this.shards.filter((s) => shard.some((sh) => sh === s.id))
                : this.shards).map((s) => s);
        await Promise.all(shards.map((s) => s?.send({
            op: DiscordTypes.GatewayOpcodes.PresenceUpdate,
            d: presence,
        })));
    }
    /**
     * Binds a shard's events.
     * @param shard The shard to bind.
     */
    _bindShardEvents(shard) {
        shard.on(`SENT_PAYLOAD`, (payload) => this.emit(`SENT_PAYLOAD`, payload));
        shard.on(`RECEIVED_PAYLOAD`, (message) => this.emit(`*`, message));
        shard.on(`IDLE`, () => this.emit(`SHARD_IDLE`, shard));
        shard.on(`DISCONNECTED`, () => this.emit(`SHARD_DISCONNECTED`, shard));
        shard.on(`CONNECTING`, () => this.emit(`SHARD_CONNECTING`, shard));
        shard.on(`READY`, () => this.emit(`SHARD_READY`, shard));
        shard.on(`GUILDS_READY`, () => this.emit(`SHARD_GUILDS_READY`, shard));
    }
    /**
     * Calculate the shards the gateway manager will be spawning.
     * @param gatewayBot [`GET /gateway/bot`](https://discord.com/developers/docs/topics/gateway#get-gateway-bot).
     */
    _calculateShards(gatewayBot) {
        const totalBotShards = this.options.sharding.totalBotShards === `auto`
            ? gatewayBot.shards
            : (this.options.sharding.totalBotShards ?? gatewayBot.shards);
        const calculatedShards = {
            totalBotShards,
            shards: this.options.sharding.shards ?? totalBotShards,
            offset: this.options.sharding.offset ?? 0,
        };
        if (calculatedShards.totalBotShards < calculatedShards.shards ||
            calculatedShards.totalBotShards <= calculatedShards.offset ||
            calculatedShards.totalBotShards < calculatedShards.shards + calculatedShards.offset) {
            throw new Error(`Invalid shard configuration, got ${calculatedShards.totalBotShards} total shards, with ${calculatedShards.shards} to be spawned with an offset of ${calculatedShards.offset}`);
        }
        if (calculatedShards.shards > gatewayBot.session_start_limit.remaining) {
            throw new Error(`Session start limit reached; tried to spawn ${calculatedShards.shards} shards when only ${gatewayBot.session_start_limit.remaining} more shards are allowed. Limit will reset in ${gatewayBot.session_start_limit.reset_after / 1000} seconds`);
        }
        return calculatedShards;
    }
    /**
     * Gets [`GET /gateway/bot`](https://discord.com/developers/docs/topics/gateway#get-gateway-bot) from Discord or from the custom URL.
     */
    async _getGatewayBot() {
        const customGetGatewayBotURL = this.options.customGetGatewayBotURL
            ? new node_url_1.URL(this.options.customGetGatewayBotURL)
            : undefined;
        const getGatewayBot = customGetGatewayBotURL
            ? await this._rest.request(`GET`, customGetGatewayBotURL.pathname, {
                customBaseURL: customGetGatewayBotURL.origin,
                query: Object.fromEntries(customGetGatewayBotURL.searchParams.entries()),
            })
            : await this._rest.getGatewayBot();
        if (!getGatewayBot?.session_start_limit ||
            typeof getGatewayBot?.shards !== `number` ||
            (!this.options.customGatewaySocketURL && typeof getGatewayBot?.url !== `string`))
            throw new Error(`Invalid GET /gateway/bot response`);
        return getGatewayBot;
    }
    /**
     * Get a guild's shard ID.
     * @param guildId The guild's ID.
     * @param numShards The `numShards` value sent in the identify payload.
     * @returns A shard ID.
     */
    _guildShard(guildId, numShards) {
        return Number((BigInt(guildId) >> 22n) % BigInt(numShards));
    }
    /**
     * Spawns shards.
     * @param buckets Shard buckets.
     * @returns The results from {@link GatewayShard shard} spawns; `[success, failed]`.
     */
    async _spawnShards(buckets) {
        const waitingForGuildReady = Promise.all(buckets
            .reduce((p, c) => p.concat(c.filter((shard) => shard !== null).map((shard) => shard)), [])
            .map((shard) => typed_emitter_1.TypedEmitter.once(shard, `GUILDS_READY`)));
        const results = [];
        const mostShards = Math.max(...buckets.map((bucket) => bucket.size));
        for (let i = 0; i < mostShards; i++) {
            this._log(`Starting spawn process for shard rate limit key ${i}`, {
                level: `DEBUG`,
                system: this.system,
            });
            const bucketResult = await Promise.allSettled(buckets
                .filter((bucket) => bucket.get(i) instanceof GatewayShard_1.GatewayShard)
                .map((bucket) => bucket.get(i).spawn()));
            results.push(...bucketResult);
            if (i !== buckets.size - 1 && !this.options.disableBucketRatelimits)
                await (0, promises_1.setTimeout)(Gateway.SHARD_SPAWN_COOLDOWN);
        }
        await waitingForGuildReady;
        const success = results.filter((result) => result.status === `fulfilled`).length;
        const failed = results.filter((result) => result.status === `rejected`).length;
        this._log(`${success}/${success + failed} shards spawned`, {
            level: `INFO`,
            system: this.system,
        });
        if (failed > 0)
            this._log(`${failed} shards failed to spawn`, {
                level: `WARN`,
                system: this.system,
            });
        return [success, failed];
    }
}
exports.Gateway = Gateway;
