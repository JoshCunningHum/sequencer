import { type UseAsyncStateOptions, promiseTimeout } from "@vueuse/core";

interface UseAsyncStateTimeoutOptions<Shallow extends boolean, D = any>
    extends UseAsyncStateOptions<Shallow, D> {
    timeout?: number;
}

export const useAsyncStateTimeout = <
    Data,
    Params extends any[] = [],
    Shallow extends boolean = true,
>(
    promise: Promise<Data> | ((...args: Params) => Promise<Data>),
    initialState: Data,
    options?: UseAsyncStateTimeoutOptions<Shallow, Data>
) => {
    const { timeout = 15000 } = options ?? {};
    const asyncstatereturn = useAsyncState(
        (...args: Params) =>
            new Promise<Data>(async (resolve, reject) => {
                const _promise =
                    typeof promise === "function" ? promise(...args) : promise;
                _promise
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                // another promise for the timeout
                promiseTimeout(timeout).then(() => reject(`Timeout`));
            }),
        initialState,
        options
    );

    return asyncstatereturn;
};
