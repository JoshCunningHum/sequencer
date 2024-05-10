import { type UseMemoizeReturn } from "@vueuse/core";

export default <T, U extends unknown[]>(
    memoized: UseMemoizeReturn<Promise<T>, U>,
    args: U,
    value: T
) => {
    memoized.cache.set(JSON.stringify(args), (async () => value)());
};
