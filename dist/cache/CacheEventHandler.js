"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheEventHandler = void 0;
const collection_1 = __importDefault(require("@discordjs/collection"));
/**
 * The built in cache event handler function.
 * @param cache The {@link Cache cache} to update.
 * @param data A {@link GatewayEvents dispatched payload} to handle.
 * @internal
 */
const cacheEventHandler = (cache, data) => {
    const enabled = Object.keys(cache.options.cacheControl).filter((control) => cache.options.cacheControl[control] instanceof Array && cache[control]);
    if (enabled.length === 0)
        return;
    switch (data.t) {
        case `READY`: {
            if (enabled.includes(`guilds`))
                data.d.guilds.forEach((guild) => updateGuild(cache, false, guild));
            if (enabled.includes(`users`))
                updateUser(cache, false, data.d.user);
            break;
        }
        case `RESUMED`: {
            break;
        }
        case `CHANNEL_CREATE`: {
            if (enabled.includes(`channels`))
                updateChannel(cache, false, data.d);
            if (enabled.includes(`guilds`) && data.d.guild_id)
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    channels: [data.d.id, ...(cache.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id) ?? [])]
                });
            break;
        }
        case `CHANNEL_UPDATE`: {
            if (enabled.includes(`channels`))
                updateChannel(cache, false, data.d);
            break;
        }
        case `CHANNEL_DELETE`: {
            if (enabled.includes(`channels`))
                updateChannel(cache, true, data.d);
            if (enabled.includes(`guilds`) && data.d.guild_id)
                cache.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id);
            break;
        }
        case `CHANNEL_PINS_UPDATE`: {
            if (enabled.includes(`channels`))
                updateChannel(cache, false, {
                    ...data.d,
                    id: data.d.channel_id
                });
            break;
        }
        case `THREAD_CREATE`: {
            if (enabled.includes(`channels`))
                updateChannel(cache, false, data.d);
            if (enabled.includes(`guilds`) && data.d.guild_id)
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    channels: [data.d.id, ...(cache.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id) ?? [])]
                });
            break;
        }
        case `THREAD_UPDATE`: {
            if (enabled.includes(`channels`))
                updateChannel(cache, false, data.d);
            break;
        }
        case `THREAD_DELETE`: {
            if (enabled.includes(`channels`))
                updateChannel(cache, true, data.d);
            if (enabled.includes(`guilds`) && data.d.guild_id)
                cache.guilds?.get(data.d.guild_id)?.channels?.filter((channel) => channel !== data.d.id);
            break;
        }
        case `THREAD_LIST_SYNC`:
        case `THREAD_MEMBER_UPDATE`:
        case `THREAD_MEMBERS_UPDATE`: {
            break;
        }
        case `GUILD_CREATE`:
        case `GUILD_UPDATE`: {
            if (enabled.includes(`channels`))
                data.d.channels?.forEach((channel) => updateChannel(cache, false, channel));
            if (enabled.includes(`guilds`))
                updateGuild(cache, false, {
                    ...data.d,
                    channels: data.d.channels?.map((channel) => channel.id),
                    members: data.d.members?.filter((member) => member.user).map((member) => member.user.id),
                    roles: data.d.roles.map((role) => role.id)
                });
            if (enabled.includes(`members`))
                data.d.members?.filter((member) => member.user).forEach((member) => updateMember(cache, false, {
                    ...member,
                    user_id: member.user.id,
                    guild_id: data.d.id
                }));
            if (enabled.includes(`presences`))
                data.d.presences?.forEach((presence) => updatePresence(cache, false, {
                    ...presence,
                    user_id: presence.user.id
                }));
            if (enabled.includes(`roles`))
                data.d.roles.forEach((role) => updateRole(cache, false, role));
            if (enabled.includes(`users`))
                data.d.members?.filter((member) => member.user).forEach((member) => updateUser(cache, false, member.user));
            if (enabled.includes(`voiceStates`))
                data.d.voice_states?.forEach((voiceState) => updateVoiceState(cache, false, {
                    ...voiceState,
                    guild_id: data.d.id
                }));
            break;
        }
        case `GUILD_DELETE`: {
            if (data.d.unavailable) {
                if (enabled.includes(`guilds`))
                    updateGuild(cache, false, data.d);
            }
            else {
                if (enabled.includes(`channels`))
                    cache.channels?.sweep((channel) => channel.guild_id === data.d.id);
                if (enabled.includes(`guilds`))
                    updateGuild(cache, true, data.d);
                if (enabled.includes(`members`))
                    cache.members?.delete(data.d.id);
                if (enabled.includes(`presences`))
                    cache.presences?.delete(data.d.id);
                if (enabled.includes(`roles`))
                    cache.roles?.sweep((role) => role.guild_id === data.d.id);
                if (enabled.includes(`voiceStates`))
                    cache.voiceStates?.delete(data.d.id);
            }
            break;
        }
        case `GUILD_BAN_ADD`:
        case `GUILD_BAN_REMOVE`: {
            break;
        }
        case `GUILD_EMOJIS_UPDATE`: {
            if (enabled.includes(`guilds`))
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    emojis: data.d.emojis
                });
            break;
        }
        case `GUILD_STICKERS_UPDATE`: {
            if (enabled.includes(`guilds`))
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    stickers: data.d.stickers
                });
            break;
        }
        case `GUILD_INTEGRATIONS_UPDATE`: {
            break;
        }
        case `GUILD_MEMBER_ADD`: {
            if (enabled.includes(`guilds`) && data.d.user)
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    members: [data.d.user.id, ...(cache.guilds?.get(data.d.guild_id)?.members?.filter((member) => member !== data.d.user.id) ?? [])]
                });
            if (enabled.includes(`members`) && data.d.user)
                updateMember(cache, false, {
                    ...data.d,
                    user_id: data.d.user.id
                });
            if (enabled.includes(`users`) && data.d.user)
                updateUser(cache, false, data.d.user);
            break;
        }
        case `GUILD_MEMBER_REMOVE`: {
            if (enabled.includes(`guilds`))
                cache.guilds?.get(data.d.guild_id)?.members?.filter((member) => member !== data.d.user.id);
            if (enabled.includes(`members`))
                updateMember(cache, true, {
                    ...data.d,
                    user_id: data.d.user.id
                });
            break;
        }
        case `GUILD_MEMBER_UPDATE`: {
            if (enabled.includes(`members`))
                updateMember(cache, false, {
                    ...data.d,
                    user_id: data.d.user.id,
                    joined_at: data.d.joined_at ?? undefined
                });
            if (enabled.includes(`users`) && data.d.user)
                updateUser(cache, false, data.d.user);
            break;
        }
        case `GUILD_MEMBERS_CHUNK`: {
            if (enabled.includes(`members`))
                data.d.members.filter((member) => member.user).forEach((member) => updateMember(cache, false, {
                    ...member,
                    guild_id: data.d.guild_id,
                    user_id: member.user.id
                }));
            if (enabled.includes(`presences`))
                data.d.presences?.forEach((presence) => updatePresence(cache, false, {
                    ...presence,
                    user_id: presence.user.id
                }));
            if (enabled.includes(`users`))
                data.d.members.filter((member) => member.user).forEach((member) => updateUser(cache, false, member.user));
            break;
        }
        case `GUILD_ROLE_CREATE`: {
            if (enabled.includes(`roles`))
                updateRole(cache, false, {
                    ...data.d.role,
                    guild_id: data.d.guild_id
                });
            if (enabled.includes(`guilds`))
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    roles: [data.d.role.id, ...(cache.guilds?.get(data.d.guild_id)?.roles?.filter((role) => role !== data.d.role.id) ?? [])]
                });
            break;
        }
        case `GUILD_ROLE_UPDATE`: {
            if (enabled.includes(`roles`))
                updateRole(cache, false, {
                    ...data.d.role,
                    guild_id: data.d.guild_id
                });
            break;
        }
        case `GUILD_ROLE_DELETE`: {
            if (enabled.includes(`roles`))
                updateRole(cache, true, {
                    id: data.d.role_id,
                    guild_id: data.d.guild_id
                });
            if (enabled.includes(`guilds`))
                cache.guilds?.get(data.d.guild_id)?.roles?.filter((role) => role !== data.d.role_id);
            break;
        }
        case `GUILD_SCHEDULED_EVENT_CREATE`:
        case `GUILD_SCHEDULED_EVENT_UPDATE`: {
            if (enabled.includes(`guilds`))
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    guild_scheduled_events: [data.d, ...(cache.guilds?.get(data.d.guild_id)?.guild_scheduled_events?.filter((event) => event.id !== data.d.id) ?? [])]
                });
            break;
        }
        case `GUILD_SCHEDULED_EVENT_DELETE`: {
            if (enabled.includes(`guilds`))
                cache.guilds?.get(data.d.guild_id)?.guild_scheduled_events?.filter((event) => event.id !== data.d.id);
            break;
        }
        case `GUILD_SCHEDULED_EVENT_USER_ADD`:
        case `GUILD_SCHEDULED_EVENT_USER_REMOVE`:
        case `INTEGRATION_CREATE`:
        case `INTEGRATION_UPDATE`:
        case `INTEGRATION_DELETE`:
        case `INTERACTION_CREATE`:
        case `INVITE_CREATE`:
        case `INVITE_DELETE`: {
            break;
        }
        case `MESSAGE_CREATE`: {
            if (enabled.includes(`channels`))
                updateChannel(cache, false, {
                    id: data.d.channel_id,
                    last_message_id: data.d.id
                });
            break;
        }
        case `MESSAGE_UPDATE`:
        case `MESSAGE_DELETE`:
        case `MESSAGE_DELETE_BULK`:
        case `MESSAGE_REACTION_ADD`:
        case `MESSAGE_REACTION_REMOVE`:
        case `MESSAGE_REACTION_REMOVE_ALL`:
        case `MESSAGE_REACTION_REMOVE_EMOJI`: {
            break;
        }
        case `PRESENCE_UPDATE`: {
            if (enabled.includes(`presences`))
                updatePresence(cache, false, {
                    ...data.d,
                    user_id: data.d.user.id
                });
            break;
        }
        case `STAGE_INSTANCE_CREATE`: {
            if (enabled.includes(`guilds`))
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    stage_instances: [data.d, ...(cache.guilds?.get(data.d.guild_id)?.stage_instances?.filter((instance) => instance.id !== data.d.id) ?? [])]
                });
            break;
        }
        case `STAGE_INSTANCE_DELETE`: {
            if (enabled.includes(`guilds`))
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    stage_instances: cache.guilds?.get(data.d.guild_id)?.stage_instances?.filter((instance) => instance.id !== data.d.id) ?? []
                });
            break;
        }
        case `STAGE_INSTANCE_UPDATE`: {
            if (enabled.includes(`guilds`))
                updateGuild(cache, false, {
                    id: data.d.guild_id,
                    stage_instances: [data.d, ...(cache.guilds?.get(data.d.guild_id)?.stage_instances?.filter((instance) => instance.id !== data.d.id) ?? [])]
                });
            break;
        }
        case `TYPING_START`: {
            break;
        }
        case `USER_UPDATE`: {
            if (enabled.includes(`users`))
                updateUser(cache, false, data.d);
            break;
        }
        case `VOICE_STATE_UPDATE`: {
            if (enabled.includes(`voiceStates`) && data.d.guild_id)
                updateVoiceState(cache, data.d.channel_id === null, data.d);
            break;
        }
        case `VOICE_SERVER_UPDATE`:
        case `WEBHOOKS_UPDATE`: {
            break;
        }
    }
};
exports.cacheEventHandler = cacheEventHandler;
/**
 * Update a channel.
 * @param cache The cache to update.
 * @param remove If the channel should be removed from the cache.
 * @param data Data to update with.
 */
const updateChannel = (cache, remove, data) => {
    if (remove)
        return void cache.channels.delete(data.id);
    if (!cache.channels.has(data.id))
        cache.channels.set(data.id, { id: data.id });
    Object.keys(data)
        .filter((key) => data[key] !== undefined && (key === `guild_id` || cache.options.cacheControl.channels?.includes(key)))
        .forEach((key) => cache.channels.get(data.id)[key] = data[key]);
};
/**
 * Update a guild.
 * @param cache The cache to update.
 * @param remove If the guild should be removed from the cache.
 * @param data Data to update with.
 */
const updateGuild = (cache, remove, data) => {
    if (remove)
        return void cache.guilds.delete(data.id);
    if (!cache.guilds.has(data.id))
        cache.guilds.set(data.id, { id: data.id });
    Object.keys(data)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.guilds?.includes(key))
        .forEach((key) => cache.guilds.get(data.id)[key] = data[key]);
};
/**
 * Update a member.
 * @param cache The cache to update.
 * @param remove If the member should be removed from the cache.
 * @param data Data to update with.
 */
const updateMember = (cache, remove, data) => {
    if (remove) {
        cache.members.get(data.guild_id)?.delete(data.user_id);
        if (cache.members.get(data.guild_id)?.size === 0)
            cache.members.delete(data.guild_id);
        return;
    }
    if (!cache.members.has(data.guild_id))
        cache.members.set(data.guild_id, new collection_1.default());
    if (!cache.members.get(data.guild_id)?.has(data.user_id))
        cache.members.get(data.guild_id).set(data.user_id, {
            user_id: data.user_id, guild_id: data.guild_id
        });
    Object.keys(data)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.members?.includes(key))
        .forEach((key) => cache.members.get(data.guild_id).get(data.user_id)[key] = data[key]);
};
/**
 * Update a presence.
 * @param cache The cache to update.
 * @param remove If the presence should be removed from the cache.
 * @param data Data to update with.
 */
const updatePresence = (cache, remove, data) => {
    if (remove) {
        cache.presences.get(data.guild_id)?.delete(data.user_id);
        if (cache.presences.get(data.guild_id)?.size === 0)
            cache.presences.delete(data.guild_id);
        return;
    }
    if (!cache.presences.has(data.guild_id))
        cache.presences.set(data.guild_id, new collection_1.default());
    if (!cache.presences.get(data.guild_id)?.has(data.user_id))
        cache.presences.get(data.guild_id).set(data.user_id, {
            user_id: data.user_id, guild_id: data.guild_id
        });
    Object.keys(data)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.presences?.includes(key))
        .forEach((key) => cache.presences.get(data.guild_id).get(data.user_id)[key] = data[key]);
};
/**
 * Update a role.
 * @param cache The cache to update.
 * @param remove If the role should be removed from the cache.
 * @param data Data to update with.
 */
const updateRole = (cache, remove, data) => {
    if (remove)
        return void cache.roles.delete(data.id);
    if (!cache.roles.has(data.id))
        cache.roles.set(data.id, { id: data.id });
    Object.keys(data)
        .filter((key) => data[key] !== undefined && (key === `guild_id` || cache.options.cacheControl.roles?.includes(key)))
        .forEach((key) => cache.roles.get(data.id)[key] = data[key]);
};
/**
 * Update a user.
 * @param cache The cache to update.
 * @param remove If the user should be removed from the cache.
 * @param data Data to update with.
 */
const updateUser = (cache, remove, data) => {
    if (remove)
        return void cache.users.delete(data.id);
    if (!cache.users.has(data.id))
        cache.users.set(data.id, { id: data.id });
    Object.keys(data)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.users?.includes(key))
        .forEach((key) => cache.users.get(data.id)[key] = data[key]);
};
/**
 * Update a voice state.
 * @param cache The cache to update.
 * @param remove If the voice state should be removed from the cache.
 * @param data Data to update with.
 */
const updateVoiceState = (cache, remove, data) => {
    if (remove) {
        cache.voiceStates.get(data.guild_id)?.delete(data.user_id);
        if (cache.voiceStates.get(data.guild_id)?.size === 0)
            cache.voiceStates.delete(data.guild_id);
        return;
    }
    if (!cache.voiceStates.has(data.guild_id))
        cache.voiceStates.set(data.guild_id, new collection_1.default());
    if (!cache.voiceStates.get(data.guild_id)?.has(data.user_id))
        cache.voiceStates.get(data.guild_id).set(data.user_id, {
            user_id: data.user_id, guild_id: data.guild_id
        });
    Object.keys(data)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.voiceStates?.includes(key))
        .forEach((key) => cache.voiceStates.get(data.guild_id).get(data.user_id)[key] = data[key]);
};
