/**
 * Default options.
 */
export declare const DefaultOptions: {
    readonly CACHE: {
        readonly cacheControl: {};
        readonly cacheEventHandler: (cache: import("..").Cache, data: import("discord-api-types").GatewayDispatchPayload) => void;
    };
    readonly GATEWAY: {
        readonly largeGuildThreshold: undefined;
        readonly presence: undefined;
        readonly sharding: {};
        readonly spawnAttemptDelay: 2500;
        readonly spawnMaxAttempts: 10;
        readonly spawnTimeout: 30000;
        readonly version: 9;
        readonly wsOptions: undefined;
    };
    readonly REST: {
        readonly version: 9;
    };
};
