import { EventEmitter } from 'events';

type Callback<V extends any[]|any> = (...data: V extends any[] ? V : [V]) => void | any

/**
 * A typed event emitter.
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
    static readonly captureRejectionSymbol;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    static captureRejections;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    static defaultMaxListeners;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    emit: <K extends keyof Events>(event: K | symbol, ...data: Events[K] extends any[] ? Events[K] : [Events[K]]) => boolean;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    static readonly errorMonitor;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    eventNames: <K extends keyof Events>() => Array<(K | symbol)>;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    static getEventListeners;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    getMaxListeners: () => number;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    listenerCount: <K extends keyof Events>(event: K | symbol) => number;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    static listenerCount;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    listeners: <K extends keyof Events>(event: K | symbol) => Array<Callback<Events[K]>>;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    off: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    on: <K extends keyof Events>(event: symbol | K, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    static on;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    once: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 4144 7008
    static once;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    prependListener: <K extends keyof Events>(event: symbol | K, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    prependOnceListener: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    rawListeners: <K extends keyof Events>(event: K | symbol) => Array<Callback<Events[K]>>;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    removeAllListeners: <K extends keyof Events>(event?: K | symbol) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    removeListener: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    // @ts-expect-error 2564 4144
    setMaxListeners: (n: number) => this;
}
