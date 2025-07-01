"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedMap = void 0;
const node_util_1 = require("node:util");
/**
 * A Map with additional methods.
 * Similar to that of [discord.js's collection](https://github.com/discordjs/discord.js/tree/main/packages/collection)
 */
class ExtendedMap extends Map {
    // Map derived methods.
    /**
     * The number of elements in the map.
     * Derived from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size Map#size}.
     */
    get size() {
        return super.size;
    }
    /**
     * Removes all elements from the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear Map#clear()} method, however `this` is returned instead of `void`.
     * @returns The map.
     */
    clear() {
        super.clear();
        return this;
    }
    /**
     * Removes a specified element from the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete Map#delete()} method.
     * @param key The key of the element to remove.
     * @returns If the element was removed, false if it does not exist.
     */
    delete(key) {
        return super.delete(key);
    }
    /**
     * Returns a new iterator object that contains key value pairs for each element in the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries Map#entries()} method.
     * @returns The new iterator object.
     */
    entries() {
        return super.entries();
    }
    /**
     * Executes the provided function once for each element in the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach Map#forEach()} method, however `this` is returned instead of `void`.
     * @param {forEachCallback} callbackfn The function to execute for each element in the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The map.
     */
    forEach(callbackfn, thisArg) {
        super.forEach(callbackfn, thisArg);
        return this;
    }
    /**
     * Returns a specified element from the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get Map#get()} method.
     * @param key The key of the element.
     * @returns The element with the specified key, or `undefined` if no element matches the key.
     */
    get(key) {
        return super.get(key);
    }
    /**
     * Checks if the map has an element with the specified key.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has Map#has()} method.
     * @param key The key to test.
     * @returns `true` if an element is found, `false` otherwise.
     */
    has(key) {
        return super.has(key);
    }
    /**
     * Returns a new iterator object that contains keys for each element in the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys Map#keys()} method.
     * @returns The new iterator object.
     */
    keys() {
        return super.keys();
    }
    /**
     * Adds or modifies an element with the specified key.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set Map#set()} method.
     * @param key The key of the element to add / modify.
     * @param value The new value of the specified element.
     * @returns The map.
     */
    set(key, value) {
        return super.set(key, value);
    }
    /**
     * Returns a new iterator object that contains values for each element in the map.
     * Derived from the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values Map#values()} method.
     * @returns The new iterator object.
     */
    values() {
        return super.values();
    }
    // Array-like methods.
    /**
     * Returns the element of the element at an index of the map.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at Array#at()}.
     * @param index The index of the element.
     * @returns The found element, or `undefined` if no element matches the index.
     */
    at(index) {
        return [...this.values()].at(Math.round(index));
    }
    /**
     * Merges the map with one or more other maps, or a key / value pair.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array#concat()}.
     * @param maps The maps to merge.
     * @returns The merged map.
     */
    concat(...maps) {
        const newMap = this.clone();
        maps.forEach((map) => {
            if (ExtendedMap.isMap(map)) {
                map.forEach((value, key) => newMap.set(key, value));
            }
            else if (Array.isArray(map) && map.length === 2) {
                newMap.set(map[0], map[1]);
            }
            else
                throw new TypeError(`Provided value is not a Map or key / value pair`);
        });
        return newMap;
    }
    /**
     * Tests if all elements in the map satisfy a test specified in the callback.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array#every()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns `true` if all elements pass the callback test, `false` otherwise.
     */
    every(callbackfn, thisArg) {
        if (thisArg !== undefined)
            callbackfn = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
            if (!callbackfn(value, key, this))
                return false;
        }
        return true;
    }
    /**
     * Sets every element of the map to the specified value.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill Array#fill()}.
     * @param value The value to set all elements of the map to.
     * @returns The map.
     */
    fill(value) {
        this.forEach((_, key) => this.set(key, value));
        return this;
    }
    /**
     * Creates a new map with all elements that pass a test specified in the callback.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array#filter()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns A map with elements that passed the provided test.
     */
    filter(callbackfn, thisArg) {
        if (thisArg !== undefined)
            callbackfn = callbackfn.bind(thisArg);
        const newMap = new this.constructor[Symbol.species]();
        for (const [key, value] of this) {
            if (callbackfn(value, key, this))
                newMap.set(key, value);
        }
        return newMap;
    }
    /**
     * Returns the first element in the map that satisfies the provided test.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find Array#find()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The first element that satisfies the test. If no element is found, `undefined` is returned.
     */
    find(callbackfn, thisArg) {
        if (thisArg !== undefined)
            callbackfn = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
            if (callbackfn(value, key, this))
                return value;
        }
        return undefined;
    }
    /**
     * Returns the first key in the map that satisfies the provided test.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex Array#findIndex()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The first key that satisfies the test. If no element is found, `undefined` is returned.
     */
    findKey(callbackfn, thisArg) {
        if (thisArg !== undefined)
            callbackfn = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
            if (callbackfn(value, key, this))
                return key;
        }
        return undefined;
    }
    /**
     * Returns a new map created by applying a specified callback function to each element of the map, then flattening the result by 1 level.
     * Identical to `ExtendedMap#map()` followed by flattening by a depth of 1.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap Array#flatMap()}.
     * @param callbackfn A function to apply to every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The new map.
     */
    flatMap(callbackfn, thisArg) {
        const newMap = this.map(callbackfn, thisArg);
        return new this.constructor[Symbol.species]().concat(...newMap);
    }
    /**
     * Creates a string by concatenating the values of all elements of the map.
     * @param separator A string to separate values by. Defaults to `,`.
     * @returns The created strings.
     */
    join(separator = `,`) {
        return this.reduce((p, c) => `${p}${separator}${c}`, ``);
    }
    /**
     * Creates a string by concatenating the keys of all elements of the map.
     * @param separator A string to separate keys by. Defaults to `,`.
     * @returns The created strings.
     */
    joinKeys(separator = `,`) {
        return this.reduce((p, _, key) => `${p}${separator}${key}`, ``);
    }
    /**
     * Creates an array filled with the results from calling a specified callback function on each element of the map.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array#map()}.
     * @param callbackfn A function to apply to every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns The array.
     */
    map(callbackfn, thisArg) {
        if (thisArg !== undefined)
            callbackfn = callbackfn.bind(thisArg);
        const iterable = this.entries();
        return Array.from({ length: this.size }, () => {
            const [key, value] = iterable.next().value;
            return callbackfn(value, key, this);
        });
    }
    /**
     * Executes a specified reducer callback function on each element of the map to produce a single value.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array#reduce()}.
     * @param callbackfn A reducer function to apply to every element of the map.
     * @param initialValue A value to initialize `previousValue` in the callback function with.
     * @returns The result of the reducer.
     */
    reduce(callbackfn, initialValue) {
        if (!this.size && initialValue === undefined)
            throw new TypeError(`Reduce of empty map with no initial value`);
        let accumulator = initialValue ?? this.values().next().value;
        let needsInitial = initialValue === undefined;
        for (const [key, value] of this) {
            if (needsInitial) {
                needsInitial = false;
                continue;
            }
            accumulator = callbackfn(accumulator, value, key, this);
        }
        return accumulator;
    }
    /**
     * Tests if any element in the map satisfies a test specified in the callback.
     * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array#some()}.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns `true` if a single element passes the callback test, `false` otherwise.
     */
    some(callbackfn, thisArg) {
        if (thisArg !== undefined)
            callbackfn = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
            if (callbackfn(value, key, this))
                return true;
        }
        return false;
    }
    first(amount) {
        if (typeof amount !== `number`)
            return this.values().next().value;
        const values = this.values();
        return Array.from({ length: Math.min(this.size, Math.max(amount, 0)) }, () => values.next().value);
    }
    /**
     * Creates a shallow clone of the map.
     * @returns The clone of the map.
     */
    clone() {
        return new this.constructor[Symbol.species](this);
    }
    /**
     * Removes all elements in the map that satisfy a specified test.
     * @param callbackfn A function to test every element of the map.
     * @param thisArg A value to use as `this` when executing `callbackfn`.
     * @returns A map containing the removed elements.
     */
    sweep(callbackfn, thisArg) {
        const sweepedItems = new this.constructor[Symbol.species]();
        if (thisArg !== undefined)
            callbackfn = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
            if (callbackfn(value, key, this)) {
                sweepedItems.set(key, value);
                this.delete(key);
            }
        }
        return sweepedItems;
    }
    /**
     * Determines if a value is a map.
     * @param value The value to test.
     */
    static isMap(value) {
        return node_util_1.types.isMap(value);
    }
    /**
     * Determines if a value is an {@link ExtendedMap extended map}.
     * @param value The value to test.
     */
    static isExtendedMap(value) {
        return ExtendedMap.isMap(value) && value instanceof ExtendedMap;
    }
}
exports.ExtendedMap = ExtendedMap;
