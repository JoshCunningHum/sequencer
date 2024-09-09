import { acceptHMRUpdate, defineStore } from "pinia";

export const useProjectsStore = defineStore("projects", () => {
    const headers = useRequestHeaders(["cookie"]) as HeadersInit;
    const { data: user } = useFetch("/api/me", { lazy: true, headers });

    const {
        state: projects,
        isLoading: isFetching,
        execute: sync,
    } = useAsyncState(
        async () => {
            const id = user.value?.id;
            if (!id) return [];
            return await $fetch("/api/projects", { body: { id }, method: "POST" });
        },
        [],
        { shallow: false }
    );

    return { projects, isFetching, sync };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot));
}
