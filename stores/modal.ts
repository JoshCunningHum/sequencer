import { defineStore } from "pinia";
import { type Project } from "~/types";

export const useModalStore = defineStore("Modal", () => {
    // Projects
    const project_to_be_renamed = ref<Project>(); // To be deleted
    const project_to_be_deleted = ref<Project>(); // To be renamed

    return {
        project_to_be_deleted,
        project_to_be_renamed,
    };
});
