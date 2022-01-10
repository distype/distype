import { EventEmitter } from 'events';

type Callback<V extends any[] | any> = (...data: V extends any[] ? V : [V]) => void | any

/**
 * A typed event emitter.
 * @internal
 */
export class TypedEmitter<Events extends Record<string, any>> extends EventEmitter {
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    addListener: <K extends keyof Events>(event: symbol | K, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    public static readonly captureRejectionSymbol;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    public static captureRejections;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    public static defaultMaxListeners;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public emit: <K extends keyof Events>(event: K | symbol, ...data: Events[K] extends any[] ? Events[K] : [Events[K]]) => boolean;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    public static readonly errorMonitor;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public eventNames: <K extends keyof Events>() => Array<(K | symbol)>;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    public static getEventListeners;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public getMaxListeners: () => number;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public listenerCount: <K extends keyof Events>(event: K | symbol) => number;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    public static listenerCount;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public listeners: <K extends keyof Events>(event: K | symbol) => Array<Callback<Events[K]>>;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public off: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public on: <K extends keyof Events>(event: symbol | K, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    public static on;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public once: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    public static once;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public prependListener: <K extends keyof Events>(event: symbol | K, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public prependOnceListener: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public rawListeners: <K extends keyof Events>(event: K | symbol) => Array<Callback<Events[K]>>;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public removeAllListeners: <K extends keyof Events>(event?: K | symbol) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public removeListener: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    public setMaxListeners: (n: number) => this;
}
