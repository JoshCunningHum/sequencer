<script lang="ts" setup>
import type { Project } from "~/types";
import { useProjectsStore } from "../stores/projects";
import { set } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";

// Page metadata
const route = useRoute("dashboard-id");
const selected = computed(() => route.params.id);
definePageMeta({
    middleware: "auth",
});

// Stores
const projectStore = useProjectsStore();

// Projects
const { projects } = storeToRefs(projectStore);

// New Project Modal
const openProjectCreateModal = ref(false);
const CreateProject = () => set(openProjectCreateModal, true);

// Sync Projects
const { isReady: isFetchedProjects } = useAsyncState(
    async () => await projectStore.sync(),
    null
);

// Search a project
const search = useRouteQuery("search", "");
const projects_filtered = useArrayFilter(projects, (p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
);
</script>

<template>
    <!-- Modals -->
    <ModalProjectNew v-model="openProjectCreateModal" />
    <ModalProjectRemove />
    <ModalProjectRename />

    <Fill class="bg-primary">
        <Fill
            class="max-w-[200px]"
            flex-col
        >
            <Nav header="Dashboard" />
            <Fill>
                <Loader
                    :finished="isFetchedProjects"
                    text="Fetching"
                    class="max-w-[200px] bg-primary-emph border-r border-secondary relative"
                >
                    <Fill
                        class="max-w-[200px] DMSans border-r border-secondary"
                        flex-col
                    >
                        <SearchInput
                            class="sticky"
                            v-model="search"
                        />
                        <Fill
                            v-if="projects.length"
                            flex-col
                            class="p-1.5"
                        >
                            <ProjectList
                                linked
                                :projects="projects_filtered"
                            />
                        </Fill>
                        <Empty
                            v-else
                            no-icon
                            >Empty Projects</Empty
                        >
                        <!-- Add Project Button -->
                        <UButton
                            block
                            @click="CreateProject"
                            size="md"
                            class="rounded-none"
                            icon="i-mdi-plus"
                            >New Project</UButton
                        >
                    </Fill>
                </Loader>
            </Fill>
        </Fill>

        <Fill center>
            <!-- Loading State -->
            <Loading
                v-if="!isFetchedProjects"
                no-text
            />
            <!-- Create a Project Card -->
            <div
                class="flex flex-col gap-2"
                v-else-if="!projects.length"
            >
                <Empty>You have no projects yet</Empty>
                <UButton
                    block
                    @click="CreateProject"
                    size="xs"
                    icon="i-mdi-plus"
                    >Create New Project</UButton
                >
            </div>
            <!-- Create a Project Card -->
            <div
                class="flex flex-col gap-2"
                v-else-if="!selected"
            >
                <Empty icon="i-mdi-file-document-multiple-outline"
                    >Select a project</Empty
                >
            </div>
            <NuxtPage v-else />
        </Fill>

        <!--
            <StepNav
                orientation="vertical"
                :disabled="disable_menu"
                v-model="step"
                :steps="steps"
            />
             <UDivider orientation="vertical" />
            <StepNav
                :disabled="disable_menu"
                v-if="step === 0"
                v-model="diag"
                :steps="['Class', 'Use Case']"
            />
            <UDivider orientation="vertical" />
            <ForcedPreloader
                v-slot="{ done }"
                :show="step === 0"
                @started="disable_menu = true"
                @loaded="disable_menu = false"
            >
                <DrawIOEmbed
                    @loaded="done"
                    v-show="step === 0"
                    v-model="xmldata"
                />
            </ForcedPreloader> -->
    </Fill>
</template>

<style lang="scss" scoped></style>
