import { defineStore } from "pinia";

export const useDevStore = defineStore("Dev", () => {
    const enabled = ref(true);

    return {
        enabled,
    };
});
