import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from './CacheObjects';
import { CacheOptions } from './CacheOptions';
import { LogCallback } from '../types/Log';
import { ExtendedMap } from '@br88c/node-utils';
import { GatewayDispatchPayload, Snowflake } from 'discord-api-types/v10';
/**
 * The cache manager.
 * Contains cached data, and {@link cacheEventHandler handles dispatched gateway events} to keep the cache up to date.
 * Keep in mind that there are many caveats to the gateway, and that real-world cache data may not directly reflect your {@link CacheOptions cache control options}.
 * It is recommended that you research [intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) and the [caveats](https://discord.com/developers/docs/topics/gateway#caveats) to the gateway, to make sure your bot receives sufficient data for your use case.
 * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway)
 */
export declare class Cache {
    /**
     * {@link CachedChannel Cached channels}.
     * A channel's key in the map is its ID.
     */
    channels?: ExtendedMap<Snowflake, CachedChannel>;
    /**
     * {@link CachedGuild Cached guilds}.
     * A guild's key in the map is its ID.
     */
    guilds?: ExtendedMap<Snowflake, CachedGuild>;
    /**
     * {@link CachedMember Cached members}.
     * Each key of the parent cache is a guild ID, with its children being a map of members in that guild.
     * A member's key in its map is its user ID.
     */
    members?: ExtendedMap<Snowflake, ExtendedMap<Snowflake, CachedMember>>;
    /**
     * {@link CachedPresence Cached presences}.
     * Each key of the parent cache is a guild ID, with its children being a map of presences in that guild.
     * A presence's key in its map is its user's ID.
     */
    presences?: ExtendedMap<Snowflake, ExtendedMap<Snowflake, CachedPresence>>;
    /**
     * {@link CachedRole Cached roles}.
     * A role's key in the map is its ID.
     */
    roles?: ExtendedMap<Snowflake, CachedRole>;
    /**
     * {@link CachedUser Cached users}.
     * A user's key in the map is its ID.
     */
    users?: ExtendedMap<Snowflake, CachedUser>;
    /**
     * {@link CachedVoiceState Cached voice states}.
     * Each key of the parent cache is a guild ID, with its children being a map of voice states in that guild.
     * A voice state's key in its map is its user's ID.
     */
    voiceStates?: ExtendedMap<Snowflake, ExtendedMap<Snowflake, CachedVoiceState>>;
    /**
     * {@link CacheOptions Options} for the cache manager.
     * Note that any options not specified are set to a default value.
     */
    readonly options: Required<CacheOptions>;
    /**
     * The system string used for logging.
     */
    readonly system = "Cache";
    /**
     * The {@link LogCallback log callback} used by the cache manager.
     */
    private _log;
    /**
     * The keys of enabled caches.
     */
    private readonly _enabledKeys;
    /**
     * Create a cache manager.
     * @param options {@link CacheOptions Cache options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally in the cache manager.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(options?: CacheOptions, logCallback?: LogCallback, logThisArg?: any);
    /**
     * Handles data from a gateway event.
     * @param data The gateway data to handle.
     * @internal
     */
    handleEvent(data: GatewayDispatchPayload): void;
    /**
     * Update a channel.
     * @param remove If the channel should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateChannel;
    /**
     * Update a guild.
     * @param remove If the guild should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateGuild;
    /**
     * Update a member.
     * @param remove If the member should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateMember;
    /**
     * Update a presence.
     * @param remove If the presence should be removed from the cache.
     * @param data Data to update with.
     */
    private _updatePresence;
    /**
     * Update a role.
     * @param remove If the role should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateRole;
    /**
     * Update a user.
     * @param remove If the user should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateUser;
    /**
     * Update a voice state.
     * @param remove If the voice state should be removed from the cache.
     * @param data Data to update with.
     */
    private _updateVoiceState;
}
