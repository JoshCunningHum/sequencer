<script setup lang="ts">
import type { Project } from "../../types";
import type { VerticalNavigationLink } from "#ui/types";
import { get } from "@vueuse/core";

// Route
const route = useRoute("dashboard-id");
const param = computed(() => route.params);

// Props
const props = defineProps<{
    projects: Project[];
    selected?: number;
    disabled?: boolean;
    linked?: boolean;
}>();

// Emits
const emit = defineEmits<{
    (e: "select", p: Project, i: number): void;
}>();

// Projects Mapped
const { projects, selected, disabled, linked } = toRefs(props);
const list = useArrayMap<Project, VerticalNavigationLink>(projects, (p, i) => ({
    label: p.name,
    active: get(linked)
        ? p.id === Number(param.value.id)
        : p.id === get(selected),
    badge: i,
    icon: "i-mdi-file-document-outline",
    disabled: get(disabled),
    to: `/dashboard/${p.id}`,
    click: () => emit("select", p, i),
}));

// UI
const ui = /* ui */ {
    rounded: "",
    label: "truncate relative flex-initial text-left",
    active: "text-primary dark:text-white border-current",
    inactive:
        "border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300",
};
</script>
<template>
    <UVerticalNavigation
        :links="list"
        :ui="ui"
    >
        <template
            #badge="{
                link,
                isActive,
            }: {
                link: VerticalNavigationLink;
                isActive: boolean;
            }"
        >
            <ProjectOptions
                :project="projects[Number(link.badge)]"
                v-show="isActive"
            />
        </template>
    </UVerticalNavigation>
</template>

<style lang="scss" scoped></style>
