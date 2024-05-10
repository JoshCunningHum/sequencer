import { defineStore } from "pinia";
import { type Project } from "~/types";
import { ProjectController } from "~/controllers/ProjectControl";

export const useProjectsStore = defineStore("Projects", () => {
    const user = useSupabaseUser();
    const userID = computed(() => user.value?.id || "");

    const projects = reactive<Project[]>([]);

    const syncMemo = useMemoize(
        async (userID: string) => await ProjectController.sync()
    );

    const sync = async () => {
        const data = await syncMemo(userID.value);
        projects.splice(0);
        projects.push(...data);
    };

    const add = async (name: string, dclass?: string, dusecase?: string) => {
        const data = await ProjectController.add(name, dclass, dusecase);
        if (!user.value) return;

        // instead of syncing again, just update the project list
        projects.push(data);

        console.log(syncMemo.cache);

        // Update the cache
        asyncCacheSet(syncMemo, [userID.value], projects.slice());

        console.log(syncMemo.cache);
    };

    const remove = async (id: number) => {
        await ProjectController.remove(id);
        // find the id in the project list
        const index = projects.findIndex((p) => p.id === id);
        if (index === -1) return;

        projects.splice(index, 1);

        // Update the cache
        asyncCacheSet(syncMemo, [userID.value], projects.slice());
    };

    const update = async (proj: Project) => {
        await ProjectController.update(proj);
        // find the id then update
        const index = projects.findIndex((p) => p.id === proj.id);
        if (index === -1) return;

        projects.splice(index, 1, proj);

        // Update the cache
        asyncCacheSet(syncMemo, [userID.value], projects.slice());
    };

    return {
        projects,
        sync,
        add,
        remove,
        update,
    };
});
