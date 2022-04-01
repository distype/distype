import { RestInternalRequestOptions, RestMethod, RestRequestDataBodyStream } from './Rest';
import { RestRequestOptions } from './RestOptions';

import * as DiscordTypes from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/v10';

/**
 * A class containing methods for all routes for the Discord API.
 * @internal
 */
export abstract class RestRequests {
    public abstract request(method: RestMethod, route: string, options?: RestInternalRequestOptions): Promise<any>;

    /**
     * @param applicationId The application ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands)
     */
    public async getGlobalApplicationCommands (applicationId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/commands`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command)
     */
    public async createGlobalApplicationCommand (applicationId: Snowflake, body: DiscordTypes.RESTPostAPIApplicationCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIApplicationCommandsResult> {
        return await this.request(`POST`, `/applications/${applicationId}/commands`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-command)
     */
    public async getGlobalApplicationCommand (applicationId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandResult> {
        return await this.request(`GET`, `/applications/${applicationId}/commands/${commandId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command)
     */
    public async editGlobalApplicationCommand (applicationId: Snowflake, commandId: Snowflake, body: DiscordTypes.RESTPatchAPIApplicationCommandJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationCommandResult> {
        return await this.request(`PATCH`, `/applications/${applicationId}/commands/${commandId}`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-global-application-command)
     */
    public async deleteGlobalApplicationCommand (applicationId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<never> {
        return await this.request(`DELETE`, `/applications/${applicationId}/commands/${commandId}`, options) as never;
    }

    /**
     * @param applicationId The application ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands)
     */
    public async bulkOverwriteGlobalApplicationCommands (applicationId: Snowflake, body: DiscordTypes.RESTPutAPIApplicationCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/commands`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands)
     */
    public async getGuildApplicationCommands (applicationId: Snowflake, guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command)
     */
    public async createGuildApplicationCommand (applicationId: Snowflake, guildId: Snowflake, body: DiscordTypes.RESTPostAPIApplicationGuildCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIApplicationGuildCommandsResult> {
        return await this.request(`POST`, `/applications/${applicationId}/guilds/${guildId}/commands`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command)
     */
    public async getGuildApplicationCommand (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command)
     */
    public async editGuildApplicationCommand (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, body: DiscordTypes.RESTPatchAPIApplicationGuildCommandJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationGuildCommandResult> {
        return await this.request(`POST`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-guild-application-command)
     */
    public async deleteGuildApplicationCommand (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<never> {
        return await this.request(`DELETE`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, options) as never;
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands)
     */
    public async bulkOverwriteGuildApplicationCommands (applicationId: Snowflake, guildId: Snowflake, body: DiscordTypes.RESTPutAPIApplicationGuildCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationGuildCommandsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/guilds/${guildId}/commands`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command-permissions)
     */
    public async getGuildApplicationCommandPermissions (applicationId: Snowflake, guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildApplicationCommandsPermissionsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/permissions`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-application-command-permissions)
     */
    public async getApplicationCommandPermissions (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandPermissionsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions)
     */
    public async editApplicationCommandPermissions (applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, body: DiscordTypes.RESTPutAPIApplicationCommandPermissionsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandPermissionsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#batch-edit-application-command-permissions)
     */
    public async batchEditApplicationCommandPermissions (applicationId: Snowflake, guildId: Snowflake, body: DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/guilds/${guildId}/commands/permissions`, {
            body, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response)
     */
    public async createInteractionResponse (interactionId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPostAPIInteractionCallbackJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<never> {
        return await this.request(`POST`, `/interactions/${interactionId}/${interactionToken}/callback`, {
            body, ...options
        }) as never;
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response)
     */
    public async getOriginalInteractionResponse (interactionId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionOriginalResponseResult> {
        return await this.request(`GET`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, options);
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    public async editOriginalInteractionResponse (interactionId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPatchAPIInteractionOriginalResponseJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionOriginalResponseResult> {
        return await this.request(`PATCH`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, {
            body, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response)
     */
    public async deleteOriginalInteractionResponse (interactionId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionOriginalResponseResult> {
        return await this.request(`DELETE`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, options) as never;
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    public async createFollowupMessage (interactionId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPostAPIInteractionFollowupJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIInteractionFollowupResult> {
        return await this.request(`POST`, `/interactions/${interactionId}/${interactionToken}`, {
            body, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-followup-message)
     */
    public async getFollowupMessage (interactionId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionFollowupResult> {
        return await this.request(`GET`, `/interactions/${interactionId}/${interactionToken}/messages/${messageId}`, options);
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message)
     */
    public async editFollowupMessage (interactionId: Snowflake, interactionToken: string, messageId: Snowflake, body: DiscordTypes.RESTPatchAPIInteractionFollowupJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionFollowupResult> {
        return await this.request(`PATCH`, `/interactions/${interactionId}/${interactionToken}/messages/${messageId}`, {
            body, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message)
     */
    public async deleteFollowupMessage (interactionId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionFollowupResult> {
        return await this.request(`DELETE`, `/interactions/${interactionId}/${interactionToken}/messages/${messageId}`, options) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)
     */
    public async getGuildAuditLog (guildId: Snowflake, query: DiscordTypes.RESTGetAPIAuditLogQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIAuditLogResult> {
        return await this.request(`GET`, `/guilds/${guildId}/audit-logs`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel)
     */
    public async getChannel (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelResult> {
        return await this.request(`GET`, `/channels/${channelId}`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#modify-channel)
     */
    public async modifyChannel (channelId: Snowflake, body: DiscordTypes.RESTPatchAPIChannelJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIChannelResult> {
        return await this.request(`PATCH`, `/channels/${channelId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#deleteclose-channel)
     */
    public async deleteChannel (channelId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelResult> {
        return await this.request(`DELETE`, `/channels/${channelId}`, {
            reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-messages)
     */
    public async getChannelMessages (channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelMessagesQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessagesResult> {
        return await this.request(`GET`, `/channels/${channelId}/messages`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-message)
     */
    public async getChannelMessage (channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessageResult> {
        return await this.request(`GET`, `/channels/${channelId}/messages/${messageId}`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    public async createMessage (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessageJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages`, {
            body, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#crosspost-message)
     */
    public async crosspostMessage (channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageCrosspostResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages/${messageId}/crosspost`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-reaction)
     */
    public async createReaction (channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelMessageReactionResult> {
        return await this.request(`PUT`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-own-reaction)
     */
    public async deleteOwnReaction (channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageOwnReaction> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-user-reaction)
     */
    public async deleteUserReaction (channelId: Snowflake, messageId: Snowflake, emoji: string, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageUserReactionResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-reactions)
     */
    public async getReactions (channelId: Snowflake, messageId: Snowflake, emoji: string, query: DiscordTypes.RESTGetAPIChannelMessageReactionUsersQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessageReactionUsersResult> {
        return await this.request(`GET`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-all-reactions)
     */
    public async deleteAllReactions (channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelAllMessageReactionsResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-all-reactions-for-emoji)
     */
    public async deleteAllReactionsForEmoji (channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageReactionResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#edit-message)
     */
    public async editMessage (channelId: Snowflake, messageId: Snowflake, body: DiscordTypes.RESTPatchAPIChannelMessageJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIChannelMessageResult> {
        return await this.request(`PATCH`, `/channels/${channelId}/messages/${messageId}`, {
            body, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-message)
     */
    public async deleteMessage (channelId: Snowflake, messageId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#bulk-delete-messages)
     */
    public async bulkDeleteMessages (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessagesBulkDeleteJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessagesBulkDeleteResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages/bulk-delete`, {
            body, reason, ...options
        }) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param overwriteId The overwrite ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#edit-channel-permissions)
     */
    public async editChannelPermissions (channelId: Snowflake, overwriteId: Snowflake, body: DiscordTypes.RESTPutAPIChannelPermissionJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelPermissionResult> {
        return await this.request(`PUT`, `/channels/${channelId}/permissions/${overwriteId}`, {
            body, reason, ...options
        }) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-invites)
     */
    public async getChannelInvites (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelInvitesResult> {
        return await this.request(`GET`, `/channels/${channelId}/invites`, options);
    }

    // ------------------------------------

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     */
    public async getGuild (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildResult> {
        return await this.request(`GET`, `/guilds/${guildId}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param options Request options.
     */
    public async getGuildMember (guildId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMemberResult> {
        return await this.request(`GET`, `/guilds/${guildId}/members/${userId}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     */
    public async getGuildRoles (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildRolesResult> {
        return await this.request(`GET`, `/guilds/${guildId}/roles`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state)
     */
    public async modifyCurrentUserVoiceState (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody, options?: RestRequestOptions): Promise<never> {
        return await this.request(`PATCH`, `/guilds/${guildId}/voice-states/@me`, {
            body, ...options
        }) as never;
    }

    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#create-dm)
     */
    public async createDM (body: DiscordTypes.RESTPostAPICurrentUserCreateDMChannelJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPICurrentUserCreateDMChannelResult> {
        return await this.request(`POST`, `/users/@me/channels`, {
            body, ...options
        });
    }

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway)
     */
    public async getGateway (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGatewayResult> {
        return await this.request(`GET`, `/gateway`, options);
    }

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway-bot)
     */
    public async getGatewayBot (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGatewayBotResult> {
        return await this.request(`GET`, `/gateway/bot`, options);
    }
}
