import { Rest, RestOptions } from './Rest';

/**
 * Completes specified options for the rest manager.
 * @param options Specified options for the manager.
 * @returns Complete options.
 */
export const completeRestOptions = (options: RestOptions): Rest[`options`] => ({
    version: 9,
    ...options
});
