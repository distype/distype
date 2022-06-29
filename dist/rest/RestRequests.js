"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestRequests = void 0;
/**
 * A class containing methods for all routes for the Discord API.
 * @internal
 */
class RestRequests {
    /**
     * @param applicationId The application ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands)
     */
    async getGlobalApplicationCommands(applicationId, options) {
        return await this.request(`GET`, `/applications/${applicationId}/commands`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command)
     */
    async createGlobalApplicationCommand(applicationId, body, options) {
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
    async getGlobalApplicationCommand(applicationId, commandId, options) {
        return await this.request(`GET`, `/applications/${applicationId}/commands/${commandId}`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command)
     */
    async editGlobalApplicationCommand(applicationId, commandId, body, options) {
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
    async deleteGlobalApplicationCommand(applicationId, commandId, options) {
        return await this.request(`DELETE`, `/applications/${applicationId}/commands/${commandId}`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands)
     */
    async bulkOverwriteGlobalApplicationCommands(applicationId, body, options) {
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
    async getGuildApplicationCommands(applicationId, guildId, options) {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command)
     */
    async createGuildApplicationCommand(applicationId, guildId, body, options) {
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
    async getGuildApplicationCommand(applicationId, guildId, commandId, options) {
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
    async editGuildApplicationCommand(applicationId, guildId, commandId, body, options) {
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
    async deleteGuildApplicationCommand(applicationId, guildId, commandId, options) {
        return await this.request(`DELETE`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands)
     */
    async bulkOverwriteGuildApplicationCommands(applicationId, guildId, body, options) {
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
    async getGuildApplicationCommandPermissions(applicationId, guildId, options) {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands/permissions`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param commandId The command ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#get-application-command-permissions)
     */
    async getApplicationCommandPermissions(applicationId, guildId, commandId, options) {
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
    async editApplicationCommandPermissions(applicationId, guildId, commandId, body, options) {
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
    async createInteractionResponse(interactionId, interactionToken, body, options) {
        return await this.request(`POST`, `/interactions/${interactionId}/${interactionToken}/callback`, {
            body, ...options
        });
    }
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response)
     */
    async getOriginalInteractionResponse(applicationId, interactionToken, options) {
        return await this.request(`GET`, `/webhooks/${applicationId}/${interactionToken}/messages/@original`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    async editOriginalInteractionResponse(applicationId, interactionToken, body, options) {
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
    async deleteOriginalInteractionResponse(applicationId, interactionToken, options) {
        return await this.request(`DELETE`, `/webhooks/${applicationId}/${interactionToken}/messages/@original`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    async createFollowupMessage(applicationId, interactionToken, body, options) {
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
    async getFollowupMessage(applicationId, interactionToken, messageId, options) {
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
    async editFollowupMessage(applicationId, interactionToken, messageId, body, options) {
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
    async deleteFollowupMessage(applicationId, interactionToken, messageId, options) {
        return await this.request(`DELETE`, `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)
     */
    async getGuildAuditLog(guildId, query, options) {
        return await this.request(`GET`, `/guilds/${guildId}/audit-logs`, {
            query, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel)
     */
    async getChannel(channelId, options) {
        return await this.request(`GET`, `/channels/${channelId}`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#modify-channel)
     */
    async modifyChannel(channelId, body, reason, options) {
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
    async deleteChannel(channelId, reason, options) {
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
    async getChannelMessages(channelId, query, options) {
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
    async getChannelMessage(channelId, messageId, options) {
        return await this.request(`GET`, `/channels/${channelId}/messages/${messageId}`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    async createMessage(channelId, body, options) {
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
    async crosspostMessage(channelId, messageId, options) {
        return await this.request(`POST`, `/channels/${channelId}/messages/${messageId}/crosspost`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-reaction)
     */
    async createReaction(channelId, messageId, emoji, options) {
        return await this.request(`PUT`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-own-reaction)
     */
    async deleteOwnReaction(channelId, messageId, emoji, options) {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-user-reaction)
     */
    async deleteUserReaction(channelId, messageId, emoji, userId, options) {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-reactions)
     */
    async getReactions(channelId, messageId, emoji, query, options) {
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
    async deleteAllReactions(channelId, messageId, options) {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#delete-all-reactions-for-emoji)
     */
    async deleteAllReactionsForEmoji(channelId, messageId, emoji, options) {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#edit-message)
     */
    async editMessage(channelId, messageId, body, options) {
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
    async deleteMessage(channelId, messageId, reason, options) {
        return await this.request(`DELETE`, `/channels/${channelId}/messages/${messageId}`, {
            reason, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#bulk-delete-messages)
     */
    async bulkDeleteMessages(channelId, body, reason, options) {
        return await this.request(`POST`, `/channels/${channelId}/messages/bulk-delete`, {
            body, reason, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param overwriteId The overwrite ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#edit-channel-permissions)
     */
    async editChannelPermissions(channelId, overwriteId, body, reason, options) {
        return await this.request(`PUT`, `/channels/${channelId}/permissions/${overwriteId}`, {
            body, reason, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-channel-invites)
     */
    async getChannelInvites(channelId, options) {
        return await this.request(`GET`, `/channels/${channelId}/invites`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-channel-invite)
     */
    async createChannelInvite(channelId, body, reason, options) {
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
    async deleteChannelPermission(channelId, overwriteId, reason, options) {
        return await this.request(`DELETE`, `/channels/${channelId}/permissions/${overwriteId}`, {
            reason, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#follow-news-channel)
     */
    async followNewsChannel(channelId, body, options) {
        return await this.request(`POST`, `/channels/${channelId}/followers`, {
            body, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#trigger-typing-indicator)
     */
    async triggerTypingIndicator(channelId, options) {
        return await this.request(`POST`, `/channels/${channelId}/typing`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#get-pinned-messages)
     */
    async getPinnedMessages(channelId, options) {
        return await this.request(`GET`, `/channels/${channelId}/pins`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#pin-message)
     */
    async pinMessage(channelId, messageId, reason, options) {
        return await this.request(`PUT`, `/channels/${channelId}/pins/${messageId}`, {
            reason, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param messageId The message ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#unpin-message)
     */
    async unpinMessage(channelId, messageId, reason, options) {
        return await this.request(`DELETE`, `/channels/${channelId}/pins/${messageId}`, {
            reason, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#group-dm-add-recipient)
     */
    async groupDMAddRecipient(channelId, userId, body, options) {
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
    async groupDMRemoveRecipient(channelId, userId, options) {
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
    async startThreadFromMessage(channelId, messageId, body, reason, options) {
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
    async startThreadWithoutMessage(channelId, body, reason, options) {
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
    async startThreadInForumChannel(channelId, body, reason, options) {
        return await this.request(`POST`, `/channels/${channelId}/threads`, {
            body, reason, ...options
        });
    }
    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#join-thread)
     */
    async joinThread(threadId, options) {
        return await this.request(`PUT`, `/channels/${threadId}/thread-members/@me`, options);
    }
    /**
     * @param threadId The thread ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#add-thread-member)
     */
    async addThreadMember(threadId, userId, options) {
        return await this.request(`PUT`, `/channels/${threadId}/thread-members/${userId}`, options);
    }
    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#leave-thread)
     */
    async leaveThread(threadId, options) {
        return await this.request(`DELETE`, `/channels/${threadId}/thread-members/@me`, options);
    }
    /**
     * @param threadId The thread ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#remove-thread-member)
     */
    async removeThreadMember(threadId, userId, options) {
        return await this.request(`DELETE`, `/channels/${threadId}/thread-members/${userId}`, options);
    }
    /**
     * @param threadId The thread ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-thread-members)
     */
    async listThreadMembers(threadId, options) {
        return await this.request(`GET`, `/channels/${threadId}/thread-members`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#list-public-archived-threads)
     */
    async listPublicArchivedThreads(channelId, query, options) {
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
    async listPrivateArchivedThreads(channelId, query, options) {
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
    async listJoinedPrivateArchivedThreads(channelId, query, options) {
        return await this.request(`GET`, `/channels/${channelId}/users/@me/threads/archived/private`, {
            query, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#list-guild-emojis)
     */
    async listGuildEmojis(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/emojis`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param emoji The emoji's identifier.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#get-guild-emoji)
     */
    async getGuildEmoji(guildId, emoji, options) {
        return await this.request(`GET`, `/guilds/${guildId}/emojis/${emoji}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/emoji#create-guild-emoji)
     */
    async createGuildEmoji(guildId, body, reason, options) {
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
    async modifyGuildEmoji(guildId, body, reason, options) {
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
    async deleteGuildEmoji(guildId, emoji, reason, options) {
        return await this.request(`DELETE`, `/guilds/${guildId}/emojis/${emoji}`, {
            reason, ...options
        });
    }
    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild)
     */
    async createGuild(body, options) {
        return await this.request(`POST`, `/guilds`, {
            body, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild)
     */
    async getGuild(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-preview)
     */
    async getGuildPreview(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/preview`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild)
     */
    async modifyGuild(guildId, body, reason, options) {
        return await this.request(`PATCH`, `/guilds/${guildId}`, {
            body, reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild)
     */
    async deleteGuild(guildId, options) {
        return await this.request(`DELETE`, `/guilds/${guildId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-channels)
     */
    async getGuildChannels(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/channels`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-channel)
     */
    async createGuildChannel(guildId, body, reason, options) {
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
    async modifyGuildChannelPositions(guildId, body, reason, options) {
        return await this.request(`PATCH`, `/guilds/${guildId}/channels`, {
            body, reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#list-active-threads)
     */
    async listActiveThreads(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/threads/active`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-member)
     */
    async getGuildMember(guildId, userId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/members/${userId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#list-guild-members)
     */
    async listGuildMembers(guildId, query, options) {
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
    async searchGuildMembers(guildId, query, options) {
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
    async addGuildMember(guildId, userId, body, options) {
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
    async modifyGuildMember(guildId, userId, body, reason, options) {
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
    async modifyCurrentMember(guildId, body, reason, options) {
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
    async addGuildMemberRole(guildId, userId, roleId, reason, options) {
        return await this.request(`PUT`, `/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
            reason, ...options
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
    async removeGuildMemberRole(guildId, userId, roleId, reason, options) {
        return await this.request(`DELETE`, `/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
            reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#remove-guild-member)
     */
    async removeGuildMember(guildId, userId, reason, options) {
        return await this.request(`DELETE`, `/guilds/${guildId}/members/${userId}`, {
            reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-bans)
     */
    async getGuildBans(guildId, query, options) {
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
    async getGuildBan(guildId, userId, options) {
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
    async createGuildBan(guildId, userId, body, reason, options) {
        return await this.request(`PUT`, `/guilds/${guildId}/bans/${userId}`, {
            body, reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#remove-guild-ban)
     */
    async removeGuildBan(guildId, userId, reason, options) {
        return await this.request(`DELETE`, `/guilds/${guildId}/bans/${userId}`, {
            reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-roles)
     */
    async getGuildRoles(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/roles`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#create-guild-role)
     */
    async createGuildRole(guildId, body, reason, options) {
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
    async modifyGuildRolePositions(guildId, body, reason, options) {
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
    async modifyGuildRole(guildId, roleId, body, reason, options) {
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
    async modifyGuildMFALevel(guildId, body, options) {
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
    async deleteGuildRole(guildId, roleId, reason, options) {
        return await this.request(`DELETE`, `/guilds/${guildId}/roles/${roleId}`, {
            reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-prune-count)
     */
    async getGuildPruneCount(guildId, query, options) {
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
    async beginGuildPrune(guildId, body, reason, options) {
        return await this.request(`POST`, `/guilds/${guildId}/prune`, {
            body, reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-voice-regions)
     */
    async getGuildVoiceRegions(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/regions`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-invites)
     */
    async getGuildInvites(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/invites`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-integrations)
     */
    async getGuildIntegrations(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/integrations`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param integrationId The integration ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#delete-guild-integration)
     */
    async deleteGuildIntegration(guildId, integrationId, reason, options) {
        return await this.request(`DELETE`, `/guilds/${guildId}/integrations/${integrationId}`, {
            reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-widget-settings)
     */
    async getGuildWidgetSettings(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/widget`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-widget)
     */
    async modifyGuildWidget(guildId, body, reason, options) {
        return await this.request(`PATCH`, `/guilds/${guildId}/widget`, {
            body, reason, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-widget)
     */
    async getGuildWidget(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/widget.json`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-vanity-url)
     */
    async getGuildVanityURL(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/vanity-url`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#get-guild-welcome-screen)
     */
    async getGuildWelcomeScreen(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/welcome-screen`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen)
     */
    async modifyGuildWelcomeScreen(guildId, body, reason, options) {
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
    async modifyCurrentUserVoiceState(guildId, body, options) {
        return await this.request(`PATCH`, `/guilds/${guildId}/voice-states/@me`, {
            body, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild#modify-user-voice-state)
     */
    async modifyUserVoiceState(guildId, userId, body, options) {
        return await this.request(`PATCH`, `/guilds/${guildId}/voice-states/${userId}`, {
            body, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild-scheduled-event#list-scheduled-events-for-guild)
     */
    async listScheduledEventsForGuild(guildId, query, options) {
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
    async createGuildScheduledEvent(guildId, body, reason, options) {
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
    async getGuildScheduledEvent(guildId, eventId, query, options) {
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
    async modifyGuildScheduledEvent(guildId, eventId, body, reason, options) {
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
    async deleteGuildScheduledEvent(guildId, eventId, options) {
        return await this.request(`DELETE`, `/guilds/${guildId}/scheduled-events/${eventId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param eventId The event ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/guild-scheduled-event#get-guild-scheduled-event-users)
     */
    async getGuildScheduledEventUsers(guildId, eventId, query, options) {
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
    async getInvite(inviteCode, query, options) {
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
    async deleteInvite(inviteCode, reason, options) {
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
    async createStageInstance(body, reason, options) {
        return await this.request(`POST`, `/stage-instances`, {
            body, reason, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/stage-instance#get-stage-instance)
     */
    async getStageInstance(channelId, options) {
        return await this.request(`GET`, `/stage-instances/${channelId}`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/stage-instance#modify-stage-instance)
     */
    async modifyStageInstance(channelId, body, reason, options) {
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
    async deleteStageInstance(channelId, reason, options) {
        return await this.request(`DELETE`, `/stage-instances/${channelId}`, {
            reason, ...options
        });
    }
    /**
     * @param stickerId The sticker ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#get-sticker)
     */
    async getSticker(stickerId, options) {
        return await this.request(`GET`, `/stickers/${stickerId}`, options);
    }
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#list-nitro-sticker-packs)
     */
    async listNitroStickerPacks(options) {
        return await this.request(`GET`, `/sticker-packs`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#list-guild-stickers)
     */
    async listGuildStickers(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/stickers`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param stickerId The sticker ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#get-guild-sticker)
     */
    async getGuildSticker(guildId, stickerId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/stickers/${stickerId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/sticker#create-guild-sticker)
     */
    async createGuildSticker(guildId, body, reason, options) {
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
    async modifyGuildSticker(guildId, stickerId, body, reason, options) {
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
    async deleteGuildSticker(guildId, stickerId, reason, options) {
        return await this.request(`PATCH`, `/guilds/${guildId}/stickers/${stickerId}`, {
            reason, ...options
        });
    }
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-current-user)
     */
    async getCurrentUser(options) {
        return await this.request(`GET`, `/users/@me`, options);
    }
    /**
     * @param userId The user ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-user)
     */
    async getUser(userId, options) {
        return await this.request(`GET`, `/users/${userId}`, options);
    }
    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#modify-current-user)
     */
    async modifyCurrentUser(body, options) {
        return await this.request(`PATCH`, `/users/@me`, {
            body, ...options
        });
    }
    /**
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-current-user-guilds)
     */
    async getCurrentUserGuilds(query, options) {
        return await this.request(`GET`, `/users/@me/guilds`, {
            query, ...options
        });
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-current-user-guild-member)
     */
    async getCurrentUserGuildMember(guildId, options) {
        return await this.request(`GET`, `/user/@me/guilds/${guildId}/member`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#leave-guild)
     */
    async leaveGuild(guildId, options) {
        return await this.request(`DELETE`, `/user/@me/guilds/${guildId}`, options);
    }
    /**
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#create-dm)
     */
    async createDM(body, options) {
        return await this.request(`POST`, `/users/@me/channels`, {
            body, ...options
        });
    }
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/user#get-user-connections)
     */
    async getUserConnections(options) {
        return await this.request(`GET`, `/users/@me/connections`, options);
    }
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/voice#list-voice-regions)
     */
    async listVoiceRegions(options) {
        return await this.request(`GET`, `/voice/regions`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#create-webhook)
     */
    async createWebhook(channelId, body, reason, options) {
        return await this.request(`POST`, `/channels/${channelId}/webhooks`, {
            body, reason, ...options
        });
    }
    /**
     * @param channelId The channel ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#get-channel-webhooks)
     */
    async getChannelWebhooks(channelId, options) {
        return await this.request(`GET`, `/channels/${channelId}/webhooks`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#get-guild-webhooks)
     */
    async getGuildWebhooks(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/webhooks`, options);
    }
    /**
     * @param webhookId The webhook ID.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#get-webhook)
     */
    async getWebhook(webhookId, options) {
        return await this.request(`GET`, `/webhooks/${webhookId}`, options);
    }
    /**
     * @param webhookId The webhook ID.
     * @param token The webhook's token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#get-webhook-with-token)
     */
    async getWebhookWithToken(webhookId, token, options) {
        return await this.request(`GET`, `/webhooks/${webhookId}/${token}`, options);
    }
    /**
     * @param webhookId The webhook ID.
     * @param body Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#modify-webhook)
     */
    async modifyWebhook(webhookId, body, reason, options) {
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
    async modifyWebhookWithToken(webhookId, token, body, reason, options) {
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
    async deleteWebhook(webhookId, reason, options) {
        return await this.request(`DELETE`, `/webhooks/${webhookId}`, {
            reason, ...options
        });
    }
    /**
     * @param webhookId The webhook ID.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/webhook#delete-webhook-with-token)
     */
    async deleteWebhookWithToken(webhookId, token, reason, options) {
        return await this.request(`DELETE`, `/webhooks/${webhookId}/${token}`, {
            reason, ...options
        });
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
    async executeWebhook(webhookId, token, body, wait, threadId, options) {
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
    async getWebhookMessage(webhookId, token, messageId, threadId, options) {
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
    async editWebhookMessage(webhookId, token, messageId, body, threadId, options) {
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
    async deleteWebhookMessage(webhookId, token, messageId, threadId, options) {
        return await this.request(`DELETE`, `/webhooks/${webhookId}/${token}/messages/${messageId}`, {
            query: { thread_id: threadId },
            ...options
        });
    }
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway)
     */
    async getGateway(options) {
        return await this.request(`GET`, `/gateway`, options);
    }
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/gateway#get-gateway-bot)
     */
    async getGatewayBot(options) {
        return await this.request(`GET`, `/gateway/bot`, options);
    }
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/oauth2#get-current-bot-application-information)
     */
    async getCurrentBotApplicationInformation(options) {
        return await this.request(`GET`, `/oauth2/applications/@me`, options);
    }
    /**
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information)
     */
    async getCurrentAuthorizationInformation(options) {
        return await this.request(`GET`, `/oauth2/@me`, options);
    }
}
exports.RestRequests = RestRequests;
