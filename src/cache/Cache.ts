import { CacheTypes } from './CacheTypes';
import { completeCacheOptions } from './completeCacheOptions';

import Collection from '@discordjs/collection';
import { GatewayDispatchPayload, Snowflake } from 'discord-api-types';

/**
 * Cache options.
 */
export interface CacheOptions {
    /**
     * Cache control.
     * By default, nothing is cached. Setting a cache to "true" will cache all data.
     * Defining an array will only cache those keys of the raw data.
     * @default {}
     */
    cacheControl?: {
        channels?: boolean | Array<keyof Omit<CacheTypes[`channel`], `id`>>
        emojis?: boolean | Array<keyof Omit<CacheTypes[`emoji`], `id`>>
        guilds?: boolean | Array<keyof Omit<CacheTypes[`guild`], `id`>>
        members?: boolean | Array<keyof Omit<CacheTypes[`member`], `id` | `guild_id`>>
        presences?: boolean | Array<keyof Omit<CacheTypes[`presence`], `id` | `guild_id`>>
        roles?: boolean | Array<keyof Omit<CacheTypes[`role`], `id`>>
        stickers?: boolean | Array<keyof Omit<CacheTypes[`sticker`], `id`>>
        voiceStates?: boolean | Array<keyof Omit<CacheTypes[`voiceState`], `user_id` | `guild_id`>>
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
    public channels?: Collection<Snowflake, CacheTypes[`channel`]>;
    /**
     * Cached emojis.
     * An emoji's key in the collection is its ID.
     */
    public emojis?: Collection<Snowflake, CacheTypes[`emoji`]>;
    /**
     * Cached guilds.
     * A guild's key in the collection is its ID.
     */
    public guilds?: Collection<Snowflake, CacheTypes[`guild`]>;
    /**
     * Cached members.
     * Each key of the parent cache is a guild ID, with its children being a collection of members in that guild.
     * A member's key in its collection is its user ID.
     */
    public members?: Collection<Snowflake, Collection<Snowflake, CacheTypes[`member`]>>;
    /**
     * Cached presences.
     * Each key of the parent cache is a guild ID, with its children being a collection of presences in that guild.
     * A presence's key in its collection is its user's ID.
     */
    public presences?: Collection<Snowflake, Collection<Snowflake, CacheTypes[`presence`]>>;
    /**
     * Cached roles.
     * A role's key in the collection is its ID.
     */
    public roles?: Collection<Snowflake, CacheTypes[`role`]>;
    /**
     * Cached stickers.
     * A sticker's key in the collection is its ID.
     */
    public stickers?: Collection<Snowflake, CacheTypes[`sticker`]>;
    /**
     * Cached voice states.
     * Each key of the parent cache is a guild ID, with its children being a collection of voice states in that guild.
     * A voice state's key in its collection is its user's ID.
     */
    public voiceStates?: Collection<Snowflake, Collection<Snowflake, CacheTypes[`voiceState`]>>;

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

    }
}

/**
 * The built in cache event handler function.
 * @param cache The cache to update.
 * @param data A dispatched payload to handle.
 * @internal
 */
export const cacheEventHandler = (cache: Cache, data: GatewayDispatchPayload): void => {

};
