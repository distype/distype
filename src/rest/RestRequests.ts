import { RestData, RestMethod, RestOptions } from './Rest';

import * as DiscordTypes from 'discord-api-types';
import FormData from 'form-data';
import { Snowflake } from 'discord-api-types';

/**
 * A class containing methods for all routes for the Discord API.
 * @internal
 */
export abstract class RestRequests {
    abstract request(method: RestMethod, route: string, options?: RestOptions & RestData): Promise<any>;

    /**
     * @param applicationId The application ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands)
     */
    public async getGlobalApplicationCommands(applicationId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/commands`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command)
     */
    public async createGlobalApplicationCommand(applicationId: Snowflake, data: DiscordTypes.RESTPostAPIApplicationCommandsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIApplicationCommandsResult> {
        return await this.request(`POST`, `/applications/${applicationId}/commands`, {
            data, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-command)
     */
    public async getGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandResult> {
        return await this.request(`GET`, `/applications/${applicationId}/commands/${commandId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command)
     */
    public async editGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, data: DiscordTypes.RESTPatchAPIApplicationCommandJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationCommandResult> {
        return await this.request(`PATCH`, `/applications/${applicationId}/commands/${commandId}`, {
            data, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-global-application-command)
     */
    public async deleteGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<void> {
        return await this.request(`DELETE`, `/applications/${applicationId}/commands/${commandId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands)
     */
    public async bulkOverwriteGlobalApplicationCommands(applicationId: Snowflake, data: DiscordTypes.RESTPutAPIApplicationCommandsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/commands`, {
            data, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands)
     */
    public async getGuildApplicationCommands(applicationId: Snowflake, guildId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command)
     */
    public async createGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, data: DiscordTypes.RESTPostAPIApplicationGuildCommandsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIApplicationGuildCommandsResult> {
        return await this.request(`POST`, `/applications/${applicationId}/guilds/${guildId}/commands`, {
            data, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command)
     */
    public async getGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command)
     */
    public async editGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, data: DiscordTypes.RESTPatchAPIApplicationGuildCommandJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationGuildCommandResult> {
        return await this.request(`POST`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, {
            data, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-guild-application-command)
     */
    public async deleteGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<void> {
        return await this.request(`DELETE`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands)
     */
    public async bulkOverwriteGuildApplicationCommands(applicationId: Snowflake, guildId: Snowflake, data: DiscordTypes.RESTPutAPIApplicationGuildCommandsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIApplicationGuildCommandsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/guilds/${guildId}/commands`, {
            data, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command-permissions)
     */
    public async getGuildApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIGuildApplicationCommandsPermissionsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/permissions`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-application-command-permissions)
     */
    public async getApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandPermissionsResult> {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`, options);
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions)
     */
    public async editApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, data: DiscordTypes.RESTPutAPIApplicationCommandPermissionsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandPermissionsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`, {
            data, ...options
        });
    }

    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#batch-edit-application-command-permissions)
     */
    public async batchEditApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, data: DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsResult> {
        return await this.request(`PUT`, `/applications/${applicationId}/guilds/${guildId}/commands/permissions`, {
            data, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response)
     */
    public async createInteractionResponse(interactionId: Snowflake, interactionToken: string, data: DiscordTypes.RESTPostAPIInteractionCallbackJSONBody | FormData, options?: RestOptions): Promise<void> {
        return await this.request(`POST`, `/interactions/${interactionId}/${interactionToken}/callback`, {
            data, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response)
     */
    public async getOriginalInteractionResponse(interactionId: Snowflake, interactionToken: string, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIInteractionOriginalResponseResult> {
        return await this.request(`GET`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, options);
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    public async editOriginalInteractionResponse(interactionId: Snowflake, interactionToken: string, data: DiscordTypes.RESTPatchAPIInteractionOriginalResponseJSONBody | FormData, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionOriginalResponseResult> {
        return await this.request(`PATCH`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, {
            data, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response)
     */
    public async deleteOriginalInteractionResponse(interactionId: Snowflake, interactionToken: string, options?: RestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionOriginalResponseResult> {
        return await this.request(`DELETE`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, options) as Promise<DiscordTypes.RESTDeleteAPIInteractionOriginalResponseResult>;
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    public async createFollowupMessage(interactionId: Snowflake, interactionToken: string, data: DiscordTypes.RESTPostAPIInteractionFollowupJSONBody | FormData, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIInteractionFollowupResult> {
        return await this.request(`POST`, `/interactions/${interactionId}/${interactionToken}`, {
            data, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-followup-message)
     */
    public async getFollowupMessage(interactionId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIInteractionFollowupResult> {
        return await this.request(`GET`, `/interactions/${interactionId}/${interactionToken}/messages/${messageId}`, options);
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message)
     */
    public async editFollowupMessage(interactionId: Snowflake, interactionToken: string, messageId: Snowflake, data: DiscordTypes.RESTPatchAPIInteractionFollowupJSONBody | FormData, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionFollowupResult> {
        return await this.request(`PATCH`, `/interactions/${interactionId}/${interactionToken}/messages/${messageId}`, {
            data, ...options
        });
    }

    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message)
     */
    public async deleteFollowupMessage(interactionId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionFollowupResult> {
        return await this.request(`DELETE`, `/interactions/${interactionId}/${interactionToken}/messages/${messageId}`, options) as Promise<DiscordTypes.RESTDeleteAPIInteractionFollowupResult>;
    }

    /**
     * @param guildId The guild ID.
     * @param params Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)
     */
    public async getGuildAuditLog(guildId: Snowflake, params: DiscordTypes.RESTGetAPIAuditLogQuery = {}, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIAuditLogResult> {
        return await this.request(`GET`, `/guilds/${guildId}/audit-logs`, {
            params, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel)
     */
    public async getChannel(channelId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIChannelResult> {
        return await this.request(`GET`, `/channels/${channelId}`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param data Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#modify-channel)
     */
    public async modifyChannel(channelId: Snowflake, data: DiscordTypes.RESTPatchAPIChannelJSONBody, reason?: string, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIChannelResult> {
        return await this.request(`PATCH`, `/channels/${channelId}`, {
            data, reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#deleteclose-channel)
     */
    public async deleteChannel(channelId: Snowflake, reason?: string, options?: RestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelResult> {
        return await this.request(`DELETE`, `/channels/${channelId}`, {
            reason, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param params Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-messages)
     */
    public async getChannelMessages(channelId: Snowflake, params: DiscordTypes.RESTGetAPIChannelMessagesQuery = {}, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessagesResult> {
        return await this.request(`GET`, `/channels/${channelId}/messages`, {
            params, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-message)
     */
    public async getChannelMessage(channelId: Snowflake, messageId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessageResult> {
        return await this.request(`GET`, `/channels/${channelId}/messages/${messageId}`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    public async createMessage(channelId: Snowflake, data: DiscordTypes.RESTPostAPIChannelMessageJSONBody | FormData, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages`, {
            data, ...options
        });
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#crosspost-message)
     */
    public async crosspostMessage(channelId: Snowflake, messageId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageCrosspostResult> {
        return await this.request(`POST`, `/channels/${channelId}/messages/${messageId}/crosspost`, options);
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-reaction)
     */
    public async createReaction(channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIChannelMessageReactionResult> {
        return await this.request(`PUT`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, options) as Promise<DiscordTypes.RESTPutAPIChannelMessageReactionResult>;
    }

    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-own-reaction)
     */
    public async deleteOwnReaction(channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageOwnReaction> {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, options) as Promise<DiscordTypes.RESTDeleteAPIChannelMessageOwnReaction>;
    }

    // --------------------

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway)
     */
    public async getGateway(options?: RestOptions): Promise<DiscordTypes.RESTGetAPIGatewayResult> {
        return await this.request(`GET`, `/gateway`, options);
    }

    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway-bot)
     */
    public async getGatewayBot(options?: RestOptions): Promise<DiscordTypes.RESTGetAPIGatewayBotResult> {
        return await this.request(`GET`, `/gateway/bot`, options);
    }
}
