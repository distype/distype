"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
const DiscordConstants_1 = require("../utils/DiscordConstants");
const DistypeConstants_1 = require("../utils/DistypeConstants");
const RestRequests_1 = require("./RestRequests");
const undici_1 = require("undici");
const form_data_1 = __importDefault(require("form-data"));
const url_1 = require("url");
/**
 * The rest manager.
 * Used for making rest requests to the Discord API.
 */
class Rest extends RestRequests_1.RestRequests {
    /**
     * Create a rest manager.
     * @param token The bot's token.
     * @param options Rest options.
     */
    constructor(token, options) {
        super();
        if (typeof token !== `string`)
            throw new TypeError(`A bot token must be specified`);
        Object.defineProperty(this, `_token`, {
            configurable: false,
            enumerable: false,
            value: token,
            writable: false
        });
        Object.defineProperty(this, `options`, {
            configurable: false,
            enumerable: true,
            value: Object.freeze(options),
            writable: false
        });
    }
    async request(method, route, options) {
        return await (await this._make(method, route, options)).body;
    }
    async _make(method, route, options = {}) {
        const usingFormData = options.body instanceof form_data_1.default;
        const headers = {
            ...options.headers,
            ...(usingFormData ? options.body.getHeaders() : undefined),
            'Authorization': `Bot ${this._token}`,
            'User-Agent': `DiscordBot (${DistypeConstants_1.DistypeConstants.URL}, v${DistypeConstants_1.DistypeConstants.VERSION})`
        };
        if (!usingFormData && options.body)
            headers[`Content-Type`] = `application/json`;
        if (options.reason)
            headers[`X-Audit-Log-Reason`] = options.reason;
        const url = new url_1.URL(`${DiscordConstants_1.DiscordConstants.BASE_URL}/v${options.version ?? this.options.version}${route.at(0) === `/` ? `` : `/`}${route}`);
        url.search = new url_1.URLSearchParams(options.query).toString();
        const req = (0, undici_1.request)(url, {
            ...this.options,
            ...options,
            method,
            headers,
            body: usingFormData ? undefined : JSON.stringify(options.body),
            bodyTimeout: options.timeout ?? this.options.timeout
        });
        if (usingFormData)
            options.body.pipe(req);
        const res = await req;
        return {
            ...res,
            body: await res.body.json()
        };
    }
}
exports.Rest = Rest;
