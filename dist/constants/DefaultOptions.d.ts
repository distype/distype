/**
 * Default options.
 * @internal
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
    readonly LOGGER: {
        readonly disableInternal: false;
        readonly enabledOutput: {};
        readonly format: {};
        readonly showTime: true;
    };
    readonly REST: {
        readonly code500retries: 2;
        readonly ratelimits: {
            readonly globalPerSecond: 50;
            readonly pause: 10;
            readonly sweepInterval: 300000;
        };
        readonly version: 9;
    };
};
