import { ClientOptions } from './ClientOptions';
import { Cache } from '../cache/Cache';
import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from '../cache/CacheObjects';
import { DistypeConstants } from '../constants/DistypeConstants';
import { Gateway } from '../gateway/Gateway';
import { Rest } from '../rest/Rest';
import { LogCallback } from '../types/Log';
import { Snowflake } from 'discord-api-types/v10';
/**
 * The Discord client.
 */
export declare class Client {
    /**
     * The client's {@link Cache cache}.
     */
    cache: Cache;
    /**
     * The client's {@link Gateway gateway manager}.
     */
    gateway: Gateway;
    /**
     * The client's {@link Rest rest manager}.
     */
    rest: Rest;
    /**
     * The version of [Distype](https://github.com/distype/distype) being used.
     */
    readonly DISTYPE_VERSION: typeof DistypeConstants.VERSION;
    /**
     * {@link ClientOptions Options} for the client.
     * Note that any options not specified are set to a default value.
     */
    readonly options: {
        cache: Cache[`options`];
        gateway: Gateway[`options`];
        rest: Rest[`options`];
    };
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    readonly system = "Client";
    /**
     * The {@link LogCallback log callback} used by the client.
     */
    private _log;
    /**
     * The bot's token.
     */
    private readonly _token;
    /**
     * Create a client.
     * @param token The bot's token.
     * @param options {@link ClientOptions Client options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally throughout the client.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor(token: string, options?: ClientOptions, logCallback?: LogCallback, logThisArg?: any);
    /**
     * Tries to ensure channel data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The channel's ID.
     * @param keys Properties to ensure.
     */
    getChannelData<T extends Array<keyof CachedChannel>>(id: Snowflake, ...keys: T): Promise<Pick<CachedChannel, T[number]>>;
    /**
     * Tries to ensure guild data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The guild's ID.
     * @param keys Properties to ensure.
     */
    getGuildData<T extends Array<keyof CachedGuild>>(id: Snowflake, ...keys: T): Promise<Pick<CachedGuild, T[number]>>;
    /**
     * Tries to ensure member data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param guildId The member's guild ID.
     * @param userId The member's user ID.
     * @param keys Properties to ensure.
     */
    getMemberData<T extends Array<keyof CachedMember>>(guildId: Snowflake, userId: Snowflake, ...keys: T): Promise<Pick<CachedMember, T[number]>>;
    /**
     * Tries to ensure presence data.
     * @param guildId The presence's guild ID.
     * @param userId The presence's user ID.
     * @param keys Properties to ensure.
     */
    getPresenceData<T extends Array<keyof CachedPresence>>(guildId: Snowflake, userId: Snowflake, ...keys: T): Pick<CachedPresence, T[number]>;
    /**
     * Tries to ensure role data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The role's ID.
     * @param guildId The role's guild's ID.
     * @param keys Properties to ensure.
     */
    getRoleData<T extends Array<keyof CachedRole>>(id: Snowflake, guildId: Snowflake, ...keys: T): Promise<Pick<CachedRole, T[number]>>;
    /**
     * Tries to ensure user data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The user's ID.
     * @param keys Properties to ensure.
     */
    getUserData<T extends Array<keyof CachedUser>>(id: Snowflake, ...keys: T): Promise<Pick<CachedUser, T[number]>>;
    /**
     * Tries to ensure presence data.
     * @param guildId The presence's guild ID.
     * @param userId The presence's user ID.
     * @param keys Properties to ensure.
     */
    getVoiceStateData<T extends Array<keyof CachedVoiceState>>(guildId: Snowflake, userId: Snowflake, ...keys: T): Pick<CachedVoiceState, T[number]>;
    /**
     * Gets the bot's self permissions.
     * For no requests to the API to be made, the following must be cached:
     * ```ts
     * const cacheOptions = {
     *   channels: [`permission_overwrites`], // Only necessary if channelId is specified
     *   guilds: [`owner_id`, `roles`],
     *   members: [`communication_disabled_until`, `roles`],
     *   roles: [`permissions`]
     * }
     * ```
     * @param guildId The guild to get the bot's permissions in.
     * @param channelId The channel to get the bot's permissions in.
     * @returns The bot's permission flags.
     */
    getSelfPermissions(guildId: Snowflake, channelId?: Snowflake): Promise<bigint>;
}
