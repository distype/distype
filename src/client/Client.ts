import { ClientOptions } from './ClientOptions';

import { Cache } from '../cache/Cache';
import { CachedChannel, CachedGuild, CachedMember, CachedPresence, CachedRole, CachedUser, CachedVoiceState } from '../cache/CacheObjects';
import { DistypeConstants } from '../constants/DistypeConstants';
import { Gateway } from '../gateway/Gateway';
import { Rest } from '../rest/Rest';
import { LogCallback } from '../types/Log';
import { PermissionsGuild, PermissionsMember, PermissionsUtils } from '../utils/PermissionsUtils';

import { Snowflake } from 'discord-api-types/v10';

/**
 * The Discord client.
 */
export class Client {
    /**
     * The client's {@link Cache cache}.
     */
    public cache: Cache;
    /**
     * The client's {@link Gateway gateway manager}.
     */
    public gateway: Gateway;
    /**
     * The client's {@link Rest rest manager}.
     */
    public rest: Rest;

    /**
     * The version of [Distype](https://github.com/distype/distype) being used.
     */
    public readonly DISTYPE_VERSION: typeof DistypeConstants.VERSION = DistypeConstants.VERSION;
    /**
     * {@link ClientOptions Options} for the client.
     * Note that any options not specified are set to a default value.
     */
    public readonly options: {
        cache: Cache[`options`]
        gateway: Gateway[`options`]
        rest: Rest[`options`]
    };
    /**
     * The system string used for emitting {@link DistypeError errors} and for the {@link LogCallback log callback}.
     */
    public readonly system = `Client`;

    /**
     * The {@link LogCallback log callback} used by the client.
     */
    private _log: LogCallback;

    /**
     * The bot's token.
     */
    // @ts-expect-error Property '_token' has no initializer and is not definitely assigned in the constructor.
    private readonly _token: string;

    /**
     * Create a client.
     * @param token The bot's token.
     * @param options {@link ClientOptions Client options}.
     * @param logCallback A {@link LogCallback callback} to be used for logging events internally throughout the client.
     * @param logThisArg A value to use as `this` in the `logCallback`.
     */
    constructor (token: string, options: ClientOptions = {}, logCallback: LogCallback = (): void => {}, logThisArg?: any) {
        if (typeof token !== `string`) throw new TypeError(`Parameter "token" (string) not provided: got ${token} (${typeof token})`);
        if (typeof options !== `object`) throw new TypeError(`Parameter "options" (object) type mismatch: got ${options} (${typeof options})`);
        if (typeof logCallback !== `function`) throw new TypeError(`Parameter "logCallback" (function) type mismatch: got ${logCallback} (${typeof logCallback})`);

        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token as Client[`_token`],
            writable: false
        });

        this.cache = new Cache(options.cache, logCallback, logThisArg);
        this.rest = new Rest(token, options.rest, logCallback, logThisArg);
        this.gateway = new Gateway(token, this.rest, this.cache, options.gateway, logCallback, logThisArg);

        this.options = {
            cache: this.cache.options,
            gateway: this.gateway.options,
            rest: this.rest.options
        };

        this._log = logCallback.bind(logThisArg);
        this._log(`Initialized client`, {
            level: `DEBUG`, system: this.system
        });
    }

    /**
     * Tries to ensure channel data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The channel's ID.
     * @param keys Properties to ensure.
     */
    public async getChannelData <T extends Array<keyof CachedChannel>> (id: Snowflake, ...keys: T): Promise<Pick<CachedChannel, T[number]>> {
        let data = this.cache.channels?.get(id) ?? { id };
        if (keys.some((key) => !Object.keys(data).includes(key))) {
            data = {
                ...data, ...(await this.rest.getChannel(id) as unknown as CachedChannel)
            };
        }

        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {} as any);
    }

    /**
     * Tries to ensure guild data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The guild's ID.
     * @param keys Properties to ensure.
     */
    public async getGuildData <T extends Array<keyof CachedGuild>> (id: Snowflake, ...keys: T): Promise<Pick<CachedGuild, T[number]>> {
        let data = this.cache.guilds?.get(id) ?? { id };
        if (keys.some((key) => !Object.keys(data).includes(key))) {
            const guild = await this.rest.getGuild(id);
            data = {
                ...data,
                ...guild,
                channels: guild.channels?.map((channel) => channel.id),
                members: guild.members?.filter((member) => !!member.user).map((member) => member.user!.id),
                roles: guild.roles.map((role) => role.id)
            };
        }

        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {} as any);
    }

    /**
     * Tries to ensure member data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param guildId The member's guild ID.
     * @param userId The member's user ID.
     * @param keys Properties to ensure.
     */
    public async getMemberData <T extends Array<keyof CachedMember>> (guildId: Snowflake, userId: Snowflake, ...keys: T): Promise<Pick<CachedMember, T[number]>> {
        let data = this.cache.members?.get(guildId)?.get(userId) ?? {
            guild_id: guildId, user_id: userId
        };
        if (keys.some((key) => !Object.keys(data).includes(key))) {
            data = {
                ...data, ...(await this.rest.getGuildMember(guildId, userId))
            };
        }

        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {} as any);
    }

    /**
     * Tries to ensure presence data.
     * @param guildId The presence's guild ID.
     * @param userId The presence's user ID.
     * @param keys Properties to ensure.
     */
    public getPresenceData <T extends Array<keyof CachedPresence>> (guildId: Snowflake, userId: Snowflake, ...keys: T): Promise<Pick<CachedPresence, T[number]>> {
        const data = this.cache.presences?.get(guildId)?.get(userId) ?? {
            guild_id: guildId, user_id: userId
        };

        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {} as any);
    }

    /**
     * Tries to ensure role data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The role's ID.
     * @param guildId The role's guild's ID.
     * @param keys Properties to ensure.
     */
    public async getRoleData <T extends Array<keyof CachedRole>> (id: Snowflake, guildId: Snowflake, ...keys: T): Promise<Pick<CachedRole, T[number]>> {
        let data = this.cache.roles?.get(id) ?? { id };
        data.guild_id = guildId;

        if (keys.some((key) => !Object.keys(data).includes(key))) {
            const role = (await this.rest.getGuildRoles(guildId)).find((role) => role.id === id);
            if (role) data = {
                ...data, ...role
            };
        }

        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {} as any);
    }

    /**
     * Tries to ensure user data.
     * Fetches data from the {@link Cache cache}, then if data isn't found a {@link Rest rest} request is made.
     * @param id The user's ID.
     * @param keys Properties to ensure.
     */
    public async getUserData <T extends Array<keyof CachedUser>> (id: Snowflake, ...keys: T): Promise<Pick<CachedUser, T[number]>> {
        let data = this.cache.users?.get(id) ?? { id };
        if (keys.some((key) => !Object.keys(data).includes(key))) {
            data = {
                ...data, ...(await this.rest.getUser(id))
            };
        }

        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {} as any);
    }

    /**
     * Tries to ensure presence data.
     * @param guildId The presence's guild ID.
     * @param userId The presence's user ID.
     * @param keys Properties to ensure.
     */
    public getVoiceStateData <T extends Array<keyof CachedVoiceState>> (guildId: Snowflake, userId: Snowflake, ...keys: T): Promise<Pick<CachedVoiceState, T[number]>> {
        const data = this.cache.voiceStates?.get(guildId)?.get(userId) ?? {
            guild_id: guildId, user_id: userId
        };

        return keys.reduce((p, c) => Object.assign(p, { [c]: data[c] }), {} as any);
    }

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
    public async getSelfPermissions (guildId: Snowflake, channelId?: Snowflake): Promise<bigint> {
        if (!this.gateway.user?.id) throw new Error(``);

        const member = await this.getMemberData(guildId, this.gateway.user.id, `roles`);
        const completeMember: PermissionsMember = {
            ...member,
            user: { id: this.gateway.user.id }
        };

        const timedOut = typeof (this.options.cache.members?.includes(`communication_disabled_until`) ? this.cache.members?.get(guildId)?.get(this.gateway.user.id)?.communication_disabled_until : (await this.rest.getGuildMember(guildId, this.gateway.user.id)).communication_disabled_until) === `string`;

        let completeGuild: Required<PermissionsGuild>;
        const cachedGuild = this.cache.guilds?.get(guildId) ?? { id: guildId };
        if (typeof cachedGuild.owner_id !== `string` || !Array.isArray(cachedGuild.roles)) {
            completeGuild = await this.rest.getGuild(guildId);
        } else {
            const cachedRoles = this.cache.roles?.filter((role) => cachedGuild.roles!.includes(role.id));
            let completeRoles: Required<PermissionsGuild>[`roles`];
            if (!cachedRoles || cachedRoles.size !== cachedGuild.roles.length || cachedRoles.some((role) => typeof role.permissions !== `string`)) {
                completeRoles = await this.rest.getGuildRoles(guildId);
            } else {
                completeRoles = cachedRoles as any;
            }

            completeGuild = {
                id: guildId,
                owner_id: cachedGuild.owner_id!,
                roles: completeRoles
            };
        }

        if (channelId) {
            return PermissionsUtils.channelPermissions(completeMember, completeGuild, await this.getChannelData(channelId, `permission_overwrites`), timedOut);
        } else {
            return PermissionsUtils.guildPermissions(completeMember, completeGuild, timedOut);
        }
    }
}
