import { defineStore, acceptHMRUpdate } from "pinia";

export const useDrawioStore = defineStore("drawio", () => {
    const xml = ref<string | undefined>();

    return { xml };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useDrawioStore, import.meta.hot));
}
