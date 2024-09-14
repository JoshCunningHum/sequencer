import { acceptHMRUpdate, defineStore } from "pinia";
import type { Project } from "~/server/database/project";

export const useProjectsStore = defineStore("projects", () => {
    const { user } = useUser();

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

    const remove = async (project: Pick<Project, "id">) => {
        const user_id = user.value?.id || -1;
        const res = await $fetch(`/api/projects/${project.id}/remove`, {
            body: { user_id },
            method: "POST",
        });
        // Manually remove the project object in the client (to save bandwidth)
        const index = projects.value.findIndex((p) => p.id === project.id);
        if (index !== -1) projects.value.splice(index, 1);
        return res;
    };

    const update = async ({ id, by, ...rest }: Partial<Project> & { id: number }) => {
        const user_id = user.value?.id || -1;
        const res = await $fetch(`/api/projects/${id}/update`, {
            body: { user_id, ...rest },
            method: "POST",
        });

        // Manually update the project in the store (to save bandwidth)
        const index = projects.value.findIndex((p) => p.id === id);
        if (index !== -1) Object.assign(projects.value[index]!, rest);
        return res;
    };

    return { projects, isFetching, sync, remove, update };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot));
}
