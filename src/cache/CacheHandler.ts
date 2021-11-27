import { Cache } from './Cache';
import { CacheTypes } from './CacheTypes';
import { GatewayEvents } from '../gateway/Gateway';

import { Snowflake } from 'discord-api-types';

/**
 * The built in cache event handler function.
 * @param cache The cache to update.
 * @param data A dispatched payload to handle.
 * @internal
 */
export const cacheEventHandler = (cache: Cache, data: GatewayEvents[keyof GatewayEvents]): void => {
    switch (data.t) {
        default: {
            return;
        }
    }
};

/**
 * Update a channel.
 * @param cache The cache to update.
 * @param id The channel's ID.
 * @param data Data to update with.
 */
const updateChannel = (cache: Cache, id: Snowflake, data: Partial<CacheTypes[`channel`]>): void => {

};

/**
 * Update an emoji.
 * @param cache The cache to update.
 * @param id The emoji's ID.
 * @param data Data to update with.
 */
const updateEmoji = (cache: Cache, id: Snowflake, data: Partial<CacheTypes[`emoji`]>): void => {

};

/**
 * Update a guild.
 * @param cache The cache to update.
 * @param id The guild's ID.
 * @param data Data to update with.
 */
const updateGuild = (cache: Cache, id: Snowflake, data: Partial<CacheTypes[`guild`]>): void => {

};

/**
 * Update a member.
 * @param cache The cache to update.
 * @param id The user's ID.
 * @param guildId The guild ID.
 * @param data Data to update with.
 */
const updateMember = (cache: Cache, id: Snowflake, guildId: Snowflake, data: Partial<CacheTypes[`member`]>): void => {

};

/**
 * Update a presence.
 * @param cache The cache to update.
 * @param id The user's ID.
 * @param guildId The guild ID.
 * @param data Data to update with.
 */
const updatePresence = (cache: Cache, id: Snowflake, guildId: Snowflake, data: Partial<CacheTypes[`presence`]>): void => {

};

/**
 * Update a role.
 * @param cache The cache to update.
 * @param id The role's ID.
 * @param data Data to update with.
 */
const updateRole = (cache: Cache, id: Snowflake, data: Partial<CacheTypes[`role`]>): void => {

};

/**
 * Update a sticker.
 * @param cache The cache to update.
 * @param id The sticker's ID.
 * @param data Data to update with.
 */
const updateSticker = (cache: Cache, id: Snowflake, data: Partial<CacheTypes[`sticker`]>): void => {

};

/**
 * Update a voice state.
 * @param cache The cache to update.
 * @param userId The user's ID.
 * @param guildId The guild's ID.
 * @param data Data to update with.
 */
const updateVoiceState = (cache: Cache, userId: Snowflake, guildId: Snowflake, data: Partial<CacheTypes[`channel`]>): void => {

};

