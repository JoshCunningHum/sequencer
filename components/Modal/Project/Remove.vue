<script setup lang="ts">
import { get, set } from "@vueuse/core";
import { useModalStore } from "../../../stores/modal";
import { useProjectsStore } from "../../../stores/projects";

// Routing
const router = useRouter();

// Component Arguments
const modalStore = useModalStore();

const { project_to_be_deleted: project } = storeToRefs(modalStore);
const open = computed({
    get: () => !!get(project),
    set: (value) => set(project, undefined),
});

// Store
const projectStore = useProjectsStore();

// Deleting
const isDeleting = ref(false);
const remove = async () => {
    if (!project.value) return;

    set(isDeleting, true);
    await projectStore.remove(project.value.id);
    set(isDeleting, false);
    set(project, undefined);

    // Reroute to dashboard
    router.push("/dashboard");
};
</script>

<template>
    <UModal
        v-model="open"
        :prevent-close="isDeleting"
        v-if="!!project"
    >
        <UCard class="DMSans">
            <template #header>
                <div class="text-xl font-semibold">Delete Project?</div>
            </template>

            <div>
                Are you sure you want to delete project
                <UKbd
                    class="inline text-sm font-normal px-1 py-0.5 break-keep"
                    >{{ project.name }}</UKbd
                >?
            </div>
            <div class="flex justify-end pt-4">
                <UButton
                    icon="i-mdi-delete"
                    type="submit"
                    color="red"
                    :loading="isDeleting"
                    @click="remove"
                    >Delete</UButton
                >
            </div>
        </UCard>
    </UModal>
</template>

<style lang="scss" scoped></style>
