import { defineStore, acceptHMRUpdate } from "pinia";

export const useUserStore = defineStore("user", () => {
    const headers = useRequestHeaders(["cookie"]) as HeadersInit;
    const { state: user, execute: sync } = useAsyncState(
        $fetch("/api/me", {
            lazy: true,
            headers,
            immediate: false,
        }),
        undefined,
        { shallow: false },
    );

    return {
        user,
        sync,
    };
});
