"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const Cache_1 = require("../cache/Cache");
const DistypeConstants_1 = require("../constants/DistypeConstants");
const Gateway_1 = require("../gateway/Gateway");
const Rest_1 = require("../rest/Rest");
/**
 * The Discord client.
 */
class Client {
    /**
     * Create a client.
     * @param token The bot's token.
     * @param options {@link ClientOptions Client options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally throughout the client.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token, options = {}, logCallback = () => { }, logThisArg) {
        /**
         * The version of [Distype](https://github.com/distype/distype) being used.
         */
        this.DISTYPE_VERSION = DistypeConstants_1.DistypeConstants.VERSION;
        /**
         * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
         */
        this.system = `Client`;
        if (typeof token !== `string`)
            throw new TypeError(`Parameter "token" (string) not provided: got ${token} (${typeof token})`);
        if (typeof options !== `object`)
            throw new TypeError(`Parameter "options" (object) type mismatch: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`)
            throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        this.cache = new Cache_1.Cache(options.cache, logCallback, logThisArg);
        this.rest = new Rest_1.Rest(token, options.rest, logCallback, logThisArg);
        this.gateway = new Gateway_1.Gateway(token, this.rest, this.cache, options.gateway, logCallback, logThisArg);
        this.options = {
            cache: this.cache.options,
            gateway: this.gateway.options,
            rest: this.rest.options
        };
        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized client`, {
            level: `DEBUG`, system: this.system
        });
    }
    /**
     * Tries to ensure channel data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The channel's ID.
     * @param keys Properties to ensure.
     */
    async getChannelData(id, ...keys) {
        let data = this.cache.channels?.get(id) ?? { id };
        if (keys.some((key) => !Object.keys(data).includes(key))) {
            data = {
                ...data, ...await this.rest.getChannel(id)
            };
        }
        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {});
    }
    /**
     * Tries to ensure guild data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The guild's ID.
     * @param keys Properties to ensure.
     */
    async getGuildData(id, ...keys) {
        let data = this.cache.guilds?.get(id) ?? { id };
        if (keys.some((key) => !Object.keys(data).includes(key))) {
            const guild = await this.rest.getGuild(id);
            data = {
                ...data,
                ...guild,
                channels: guild.channels?.map((channel) => channel.id),
                members: guild.members?.filter((member) => !!member.user).map((member) => member.user.id),
                roles: guild.roles.map((role) => role.id)
            };
        }
        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {});
    }
    /**
     * Tries to ensure member data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param guildId The member's guild ID.
     * @param userId The member's user ID.
     * @param keys Properties to ensure.
     */
    async getMemberData(guildId, userId, ...keys) {
        let data = this.cache.members?.get(guildId)?.get(userId) ?? {
            guild_id: guildId, user_id: userId
        };
        if (keys.some((key) => !Object.keys(data).includes(key))) {
            data = {
                ...data, ...(await this.rest.getGuildMember(guildId, userId))
            };
        }
        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {});
    }
    /**
     * Tries to ensure presence data.
     * @param guildId The presence's guild ID.
     * @param userId The presence's user ID.
     * @param keys Properties to ensure.
     */
    getPresenceData(guildId, userId, ...keys) {
        const data = this.cache.presences?.get(guildId)?.get(userId) ?? {
            guild_id: guildId, user_id: userId
        };
        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {});
    }
    /**
     * Tries to ensure role data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The role's ID.
     * @param guildId The role's guild's ID.
     * @param keys Properties to ensure.
     */
    async getRoleData(id, guildId, ...keys) {
        let data = this.cache.roles?.get(id) ?? { id };
        data.guild_id = guildId;
        if (keys.some((key) => !Object.keys(data).includes(key))) {
            const role = (await this.rest.getGuildRoles(guildId)).find((role) => role.id === id);
            if (role)
                data = {
                    ...data, ...role
                };
        }
        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {});
    }
    /**
     * Tries to ensure user data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The user's ID.
     * @param keys Properties to ensure.
     */
    async getUserData(id, ...keys) {
        let data = this.cache.users?.get(id) ?? { id };
        if (keys.some((key) => !Object.keys(data).includes(key))) {
            data = {
                ...data, ...(await this.rest.getUser(id))
            };
        }
        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {});
    }
    /**
     * Tries to ensure presence data.
     * @param guildId The presence's guild ID.
     * @param userId The presence's user ID.
     * @param keys Properties to ensure.
     */
    getVoiceStateData(guildId, userId, ...keys) {
        const data = this.cache.voiceStates?.get(guildId)?.get(userId) ?? {
            guild_id: guildId, user_id: userId
        };
        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {});
    }
}
exports.Client = Client;
