<script setup lang="ts">
import { set } from "@vueuse/core";
import type { Project } from "~/server/database/project";

const { project } = defineProps<{
    project: Project;
}>();

//#region When clicking the item
const route = useRoute("dashboard-id");
const currentProject = computed(() => Number(route.params.id));
const navigate = (p: Project) => {
    navigateTo(`/dashboard/${p.id}`);
};

//#region On right click
const emits = defineEmits<{
    (e: "context", event: MouseEvent, project: Project): void;
}>();

// On item click
const has_clicked = ref(false);
const onClick = () => {
    set(has_clicked, true);
    navigate(project);
};
const is_loading = computed(() => has_clicked.value && !route.params.id);
const left_icon = computed(() => `pi pi-${is_loading.value ? "spinner animate-spin" : "file"}`);
</script>

<template>
    <div
        class="item group"
        v-ripple
        @click="onClick"
        :class="{
            selected: currentProject === project.id,
        }"
        @contextmenu="emits('context', $event, project)"
    >
        <i :class="[left_icon]" />
        <div class="label">{{ project.name }}</div>
        <i
            class="pi pi-ellipsis-v !text-xs ml-auto px-1.5 pt-1 pb-0.5 rounded-full"
            v-if="currentProject === project.id"
            @click="emits('context', $event, project)"
        />
    </div>
</template>

<style lang="scss" scoped>
.item {
    @apply flex gap-2 max-w-64 items-center px-3 py-1.5 rounded-sm hover:bg-surface-900 cursor-pointer text-surface-400 flex-shrink-0;

    .label {
        @apply flex-shrink truncate;
    }

    &.selected {
        @apply bg-surface-800/80 hover:bg-surface-800 text-surface-200;
    }
}
</style>
