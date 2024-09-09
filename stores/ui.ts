import { defineStore, acceptHMRUpdate } from "pinia";

export type SequencerXMLTypes = "class" | "usecase" | "sequence";

export const useUiStore = defineStore("ui", () => {
    const minimized_sidebar = ref(false);
    const sequencer_tab = ref<SequencerXMLTypes>("class");

    return {
        minimized_sidebar,
        sequencer_tab,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot));
}
