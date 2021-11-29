import * as DiscordTypes from 'discord-api-types';
import { Snowflake } from 'discord-api-types';

/**
 * Cache types.
 */
export interface CacheTypes {
    /**
     * A cached channel.
     */
    channel: Partial<DiscordTypes.APIChannel> & {
        /**
         * The channel's ID.
         * Always included, regardless of cache control.
         */
        id: Snowflake
    }

    /**
     * A cached guild.
     */
    guild: Partial<Omit<DiscordTypes.APIGuild, `channels` | `members` | `presences` | `roles` | `threads` | `voice_states`>> & {
        /**
         * The guild's ID.
         * Always included, regardless of cache control.
         */
        id: Snowflake
        /**
         * The guild's channels, represented by their IDs.
         * Note that threads are also included.
         */
        channels?: Snowflake[],
        /**
         * The guild's members, represented by their IDs.
         */
        members?: Snowflake[],
        /**
         * The guild's roles, represented by their IDs.
         */
        roles?: Snowflake[],
    }

    /**
     * A cached member.
     */
    member: Partial<DiscordTypes.APIGuildMember> & {
        /**
         * The ID of the user the member object originates from.
         * Always included, regardless of cache control.
         */
        id: Snowflake
        /**
         * The ID of the guild the member object originates from.
         * Always included, regardless of cache control.
         */
        guild_id: Snowflake
    }

    /**
     * A cached presence.
     */
    presence: Partial<DiscordTypes.GatewayPresenceUpdateDispatchData> & {
        /**
         * The ID of the user the presence originates from.
         * Always included, regardless of cache control.
         */
        id: Snowflake
        /**
         * The ID of the guild the presence originates from.
         * Always included, regardless of cache control.
         */
        guild_id: Snowflake
    }

    /**
     * A cached role.
     */
    role: Partial<DiscordTypes.APIRole> & {
        /**
         * The role's ID.
         * Always included, regardless of cache control.
         */
        id: Snowflake
        /**
         * The id of the guild (may be missing for some role objects received over gateway dispatches)
         */
        guild_id?: Snowflake
    }

    /**
     * A cached user.
     */
    user: Partial<DiscordTypes.APIUser> & {
        /**
         * The user's ID.
         * Always included, regardless of cache control.
         */
        id: Snowflake
    }

    /**
     * A cached voice state.
     */
    voiceState: Partial<DiscordTypes.GatewayVoiceState> & {
        /**
         * The ID of the user the voice state originates from.
         * Always included, regardless of cache control.
         */
        id: Snowflake
        /**
         * The ID of the guild the voice state originates from.
         * Always included, regardless of cache control.
         */
        guild_id: Snowflake
    }
}
