import { defineStore, acceptHMRUpdate } from "pinia";

export type SequencerXMLTypes = "class" | "usecase" | "sequence";
export type SidebarViews = "generate" | "info";

export const useUiStore = defineStore("ui", () => {
    const minimized_sidebar = ref(false);

    const diagram = ref<SequencerXMLTypes>("class");
    const sidebar_tab = ref<SidebarViews>();

    return {
        minimized_sidebar,
        diagram,
        sidebar_tab,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot));
}
