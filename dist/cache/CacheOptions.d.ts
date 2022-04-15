import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from './CacheObjects';
import { UnionKeys } from '@br88c/node-utils';
/**
 * {@link Cache} options.
 */
export interface CacheOptions {
    /**
     * Channel cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
     * Defining an empty array (`[]`) will only cache the required data, `null` or `undefined` will cache no data.
     * @default null
     */
    channels?: Array<Exclude<UnionKeys<CachedChannel>, `id`>> | null;
    /**
     * Guild cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
     * Defining an empty array (`[]`) will only cache the required data, `null` or `undefined` will cache no data.
     * @default null
     */
    guilds?: Array<Exclude<keyof CachedGuild, `id`>> | null;
    /**
     * Member cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
     * Defining an empty array (`[]`) will only cache the required data, `null` or `undefined` will cache no data.
     * @default null
     */
    members?: Array<Exclude<keyof CachedMember, `user_id` | `guild_id`>> | null;
    /**
     * Presence cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
     * Defining an empty array (`[]`) will only cache the required data, `null` or `undefined` will cache no data.
     * @default null
     */
    presences?: Array<Exclude<keyof CachedPresence, `user_id` | `guild_id`>> | null;
    /**
     * Role cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
     * Defining an empty array (`[]`) will only cache the required data, `null` or `undefined` will cache no data.
     * @default null
     */
    roles?: Array<Exclude<keyof CachedRole, `id`>> | null;
    /**
     * User cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
     * Defining an empty array (`[]`) will only cache the required data, `null` or `undefined` will cache no data.
     * @default null
     */
    users?: Array<Exclude<keyof CachedUser, `id`>> | null;
    /**
     * Voice state cache control.
     * By default, nothing is cached. Cache is enabled on a per-key basis, meaning you specify what keys of data you wish to keep cached.
     * Keep in mind that even if you select to cache data, that data may not be available until specific gateway dispatches are received.
     * Defining an empty array (`[]`) will only cache the required data, `null` or `undefined` will cache no data.
     * @default null
     */
    voiceStates?: Array<Exclude<keyof CachedVoiceState, `user_id` | `guild_id`>> | null;
}
