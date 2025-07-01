import {
    CachedChannel,
    CachedGuild,
    CachedMember,
    CachedPresence,
    CachedRole,
    CachedUser,
    CachedVoiceState,
} from './CacheObjects';
import { CacheOptions } from './CacheOptions';

import { LogCallback } from '../types/Log';
import { Snowflake } from '../utils/SnowflakeUtils';
import { ExtendedMap } from '../utils/ExtendedMap';

import {
    ChannelType,
    GatewayDispatchEvents,
    GatewayDispatchPayload,
    GatewayGuildCreateDispatchData,
} from 'discord-api-types/v10';

/**
 * The cache manager.
 * Contains cached data, and {@link cacheEventHandler handles dispatched gateway events} to keep the cache up to date.
 * Keep in mind that there are many caveats to the gateway, and that real-world cache data may not directly reflect your {@link CacheOptions cache control options}.
 * It is recommended that you research [intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) and the [caveats](https://discord.com/developers/docs/topics/gateway#caveats) to the gateway, to make sure your bot receives sufficient data for your use case.
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway)
 */
export class Cache {
    /**
     * {@link CachedChannel Cached channels}.
     * A channel's key in the map is its ID.
     */
    public channels?: ExtendedMap<Snowflake, CachedChannel>;
    /**
     * {@link CachedGuild Cached guilds}.
     * A guild's key in the map is its ID.
     */
    public guilds?: ExtendedMap<Snowflake, CachedGuild>;
    /**
     * {@link CachedMember Cached members}.
     * Each key of the parent cache is a guild ID, with its children being a map of members in that guild.
     * A member's key in its map is its user ID.
     */
    public members?: ExtendedMap<Snowflake, ExtendedMap<Snowflake, CachedMember>>;
    /**
     * {@link CachedPresence Cached presences}.
     * Each key of the parent cache is a guild ID, with its children being a map of presences in that guild.
     * A presence's key in its map is its user's ID.
     */
    public presences?: ExtendedMap<Snowflake, ExtendedMap<Snowflake, CachedPresence>>;
    /**
     * {@link CachedRole Cached roles}.
     * A role's key in the map is its ID.
     */
    public roles?: ExtendedMap<Snowflake, CachedRole>;
    /**
     * {@link CachedUser Cached users}.
     * A user's key in the map is its ID.
     */
    public users?: ExtendedMap<Snowflake, CachedUser>;
    /**
     * {@link CachedVoiceState Cached voice states}.
     * Each key of the parent cache is a guild ID, with its children being a map of voice states in that guild.
     * A voice state's key in its map is its user's ID.
     */
    public voiceStates?: ExtendedMap<Snowflake, ExtendedMap<Snowflake, CachedVoiceState>>;

    /**
     * {@link CacheOptions Options} for the cache manager.
     * Note that any options not specified are set to a default value.
     */
    public readonly options: Required<CacheOptions>;
    /**
     * The system string used for logging.
     */
    public readonly system = `Cache`;

    /**
     * The {@link LogCallback log callback} used by the cache manager.
     */
    private _log: LogCallback;

    /**
     * The keys of enabled caches.
     */
    private readonly _enabledKeys: Array<keyof Cache[`options`]>;

    /**
     * Create a cache manager.
     * @param options {@link CacheOptions Cache options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the cache manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(options: CacheOptions = {}, logCallback: LogCallback = (): void => {}, logThisArg?: any) {
        if (typeof options !== `object`)
            throw new TypeError(`Parameter "options" (object) type mismatch: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`)
            throw new TypeError(
                `Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`,
            );

        this.options = {
            channels: options.channels ?? null,
            guilds: options.guilds ?? null,
            members: options.members ?? null,
            presences: options.presences ?? null,
            roles: options.roles ?? null,
            users: options.users ?? null,
            voiceStates: options.voiceStates ?? null,
        };

        this._enabledKeys = (Object.keys(this.options) as Array<keyof Cache[`options`]>).filter((control) =>
            Array.isArray(this.options[control]),
        );
        this._enabledKeys.forEach((key) => {
            this[key] = new ExtendedMap<any, any>();
        });

        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized cache manager`, {
            level: `DEBUG`,
            system: this.system,
        });
    }

    /**
     * Handles data from a gateway event.
     * @param data The gateway data to handle.
     * @internal
     */
    public handleEvent(data: GatewayDispatchPayload): void {
        if (this._enabledKeys.length === 0) return;

        switch (data.t) {
            case GatewayDispatchEvents.Ready: {
                if (this._enabledKeys.includes(`guilds`))
                    data.d.guilds.forEach((guild) => this._updateGuild(false, guild));
                if (this._enabledKeys.includes(`users`)) this._updateUser(false, data.d.user);
                break;
            }
            case GatewayDispatchEvents.ChannelCreate: {
                if (this._enabledKeys.includes(`channels`)) this._updateChannel(false, data.d as any);
                if (this._enabledKeys.includes(`guilds`) && data.d.guild_id)
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        channels: [
                            data.d.id,
                            ...(this.guilds
                                ?.get(data.d.guild_id)
                                ?.channels?.filter((channel) => channel !== data.d.id) ?? []),
                        ],
                    });
                break;
            }
            case GatewayDispatchEvents.ChannelUpdate: {
                if (this._enabledKeys.includes(`channels`)) this._updateChannel(false, data.d as any);
                break;
            }
            case GatewayDispatchEvents.ChannelDelete: {
                if (this._enabledKeys.includes(`channels`)) this._updateChannel(true, data.d as any);
                if (this._enabledKeys.includes(`guilds`) && data.d.guild_id)
                    this.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id);
                break;
            }
            case GatewayDispatchEvents.ChannelPinsUpdate: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(false, {
                        ...data.d,
                        id: data.d.channel_id,
                    });
                break;
            }
            case GatewayDispatchEvents.ThreadCreate: {
                if (this._enabledKeys.includes(`channels`)) this._updateChannel(false, data.d as any);
                if (this._enabledKeys.includes(`guilds`) && data.d.guild_id)
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        channels: [
                            data.d.id,
                            ...(this.guilds
                                ?.get(data.d.guild_id)
                                ?.channels?.filter((channel) => channel !== data.d.id) ?? []),
                        ],
                    });
                break;
            }
            case GatewayDispatchEvents.ThreadUpdate: {
                if (this._enabledKeys.includes(`channels`)) this._updateChannel(false, data.d as any);
                break;
            }
            case GatewayDispatchEvents.ThreadDelete: {
                if (this._enabledKeys.includes(`channels`)) this._updateChannel(true, data.d as any);
                if (
                    this._enabledKeys.includes(`guilds`) &&
                    data.d.type !== ChannelType.GroupDM &&
                    data.d.type !== ChannelType.DM &&
                    data.d.guild_id
                )
                    this.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id);
                break;
            }
            case GatewayDispatchEvents.GuildCreate: {
                if (this._enabledKeys.includes(`channels`))
                    (data.d as GatewayGuildCreateDispatchData).channels.forEach((channel) =>
                        this._updateChannel(false, channel as any),
                    );
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        ...data.d,
                        channels: (data.d as GatewayGuildCreateDispatchData).channels?.map((channel) => channel.id),
                        members: (data.d as GatewayGuildCreateDispatchData).members
                            ?.filter((member) => member.user)
                            .map((member) => member.user!.id),
                        roles: data.d.roles.map((role) => role.id),
                    });
                if (this._enabledKeys.includes(`members`))
                    (data.d as GatewayGuildCreateDispatchData).members
                        .filter((member) => member.user)
                        .forEach((member) =>
                            this._updateMember(false, {
                                ...member,
                                user_id: member.user!.id,
                                guild_id: data.d.id,
                            }),
                        );
                if (this._enabledKeys.includes(`presences`))
                    (data.d as GatewayGuildCreateDispatchData).presences.forEach((presence) =>
                        this._updatePresence(false, {
                            ...presence,
                            user_id: presence.user.id,
                        }),
                    );
                if (this._enabledKeys.includes(`roles`)) data.d.roles.forEach((role) => this._updateRole(false, role));
                if (this._enabledKeys.includes(`users`))
                    (data.d as GatewayGuildCreateDispatchData).members
                        .filter((member) => member.user)
                        .forEach((member) => this._updateUser(false, member.user!));
                if (this._enabledKeys.includes(`voiceStates`))
                    (data.d as GatewayGuildCreateDispatchData).voice_states.forEach((voiceState) =>
                        this._updateVoiceState(false, {
                            ...voiceState,
                            guild_id: data.d.id,
                        }),
                    );
                break;
            }
            case GatewayDispatchEvents.GuildUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        ...data.d,
                        roles: data.d.roles.map((role) => role.id),
                    });
                if (this._enabledKeys.includes(`roles`)) data.d.roles.forEach((role) => this._updateRole(false, role));
                break;
            }
            case GatewayDispatchEvents.GuildDelete: {
                if (data.d.unavailable) {
                    if (this._enabledKeys.includes(`guilds`)) this._updateGuild(false, data.d);
                } else {
                    if (this._enabledKeys.includes(`channels`))
                        this.channels?.sweep((channel) => channel.guild_id === data.d.id);
                    if (this._enabledKeys.includes(`guilds`)) this._updateGuild(true, data.d);
                    if (this._enabledKeys.includes(`members`)) this.members?.delete(data.d.id);
                    if (this._enabledKeys.includes(`presences`)) this.presences?.delete(data.d.id);
                    if (this._enabledKeys.includes(`roles`)) this.roles?.sweep((role) => role.guild_id === data.d.id);
                    if (this._enabledKeys.includes(`voiceStates`)) this.voiceStates?.delete(data.d.id);
                }
                break;
            }
            case GatewayDispatchEvents.GuildEmojisUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        emojis: data.d.emojis,
                    });
                break;
            }
            case GatewayDispatchEvents.GuildStickersUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        stickers: data.d.stickers,
                    });
                break;
            }
            case GatewayDispatchEvents.GuildMemberAdd: {
                if (this._enabledKeys.includes(`guilds`) && data.d.user)
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        members: [
                            data.d.user.id,
                            ...(this.guilds
                                ?.get(data.d.guild_id)
                                ?.members?.filter((member) => member !== data.d.user!.id) ?? []),
                        ],
                    });
                if (this._enabledKeys.includes(`members`) && data.d.user)
                    this._updateMember(false, {
                        ...data.d,
                        user_id: data.d.user.id,
                    });
                if (this._enabledKeys.includes(`users`) && data.d.user) this._updateUser(false, data.d.user);
                break;
            }
            case GatewayDispatchEvents.GuildMemberRemove: {
                if (this._enabledKeys.includes(`guilds`))
                    this.guilds?.get(data.d.guild_id)?.members?.filter((member) => member !== data.d.user.id);
                if (this._enabledKeys.includes(`members`))
                    this._updateMember(true, {
                        ...data.d,
                        user_id: data.d.user.id,
                    });
                break;
            }
            case GatewayDispatchEvents.GuildMemberUpdate: {
                if (this._enabledKeys.includes(`members`))
                    this._updateMember(false, {
                        ...data.d,
                        user_id: data.d.user.id,
                        joined_at: data.d.joined_at ?? undefined,
                    });
                if (this._enabledKeys.includes(`users`) && data.d.user) this._updateUser(false, data.d.user);
                break;
            }
            case GatewayDispatchEvents.GuildMembersChunk: {
                if (this._enabledKeys.includes(`members`))
                    data.d.members
                        .filter((member) => member.user)
                        .forEach((member) =>
                            this._updateMember(false, {
                                ...member,
                                guild_id: data.d.guild_id,
                                user_id: member.user!.id,
                            }),
                        );
                if (this._enabledKeys.includes(`presences`))
                    data.d.presences?.forEach((presence) =>
                        this._updatePresence(false, {
                            ...presence,
                            user_id: presence.user.id,
                            guild_id: data.d.guild_id,
                        }),
                    );
                if (this._enabledKeys.includes(`users`))
                    data.d.members
                        .filter((member) => member.user)
                        .forEach((member) => this._updateUser(false, member.user!));
                break;
            }
            case GatewayDispatchEvents.GuildRoleCreate: {
                if (this._enabledKeys.includes(`roles`))
                    this._updateRole(false, {
                        ...data.d.role,
                        guild_id: data.d.guild_id,
                    });
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        roles: [
                            data.d.role.id,
                            ...(this.guilds?.get(data.d.guild_id)?.roles?.filter((role) => role !== data.d.role.id) ??
                                []),
                        ],
                    });
                break;
            }
            case GatewayDispatchEvents.GuildRoleUpdate: {
                if (this._enabledKeys.includes(`roles`))
                    this._updateRole(false, {
                        ...data.d.role,
                        guild_id: data.d.guild_id,
                    });
                break;
            }
            case GatewayDispatchEvents.GuildRoleDelete: {
                if (this._enabledKeys.includes(`roles`))
                    this._updateRole(true, {
                        id: data.d.role_id,
                        guild_id: data.d.guild_id,
                    });
                if (this._enabledKeys.includes(`guilds`))
                    this.guilds?.get(data.d.guild_id)?.roles?.filter((role) => role !== data.d.role_id);
                break;
            }
            case GatewayDispatchEvents.GuildScheduledEventCreate:
            case GatewayDispatchEvents.GuildScheduledEventUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        guild_scheduled_events: [
                            data.d,
                            ...(this.guilds
                                ?.get(data.d.guild_id)
                                ?.guild_scheduled_events?.filter((event) => event.id !== data.d.id) ?? []),
                        ],
                    });
                break;
            }
            case GatewayDispatchEvents.GuildScheduledEventDelete: {
                if (this._enabledKeys.includes(`guilds`))
                    this.guilds
                        ?.get(data.d.guild_id)
                        ?.guild_scheduled_events?.filter((event) => event.id !== data.d.id);
                break;
            }
            case GatewayDispatchEvents.MessageCreate: {
                if (this._enabledKeys.includes(`channels`))
                    this._updateChannel(false, {
                        id: data.d.channel_id,
                        last_message_id: data.d.id,
                    });
                break;
            }
            case GatewayDispatchEvents.PresenceUpdate: {
                if (this._enabledKeys.includes(`presences`))
                    this._updatePresence(false, {
                        ...data.d,
                        user_id: data.d.user.id,
                    });
                break;
            }
            case GatewayDispatchEvents.StageInstanceCreate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        stage_instances: [
                            data.d,
                            ...(this.guilds
                                ?.get(data.d.guild_id)
                                ?.stage_instances?.filter((instance) => instance.id !== data.d.id) ?? []),
                        ],
                    });
                break;
            }
            case GatewayDispatchEvents.StageInstanceDelete: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        stage_instances:
                            this.guilds
                                ?.get(data.d.guild_id)
                                ?.stage_instances?.filter((instance) => instance.id !== data.d.id) ?? [],
                    });
                break;
            }
            case GatewayDispatchEvents.StageInstanceUpdate: {
                if (this._enabledKeys.includes(`guilds`))
                    this._updateGuild(false, {
                        id: data.d.guild_id,
                        stage_instances: [
                            data.d,
                            ...(this.guilds
                                ?.get(data.d.guild_id)
                                ?.stage_instances?.filter((instance) => instance.id !== data.d.id) ?? []),
                        ],
                    });
                break;
            }
            case GatewayDispatchEvents.UserUpdate: {
                if (this._enabledKeys.includes(`users`)) this._updateUser(false, data.d);
                break;
            }
            case GatewayDispatchEvents.VoiceStateUpdate: {
                if (this._enabledKeys.includes(`voiceStates`) && data.d.guild_id)
                    this._updateVoiceState(data.d.channel_id === null, data.d as any);
                break;
            }
        }
    }

    /**
     * Update a channel.
     * @param remove If the channel should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateChannel(remove: boolean, data: CachedChannel): void {
        if (remove) return void this.channels!.delete(data.id);

        if (!this.channels!.has(data.id)) this.channels!.set(data.id, { id: data.id });

        for (const key in data) {
            if (data[key as keyof CachedChannel] !== undefined && this.options.channels?.includes(key as any)) {
                (this.channels!.get(data.id)![key as keyof CachedChannel] as any) = data[key as keyof CachedChannel];
            }
        }
    }

    /**
     * Update a guild.
     * @param remove If the guild should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateGuild(remove: boolean, data: CachedGuild): void {
        if (remove) return void this.guilds!.delete(data.id);

        if (!this.guilds!.has(data.id)) this.guilds!.set(data.id, { id: data.id });

        for (const key in data) {
            if (data[key as keyof CachedGuild] !== undefined && this.options.guilds?.includes(key as any)) {
                (this.guilds!.get(data.id)![key as keyof CachedGuild] as any) = data[key as keyof CachedGuild];
            }
        }
    }

    /**
     * Update a member.
     * @param remove If the member should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateMember(remove: boolean, data: CachedMember): void {
        if (remove) {
            this.members!.get(data.guild_id)?.delete(data.user_id);
            if (this.members!.get(data.guild_id)?.size === 0) this.members!.delete(data.guild_id);
            return;
        }

        if (!this.members!.has(data.guild_id)) this.members!.set(data.guild_id, new ExtendedMap());
        if (!this.members!.get(data.guild_id)?.has(data.user_id))
            this.members!.get(data.guild_id)!.set(data.user_id, {
                user_id: data.user_id,
                guild_id: data.guild_id,
            });

        for (const key in data) {
            if (data[key as keyof CachedMember] !== undefined && this.options.members?.includes(key as any)) {
                (this.members!.get(data.guild_id)!.get(data.user_id)![key as keyof CachedMember] as any) =
                    data[key as keyof CachedMember];
            }
        }
    }

    /**
     * Update a presence.
     * @param remove If the presence should be removed from the cache.
     * @param data Data to update with.
     */
    private _updatePresence(remove: boolean, data: CachedPresence): void {
        if (remove) {
            this.presences!.get(data.guild_id)?.delete(data.user_id);
            if (this.presences!.get(data.guild_id)?.size === 0) this.presences!.delete(data.guild_id);
            return;
        }

        if (!this.presences!.has(data.guild_id)) this.presences!.set(data.guild_id, new ExtendedMap());
        if (!this.presences!.get(data.guild_id)?.has(data.user_id))
            this.presences!.get(data.guild_id)!.set(data.user_id, {
                user_id: data.user_id,
                guild_id: data.guild_id,
            });

        for (const key in data) {
            if (data[key as keyof CachedPresence] !== undefined && this.options.presences?.includes(key as any)) {
                (this.presences!.get(data.guild_id)!.get(data.user_id)![key as keyof CachedPresence] as any) =
                    data[key as keyof CachedPresence];
            }
        }
    }

    /**
     * Update a role.
     * @param remove If the role should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateRole(remove: boolean, data: CachedRole): void {
        if (remove) return void this.roles!.delete(data.id);

        if (!this.roles!.has(data.id)) this.roles!.set(data.id, { id: data.id });

        for (const key in data) {
            if (data[key as keyof CachedRole] !== undefined && this.options.roles?.includes(key as any)) {
                (this.roles!.get(data.id)![key as keyof CachedRole] as any) = data[key as keyof CachedRole];
            }
        }
    }

    /**
     * Update a user.
     * @param remove If the user should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateUser(remove: boolean, data: CachedUser): void {
        if (remove) return void this.users!.delete(data.id);

        if (!this.users!.has(data.id)) this.users!.set(data.id, { id: data.id });

        for (const key in data) {
            if (data[key as keyof CachedUser] !== undefined && this.options.users?.includes(key as any)) {
                (this.users!.get(data.id)![key as keyof CachedUser] as any) = data[key as keyof CachedUser];
            }
        }
    }

    /**
     * Update a voice state.
     * @param remove If the voice state should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateVoiceState(remove: boolean, data: CachedVoiceState): void {
        if (remove) {
            this.voiceStates!.get(data.guild_id)?.delete(data.user_id);
            if (this.voiceStates!.get(data.guild_id)?.size === 0) this.voiceStates!.delete(data.guild_id);
            return;
        }

        if (!this.voiceStates!.has(data.guild_id)) this.voiceStates!.set(data.guild_id, new ExtendedMap());
        if (!this.voiceStates!.get(data.guild_id)?.has(data.user_id))
            this.voiceStates!.get(data.guild_id)!.set(data.user_id, {
                user_id: data.user_id,
                guild_id: data.guild_id,
            });

        for (const key in data) {
            if (data[key as keyof CachedVoiceState] !== undefined && this.options.voiceStates?.includes(key as any)) {
                (this.voiceStates!.get(data.guild_id)!.get(data.user_id)![key as keyof CachedVoiceState] as any) =
                    data[key as keyof CachedVoiceState];
            }
        }
    }
}
