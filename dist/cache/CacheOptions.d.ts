import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from './CacheObjects';
import { CacheEventHandler } from './CacheEventHandler';
/**
 * Cache options.
 */
export interface CacheOptions {
    /**
     * Cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
     * Defining an empty array (`[]`) will only cache the required data.
     */
    cacheControl: {
        channels?: Array<keyof Omit<CachedChannel, `id` | `guild_id`>>;
        guilds?: Array<keyof Omit<CachedGuild, `id`>>;
        members?: Array<keyof Omit<CachedMember, `user_id` | `guild_id`>>;
        presences?: Array<keyof Omit<CachedPresence, `user_id` | `guild_id`>>;
        roles?: Array<keyof Omit<CachedRole, `id` | `guild_id`>>;
        users?: Array<keyof Omit<CachedUser, `id`>>;
        voiceStates?: Array<keyof Omit<CachedVoiceState, `user_id` | `guild_id`>>;
    };
    /**
     * A custom handler to use for updating the cache with incoming gateway events.
     * It is recommended that you leave this undefined, so that the built-in handler is used.
     */
    cacheEventHandler: CacheEventHandler;
}
