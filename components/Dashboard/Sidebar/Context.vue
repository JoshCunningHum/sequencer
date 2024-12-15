<script setup lang="ts">
import { set } from "@vueuse/core";
import type ContextMenu from "primevue/contextmenu";
import type { MenuItem } from "primevue/menuitem";
import { type Project } from "~/server/database/project";
import * as yup from "yup";

//#region Target project
const project = ref<Project>();

//#region Context menu showing up
const menu = useTemplateRef<InstanceType<typeof ContextMenu>>("menu");
const show = (event: MouseEvent, p: Project) => {
    menu.value?.show(event);
    set(project, p);
};
defineExpose({ show });

// Menu items
const { remove, update } = useProjectsStore();
const { ask } = useQuery();
const items = computed<MenuItem[]>(() => [
    {
        label: "Rename",
        icon: "pi pi-pencil",
        command: () =>
            ask({
                title: "Rename project",
                approveText: "Rename",
                joinLabels: true,
                schema: yup.object({
                    name: yup
                        .string()
                        .required("Please input a project name")
                        .label("Project name"),
                }),
                then: async (data) => {
                    const p = project.value;
                    if (!p) return;
                    await update({ ...p, name: data.name });
                },
            }),
    },
    {
        label: "Delete",
        icon: "pi pi-trash",
        command: () =>
            ask({
                title: "Delete project?",
                approveText: "Delete",
                description: `Are you sure you want to delete ${project.value?.name}?`,
                then: async (data) => {
                    await remove(project.value!);
                    navigateTo("/dashboard");
                },
            }),
    },
]);
</script>

<template>
    <ContextMenu :model="items" ref="menu" />
</template>

<style lang="scss" scoped></style>
