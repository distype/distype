import * as DiscordTypes from 'discord-api-types';
import { Snowflake } from 'discord-api-types';
/**
 * A cached channel.
 */
export interface CachedChannel extends Partial<Omit<DiscordTypes.APIChannel, `member`>> {
    /**
     * The channel's ID.
     * Always included, regardless of cache control.
     */
    id: Snowflake;
    /**
     * The ID of the guild the channel originates from.
     * May be undefined if only sent from certain gateway dispatches.
     * Always included, regardless of cache control.
     */
    guild_id?: Snowflake;
    /**
     * The ID of the last message sent in this channel (may not point to an existing or valid message).
     * Note that this field will not update if you do not have the GUILD_MESSAGES / DIRECT_MESSAGES intent enabled. [Discord API Reference](https://discord.com/developers/docs/topics/gateway#channel-update)
     */
    last_message_id?: Snowflake | null;
}
/**
 * A cached guild.
 */
export interface CachedGuild extends Partial<Omit<DiscordTypes.APIGuild, `channels` | `members` | `presences` | `roles` | `threads` | `voice_states`>> {
    /**
     * The guild's ID.
     * Always included, regardless of cache control.
     */
    id: Snowflake;
    /**
     * The guild's channels, represented by their IDs.
     * Note that threads are also included.
     */
    channels?: Snowflake[];
    /**
     * The guild's members, represented by their IDs.
     * Note that this field will not update if you do not have the GUILD_MEMBERS intent enabled.
     */
    members?: Snowflake[];
    /**
     * The guild's roles, represented by their IDs.
     */
    roles?: Snowflake[];
}
/**
 * A cached member.
 */
export interface CachedMember extends Partial<DiscordTypes.APIGuildMember> {
    /**
     * The ID of the user the member object originates from.
     * Always included, regardless of cache control.
     */
    user_id: Snowflake;
    /**
     * The ID of the guild the member object originates from.
     * Always included, regardless of cache control.
     */
    guild_id: Snowflake;
}
/**
 * A cached presence.
 */
export interface CachedPresence extends Partial<DiscordTypes.GatewayPresenceUpdateDispatchData> {
    /**
     * The ID of the user the presence originates from.
     * Always included, regardless of cache control.
     */
    user_id: Snowflake;
    /**
     * The ID of the guild the presence originates from.
     * Always included, regardless of cache control.
     */
    guild_id: Snowflake;
}
/**
 * A cached role.
 */
export interface CachedRole extends Partial<DiscordTypes.APIRole> {
    /**
     * The role's ID.
     * Always included, regardless of cache control.
     */
    id: Snowflake;
    /**
     * The ID of the guild the role originates from.
     * May be undefined if only sent from certain gateway dispatches.
     * Always included, regardless of cache control.
     */
    guild_id?: Snowflake;
}
/**
 * A cached user.
 */
export interface CachedUser extends Partial<DiscordTypes.APIUser> {
    /**
     * The user's ID.
     * Always included, regardless of cache control.
     */
    id: Snowflake;
}
/**
 * A cached voice state.
 */
export interface CachedVoiceState extends Partial<DiscordTypes.GatewayVoiceState> {
    /**
     * The ID of the user the voice state originates from.
     * Always included, regardless of cache control.
     */
    user_id: Snowflake;
    /**
     * The ID of the guild the voice state originates from.
     * Always included, regardless of cache control.
     */
    guild_id: Snowflake;
}
