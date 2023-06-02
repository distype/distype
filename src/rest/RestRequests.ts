import { RestMethod, RestRequestData } from './Rest';
import { RestRequestOptions } from './RestOptions';

import * as DiscordTypes from 'discord-api-types/v10';
import { Snowflake } from 'discord-api-types/v10';

/**
 * A class containing methods for all routes for the Discord API.
 * @internal
 */
export abstract class RestRequests {
    public abstract request(method: RestMethod, route: string, options?: RestRequestData): Promise<any>;

    /**
     * @param applicationId The application ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands)
     */
    public async getGlobalApplicationCommands (applicationId: Snowflake, query: DiscordTypes.RESTGetAPIApplicationCommandsQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/commands`, {
            query, ...options
        });
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
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands)
     */
    public async getGuildApplicationCommands (applicationId: Snowflake, guildId: Snowflake, query: DiscordTypes.RESTGetAPIApplicationGuildCommandsQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands`, {
            query, ...options
        });
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
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response)
     */
    public async createInteractionResponse (interactionId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPostAPIInteractionCallbackJSONBody | FormData, options?: RestRequestOptions): Promise<never> {
        return await this.request(`POST`, `/interactions/${interactionId}/${interactionToken}/callback`, {
            body, ...options
        }) as never;
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response)
     */
    public async getOriginalInteractionResponse (applicationId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionOriginalResponseResult> {
        return await this.request(`GET`, `/webhooks/${applicationId}/${interactionToken}/messages/@original`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    public async editOriginalInteractionResponse (applicationId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPatchAPIInteractionOriginalResponseJSONBody | FormData, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionOriginalResponseResult> {
        return await this.request(`PATCH`, `/webhooks/${applicationId}/${interactionToken}/messages/@original`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response)
     */
    public async deleteOriginalInteractionResponse (applicationId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionOriginalResponseResult> {
        return await this.request(`DELETE`, `/webhooks/${applicationId}/${interactionToken}/messages/@original`, options) as never;
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    public async createFollowupMessage (applicationId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPostAPIInteractionFollowupJSONBody | FormData, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIInteractionFollowupResult> {
        return await this.request(`POST`, `/webhooks/${applicationId}/${interactionToken}`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-followup-message)
     */
    public async getFollowupMessage (applicationId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionFollowupResult> {
        return await this.request(`GET`, `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message)
     */
    public async editFollowupMessage (applicationId: Snowflake, interactionToken: string, messageId: Snowflake, body: DiscordTypes.RESTPatchAPIInteractionFollowupJSONBody | FormData, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionFollowupResult> {
        return await this.request(`PATCH`, `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, {
            body, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message)
     */
    public async deleteFollowupMessage (applicationId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionFollowupResult> {
        return await this.request(`DELETE`, `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, options) as never;
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
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/auto-moderation#list-auto-moderation-rules-for-guild)
     */
    public async listAutoModerationRulesForGuild (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIAutoModerationRulesResult> {
        return await this.request(`GET`, `/guilds/${guildId}/auto-moderation/rules`, { ...options });
    }

    /**
     * @param guildId The guild ID.
     * @param autoModerationRuleId The auto moderation rule ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/auto-moderation#get-auto-moderation-rule)
     */
    public async getAutoModerationRule (guildId: Snowflake, autoModerationRuleId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIAutoModerationRuleResult> {
        return await this.request(`GET`, `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`, { ...options });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/auto-moderation#create-auto-moderation-rule)
     */
    public async createAutoModerationRule (guildId: Snowflake, body: DiscordTypes.RESTPostAPIAutoModerationRuleJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIAutoModerationRuleResult> {
        return await this.request(`POST`, `/guilds/${guildId}/auto-moderation/rules`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param autoModerationRuleId The auto moderation rule ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/auto-moderation#create-auto-moderation-rule)
     */
    public async modifyAutoModerationRule (guildId: Snowflake, autoModerationRuleId: Snowflake, body: DiscordTypes.RESTPatchAPIAutoModerationRuleJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIAutoModerationRuleResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param autoModerationRuleId The auto moderation rule ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/auto-moderation#create-auto-moderation-rule)
     */
    public async deleteAutoModerationRule (guildId: Snowflake, autoModerationRuleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIAutoModerationRuleResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`, {
            reason, ...options
        }) as never;
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
    public async createMessage (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessageJSONBody | FormData, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageResult> {
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
    public async editMessage (channelId: Snowflake, messageId: Snowflake, body: DiscordTypes.RESTPatchAPIChannelMessageJSONBody | FormData, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIChannelMessageResult> {
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

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-channel-invite)
     */
    public async createChannelInvite (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelInviteJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelInviteResult> {
        return await this.request(`POST`, `/channels/${channelId}/invites`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param overwriteId The overwrite's ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-channel-permission)
     */
    public async deleteChannelPermission (channelId: Snowflake, overwriteId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelPermissionResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/permissions/${overwriteId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#follow-news-channel)
     */
    public async followNewsChannel (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelFollowersJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelFollowersResult> {
        return await this.request(`POST`, `/channels/${channelId}/followers`, {
            body, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#trigger-typing-indicator)
     */
    public async triggerTypingIndicator (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelTypingResult> {
        return await this.request(`POST`, `/channels/${channelId}/typing`, options) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-pinned-messages)
     */
    public async getPinnedMessages (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelPinsResult> {
        return await this.request(`GET`, `/channels/${channelId}/pins`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#pin-message)
     */
    public async pinMessage (channelId: Snowflake, messageId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelPinResult> {
        return await this.request(`PUT`, `/channels/${channelId}/pins/${messageId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#unpin-message)
     */
    public async unpinMessage (channelId: Snowflake, messageId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelPinResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/pins/${messageId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param channelId The channel ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#group-dm-add-recipient)
     */
    public async groupDMAddRecipient (channelId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPutAPIChannelRecipientJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelRecipientResult> {
        return await this.request(`PUT`, `/channels/${channelId}/recipients/${userId}`, {
            body, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#group-dm-remove-recipient)
     */
    public async groupDMRemoveRecipient (channelId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelRecipientResult> {
        return await this.request(`DELETE`, `/channels/${channelId}/recipients/${userId}`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#start-thread-from-message)
     */
    public async startThreadFromMessage (channelId: Snowflake, messageId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessagesThreadsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessagesThreadsResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages/${messageId}/threads`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#start-thread-without-message)
     */
    public async startThreadWithoutMessage (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelThreadsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelThreadsResult> {
        return await this.request(`POST`, `/channels/${channelId}/threads`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#start-thread-in-forum-channel)
     * @todo PR in `discord-api-types` for proper return type.
     */
    public async startThreadInForumChannel (channelId: Snowflake, body: DiscordTypes.RESTPostAPIGuildForumThreadsJSONBody | FormData, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelThreadsResult> {
        return await this.request(`POST`, `/channels/${channelId}/threads`, {
            body, reason, ...options
        });
    }

    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#join-thread)
     */
    public async joinThread (threadId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelThreadMembersResult> {
        return await this.request(`PUT`, `/channels/${threadId}/thread-members/@me`, options) as never;
    }

    /**
     * @param threadId The thread ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#add-thread-member)
     */
    public async addThreadMember (threadId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelThreadMembersResult> {
        return await this.request(`PUT`, `/channels/${threadId}/thread-members/${userId}`, options) as never;
    }

    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#leave-thread)
     */
    public async leaveThread (threadId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelThreadMembersResult> {
        return await this.request(`DELETE`, `/channels/${threadId}/thread-members/@me`, options) as never;
    }

    /**
     * @param threadId The thread ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#remove-thread-member)
     */
    public async removeThreadMember (threadId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelThreadMembersResult> {
        return await this.request(`DELETE`, `/channels/${threadId}/thread-members/${userId}`, options) as never;
    }

    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-thread-members)
     */
    public async listThreadMembers (threadId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelThreadMembersResult> {
        return await this.request(`GET`, `/channels/${threadId}/thread-members`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-public-archived-threads)
     */
    public async listPublicArchivedThreads (channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelThreadsArchivedQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelUsersThreadsArchivedResult> {
        return await this.request(`GET`, `/channels/${channelId}/threads/archived/public`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-private-archived-threads)
     */
    public async listPrivateArchivedThreads (channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelThreadsArchivedQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelUsersThreadsArchivedResult> {
        return await this.request(`GET`, `/channels/${channelId}/threads/archived/private`, {
            query, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-private-archived-threads)
     */
    public async listJoinedPrivateArchivedThreads (channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelThreadsArchivedQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelUsersThreadsArchivedResult> {
        return await this.request(`GET`, `/channels/${channelId}/users/@me/threads/archived/private`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#list-guild-emojis)
     */
    public async listGuildEmojis (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildEmojisResult> {
        return await this.request(`GET`, `/guilds/${guildId}/emojis`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#get-guild-emoji)
     */
    public async getGuildEmoji (guildId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildEmojiResult> {
        return await this.request(`GET`, `/guilds/${guildId}/emojis/${emoji}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#create-guild-emoji)
     */
    public async createGuildEmoji (guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildEmojiJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildEmojiResult> {
        return await this.request(`POST`, `/guilds/${guildId}/emojis`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#modify-guild-emoji)
     */
    public async modifyGuildEmoji (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildEmojiJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildEmojiResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/emojis`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param emoji The emoji's identifier.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/delete#delete-guild-emoji)
     */
    public async deleteGuildEmoji (guildId: Snowflake, emoji: string, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildEmojiResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/emojis/${emoji}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild)
     */
    public async createGuild (body: DiscordTypes.RESTPostAPIGuildsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildsResult> {
        return await this.request(`POST`, `/guilds`, {
            body, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild)
     */
    public async getGuild (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildResult> {
        return await this.request(`GET`, `/guilds/${guildId}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-preview)
     */
    public async getGuildPreview (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildPreviewResult> {
        return await this.request(`GET`, `/guilds/${guildId}/preview`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild)
     */
    public async modifyGuild (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild)
     */
    public async deleteGuild (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}`, options) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-channels)
     */
    public async getGuildChannels (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildChannelsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/channels`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-channel)
     */
    public async createGuildChannel (guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildChannelJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildChannelResult> {
        return await this.request(`POST`, `/guilds/${guildId}/channels`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-channel)
     */
    public async modifyGuildChannelPositions (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildChannelPositionsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildChannelPositionsResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/channels`, {
            body, reason, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#list-active-threads)
     */
    public async listActiveThreads (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildThreadsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/threads/active`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-member)
     */
    public async getGuildMember (guildId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMemberResult> {
        return await this.request(`GET`, `/guilds/${guildId}/members/${userId}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#list-guild-members)
     */
    public async listGuildMembers (guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildMembersQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMembersResult> {
        return await this.request(`GET`, `/guilds/${guildId}/members`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#search-guild-members)
     */
    public async searchGuildMembers (guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildMembersSearchQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMembersSearchResult> {
        return await this.request(`GET`, `/guilds/${guildId}/members/search`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#add-guild-member)
     */
    public async addGuildMember (guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPutAPIGuildMemberJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildMemberResult> {
        return await this.request(`PUT`, `/guilds/${guildId}/members/${userId}`, {
            body, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-member)
     */
    public async modifyGuildMember (guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildMemberJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildMemberResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/members/${userId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-member)
     */
    public async modifyCurrentMember (guildId: Snowflake, body: DiscordTypes.RESTPatchAPICurrentGuildMemberJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildMemberResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/members/@me`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param roleId The role ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#add-guild-member-role)
     */
    public async addGuildMemberRole (guildId: Snowflake, userId: Snowflake, roleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildMemberRoleResult> {
        return await this.request(`PUT`, `/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param roleId The role ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#add-guild-member-role)
     */
    public async removeGuildMemberRole (guildId: Snowflake, userId: Snowflake, roleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildMemberRoleResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#remove-guild-member)
     */
    public async removeGuildMember (guildId: Snowflake, userId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildMemberResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/members/${userId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-bans)
     */
    public async getGuildBans (guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildBansQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildBansResult> {
        return await this.request(`GET`, `/guilds/${guildId}/bans`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-ban)
     */
    public async getGuildBan (guildId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildBanResult> {
        return await this.request(`GET`, `/guilds/${guildId}/bans/${userId}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-ban)
     */
    public async createGuildBan (guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPutAPIGuildBanJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildBanResult> {
        return await this.request(`PUT`, `/guilds/${guildId}/bans/${userId}`, {
            body, reason, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#remove-guild-ban)
     */
    public async removeGuildBan (guildId: Snowflake, userId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildBanResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/bans/${userId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-roles)
     */
    public async getGuildRoles (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildRolesResult> {
        return await this.request(`GET`, `/guilds/${guildId}/roles`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-role)
     */
    public async createGuildRole (guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildRoleJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildRoleResult> {
        return await this.request(`POST`, `/guilds/${guildId}/roles`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-role-positions)
     */
    public async modifyGuildRolePositions (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildRolePositionsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildRolePositionsResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/roles`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param roleId The role ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-role)
     */
    public async modifyGuildRole (guildId: Snowflake, roleId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildRoleJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildRoleResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/roles/${roleId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-mfa-level)
     */
    public async modifyGuildMFALevel (guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildsMFAJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildsMFAResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/mfa`, {
            body, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param roleId The role ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild-role)
     */
    public async deleteGuildRole (guildId: Snowflake, roleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildRoleResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/roles/${roleId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-prune-count)
     */
    public async getGuildPruneCount (guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildPruneCountQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildPruneCountResult> {
        return await this.request(`GET`, `/guilds/${guildId}/prune`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#begin-guild-prune)
     */
    public async beginGuildPrune (guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildPruneJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildPruneResult> {
        return await this.request(`POST`, `/guilds/${guildId}/prune`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-voice-regions)
     */
    public async getGuildVoiceRegions (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildVoiceRegionsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/regions`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-invites)
     */
    public async getGuildInvites (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildInvitesResult> {
        return await this.request(`GET`, `/guilds/${guildId}/invites`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-integrations)
     */
    public async getGuildIntegrations (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildIntegrationsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/integrations`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param integrationId The integration ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild-integration)
     */
    public async deleteGuildIntegration (guildId: Snowflake, integrationId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildIntegrationResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/integrations/${integrationId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-widget-settings)
     */
    public async getGuildWidgetSettings (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWidgetSettingsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/widget`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-widget)
     */
    public async modifyGuildWidget (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildWidgetSettingsJSONBody, reason?:string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildWidgetSettingsResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/widget`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-widget)
     */
    public async getGuildWidget (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWidgetJSONResult> {
        return await this.request(`GET`, `/guilds/${guildId}/widget.json`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-vanity-url)
     */
    public async getGuildVanityURL (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildVanityUrlResult> {
        return await this.request(`GET`, `/guilds/${guildId}/vanity-url`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-welcome-screen)
     */
    public async getGuildWelcomeScreen (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWelcomeScreenResult> {
        return await this.request(`GET`, `/guilds/${guildId}/welcome-screen`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen)
     */
    public async modifyGuildWelcomeScreen (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildWelcomeScreenJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildWelcomeScreenResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/welcome-screen`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state)
     */
    public async modifyCurrentUserVoiceState (guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildVoiceStateCurrentMemberResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/voice-states/@me`, {
            body, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-user-voice-state)
     */
    public async modifyUserVoiceState (guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildVoiceStateUserJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildVoiceStateUserResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/voice-states/${userId}`, {
            body, ...options
        }) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild-scheduled-event#list-scheduled-events-for-guild)
     */
    public async listScheduledEventsForGuild (guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildScheduledEventsQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildScheduledEventsResult> {
        return await this.request(`GET`, `/guilds/${guildId}/scheduled-events`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild-scheduled-event#create-guild-scheduled-event)
     */
    public async createGuildScheduledEvent (guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildScheduledEventJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildScheduledEventResult> {
        return await this.request(`POST`, `/guilds/${guildId}/scheduled-events`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param eventId The event ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event)
     */
    public async getGuildScheduledEvent (guildId: Snowflake, eventId: Snowflake, query: DiscordTypes.RESTGetAPIGuildScheduledEventQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildScheduledEventResult> {
        return await this.request(`GET`, `/guilds/${guildId}/scheduled-events/${eventId}`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param eventId The event ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild-scheduled-event#modify-guild-scheduled-event)
     */
    public async modifyGuildScheduledEvent (guildId: Snowflake, eventId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildScheduledEventJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildScheduledEventResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/scheduled-events/${eventId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param eventId The event ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild-scheduled-event#delete-guild-scheduled-event)
     */
    public async deleteGuildScheduledEvent (guildId: Snowflake, eventId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildScheduledEventResult> {
        return await this.request(`DELETE`, `/guilds/${guildId}/scheduled-events/${eventId}`, options) as never;
    }

    /**
     * @param guildId The guild ID.
     * @param eventId The event ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event-users)
     */
    public async getGuildScheduledEventUsers (guildId: Snowflake, eventId: Snowflake, query: DiscordTypes.RESTGetAPIGuildScheduledEventUsersQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildScheduledEventUsersResult> {
        return await this.request(`GET`, `/guilds/${guildId}/scheduled-events/${eventId}/users`, {
            query, ...options
        });
    }

    /**
     * @param inviteCode The invite code.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/invite#get-invite)
     */
    public async getInvite (inviteCode: string, query: DiscordTypes.RESTGetAPIInviteQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInviteResult> {
        return await this.request(`GET`, `/invites/${inviteCode}`, {
            query, ...options
        });
    }

    /**
     * @param inviteCode The invite code.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/invite#delete-invite)
     */
    public async deleteInvite (inviteCode: string, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInviteResult> {
        return await this.request(`DELETE`, `/invites/${inviteCode}`, {
            reason, ...options
        });
    }

    /**
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/stage-instance#create-stage-instance)
     */
    public async createStageInstance (body: DiscordTypes.RESTPostAPIStageInstanceJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIStageInstanceResult> {
        return await this.request(`POST`, `/stage-instances`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/stage-instance#get-stage-instance)
     */
    public async getStageInstance (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIStageInstanceResult> {
        return await this.request(`GET`, `/stage-instances/${channelId}`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/stage-instance#modify-stage-instance)
     */
    public async modifyStageInstance (channelId: Snowflake, body: DiscordTypes.RESTPatchAPIStageInstanceJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIStageInstanceResult> {
        return await this.request(`PATCH`, `/stage-instances/${channelId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/stage-instance#delete-stage-instance)
     */
    public async deleteStageInstance (channelId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIStageInstanceResult> {
        return await this.request(`DELETE`, `/stage-instances/${channelId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param stickerId The sticker ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#get-sticker)
     */
    public async getSticker (stickerId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIStickerResult> {
        return await this.request(`GET`, `/stickers/${stickerId}`, options);
    }

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#list-nitro-sticker-packs)
     */
    public async listNitroStickerPacks (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetNitroStickerPacksResult> {
        return await this.request(`GET`, `/sticker-packs`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#list-guild-stickers)
     */
    public async listGuildStickers (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildStickersResult> {
        return await this.request(`GET`, `/guilds/${guildId}/stickers`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param stickerId The sticker ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#get-guild-sticker)
     */
    public async getGuildSticker (guildId: Snowflake, stickerId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildStickerResult> {
        return await this.request(`GET`, `/guilds/${guildId}/stickers/${stickerId}`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#create-guild-sticker)
     */
    public async createGuildSticker (guildId: Snowflake, body: FormData, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildStickerResult> {
        return await this.request(`POST`, `/guilds/${guildId}/stickers`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param stickerId The sticker ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#modify-guild-sticker)
     */
    public async modifyGuildSticker (guildId: Snowflake, stickerId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildStickerJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildStickerResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/stickers/${stickerId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param stickerId The sticker ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#delete-guild-sticker)
     */
    public async deleteGuildSticker (guildId: Snowflake, stickerId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildStickerResult> {
        return await this.request(`PATCH`, `/guilds/${guildId}/stickers/${stickerId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-current-user)
     */
    public async getCurrentUser (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPICurrentUserResult> {
        return await this.request(`GET`, `/users/@me`, options);
    }

    /**
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-user)
     */
    public async getUser (userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIUserResult> {
        return await this.request(`GET`, `/users/${userId}`, options);
    }

    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#modify-current-user)
     */
    public async modifyCurrentUser (body: DiscordTypes.RESTPatchAPICurrentUserJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPICurrentUserResult> {
        return await this.request(`PATCH`, `/users/@me`, {
            body, ...options
        });
    }

    /**
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-current-user-guilds)
     */
    public async getCurrentUserGuilds (query: DiscordTypes.RESTGetAPICurrentUserGuildsQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPICurrentUserGuildsResult> {
        return await this.request(`GET`, `/users/@me/guilds`, {
            query, ...options
        });
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-current-user-guild-member)
     */
    public async getCurrentUserGuildMember (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetCurrentUserGuildMemberResult> {
        return await this.request(`GET`, `/user/@me/guilds/${guildId}/member`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#leave-guild)
     */
    public async leaveGuild (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPICurrentUserGuildResult> {
        return await this.request(`DELETE`, `/user/@me/guilds/${guildId}`, options) as never;
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
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-user-connections)
     */
    public async getUserConnections (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPICurrentUserConnectionsResult> {
        return await this.request(`GET`, `/users/@me/connections`, options);
    }

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/voice#list-voice-regions)
     */
    public async listVoiceRegions (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIVoiceRegionsResult> {
        return await this.request(`GET`, `/voice/regions`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#create-webhook)
     */
    public async createWebhook (channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelWebhookJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelWebhookResult> {
        return await this.request(`POST`, `/channels/${channelId}/webhooks`, {
            body, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#get-channel-webhooks)
     */
    public async getChannelWebhooks (channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelWebhooksResult> {
        return await this.request(`GET`, `/channels/${channelId}/webhooks`, options);
    }

    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#get-guild-webhooks)
     */
    public async getGuildWebhooks (guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWebhooksResult> {
        return await this.request(`GET`, `/guilds/${guildId}/webhooks`, options);
    }

    /**
     * @param webhookId The webhook ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#get-webhook)
     */
    public async getWebhook (webhookId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIWebhookResult> {
        return await this.request(`GET`, `/webhooks/${webhookId}`, options);
    }

    /**
     * @param webhookId The webhook ID.
     * @param token The webhook's token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#get-webhook-with-token)
     */
    public async getWebhookWithToken (webhookId: Snowflake, token: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIWebhookWithTokenResult> {
        return await this.request(`GET`, `/webhooks/${webhookId}/${token}`, options);
    }

    /**
     * @param webhookId The webhook ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#modify-webhook)
     */
    public async modifyWebhook (webhookId: Snowflake, body: DiscordTypes.RESTPatchAPIWebhookJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIWebhookResult> {
        return await this.request(`PATCH`, `/webhooks/${webhookId}`, {
            body, reason, ...options
        });
    }

    /**
     * @param webhookId The webhook ID.
     * @param token The webhook's token.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#modify-webhook-with-token)
     */
    public async modifyWebhookWithToken (webhookId: Snowflake, token: string, body: DiscordTypes.RESTPatchAPIWebhookWithTokenJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIWebhookWithTokenResult> {
        return await this.request(`PATCH`, `/webhooks/${webhookId}/${token}`, {
            body, reason, ...options
        });
    }

    /**
     * @param webhookId The webhook ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#delete-webhook)
     */
    public async deleteWebhook (webhookId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIWebhookResult> {
        return await this.request(`DELETE`, `/webhooks/${webhookId}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param webhookId The webhook ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#delete-webhook-with-token)
     */
    public async deleteWebhookWithToken (webhookId: Snowflake, token: string, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIWebhookWithTokenResult> {
        return await this.request(`DELETE`, `/webhooks/${webhookId}/${token}`, {
            reason, ...options
        }) as never;
    }

    /**
     * @param webhookId The webhook ID.
     * @param token The webhook's token.
     * @param body Request body.
     * @param wait If the response should wait until server confirmation.
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#execute-webhook)
     */
    public async executeWebhook <T extends boolean = false> (webhookId: Snowflake, token: string, body: DiscordTypes.RESTPostAPIWebhookWithTokenJSONBody | FormData, wait?: T, threadId?: Snowflake, options?: RestRequestOptions): Promise<T extends true ? DiscordTypes.RESTPostAPIWebhookWithTokenWaitResult : DiscordTypes.RESTPostAPIWebhookWithTokenResult> {
        return await this.request(`POST`, `/webhooks/${webhookId}/${token}`, {
            body,
            query: {
                thread_id: threadId,
                wait
            },
            ...options
        });
    }

    /**
     * @param webhookId The webhook ID.
     * @param token The webhook's token.
     * @param messageId The message ID.
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#get-webhook-message)
     */
    public async getWebhookMessage (webhookId: Snowflake, token: string, messageId: Snowflake, threadId?: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIWebhookWithTokenMessageResult> {
        return await this.request(`GET`, `/webhooks/${webhookId}/${token}/messages/${messageId}`, {
            query: { thread_id: threadId },
            ...options
        });
    }

    /**
     * @param webhookId The webhook ID.
     * @param token The webhook's token.
     * @param messageId The message ID.
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#edit-webhook-message)
     */
    public async editWebhookMessage (webhookId: Snowflake, token: string, messageId: Snowflake, body: DiscordTypes.RESTPatchAPIWebhookWithTokenMessageJSONBody | FormData, threadId?: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIWebhookWithTokenMessageResult> {
        return await this.request(`PATCH`, `/webhooks/${webhookId}/${token}/messages/${messageId}`, {
            body,
            query: { thread_id: threadId },
            ...options
        });
    }

    /**
     * @param webhookId The webhook ID.
     * @param token The webhook's token.
     * @param messageId The message ID.
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#delete-webhook-message)
     */
    public async deleteWebhookMessage (webhookId: Snowflake, token: string, messageId: Snowflake, threadId?: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIWebhookWithTokenMessageResult> {
        return await this.request(`DELETE`, `/webhooks/${webhookId}/${token}/messages/${messageId}`, {
            query: { thread_id: threadId },
            ...options
        }) as never;
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

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/oauth2#get-current-bot-application-information)
     */
    public async getCurrentBotApplicationInformation (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIOAuth2CurrentApplicationResult> {
        return await this.request(`GET`, `/oauth2/applications/@me`, options);
    }

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information)
     */
    public async getCurrentAuthorizationInformation (options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIOAuth2CurrentAuthorizationResult> {
        return await this.request(`GET`, `/oauth2/@me`, options);
    }
}
