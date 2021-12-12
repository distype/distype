import { Cache } from './Cache';
import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from './CacheTypes';
import { GatewayEvents } from '../gateway/Gateway';

import { Snowflake } from 'discord-api-types';
import Collection from '@discordjs/collection';

/**
 * The built in cache event handler function.
 * @param cache The cache to update.
 * @param data A dispatched payload to handle.
 * @internal
 */
export const cacheEventHandler = (cache: Cache, data: GatewayEvents[keyof GatewayEvents]): void => {
    const enabled = (Object.keys(cache.options.cacheControl) as Array<keyof Cache[`options`][`cacheControl`]>).filter((control) => cache.options.cacheControl[control] instanceof Array && control.length > 0 && cache[control]);
    if (enabled.length === 0) return;

    switch (data.t) {
        case `READY`: {
            break;
        }
        case `RESUMED`: {
            break;
        }
        case `CHANNEL_CREATE`: {
            break;
        }
        case `CHANNEL_UPDATE`: {
            break;
        }
        case `CHANNEL_DELETE`: {
            break;
        }
        case `CHANNEL_PINS_UPDATE`: {
            break;
        }
        case `THREAD_CREATE`: {
            break;
        }
        case `THREAD_UPDATE`: {
            break;
        }
        case `THREAD_DELETE`: {
            break;
        }
        case `THREAD_LIST_SYNC`: {
            break;
        }
        case `THREAD_MEMBER_UPDATE`: {
            break;
        }
        case `THREAD_MEMBERS_UPDATE`: {
            break;
        }
        case `GUILD_CREATE`: {
            break;
        }
        case `GUILD_UPDATE`: {
            break;
        }
        case `GUILD_DELETE`: {
            break;
        }
        case `GUILD_BAN_ADD`: {
            break;
        }
        case `GUILD_BAN_REMOVE`: {
            break;
        }
        case `GUILD_EMOJIS_UPDATE`: {
            break;
        }
        case `GUILD_STICKERS_UPDATE`: {
            break;
        }
        case `GUILD_INTEGRATIONS_UPDATE`: {
            break;
        }
        case `GUILD_MEMBER_ADD`: {
            break;
        }
        case `GUILD_MEMBER_REMOVE`: {
            break;
        }
        case `GUILD_MEMBER_UPDATE`: {
            break;
        }
        case `GUILD_MEMBERS_CHUNK`: {
            break;
        }
        case `GUILD_ROLE_CREATE`: {
            break;
        }
        case `GUILD_ROLE_UPDATE`: {
            break;
        }
        case `GUILD_ROLE_DELETE`: {
            break;
        }
        case `GUILD_SCHEDULED_EVENT_CREATE`: {
            break;
        }
        case `GUILD_SCHEDULED_EVENT_UPDATE`: {
            break;
        }
        case `GUILD_SCHEDULED_EVENT_DELETE`: {
            break;
        }
        case `GUILD_SCHEDULED_EVENT_USER_ADD`: {
            break;
        }
        case `GUILD_SCHEDULED_EVENT_USER_REMOVE`: {
            break;
        }
        case `INTEGRATION_CREATE`: {
            break;
        }
        case `INTEGRATION_UPDATE`: {
            break;
        }
        case `INTEGRATION_DELETE`: {
            break;
        }
        case `INTERACTION_CREATE`: {
            break;
        }
        case `INVITE_CREATE`: {
            break;
        }
        case `INVITE_DELETE`: {
            break;
        }
        case `MESSAGE_CREATE`: {
            break;
        }
        case `MESSAGE_DELETE`: {
            break;
        }
        case `MESSAGE_DELETE_BULK`: {
            break;
        }
        case `MESSAGE_REACTION_ADD`: {
            break;
        }
        case `MESSAGE_REACTION_REMOVE`: {
            break;
        }
        case `MESSAGE_REACTION_REMOVE_ALL`: {
            break;
        }
        case `MESSAGE_REACTION_REMOVE_EMOJI`: {
            break;
        }
        case `PRESENCE_UPDATE`: {
            break;
        }
        case `STAGE_INSTANCE_CREATE`: {
            break;
        }
        case `STAGE_INSTANCE_DELETE`: {
            break;
        }
        case `STAGE_INSTANCE_UPDATE`: {
            break;
        }
        case `TYPING_START`: {
            break;
        }
        case `USER_UPDATE`: {
            break;
        }
        case `VOICE_STATE_UPDATE`: {
            break;
        }
        case `VOICE_SERVER_UPDATE`: {
            break;
        }
        case `WEBHOOKS_UPDATE`: {
            break;
        }
    }
};

/**
 * Update a channel.
 * @param cache The cache to update.
 * @param remove If the channel should be removed from the cache.
 * @param id The channel's ID.
 * @param data Data to update with.
 */
const updateChannel = (cache: Cache, remove: boolean, id: Snowflake, data?: CachedChannel): void => {
    if (remove) return void cache.channels!.delete(id);

    if (!cache.channels!.has(id)) cache.channels!.set(id, { id });

    if (!data) return;
    (Object.keys(data) as Array<keyof CachedChannel>)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.channels?.includes(key as any))
        .forEach((key) => (cache.channels!.get(id)![key] as any) = data[key]);
};

/**
 * Update a guild.
 * @param cache The cache to update.
 * @param remove If the guild should be removed from the cache.
 * @param id The guild's ID.
 * @param data Data to update with.
 */
const updateGuild = (cache: Cache, remove: boolean, id: Snowflake, data?: CachedGuild): void => {
    if (remove) return void cache.guilds!.delete(id);

    if (!cache.guilds!.has(id)) cache.guilds!.set(id, { id });

    if (!data) return;
    (Object.keys(data) as Array<keyof CachedGuild>)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.guilds?.includes(key as any))
        .forEach((key) => (cache.guilds!.get(id)![key] as any) = data[key]);
};

/**
 * Update a member.
 * @param cache The cache to update.
 * @param remove If the member should be removed from the cache.
 * @param userId The user's ID.
 * @param guildId The guild ID.
 * @param data Data to update with.
 */
const updateMember = (cache: Cache, remove: boolean, userId: Snowflake, guildId: Snowflake, data?: CachedMember): void => {
    if (remove) {
        cache.members!.get(guildId)?.delete(userId);
        if (cache.members!.get(guildId)?.size === 0) cache.members!.delete(guildId);
        return;
    }

    if (!cache.members!.has(guildId)) cache.members!.set(guildId, new Collection());
    if (!cache.members!.get(guildId)?.has(userId)) cache.members!.get(guildId)!.set(userId, {
        user_id: userId, guild_id: guildId
    });

    if (!data) return;
    (Object.keys(data) as Array<keyof CachedMember>)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.members?.includes(key as any))
        .forEach((key) => (cache.members!.get(guildId)!.get(userId)![key] as any) = data[key]);
};

/**
 * Update a presence.
 * @param cache The cache to update.
 * @param remove If the presence should be removed from the cache.
 * @param userId The user's ID.
 * @param guildId The guild ID.
 * @param data Data to update with.
 */
const updatePresence = (cache: Cache, remove: boolean, userId: Snowflake, guildId: Snowflake, data?: CachedPresence): void => {
    if (remove) {
        cache.presences!.get(guildId)?.delete(userId);
        if (cache.presences!.get(guildId)?.size === 0) cache.presences!.delete(guildId);
        return;
    }

    if (!cache.presences!.has(guildId)) cache.presences!.set(guildId, new Collection());
    if (!cache.presences!.get(guildId)?.has(userId)) cache.presences!.get(guildId)!.set(userId, {
        user_id: userId, guild_id: guildId
    });

    if (!data) return;
    (Object.keys(data) as Array<keyof CachedPresence>)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.presences?.includes(key as any))
        .forEach((key) => (cache.presences!.get(guildId)!.get(userId)![key] as any) = data[key]);
};

/**
 * Update a role.
 * @param cache The cache to update.
 * @param remove If the role should be removed from the cache.
 * @param id The role's ID.
 * @param data Data to update with.
 */
const updateRole = (cache: Cache, remove: boolean, id: Snowflake, data?: CachedRole): void => {
    if (remove) return void cache.roles!.delete(id);

    if (!cache.roles!.has(id)) cache.roles!.set(id, { id });

    if (!data) return;
    (Object.keys(data) as Array<keyof CachedRole>)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.roles?.includes(key as any))
        .forEach((key) => (cache.roles!.get(id)![key] as any) = data[key]);
};

/**
 * Update a user.
 * @param cache The cache to update.
 * @param remove If the user should be removed from the cache.
 * @param id The user's ID.
 * @param data Data to update with.
 */
const updateUser = (cache: Cache, remove: boolean, id: Snowflake, data?: CachedUser): void => {
    if (remove) return void cache.users!.delete(id);

    if (!cache.users!.has(id)) cache.users!.set(id, { id });

    if (!data) return;
    (Object.keys(data) as Array<keyof CachedUser>)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.users?.includes(key as any))
        .forEach((key) => (cache.users!.get(id)![key] as any) = data[key]);
};

/**
 * Update a voice state.
 * @param cache The cache to update.
 * @param remove If the voice state should be removed from the cache.
 * @param userId The user's ID.
 * @param guildId The guild's ID.
 * @param data Data to update with.
 */
const updateVoiceState = (cache: Cache, remove: boolean, userId: Snowflake, guildId: Snowflake, data?: CachedVoiceState): void => {
    if (remove) {
        cache.voiceStates!.get(guildId)?.delete(userId);
        if (cache.voiceStates!.get(guildId)?.size === 0) cache.voiceStates!.delete(guildId);
        return;
    }

    if (!cache.voiceStates!.has(guildId)) cache.voiceStates!.set(guildId, new Collection());
    if (!cache.voiceStates!.get(guildId)?.has(userId)) cache.voiceStates!.get(guildId)!.set(userId
        , {
            user_id: userId, guild_id: guildId
        });

    if (!data) return;
    (Object.keys(data) as Array<keyof CachedVoiceState>)
        .filter((key) => data[key] !== undefined && cache.options.cacheControl.voiceStates?.includes(key as any))
        .forEach((key) => (cache.voiceStates!.get(guildId)!.get(userId)![key] as any) = data[key]);
};
