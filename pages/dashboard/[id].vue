<script setup lang="ts">
import { useRoute } from "../../.nuxt/typed-router/__useTypedRoute";
import { useProjectsStore } from "../../stores/projects";
import { type Project } from "../../types";
import {
    class_default,
    usecase_default,
} from "../../components/DrawIOEmbed.vue";
import { get, set } from "@vueuse/core";
import { useRouteParams } from "@vueuse/router";
import { useDevStore } from "../../stores/dev";

// Dev Mode
const devStore = useDevStore();
const { enabled: devMode } = storeToRefs(devStore);

// Routing
const router = useRouter();
const route = useRoute("dashboard-id");
const id = computed(() => route.params.id);

// Project Object
const projectStore = useProjectsStore();
const { projects } = storeToRefs(projectStore);
const project = useArrayFind<Project>(
    projects,
    (p) => p.id.toString() === id.value
);

// Synchronize (for copy pasting link directly on this route)
const { isLoading } = useAsyncState(async () => {
    await projectStore.sync();
    // Check if the current id is indeed in the list of projects
    const projs = projects.value;
    // Redirect to dashboard if not found
    if (!projs.some((p) => p.id === Number(id.value)))
        router.push("/dashboard");
}, undefined);

// Steps
const _steps = ["Diagrams", "Confirmation", "Generate"];
const steps = computed(() =>
    _steps.filter((_) => devMode.value || _ !== "Confirmation")
);
const diagrams = ["Class Diagram", "Use Case Diagram"];

const step = ref(0);
const diagram = ref(diagrams[0]);

// Preloading DRAWIO Iframe
const disable_menu = ref(false);

// XML and saving
const isSaving = ref(false);

const xml = computed<string>({
    get: () => {
        const diag = get(diagram);
        if (diag === diagrams[0]) return project.value?.class || class_default;
        return project.value?.usecase || usecase_default;
    },
    set: (xml: string) => {
        if (get(isSaving)) return;
        set(isSaving, true);

        const diag = get(diagram);

        const proj = Object.assign({}, project.value);

        if (diag === diagrams[0]) proj.class = xml;
        else proj.usecase = xml;

        projectStore.update(proj).then(() => {
            set(isSaving, false);
        });
    },
});
</script>

<template>
    <Fill center>
        <Loading v-if="isLoading" />
        <Fill
            no-grow
            flex-col
            v-if="!!project"
        >
            <!-- Header -->
            <div
                class="border-secondary border-b p-2 flex justify-between items-center"
            >
                <StepNav
                    :steps="steps"
                    v-model="step"
                    orientation="horizontal"
                    class="w-fit"
                >
                    <template #item="{ index, step: s, click }">
                        <UButtonGroup
                            v-if="index === 0"
                            class="z-10"
                            @click="click()"
                            :ui="{ rounded: 'rounded-sm' }"
                        >
                            <UButton
                                class="rounded-sm"
                                :color="step === index ? 'primary' : 'gray'"
                                >{{ s }}</UButton
                            >
                            <USelectMenu
                                :ui="{}"
                                :options="diagrams"
                                v-model="diagram"
                            />
                        </UButtonGroup>
                        <UChip
                            v-else
                            :show="s === 'Confirmation'"
                            class="z-10"
                            size="lg"
                            inset
                            color="red"
                            text="DEV"
                        >
                            <UButton
                                @click="click()"
                                :color="step === index ? 'primary' : 'gray'"
                                >{{ s }}</UButton
                            >
                        </UChip>
                    </template>
                </StepNav>

                <DevToggle />
            </div>

            <!--Body -->
            <ForcedPreloader
                v-slot="{ done }"
                :show="step === 0"
                @started="disable_menu = true"
                @loaded="disable_menu = false"
            >
                <DrawIOEmbed
                    @loaded="done"
                    v-model="xml"
                    :saving="isSaving"
                    v-show="step === 0"
                />
            </ForcedPreloader>
        </Fill>
    </Fill>
</template>

<style lang="scss" scoped></style>
