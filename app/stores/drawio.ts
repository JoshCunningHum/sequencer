import { defineStore } from "pinia";

export const useDrawioStore = defineStore("drawio", () => {
    const xml = ref<string | undefined>();

    return { xml };
});
