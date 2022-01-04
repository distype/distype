/// <reference types="node" />
import { EventEmitter } from 'events';
declare type Callback<V extends any[] | any> = (...data: V extends any[] ? V : [V]) => void | any;
/**
 * A typed event emitter.
 */
export declare class TypedEmitter<Events extends Record<string, any>> extends EventEmitter {
    /**
     * @hidden
     */
    addListener: <K extends keyof Events>(event: symbol | K, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    static readonly captureRejectionSymbol: any;
    /**
     * @hidden
     */
    static captureRejections: any;
    /**
     * @hidden
     */
    static defaultMaxListeners: any;
    /**
     * @hidden
     */
    emit: <K extends keyof Events>(event: K | symbol, ...data: Events[K] extends any[] ? Events[K] : [Events[K]]) => boolean;
    /**
     * @hidden
     */
    static readonly errorMonitor: any;
    /**
     * @hidden
     */
    eventNames: <K extends keyof Events>() => Array<(K | symbol)>;
    /**
     * @hidden
     */
    static getEventListeners: any;
    /**
     * @hidden
     */
    getMaxListeners: () => number;
    /**
     * @hidden
     */
    listenerCount: <K extends keyof Events>(event: K | symbol) => number;
    /**
     * @hidden
     */
    static listenerCount: any;
    /**
     * @hidden
     */
    listeners: <K extends keyof Events>(event: K | symbol) => Array<Callback<Events[K]>>;
    /**
     * @hidden
     */
    off: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    on: <K extends keyof Events>(event: symbol | K, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    static on: any;
    /**
     * @hidden
     */
    once: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    static once: any;
    /**
     * @hidden
     */
    prependListener: <K extends keyof Events>(event: symbol | K, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    prependOnceListener: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    rawListeners: <K extends keyof Events>(event: K | symbol) => Array<Callback<Events[K]>>;
    /**
     * @hidden
     */
    removeAllListeners: <K extends keyof Events>(event?: K | symbol) => this;
    /**
     * @hidden
     */
    removeListener: <K extends keyof Events>(event: K | symbol, listener?: Callback<Events[K]>) => this;
    /**
     * @hidden
     */
    setMaxListeners: (n: number) => this;
}
export {};
