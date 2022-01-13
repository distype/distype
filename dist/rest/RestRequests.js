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
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#batch-edit-application-command-permissions)
     */
    async batchEditApplicationCommandPermissions(applicationId, guildId, body, options) {
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
    async createInteractionResponse(interactionId, interactionToken, body, options) {
        return await this.request(`POST`, `/interactions/${interactionId}/${interactionToken}/callback`, {
            body, ...options
        });
    }
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response)
     */
    async getOriginalInteractionResponse(interactionId, interactionToken, options) {
        return await this.request(`GET`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, options);
    }
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    async editOriginalInteractionResponse(interactionId, interactionToken, body, options) {
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
    async deleteOriginalInteractionResponse(interactionId, interactionToken, options) {
        return await this.request(`DELETE`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, options);
    }
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param body Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    async createFollowupMessage(interactionId, interactionToken, body, options) {
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
    async getFollowupMessage(interactionId, interactionToken, messageId, options) {
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
    async editFollowupMessage(interactionId, interactionToken, messageId, body, options) {
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
    async deleteFollowupMessage(interactionId, interactionToken, messageId, options) {
        return await this.request(`DELETE`, `/interactions/${interactionId}/${interactionToken}/messages/${messageId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param query Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)
     */
    async getGuildAuditLog(guildId, query = {}, options) {
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
    async getChannelMessages(channelId, query = {}, options) {
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
     * @param guildId The guild ID.
     * @param options Request options.
     */
    async getGuild(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param userId The user ID.
     * @param options Request options.
     */
    async getGuildMember(guildId, userId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/members/${userId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param options Request options.
     */
    async getGuildRoles(guildId, options) {
        return await this.request(`GET`, `/guilds/${guildId}/roles`, options);
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
    // --------------------
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
}
exports.RestRequests = RestRequests;
