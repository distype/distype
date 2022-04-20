import { RestMethod, RestRequestData, RestRequestDataBodyStream } from './Rest';
import { RestRequestOptions } from './RestOptions';
import * as DiscordTypes from 'discord-api-types/v10';
import { RESTPatchAPIGuildEmojiJSONBody, RESTPostAPIGuildEmojiJSONBody, Snowflake } from 'discord-api-types/v10';
/**
 * A class containing methods for all routes for the Discord API.
 * @internal
 */
export declare abstract class RestRequests {
    abstract request(method: RestMethod, route: string, options?: RestRequestData): Promise<any>;
    /**
     * @param applicationId The application ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands)
     */
    getGlobalApplicationCommands(applicationId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIApplicationCommandsResult>;
    /**
     * @param applicationId The application ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command)
     */
    createGlobalApplicationCommand(applicationId: Snowflake, body: DiscordTypes.RESTPostAPIApplicationCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIApplicationCommandsResult>;
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
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command)
     */
    editGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, body: DiscordTypes.RESTPatchAPIApplicationCommandJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-global-application-command)
     */
    deleteGlobalApplicationCommand(applicationId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<never>;
    /**
     * @param applicationId The application ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands)
     */
    bulkOverwriteGlobalApplicationCommands(applicationId: Snowflake, body: DiscordTypes.RESTPutAPIApplicationCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandsResult>;
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
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command)
     */
    createGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, body: DiscordTypes.RESTPostAPIApplicationGuildCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIApplicationGuildCommandsResult>;
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
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command)
     */
    editGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, body: DiscordTypes.RESTPatchAPIApplicationGuildCommandJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIApplicationGuildCommandResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#delete-guild-application-command)
     */
    deleteGuildApplicationCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, options?: RestRequestOptions): Promise<never>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands)
     */
    bulkOverwriteGuildApplicationCommands(applicationId: Snowflake, guildId: Snowflake, body: DiscordTypes.RESTPutAPIApplicationGuildCommandsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationGuildCommandsResult>;
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
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions)
     */
    editApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake, body: DiscordTypes.RESTPutAPIApplicationCommandPermissionsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIApplicationCommandPermissionsResult>;
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#batch-edit-application-command-permissions)
     */
    batchEditApplicationCommandPermissions(applicationId: Snowflake, guildId: Snowflake, body: DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildApplicationCommandsPermissionsResult>;
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response)
     */
    createInteractionResponse(interactionId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPostAPIInteractionCallbackJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<never>;
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response)
     */
    getOriginalInteractionResponse(applicationId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionOriginalResponseResult>;
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    editOriginalInteractionResponse(applicationId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPatchAPIInteractionOriginalResponseJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionOriginalResponseResult>;
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-original-interaction-response)
     */
    deleteOriginalInteractionResponse(applicationId: Snowflake, interactionToken: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionOriginalResponseResult>;
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    createFollowupMessage(applicationId: Snowflake, interactionToken: string, body: DiscordTypes.RESTPostAPIInteractionFollowupJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIInteractionFollowupResult>;
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-followup-message)
     */
    getFollowupMessage(applicationId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIInteractionFollowupResult>;
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message)
     */
    editFollowupMessage(applicationId: Snowflake, interactionToken: string, messageId: Snowflake, body: DiscordTypes.RESTPatchAPIInteractionFollowupJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIInteractionFollowupResult>;
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message)
     */
    deleteFollowupMessage(applicationId: Snowflake, interactionToken: string, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIInteractionFollowupResult>;
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)
     */
    getGuildAuditLog(guildId: Snowflake, query: DiscordTypes.RESTGetAPIAuditLogQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIAuditLogResult>;
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel)
     */
    getChannel(channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelResult>;
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#modify-channel)
     */
    modifyChannel(channelId: Snowflake, body: DiscordTypes.RESTPatchAPIChannelJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIChannelResult>;
    /**
     * @param channelId The channel ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#deleteclose-channel)
     */
    deleteChannel(channelId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelResult>;
    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-messages)
     */
    getChannelMessages(channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelMessagesQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessagesResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-message)
     */
    getChannelMessage(channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessageResult>;
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    createMessage(channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessageJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessageResult>;
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
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-user-reaction)
     */
    deleteUserReaction(channelId: Snowflake, messageId: Snowflake, emoji: string, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageUserReactionResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-reactions)
     */
    getReactions(channelId: Snowflake, messageId: Snowflake, emoji: string, query: DiscordTypes.RESTGetAPIChannelMessageReactionUsersQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelMessageReactionUsersResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-all-reactions)
     */
    deleteAllReactions(channelId: Snowflake, messageId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelAllMessageReactionsResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-all-reactions-for-emoji)
     */
    deleteAllReactionsForEmoji(channelId: Snowflake, messageId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageReactionResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#edit-message)
     */
    editMessage(channelId: Snowflake, messageId: Snowflake, body: DiscordTypes.RESTPatchAPIChannelMessageJSONBody | RestRequestDataBodyStream, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIChannelMessageResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-message)
     */
    deleteMessage(channelId: Snowflake, messageId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelMessageResult>;
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#bulk-delete-messages)
     */
    bulkDeleteMessages(channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessagesBulkDeleteJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessagesBulkDeleteResult>;
    /**
     * @param channelId The channel ID.
     * @param overwriteId The overwrite ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#edit-channel-permissions)
     */
    editChannelPermissions(channelId: Snowflake, overwriteId: Snowflake, body: DiscordTypes.RESTPutAPIChannelPermissionJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelPermissionResult>;
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-invites)
     */
    getChannelInvites(channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelInvitesResult>;
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-channel-invite)
     */
    createChannelInvite(channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelInviteJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelInviteResult>;
    /**
     * @param channelId The channel ID.
     * @param overwriteId The overwrite's ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-channel-permission)
     */
    deleteChannelPermission(channelId: Snowflake, overwriteId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelPermissionResult>;
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#follow-news-channel)
     */
    followNewsChannel(channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelFollowersJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelFollowersResult>;
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#trigger-typing-indicator)
     */
    triggerTypingIndicator(channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelTypingResult>;
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-pinned-messages)
     */
    getPinnedMessages(channelId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelPinsResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#pin-message)
     */
    pinMessage(channelId: Snowflake, messageId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelPinResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#unpin-message)
     */
    unpinMessage(channelId: Snowflake, messageId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelPinResult>;
    /**
     * @param channelId The channel ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#group-dm-add-recipient)
     */
    groupDMAddRecipient(channelId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPutAPIChannelRecipientJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelRecipientResult>;
    /**
     * @param channelId The channel ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#group-dm-remove-recipient)
     */
    groupDMRemoveRecipient(channelId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelRecipientResult>;
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#start-thread-from-message)
     */
    startThreadFromMessage(channelId: Snowflake, messageId: Snowflake, body: DiscordTypes.RESTPostAPIChannelMessagesThreadsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelMessagesThreadsResult>;
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#start-thread-without-message)
     */
    startThreadWithoutMessage(channelId: Snowflake, body: DiscordTypes.RESTPostAPIChannelThreadsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelThreadsResult>;
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#start-thread-in-forum-channel)
     * @todo PR in `discord-api-types` for proper return type.
     */
    startThreadInForumChannel(channelId: Snowflake, body: DiscordTypes.RESTPostAPIGuildForumThreadsJSONBody | RestRequestDataBodyStream, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIChannelThreadsResult>;
    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#join-thread)
     */
    joinThread(threadId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIChannelThreadMembersResult>;
    /**
     * @param threadId The thread ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#add-thread-member)
     */
    addThreadMember(threadId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<never>;
    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#leave-thread)
     */
    leaveThread(threadId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIChannelThreadMembersResult>;
    /**
     * @param threadId The thread ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#remove-thread-member)
     */
    removeThreadMember(threadId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<never>;
    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-thread-members)
     */
    listThreadMembers(threadId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelThreadMembersResult>;
    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-public-archived-threads)
     */
    listPublicArchivedThreads(channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelThreadsArchivedQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelUsersThreadsArchivedResult>;
    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-private-archived-threads)
     */
    listPrivateArchivedThreads(channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelThreadsArchivedQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelUsersThreadsArchivedResult>;
    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-private-archived-threads)
     */
    listJoinedPrivateArchivedThreads(channelId: Snowflake, query: DiscordTypes.RESTGetAPIChannelThreadsArchivedQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIChannelUsersThreadsArchivedResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#list-guild-emojis)
     */
    listGuildEmojis(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildEmojisResult>;
    /**
     * @param guildId The guild ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#get-guild-emoji)
     */
    getGuildEmoji(guildId: Snowflake, emoji: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildEmojiResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#create-guild-emoji)
     */
    createGuildEmoji(guildId: Snowflake, body: RESTPostAPIGuildEmojiJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildEmojiResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#modify-guild-emoji)
     */
    modifyGuildEmoji(guildId: Snowflake, body: RESTPatchAPIGuildEmojiJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildEmojiResult>;
    /**
     * @param guildId The guild ID.
     * @param emoji The emoji's identifier.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/delete#delete-guild-emoji)
     */
    deleteGuildEmoji(guildId: Snowflake, emoji: string, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildEmojiResult>;
    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild)
     */
    createGuild(body: DiscordTypes.RESTPostAPIGuildsJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildsResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild)
     */
    getGuild(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-preview)
     */
    getGuildPreview(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildPreviewResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild)
     */
    modifyGuild(guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild)
     */
    deleteGuild(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-channels)
     */
    getGuildChannels(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildChannelsResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-channel)
     */
    createGuildChannel(guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildChannelJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildChannelResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-channel)
     */
    modifyGuildChannelPositions(guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildChannelPositionsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildChannelPositionsResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#list-active-threads)
     */
    listActiveThreads(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildThreadsResult>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-member)
     */
    getGuildMember(guildId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMemberResult>;
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#list-guild-members)
     */
    listGuildMembers(guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildMembersQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMembersResult>;
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#search-guild-members)
     */
    searchGuildMembers(guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildMembersSearchQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildMembersSearchResult>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#add-guild-member)
     */
    addGuildMember(guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPutAPIGuildMemberJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildMemberResult>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-member)
     */
    modifyGuildMember(guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildMemberJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildMemberResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-member)
     */
    modifyCurrentMember(guildId: Snowflake, body: DiscordTypes.RESTPatchAPICurrentGuildMemberJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildMemberResult>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param roleId The role ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#add-guild-member-role)
     */
    addGuildMemberRole(guildId: Snowflake, userId: Snowflake, roleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildMemberRoleResult>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param roleId The role ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#add-guild-member-role)
     */
    removeGuildMemberRole(guildId: Snowflake, userId: Snowflake, roleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildMemberRoleResult>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#remove-guild-member)
     */
    removeGuildMember(guildId: Snowflake, userId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildMemberResult>;
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-bans)
     */
    getGuildBans(guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildBansQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildBansResult>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-ban)
     */
    getGuildBan(guildId: Snowflake, userId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildBanResult>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-ban)
     */
    createGuildBan(guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPutAPIGuildBanJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPutAPIGuildBanResult>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#remove-guild-ban)
     */
    removeGuildBan(guildId: Snowflake, userId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildBanResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-roles)
     */
    getGuildRoles(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildRolesResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-role)
     */
    createGuildRole(guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildRoleJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildRoleResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-role-positions)
     */
    modifyGuildRolePositions(guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildRolePositionsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildRolePositionsResult>;
    /**
     * @param guildId The guild ID.
     * @param roleId The role ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-role)
     */
    modifyGuildRole(guildId: Snowflake, roleId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildRoleJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildRoleResult>;
    /**
     * @param guildId The guild ID.
     * @param roleId The role ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild-role)
     */
    deleteGuildRole(guildId: Snowflake, roleId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildRoleResult>;
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-prune-count)
     */
    getGuildPruneCount(guildId: Snowflake, query: DiscordTypes.RESTGetAPIGuildPruneCountQuery, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildPruneCountResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#begin-guild-prune)
     */
    beginGuildPrune(guildId: Snowflake, body: DiscordTypes.RESTPostAPIGuildPruneJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPIGuildPruneResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-voice-regions)
     */
    getGuildVoiceRegions(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildVoiceRegionsResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-invites)
     */
    getGuildInvites(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildInvitesResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-integrations)
     */
    getGuildIntegrations(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildIntegrationsResult>;
    /**
     * @param guildId The guild ID.
     * @param integrationId The integration ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild-integration)
     */
    deleteGuildIntegration(guildId: Snowflake, integrationId: Snowflake, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTDeleteAPIGuildIntegrationResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-widget-settings)
     */
    getGuildWidgetSettings(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWidgetSettingsResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-widget)
     */
    modifyGuildWidget(guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildWidgetSettingsJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTPatchAPIGuildWidgetSettingsResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-widget)
     */
    getGuildWidget(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWidgetJSONResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-vanity-url)
     */
    getGuildVanityURL(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildVanityUrlResult>;
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-welcome-screen)
     */
    getGuildWelcomeScreen(guildId: Snowflake, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWelcomeScreenResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen)
     */
    modifyGuildWelcomeScreen(guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildWelcomeScreenJSONBody, reason?: string, options?: RestRequestOptions): Promise<DiscordTypes.RESTGetAPIGuildWelcomeScreenResult>;
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state)
     */
    modifyCurrentUserVoiceState(guildId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody, options?: RestRequestOptions): Promise<never>;
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state)
     */
    modifyUserVoiceState(guildId: Snowflake, userId: Snowflake, body: DiscordTypes.RESTPatchAPIGuildVoiceStateUserJSONBody, options?: RestRequestOptions): Promise<never>;
    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#create-dm)
     */
    createDM(body: DiscordTypes.RESTPostAPICurrentUserCreateDMChannelJSONBody, options?: RestRequestOptions): Promise<DiscordTypes.RESTPostAPICurrentUserCreateDMChannelResult>;
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
