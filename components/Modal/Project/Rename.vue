<script setup lang="ts">
import { get, set } from "@vueuse/core";
import { useModalStore } from "../../../stores/modal";
import { useProjectsStore } from "../../../stores/projects";
import { type Project } from "../../../types";

// Component Arguments
const modalStore = useModalStore();

const { project_to_be_renamed: project } = storeToRefs(modalStore);
const open = computed({
    get: () => !!get(project),
    set: (value) => set(project, undefined),
});

// Define Enter Shortcut
defineShortcuts({
    enter: {
        usingInput: true,
        whenever: [open],
        handler: () => {
            rename();
        },
    },
});

// Store
const projectStore = useProjectsStore();

// Temporary State
const name = ref("");
watch(open, (v) => {
    if (!v) return;
    set(name, project.value?.name);
});

// Deleting
const isRenaming = ref(false);
const rename = async () => {
    if (!project.value) return;

    const proj = toValue(project);

    set(isRenaming, true);
    await projectStore.update(
        Object.assign(proj as Project, { name: name.value })
    );
    set(isRenaming, false);
    set(project, undefined);
};
</script>

<template>
    <UModal
        v-model="open"
        :prevent-close="isRenaming"
        v-if="!!project"
    >
        <UCard class="DMSans">
            <template #header>
                <div class="text-xl font-semibold">Rename Project?</div>
            </template>

            <UFormGroup
                label="Project Name"
                :error="!name && 'Please input a name for the project'"
            >
                <UInput v-model="name" />
            </UFormGroup>

            <div class="flex justify-end pt-4">
                <UButton
                    icon="i-mdi-edit"
                    type="submit"
                    color="red"
                    :loading="isRenaming"
                    :disabled="!name"
                    @click="rename"
                    >Rename</UButton
                >
            </div>
        </UCard>
    </UModal>
</template>

<style lang="scss" scoped></style>
