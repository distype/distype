import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from './CacheObjects';
import { CacheOptions } from './CacheOptions';
import { Logger } from '../logger/Logger';
import Collection from '@discordjs/collection';
import { Snowflake } from 'discord-api-types/v10';
/**
 * The cache manager.
 * Contains cached data, and {@link cacheEventHandler handles dispatched gateway events} to keep the cache up to date.
 * Keep in mind that there are many caveats to the gateway, and that real-world cache data may not directly reflect your {@link CacheOptions cache control options}.
 * It is recommended that you research [intents](https://discord.com/developers/docs/topics/gateway#gateway-intents) and the [caveats](https://discord.com/developers/docs/topics/gateway#caveats) to the gateway, to make sure your bot receives sufficient data for your use case.
 * [Discord API Reference](https://discord.com/developers/docs/topics/gateway)
 */
export declare class Cache {
    /**
     * {@link CachedChannel Cached channels}.
     * A channel's key in the collection is its ID.
     */
    channels?: Collection<Snowflake, CachedChannel>;
    /**
     * {@link CachedGuild Cached guilds}.
     * A guild's key in the collection is its ID.
     */
    guilds?: Collection<Snowflake, CachedGuild>;
    /**
     * {@link CachedMember Cached members}.
     * Each key of the parent cache is a guild ID, with its children being a collection of members in that guild.
     * A member's key in its collection is its user ID.
     */
    members?: Collection<Snowflake, Collection<Snowflake, CachedMember>>;
    /**
     * {@link CachedPresence Cached presences}.
     * Each key of the parent cache is a guild ID, with its children being a collection of presences in that guild.
     * A presence's key in its collection is its user's ID.
     */
    presences?: Collection<Snowflake, Collection<Snowflake, CachedPresence>>;
    /**
     * {@link CachedRole Cached roles}.
     * A role's key in the collection is its ID.
     */
    roles?: Collection<Snowflake, CachedRole>;
    /**
     * {@link CachedUser Cached users}.
     * A user's key in the collection is its ID.
     */
    users?: Collection<Snowflake, CachedUser>;
    /**
     * {@link CachedVoiceState Cached voice states}.
     * Each key of the parent cache is a guild ID, with its children being a collection of voice states in that guild.
     * A voice state's key in its collection is its user's ID.
     */
    voiceStates?: Collection<Snowflake, Collection<Snowflake, CachedVoiceState>>;
    /**
     * {@link CacheOptions Options} for the cache manager.
     * Note that if you are using a {@link Client} or {@link ClientMaster} / {@link ClientWorker} and not manually creating a {@link Client} separately, these options may differ than the options specified when creating the client due to them being passed through the {@link optionsFactory}.
     */
    readonly options: CacheOptions;
    /**
     * The {@link Logger logger} used by the cache manager.
     */
    private _logger?;
    /**
     * Create a cache manager.
     * @param logger The {@link Logger logger} for the cache manager to use. If `false` is specified, no logger will be used.
     * @param options {@link CacheOptions Cache options}.
     */
    constructor(logger: Logger | false, options: CacheOptions);
}
