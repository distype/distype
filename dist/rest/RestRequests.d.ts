import { RestData, RestMethod, RestOptions } from './Rest';
import * as DiscordTypes from 'discord-api-types';
import FormData from 'form-data';
import { Snowflake } from 'discord-api-types';
/**
 * A class containing methods for all routes for the Discord API.
 * @internal
 */
export declare abstract class RestRequests {
    abstract request(method: RestMethod, route: string, options?: RestOptions & RestData): Promise<any>;
    /**
     * @param applicationId The application ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands)
     */
    getGlobalApplicationCommands(applicationId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command)
     */
    createGlobalApplicationCommand(applicationId: Snowflake, data: DiscordTypes.RESTPostAPIApplicationCommandsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIApplicationCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-command)
     */
    getGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command)
     */
    editGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, data: DiscordTypes.RESTPatchAPIApplicationCommandJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-global-application-command)
     */
    deleteGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<void>;
    /**
     * @param applicationId The application ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands)
     */
    bulkOverwriteGlobalApplicationCommands(applicationId: Snowflake, data: DiscordTypes.RESTPutAPIApplicationCommandsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands)
     */
    getGuildApplicationCommands(applicationId: Snowflake, guildId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command)
     */
    createGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, data: DiscordTypes.RESTPostAPIApplicationGuildCommandsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIApplicationGuildCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command)
     */
    getGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationGuildCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command)
     */
    editGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, data: DiscordTypes.RESTPatchAPIApplicationGuildCommandJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationGuildCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-guild-application-command)
     */
    deleteGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<void>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands)
     */
    bulkOverwriteGuildApplicationCommands(applicationId: Snowflake, guildId: Snowflake, data: DiscordTypes.RESTPutAPIApplicationGuildCommandsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIApplicationGuildCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command-permissions)
     */
    getGuildApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIGuildApplicationCommandsPermissionsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-application-command-permissions)
     */
    getApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandPermissionsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions)
     */
    editApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, data: DiscordTypes.RESTPutAPIApplicationCommandPermissionsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandPermissionsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#batch-edit-application-command-permissions)
     */
    batchEditApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, data: DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsJSONBody, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response)
     */
    createInteractionResponse(interactionId: Snowflake, interactionToken: string, data: DiscordTypes.RESTPostAPIInteractionCallbackJSONBody | FormData, options?: RestOptions): Promise<void>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response)
     */
    getOriginalInteractionResponse(interactionId: Snowflake, interactionToken: string, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIInteractionOriginalResponseResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    editOriginalInteractionResponse(interactionId: Snowflake, interactionToken: string, data: DiscordTypes.RESTPatchAPIInteractionOriginalResponseJSONBody | FormData, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionOriginalResponseResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response)
     */
    deleteOriginalInteractionResponse(interactionId: Snowflake, interactionToken: string, options?: RestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionOriginalResponseResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    createFollowupMessage(interactionId: Snowflake, interactionToken: string, data: DiscordTypes.RESTPostAPIInteractionFollowupJSONBody | FormData, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIInteractionFollowupResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-followup-message)
     */
    getFollowupMessage(interactionId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIInteractionFollowupResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message)
     */
    editFollowupMessage(interactionId: Snowflake, interactionToken: string, messageId: Snowflake, data: DiscordTypes.RESTPatchAPIInteractionFollowupJSONBody | FormData, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionFollowupResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message)
     */
    deleteFollowupMessage(interactionId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionFollowupResult>;
    /**
     * @param guildId The guild ID.
     * @param params Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)
     */
    getGuildAuditLog(guildId: Snowflake, params?: DiscordTypes.RESTGetAPIAuditLogQuery, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIAuditLogResult>;
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel)
     */
    getChannel(channelId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIChannelResult>;
    /**
     * @param channelId The channel ID.
     * @param data Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#modify-channel)
     */
    modifyChannel(channelId: Snowflake, data: DiscordTypes.RESTPatchAPIChannelJSONBody, reason?: string, options?: RestOptions): Promise<DiscordTypes.RESTPatchAPIChannelResult>;
    /**
     * @param channelId The channel ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#deleteclose-channel)
     */
    deleteChannel(channelId: Snowflake, reason?: string, options?: RestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelResult>;
    /**
     * @param channelId The channel ID.
     * @param params Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-messages)
     */
    getChannelMessages(channelId: Snowflake, params?: DiscordTypes.RESTGetAPIChannelMessagesQuery, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessagesResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-message)
     */
    getChannelMessage(channelId: Snowflake, messageId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessageResult>;
    /**
     * @param channelId The channel ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    createMessage(channelId: Snowflake, data: DiscordTypes.RESTPostAPIChannelMessageJSONBody | FormData, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#crosspost-message)
     */
    crosspostMessage(channelId: Snowflake, messageId: Snowflake, options?: RestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageCrosspostResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-reaction)
     */
    createReaction(channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestOptions): Promise<DiscordTypes.RESTPutAPIChannelMessageReactionResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-own-reaction)
     */
    deleteOwnReaction(channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageOwnReaction>;
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway)
     */
    getGateway(options?: RestOptions): Promise<DiscordTypes.RESTGetAPIGatewayResult>;
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway-bot)
     */
    getGatewayBot(options?: RestOptions): Promise<DiscordTypes.RESTGetAPIGatewayBotResult>;
}
