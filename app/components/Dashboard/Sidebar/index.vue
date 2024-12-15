<script setup lang="ts">
import { set } from "@vueuse/core";
import type { Project } from "~~/server/database/project";
import ContextMenu from "./Context.vue";

const projectStore = useProjectsStore();
const { projects, isFetching } = storeToRefs(projectStore);

const search = ref("");
const filtered_projects = useArrayFilter(projects, (p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase()),
);

//#region Minization
const mounted = ref(false);
const uiStore = useUiStore();
const { minimized_sidebar } = storeToRefs(uiStore);
onMounted(() => set(mounted, true));

//#region Context menu
const contextmenu = ref<InstanceType<typeof ContextMenu>>();
const showContextMenu = (event: MouseEvent, project: Project) =>
    contextmenu.value?.show(event, project);
</script>

<template>
    <div
        v-if="mounted"
        class="wrapper"
        :class="{ minimized: minimized_sidebar }"
    >
        <Fill class="flex w-full flex-col px-2 py-2">
            <IconField class="mb-2">
                <InputIcon class="pi pi-search" />
                <InputText
                    placeholder="Search projects..."
                    class="w-full !pl-9"
                    v-model="search"
                />
            </IconField>
            <Loader :finished="!isFetching">
                <Fill
                    v-if="projects.length"
                    overflow-scroll-y
                    flex-col
                    class="gap-1"
                >
                    <DashboardSidebarItem
                        v-for="project in filtered_projects"
                        :key="project.id"
                        :project
                        @context="showContextMenu"
                    />
                    <DashboardSidebarContext ref="contextmenu" />
                </Fill>
                <Empty
                    v-if="projects?.length === 0"
                    text="No projects"
                    class="text-surface-400"
                />
            </Loader>
            <DashboardAddProject />
        </Fill>
    </div>
    <div v-else class="flex flex-col gap-2 py-2 pl-2">
        <Skeleton class="mb-2" height="30px" />
        <Skeleton height="25px" />
        <Skeleton height="25px" />
        <Skeleton height="30px" class="mt-auto" />
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    @apply overflow-hidden transition-all;

    max-width: 225px;

    &.minimized {
        max-width: 0px;
    }
}
</style>
