import { RestData, RestMethod } from './Rest';
import { AxiosRequestConfig } from 'axios';
import * as DiscordTypes from 'discord-api-types/v9';
import FormData from 'form-data';
import { Snowflake } from 'discord-api-types/v9';
/**
 * Options for rest requests.
 * Extends axios request configuration.
 * @see [Axios Documentation](https://axios-http.com/docs/req_config)
 */
export interface RestRequestOptions extends Omit<AxiosRequestConfig, `auth` | `baseURL` | `data` | `method` | `params` | `responseType` | `signal` | `transitional` | `url`> {
    /**
     * The API version to use.
     * @see [Discord API Reference](https://discord.com/developers/docs/reference#api-versioning-api-versions)
     * @default 9
     */
    version?: number;
}
/**
 * A class containing methods for all routes for the Discord API.
 * @internal
 */
export declare abstract class RestRequests {
    abstract request(method: RestMethod, route: string, options?: RestRequestOptions & RestData): Promise<any>;
    /**
     * @param applicationId The application ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands)
     */
    getGlobalApplicationCommands(applicationId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command)
     */
    createGlobalApplicationCommand(applicationId: Snowflake, data: DiscordTypes.RESTPostAPIApplicationCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIApplicationCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-command)
     */
    getGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command)
     */
    editGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, data: DiscordTypes.RESTPatchAPIApplicationCommandJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-global-application-command)
     */
    deleteGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<void>;
    /**
     * @param applicationId The application ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands)
     */
    bulkOverwriteGlobalApplicationCommands(applicationId: Snowflake, data: DiscordTypes.RESTPutAPIApplicationCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands)
     */
    getGuildApplicationCommands(applicationId: Snowflake, guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command)
     */
    createGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, data: DiscordTypes.RESTPostAPIApplicationGuildCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIApplicationGuildCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command)
     */
    getGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command)
     */
    editGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, data: DiscordTypes.RESTPatchAPIApplicationGuildCommandJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationGuildCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-guild-application-command)
     */
    deleteGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<void>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands)
     */
    bulkOverwriteGuildApplicationCommands(applicationId: Snowflake, guildId: Snowflake, data: DiscordTypes.RESTPutAPIApplicationGuildCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationGuildCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command-permissions)
     */
    getGuildApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildApplicationCommandsPermissionsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-application-command-permissions)
     */
    getApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandPermissionsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions)
     */
    editApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, data: DiscordTypes.RESTPutAPIApplicationCommandPermissionsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandPermissionsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#batch-edit-application-command-permissions)
     */
    batchEditApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, data: DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response)
     */
    createInteractionResponse(interactionId: Snowflake, interactionToken: string, data: DiscordTypes.RESTPostAPIInteractionCallbackJSONBody | FormData, options?: RestRequestOptions): Promise<void>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response)
     */
    getOriginalInteractionResponse(interactionId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionOriginalResponseResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    editOriginalInteractionResponse(interactionId: Snowflake, interactionToken: string, data: DiscordTypes.RESTPatchAPIInteractionOriginalResponseJSONBody | FormData, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionOriginalResponseResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response)
     */
    deleteOriginalInteractionResponse(interactionId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionOriginalResponseResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    createFollowupMessage(interactionId: Snowflake, interactionToken: string, data: DiscordTypes.RESTPostAPIInteractionFollowupJSONBody | FormData, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIInteractionFollowupResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-followup-message)
     */
    getFollowupMessage(interactionId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionFollowupResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message)
     */
    editFollowupMessage(interactionId: Snowflake, interactionToken: string, messageId: Snowflake, data: DiscordTypes.RESTPatchAPIInteractionFollowupJSONBody | FormData, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionFollowupResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message)
     */
    deleteFollowupMessage(interactionId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionFollowupResult>;
    /**
     * @param guildId The guild ID.
     * @param params Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)
     */
    getGuildAuditLog(guildId: Snowflake, params?: DiscordTypes.RESTGetAPIAuditLogQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIAuditLogResult>;
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel)
     */
    getChannel(channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelResult>;
    /**
     * @param channelId The channel ID.
     * @param data Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#modify-channel)
     */
    modifyChannel(channelId: Snowflake, data: DiscordTypes.RESTPatchAPIChannelJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIChannelResult>;
    /**
     * @param channelId The channel ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#deleteclose-channel)
     */
    deleteChannel(channelId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelResult>;
    /**
     * @param channelId The channel ID.
     * @param params Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-messages)
     */
    getChannelMessages(channelId: Snowflake, params?: DiscordTypes.RESTGetAPIChannelMessagesQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessagesResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-message)
     */
    getChannelMessage(channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessageResult>;
    /**
     * @param channelId The channel ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    createMessage(channelId: Snowflake, data: DiscordTypes.RESTPostAPIChannelMessageJSONBody | FormData, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#crosspost-message)
     */
    crosspostMessage(channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageCrosspostResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-reaction)
     */
    createReaction(channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelMessageReactionResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-own-reaction)
     */
    deleteOwnReaction(channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageOwnReaction>;
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway)
     */
    getGateway(options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGatewayResult>;
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway-bot)
     */
    getGatewayBot(options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGatewayBotResult>;
}
