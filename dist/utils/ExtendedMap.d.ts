/**
 * @internal
 */
interface ExtendedMapConstructor {
    new (): ExtendedMap<unknown, unknown>;
    new <K, V>(iterable: Iterable<readonly [K, V]>): ExtendedMap<K, V>;
    new <K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): ExtendedMap<K, V>;
    readonly prototype: ExtendedMap<unknown, unknown>;
    readonly [Symbol.species]: ExtendedMapConstructor;
}
export interface ExtendedMap<K, V> extends Map<K, V> {
    constructor: ExtendedMapConstructor;
}
/**
 * A Map with additional methods.
 * Similar to that of [discord.js's collection](https://github.com/discordjs/discord.js/tree/main/packages/collection)
 */
export declare class ExtendedMap<K, V> extends Map<K, V> {
    /**
     * The number of elements in the map.
     * Derived from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size Map#size}.
     */
    get size(): number;
    /**
     * Removes all elements from the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear Map#clear()} method, however `this` is returned instead of `void`.
     * @returns The map.
     */
    clear(): this;
    /**
     * Removes a specified element from the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete Map#delete()} method.
     * @param key The key of the element to remove.
     * @returns If the element was removed, false if it does not exist.
     */
    delete(key: K): boolean;
    /**
     * Returns a new iterator object that contains key value pairs for each element in the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries Map#entries()} method.
     * @returns The new iterator object.
     */
    entries(): MapIterator<[K, V]>;
    /**
     * Executes the provided function once for each element in the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach Map#forEach()} method, however `this` is returned instead of `void`.
     * @param {forEachCallback} callbackfn The function to execute for each element in the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The map.
     */
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): this;
    /**
     * Returns a specified element from the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get Map#get()} method.
     * @param key The key of the element.
     * @returns The element with the specified key, or `undefined` if no element matches the key.
     */
    get(key: K): V | undefined;
    /**
     * Checks if the map has an element with the specified key.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has Map#has()} method.
     * @param key The key to test.
     * @returns `true` if an element is found, `false` otherwise.
     */
    has(key: K): boolean;
    /**
     * Returns a new iterator object that contains keys for each element in the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys Map#keys()} method.
     * @returns The new iterator object.
     */
    keys(): MapIterator<K>;
    /**
     * Adds or modifies an element with the specified key.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set Map#set()} method.
     * @param key The key of the element to add / modify.
     * @param value The new value of the specified element.
     * @returns The map.
     */
    set(key: K, value: V): this;
    /**
     * Returns a new iterator object that contains values for each element in the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values Map#values()} method.
     * @returns The new iterator object.
     */
    values(): MapIterator<V>;
    /**
     * Returns the element of the element at an index of the map.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at Array#at()}.
     * @param index The index of the element.
     * @returns The found element, or `undefined` if no element matches the index.
     */
    at(index: number): V | undefined;
    /**
     * Merges the map with one or more other maps, or a key / value pair.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array#concat()}.
     * @param maps The maps to merge.
     * @returns The merged map.
     */
    concat(...maps: Array<Map<K, V> | [K, V]>): ExtendedMap<K, V>;
    /**
     * Tests if all elements in the map satisfy a test specified in the callback.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array#every()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns `true` if all elements pass the callback test, `false` otherwise.
     */
    every(callbackfn: (value: V, key: K, map: this) => boolean, thisArg?: any): boolean;
    /**
     * Sets every element of the map to the specified value.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill Array#fill()}.
     * @param value The value to set all elements of the map to.
     * @returns The map.
     */
    fill(value: V): this;
    /**
     * Creates a new map with all elements that pass a test specified in the callback.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array#filter()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns A map with elements that passed the provided test.
     */
    filter(callbackfn: (value: V, key: K, map: this) => boolean, thisArg?: any): ExtendedMap<K, V>;
    /**
     * Returns the first element in the map that satisfies the provided test.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find Array#find()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The first element that satisfies the test. If no element is found, `undefined` is returned.
     */
    find(callbackfn: (value: V, key: K, map: this) => boolean, thisArg?: any): V | undefined;
    /**
     * Returns the first key in the map that satisfies the provided test.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex Array#findIndex()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The first key that satisfies the test. If no element is found, `undefined` is returned.
     */
    findKey(callbackfn: (value: V, key: K, map: this) => boolean, thisArg?: any): K | undefined;
    /**
     * Returns a new map created by applying a specified callback function to each element of the map, then flattening the result by 1 level.
     * Identical to `ExtendedMap#map()` followed by flattening by a depth of 1.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap Array#flatMap()}.
     * @param callbackfn A function to apply to every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The new map.
     */
    flatMap<T>(callbackfn: (value: V, key: K, map: this) => ExtendedMap<K, T>, thisArg?: any): ExtendedMap<K, T>;
    /**
     * Creates a string by concatenating the values of all elements of the map.
     * @param separator A string to separate values by. Defaults to `,`.
     * @returns The created strings.
     */
    join(separator?: string): string;
    /**
     * Creates a string by concatenating the keys of all elements of the map.
     * @param separator A string to separate keys by. Defaults to `,`.
     * @returns The created strings.
     */
    joinKeys(separator?: string): string;
    /**
     * Creates an array filled with the results from calling a specified callback function on each element of the map.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array#map()}.
     * @param callbackfn A function to apply to every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The array.
     */
    map<T>(callbackfn: (value: V, key: K, map: this) => T, thisArg?: any): T[];
    /**
     * Executes a specified reducer callback function on each element of the map to produce a single value.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array#reduce()}.
     * @param callbackfn A reducer function to apply to every element of the map.
     * @param initialValue A value to initialize `previousValue` in the callback function with.
     * @returns The result of the reducer.
     */
    reduce<T>(callbackfn: (previousValue: T, currentValue: V, currentIndex: K, map: this) => T, initialValue?: T): T;
    /**
     * Tests if any element in the map satisfies a test specified in the callback.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array#some()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns `true` if a single element passes the callback test, `false` otherwise.
     */
    some(callbackfn: (value: V, key: K, map: this) => boolean, thisArg?: any): boolean;
    /**
     * Returns the first value(s) of the map.
     * @param amount The number of items to retrieve from the start of the map.
     * @returns The first value if no amount is specified, else an array of the first values.
     */
    first(): V | undefined;
    first(amount: number): V[];
    /**
     * Creates a shallow clone of the map.
     * @returns The clone of the map.
     */
    clone(): ExtendedMap<K, V>;
    /**
     * Removes all elements in the map that satisfy a specified test.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns A map containing the removed elements.
     */
    sweep(callbackfn: (value: V, key: K, map: this) => boolean, thisArg?: any): ExtendedMap<K, V>;
    /**
     * Determines if a value is a map.
     * @param value The value to test.
     */
    static isMap(value: any): value is Map<any, any>;
    /**
     * Determines if a value is an {@link ExtendedMap extended map}.
     * @param value The value to test.
     */
    static isExtendedMap(value: any): value is ExtendedMap<any, any>;
}
export {};
