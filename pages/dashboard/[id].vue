<script setup lang="ts">
// Route Details
definePageMeta({
    key: "main-sequencer",
    keepalive: true,
    middleware: ["auth", "project-access"],
});

const route = useRoute("dashboard-id");
const id = computed(() => Number(route.params.id));

// Project Info
const projectStore = useProjectsStore();
const { projects } = storeToRefs(projectStore);

// Drawio XML data to be displayed
const uiStore = useUiStore();
const { sequencer_tab } = storeToRefs(uiStore);

const xml = computed(() => {
    const project = projects.value.find((p) => p.id === id.value); // always true because of middleware
    const tab = sequencer_tab.value;
    if (!project) return "";
    return project[tab];
});
</script>

<template>
    <Fill flex-col class="py-1 pl-2">
        <DashboardToolbar />
        <KeepAlive>
            <DrawIOEmbed v-model="xml" />
        </KeepAlive>
    </Fill>
</template>

<style lang="scss" scoped></style>
