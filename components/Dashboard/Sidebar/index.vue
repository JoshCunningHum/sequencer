<script setup lang="ts">
import { set } from "@vueuse/core";
import type { Project } from "~/server/database/project";
import ContextMenu from "./Context.vue";

const projectStore = useProjectsStore();
const { projects, isFetching } = storeToRefs(projectStore);

const search = ref("");
const filtered_projects = useArrayFilter(projects, (p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
);

//#region Project navigation
const route = useRoute("dashboard-id");
const currentProject = computed(() => Number(route.params.id));

const navigate = (p: Project) => {
    navigateTo(`/dashboard/${p.id}`);
};

//#region Minization
const mounted = ref(false);
const uiStore = useUiStore();
const { minimized_sidebar } = storeToRefs(uiStore);
const container = useTemplateRef<HTMLDivElement>("container");
const { width } = useElementSize(container);
onMounted(() => set(mounted, true));

//#region Context menu
const contextmenu = ref<InstanceType<typeof ContextMenu>>();
const showContextMenu = (event: MouseEvent, project: Project) =>
    contextmenu.value?.show(event, project);
</script>

<template>
    <div v-if="mounted" class="wrapper" :class="{ minimized: minimized_sidebar }">
        <Fill class="pl-2 py-2 flex flex-col min-w-[225px]" ref="container">
            <IconField class="mb-2">
                <InputIcon class="pi pi-search" />
                <InputText placeholder="Search projects..." class="!pl-9 w-full" v-model="search" />
            </IconField>
            <Loader :finished="!isFetching">
                <Fill v-if="projects.length" overflow-scroll-y flex-col class="gap-1">
                    <DashboardSidebarItem
                        v-for="project in filtered_projects"
                        :key="project.id"
                        :project
                        @context="showContextMenu"
                    />
                    <DashboardSidebarContext ref="contextmenu" />
                </Fill>
                <Empty v-if="projects?.length === 0" text="No projects" class="text-surface-400" />
            </Loader>
            <DashboardAddProject />
        </Fill>
    </div>
    <div v-else class="flex flex-col gap-2 min-w-[225px] pl-2 py-2">
        <Skeleton class="mb-2" height="30px" />
        <Skeleton height="25px" />
        <Skeleton height="25px" />
        <Skeleton height="30px" class="mt-auto" />
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    @apply overflow-hidden transition-all;

    max-width: v-bind('(width || 9999) + 20 + "px"');

    &.minimized {
        max-width: 0px;
    }
}
</style>
