import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from './CacheTypes';
import { cacheEventHandler } from './CacheHandler';
import { completeCacheOptions } from './completeCacheOptions';

import Collection from '@discordjs/collection';
import { Snowflake } from 'discord-api-types';

/**
 * Cache options.
 */
export interface CacheOptions {
    /**
     * Cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * @default {}
     */
    cacheControl?: {
        channels?: Array<keyof Omit<CachedChannel, `id`>>
        guilds?: Array<keyof Omit<CachedGuild, `id`>>
        members?: Array<keyof Omit<CachedMember, `id` | `guild_id`>>
        presences?: Array<keyof Omit<CachedPresence, `id` | `guild_id`>>
        roles?: Array<keyof Omit<CachedRole, `id`>>
        users?: Array<keyof Omit<CachedUser, `id`>>
        voiceStates?: Array<keyof Omit<CachedVoiceState, `id` | `guild_id`>>
    }
    /**
     * A custom handler to use for updating the cache with incoming gateway events.
     * It is recommended that you leave this undefined, so that the built-in handler is used.
     */
    cacheEventHandler?: typeof cacheEventHandler
}

/**
 * The cache manager.
 * Contains cached data, and handles dispatched gateway events to keep the cache up to date.
 */
export class Cache {
    /**
     * Cached channels.
     * A channel's key in the collection is its ID.
     */
    public channels?: Collection<Snowflake, CachedChannel>;
    /**
     * Cached guilds.
     * A guild's key in the collection is its ID.
     */
    public guilds?: Collection<Snowflake, CachedGuild>;
    /**
     * Cached members.
     * Each key of the parent cache is a guild ID, with its children being a collection of members in that guild.
     * A member's key in its collection is its user ID.
     */
    public members?: Collection<Snowflake, Collection<Snowflake, CachedMember>>;
    /**
     * Cached presences.
     * Each key of the parent cache is a guild ID, with its children being a collection of presences in that guild.
     * A presence's key in its collection is its user's ID.
     */
    public presences?: Collection<Snowflake, Collection<Snowflake, CachedPresence>>;
    /**
     * Cached roles.
     * A role's key in the collection is its ID.
     */
    public roles?: Collection<Snowflake, CachedRole>;
    /**
     * Cached users.
     * A user's key in the collection is its ID.
     */
    public users?: Collection<Snowflake, CachedUser>;
    /**
     * Cached voice states.
     * Each key of the parent cache is a guild ID, with its children being a collection of voice states in that guild.
     * A voice state's key in its collection is its user's ID.
     */
    public voiceStates?: Collection<Snowflake, Collection<Snowflake, CachedVoiceState>>;

    /**
     * Options for the cache manager.
     */
    public readonly options: Required<CacheOptions>;

    /**
     * Create a cache manager.
     * @param options Cache options.
     */
    constructor(options: CacheOptions = {}) {
        this.options = completeCacheOptions(options);

        (Object.keys(this.options.cacheControl) as Array<keyof Cache[`options`][`cacheControl`]>).forEach((key) => this[key] = new Collection<any, any>());
    }
}
