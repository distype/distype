"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const node_utils_1 = require("@br88c/node-utils");
const v10_1 = require("discord-api-types/v10");
/**
 * The cache manager.
 * Contains cached data, and {@link cacheEventHandler handles dispatched gateway events} to keep the cache up to date.
 * Keep in mind that there are many caveats to the gateway, and that real-world cache data may not directly reflect your {@link CacheOptions cache control options}.
 * It is recommended that you research [intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) and the [caveats](https://discord.com/developers/docs/topics/gateway#caveats) to the gateway, to make sure your bot receives sufficient data for your use case.
 * [Discord API Reference](https://discord.com/developers/docs/topics/gateway)
 */
class Cache {
    /**
     * {@link CachedChannel Cached channels}.
     * A channel's key in the map is its ID.
     */
    channels;
    /**
     * {@link CachedGuild Cached guilds}.
     * A guild's key in the map is its ID.
     */
    guilds;
    /**
     * {@link CachedMember Cached members}.
     * Each key of the parent cache is a guild ID, with its children being a map of members in that guild.
     * A member's key in its map is its user ID.
     */
    members;
    /**
     * {@link CachedPresence Cached presences}.
     * Each key of the parent cache is a guild ID, with its children being a map of presences in that guild.
     * A presence's key in its map is its user's ID.
     */
    presences;
    /**
     * {@link CachedRole Cached roles}.
     * A role's key in the map is its ID.
     */
    roles;
    /**
     * {@link CachedUser Cached users}.
     * A user's key in the map is its ID.
     */
    users;
    /**
     * {@link CachedVoiceState Cached voice states}.
     * Each key of the parent cache is a guild ID, with its children being a map of voice states in that guild.
     * A voice state's key in its map is its user's ID.
     */
    voiceStates;
    /**
     * {@link CacheOptions Options} for the cache manager.
     * Note that any options not specified are set to a default value.
     */
    options;
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    system = `Cache`;
    /**
     * The {@link LogCallback log callback} used by the cache manager.
     */
    _log;
    /**
     * The keys of enabled caches.
     */
    _enabledKeys;
    /**
     * Create a cache manager.
     * @param options {@link CacheOptions Cache options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the cache manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(options = {}, logCallback = () => { }, logThisArg) {
        if (typeof options !== `object`)
            throw new TypeError(`Parameter "options" (object) type mismatch: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`)
            throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);
        this.options = {
            channels: options.channels ?? null,
            guilds: options.guilds ?? null,
            members: options.members ?? null,
            presences: options.presences ?? null,
            roles: options.roles ?? null,
            users: options.users ?? null,
            voiceStates: options.voiceStates ?? null
        };
        this._enabledKeys = Object.keys(this.options).filter((control) => Array.isArray(this.options[control]));
        this._enabledKeys.forEach((key) => {
            this[key] = new node_utils_1.ExtendedMap();
        });
        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized cache manager`, {
            level: `DEBUG`, system: this.system
        });
    }
    /**
     * Handles data from a gateway event.
     * @param data The gateway data to handle.
     * @internal
     */
    handleEvent(data) {
        if (this._enabledKeys.length === 0)
            return;
        switch (data.t) {
            case v10_1.GatewayDispatchEvents.Ready: {
                if (this._enabledKeys.includes(`guilds`))
                    data.d.guilds.forEach((guild) => this._updateGuild(false, guild));
                if (this._enabledKeys.includes(`users`))
                    this._updateUser(false, data.d.user);
                break;
            }
            // case GatewayDispatchEvents.ApplicationCommandPermissionsUpdate: {
            //     ...
            //     break;
            // }
            case v10_1.GatewayDispatchEvents.ChannelCreate: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(false, data.d);
                if (this._enabledKeys.includes(`guilds`) && data.d.type !== v10_1.ChannelType.GroupDM && data.d.type !== v10_1.ChannelType.DM && data.d.guild_id)
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        channels: [data.d.id, ...(this.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id) ?? [])]
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.ChannelUpdate: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(false, data.d);
                break;
            }
            case v10_1.GatewayDispatchEvents.ChannelDelete: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(true, data.d);
                if (this._enabledKeys.includes(`guilds`) && data.d.type !== v10_1.ChannelType.GroupDM && data.d.type !== v10_1.ChannelType.DM && data.d.guild_id)
                    this.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id);
                break;
            }
            case v10_1.GatewayDispatchEvents.ChannelPinsUpdate: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(false, {
                        ...data.d,
                        id: data.d.channel_id
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.ThreadCreate: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(false, data.d);
                if (this._enabledKeys.includes(`guilds`) && data.d.type !== v10_1.ChannelType.GroupDM && data.d.type !== v10_1.ChannelType.DM && data.d.guild_id)
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        channels: [data.d.id, ...(this.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id) ?? [])]
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.ThreadUpdate: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(false, data.d);
                break;
            }
            case v10_1.GatewayDispatchEvents.ThreadDelete: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(true, data.d);
                if (this._enabledKeys.includes(`guilds`) && data.d.type !== v10_1.ChannelType.GroupDM && data.d.type !== v10_1.ChannelType.DM && data.d.guild_id)
                    this.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id);
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildCreate: {
                if (this._enabledKeys.includes(`channels`))
                    data.d.channels.forEach((channel) => this._updateChannel(false, channel));
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        ...data.d,
                        channels: data.d.channels?.map((channel) => channel.id),
                        members: data.d.members?.filter((member) => member.user).map((member) => member.user.id),
                        roles: data.d.roles.map((role) => role.id)
                    });
                if (this._enabledKeys.includes(`members`))
                    data.d.members.filter((member) => member.user).forEach((member) => this._updateMember(false, {
                        ...member,
                        user_id: member.user.id,
                        guild_id: data.d.id
                    }));
                if (this._enabledKeys.includes(`presences`))
                    data.d.presences.forEach((presence) => this._updatePresence(false, {
                        ...presence,
                        user_id: presence.user.id
                    }));
                if (this._enabledKeys.includes(`roles`))
                    data.d.roles.forEach((role) => this._updateRole(false, role));
                if (this._enabledKeys.includes(`users`))
                    data.d.members.filter((member) => member.user).forEach((member) => this._updateUser(false, member.user));
                if (this._enabledKeys.includes(`voiceStates`))
                    data.d.voice_states.forEach((voiceState) => this._updateVoiceState(false, {
                        ...voiceState,
                        guild_id: data.d.id
                    }));
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        ...data.d,
                        roles: data.d.roles.map((role) => role.id)
                    });
                if (this._enabledKeys.includes(`roles`))
                    data.d.roles.forEach((role) => this._updateRole(false, role));
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildDelete: {
                if (data.d.unavailable) {
                    if (this._enabledKeys.includes(`guilds`))
                        this._updateGuild(false, data.d);
                }
                else {
                    if (this._enabledKeys.includes(`channels`))
                        this.channels?.sweep((channel) => channel.guild_id === data.d.id);
                    if (this._enabledKeys.includes(`guilds`))
                        this._updateGuild(true, data.d);
                    if (this._enabledKeys.includes(`members`))
                        this.members?.delete(data.d.id);
                    if (this._enabledKeys.includes(`presences`))
                        this.presences?.delete(data.d.id);
                    if (this._enabledKeys.includes(`roles`))
                        this.roles?.sweep((role) => role.guild_id === data.d.id);
                    if (this._enabledKeys.includes(`voiceStates`))
                        this.voiceStates?.delete(data.d.id);
                }
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildEmojisUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        emojis: data.d.emojis
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildStickersUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        stickers: data.d.stickers
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildMemberAdd: {
                if (this._enabledKeys.includes(`guilds`) && data.d.user)
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        members: [data.d.user.id, ...(this.guilds?.get(data.d.guild_id)?.members?.filter((member) => member !== data.d.user.id) ?? [])]
                    });
                if (this._enabledKeys.includes(`members`) && data.d.user)
                    this._updateMember(false, {
                        ...data.d,
                        user_id: data.d.user.id
                    });
                if (this._enabledKeys.includes(`users`) && data.d.user)
                    this._updateUser(false, data.d.user);
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildMemberRemove: {
                if (this._enabledKeys.includes(`guilds`))
                    this.guilds?.get(data.d.guild_id)?.members?.filter((member) => member !== data.d.user.id);
                if (this._enabledKeys.includes(`members`))
                    this._updateMember(true, {
                        ...data.d,
                        user_id: data.d.user.id
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildMemberUpdate: {
                if (this._enabledKeys.includes(`members`))
                    this._updateMember(false, {
                        ...data.d,
                        user_id: data.d.user.id,
                        joined_at: data.d.joined_at ?? undefined
                    });
                if (this._enabledKeys.includes(`users`) && data.d.user)
                    this._updateUser(false, data.d.user);
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildMembersChunk: {
                if (this._enabledKeys.includes(`members`))
                    data.d.members.filter((member) => member.user).forEach((member) => this._updateMember(false, {
                        ...member,
                        guild_id: data.d.guild_id,
                        user_id: member.user.id
                    }));
                if (this._enabledKeys.includes(`presences`))
                    data.d.presences?.forEach((presence) => this._updatePresence(false, {
                        ...presence,
                        user_id: presence.user.id
                    }));
                if (this._enabledKeys.includes(`users`))
                    data.d.members.filter((member) => member.user).forEach((member) => this._updateUser(false, member.user));
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildRoleCreate: {
                if (this._enabledKeys.includes(`roles`))
                    this._updateRole(false, {
                        ...data.d.role,
                        guild_id: data.d.guild_id
                    });
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        roles: [data.d.role.id, ...(this.guilds?.get(data.d.guild_id)?.roles?.filter((role) => role !== data.d.role.id) ?? [])]
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildRoleUpdate: {
                if (this._enabledKeys.includes(`roles`))
                    this._updateRole(false, {
                        ...data.d.role,
                        guild_id: data.d.guild_id
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildRoleDelete: {
                if (this._enabledKeys.includes(`roles`))
                    this._updateRole(true, {
                        id: data.d.role_id,
                        guild_id: data.d.guild_id
                    });
                if (this._enabledKeys.includes(`guilds`))
                    this.guilds?.get(data.d.guild_id)?.roles?.filter((role) => role !== data.d.role_id);
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildScheduledEventCreate:
            case v10_1.GatewayDispatchEvents.GuildScheduledEventUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        guild_scheduled_events: [data.d, ...(this.guilds?.get(data.d.guild_id)?.guild_scheduled_events?.filter((event) => event.id !== data.d.id) ?? [])]
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.GuildScheduledEventDelete: {
                if (this._enabledKeys.includes(`guilds`))
                    this.guilds?.get(data.d.guild_id)?.guild_scheduled_events?.filter((event) => event.id !== data.d.id);
                break;
            }
            case v10_1.GatewayDispatchEvents.MessageCreate: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(false, {
                        id: data.d.channel_id,
                        last_message_id: data.d.id
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.PresenceUpdate: {
                if (this._enabledKeys.includes(`presences`))
                    this._updatePresence(false, {
                        ...data.d,
                        user_id: data.d.user.id
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.StageInstanceCreate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        stage_instances: [data.d, ...(this.guilds?.get(data.d.guild_id)?.stage_instances?.filter((instance) => instance.id !== data.d.id) ?? [])]
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.StageInstanceDelete: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        stage_instances: this.guilds?.get(data.d.guild_id)?.stage_instances?.filter((instance) => instance.id !== data.d.id) ?? []
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.StageInstanceUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        stage_instances: [data.d, ...(this.guilds?.get(data.d.guild_id)?.stage_instances?.filter((instance) => instance.id !== data.d.id) ?? [])]
                    });
                break;
            }
            case v10_1.GatewayDispatchEvents.UserUpdate: {
                if (this._enabledKeys.includes(`users`))
                    this._updateUser(false, data.d);
                break;
            }
            case v10_1.GatewayDispatchEvents.VoiceStateUpdate: {
                if (this._enabledKeys.includes(`voiceStates`) && data.d.guild_id)
                    this._updateVoiceState(data.d.channel_id === null, data.d);
                break;
            }
        }
    }
    /**
     * Update a channel.
     * @param remove If the channel should be removed from the cache.
     * @param data Data to update with.
     */
    _updateChannel(remove, data) {
        if (remove)
            return void this.channels.delete(data.id);
        if (!this.channels.has(data.id))
            this.channels.set(data.id, { id: data.id });
        for (const key in data) {
            if (data[key] !== undefined && this.options.channels?.includes(key)) {
                this.channels.get(data.id)[key] = data[key];
            }
        }
    }
    /**
     * Update a guild.
     * @param remove If the guild should be removed from the cache.
     * @param data Data to update with.
     */
    _updateGuild(remove, data) {
        if (remove)
            return void this.guilds.delete(data.id);
        if (!this.guilds.has(data.id))
            this.guilds.set(data.id, { id: data.id });
        for (const key in data) {
            if (data[key] !== undefined && this.options.guilds?.includes(key)) {
                this.guilds.get(data.id)[key] = data[key];
            }
        }
    }
    /**
     * Update a member.
     * @param remove If the member should be removed from the cache.
     * @param data Data to update with.
     */
    _updateMember(remove, data) {
        if (remove) {
            this.members.get(data.guild_id)?.delete(data.user_id);
            if (this.members.get(data.guild_id)?.size === 0)
                this.members.delete(data.guild_id);
            return;
        }
        if (!this.members.has(data.guild_id))
            this.members.set(data.guild_id, new node_utils_1.ExtendedMap());
        if (!this.members.get(data.guild_id)?.has(data.user_id))
            this.members.get(data.guild_id).set(data.user_id, {
                user_id: data.user_id, guild_id: data.guild_id
            });
        for (const key in data) {
            if (data[key] !== undefined && this.options.members?.includes(key)) {
                this.members.get(data.guild_id).get(data.user_id)[key] = data[key];
            }
        }
    }
    /**
     * Update a presence.
     * @param remove If the presence should be removed from the cache.
     * @param data Data to update with.
     */
    _updatePresence(remove, data) {
        if (remove) {
            this.presences.get(data.guild_id)?.delete(data.user_id);
            if (this.presences.get(data.guild_id)?.size === 0)
                this.presences.delete(data.guild_id);
            return;
        }
        if (!this.presences.has(data.guild_id))
            this.presences.set(data.guild_id, new node_utils_1.ExtendedMap());
        if (!this.presences.get(data.guild_id)?.has(data.user_id))
            this.presences.get(data.guild_id).set(data.user_id, {
                user_id: data.user_id, guild_id: data.guild_id
            });
        for (const key in data) {
            if (data[key] !== undefined && this.options.presences?.includes(key)) {
                this.presences.get(data.guild_id).get(data.user_id)[key] = data[key];
            }
        }
    }
    /**
     * Update a role.
     * @param remove If the role should be removed from the cache.
     * @param data Data to update with.
     */
    _updateRole(remove, data) {
        if (remove)
            return void this.roles.delete(data.id);
        if (!this.roles.has(data.id))
            this.roles.set(data.id, { id: data.id });
        for (const key in data) {
            if (data[key] !== undefined && this.options.roles?.includes(key)) {
                this.roles.get(data.id)[key] = data[key];
            }
        }
    }
    /**
     * Update a user.
     * @param remove If the user should be removed from the cache.
     * @param data Data to update with.
     */
    _updateUser(remove, data) {
        if (remove)
            return void this.users.delete(data.id);
        if (!this.users.has(data.id))
            this.users.set(data.id, { id: data.id });
        for (const key in data) {
            if (data[key] !== undefined && this.options.users?.includes(key)) {
                this.users.get(data.id)[key] = data[key];
            }
        }
    }
    /**
     * Update a voice state.
     * @param remove If the voice state should be removed from the cache.
     * @param data Data to update with.
     */
    _updateVoiceState(remove, data) {
        if (remove) {
            this.voiceStates.get(data.guild_id)?.delete(data.user_id);
            if (this.voiceStates.get(data.guild_id)?.size === 0)
                this.voiceStates.delete(data.guild_id);
            return;
        }
        if (!this.voiceStates.has(data.guild_id))
            this.voiceStates.set(data.guild_id, new node_utils_1.ExtendedMap());
        if (!this.voiceStates.get(data.guild_id)?.has(data.user_id))
            this.voiceStates.get(data.guild_id).set(data.user_id, {
                user_id: data.user_id, guild_id: data.guild_id
            });
        for (const key in data) {
            if (data[key] !== undefined && this.options.voiceStates?.includes(key)) {
                this.voiceStates.get(data.guild_id).get(data.user_id)[key] = data[key];
            }
        }
    }
}
exports.Cache = Cache;
