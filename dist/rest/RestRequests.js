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
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command)
     */
    async createGlobalApplicationCommand(applicationId, data, options) {
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
    async getGlobalApplicationCommand(applicationId, commandId, options) {
        return await this.request(`GET`, `/applications/${applicationId}/commands/${commandId}`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param commandId The command ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command)
     */
    async editGlobalApplicationCommand(applicationId, commandId, data, options) {
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
    async deleteGlobalApplicationCommand(applicationId, commandId, options) {
        return await this.request(`DELETE`, `/applications/${applicationId}/commands/${commandId}`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands)
     */
    async bulkOverwriteGlobalApplicationCommands(applicationId, data, options) {
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
    async getGuildApplicationCommands(applicationId, guildId, options) {
        return await this.request(`GET`, `/applications/${applicationId}/guilds/${guildId}/commands`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command)
     */
    async createGuildApplicationCommand(applicationId, guildId, data, options) {
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
    async getGuildApplicationCommand(applicationId, guildId, commandId, options) {
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
    async editGuildApplicationCommand(applicationId, guildId, commandId, data, options) {
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
    async deleteGuildApplicationCommand(applicationId, guildId, commandId, options) {
        return await this.request(`DELETE`, `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`, options);
    }
    /**
     * @param applicationId The application ID.
     * @param guildId The guild ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands)
     */
    async bulkOverwriteGuildApplicationCommands(applicationId, guildId, data, options) {
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
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions)
     */
    async editApplicationCommandPermissions(applicationId, guildId, commandId, data, options) {
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
    async batchEditApplicationCommandPermissions(applicationId, guildId, data, options) {
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
    async createInteractionResponse(interactionId, interactionToken, data, options) {
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
    async getOriginalInteractionResponse(interactionId, interactionToken, options) {
        return await this.request(`GET`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, options);
    }
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response)
     */
    async editOriginalInteractionResponse(interactionId, interactionToken, data, options) {
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
    async deleteOriginalInteractionResponse(interactionId, interactionToken, options) {
        return await this.request(`DELETE`, `/interactions/${interactionId}/${interactionToken}/messages/@original`, options);
    }
    /**
     * @param interactionId The interaction ID.
     * @param interactionToken The interaction token.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message)
     */
    async createFollowupMessage(interactionId, interactionToken, data, options) {
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
    async getFollowupMessage(interactionId, interactionToken, messageId, options) {
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
    async editFollowupMessage(interactionId, interactionToken, messageId, data, options) {
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
    async deleteFollowupMessage(interactionId, interactionToken, messageId, options) {
        return await this.request(`DELETE`, `/interactions/${interactionId}/${interactionToken}/messages/${messageId}`, options);
    }
    /**
     * @param guildId The guild ID.
     * @param params Request query.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log)
     */
    async getGuildAuditLog(guildId, params = {}, options) {
        return await this.request(`GET`, `/guilds/${guildId}/audit-logs`, {
            params, ...options
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
     * @param data Request body.
     * @param reason The value for the `X-Audit-Log-Reason` header.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#modify-channel)
     */
    async modifyChannel(channelId, data, reason, options) {
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
    async deleteChannel(channelId, reason, options) {
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
    async getChannelMessages(channelId, params = {}, options) {
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
    async getChannelMessage(channelId, messageId, options) {
        return await this.request(`GET`, `/channels/${channelId}/messages/${messageId}`, options);
    }
    /**
     * @param channelId The channel ID.
     * @param data Request body.
     * @param options Request options.
     * @see [Discord API Reference](https://discord.com/developers/docs/resources/channel#create-message)
     */
    async createMessage(channelId, data, options) {
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
