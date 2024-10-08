<script setup lang="ts">
// Route Details
definePageMeta({
    key: "main-sequencer",
    keepalive: true,
    middleware: ["auth", "project-access"],
});

const route = useRoute("dashboard-id");
const id = computed(() => Number(route.params.id));

// Drawio XML data to be displayed
const drawIOStore = useDrawioStore();
const { xml: prioxml } = storeToRefs(drawIOStore);

const uiStore = useUiStore();
const { diagram } = storeToRefs(uiStore);

const generationStore = useGenerationStore();
const { project } = storeToRefs(generationStore);
const update = generationStore.update;

const xml = computed(() => {
    if (diagram.value === "sequence") return prioxml.value || project.value?.sequence || "";
    return project.value?.[diagram.value] || "";
});

// Handle savings
const { isLoading: isSaving, execute: save } = useAsyncState(update, false, { immediate: false });
const onSave = (data: string) => {
    const p = project.value;
    const tab = diagram.value;
    if (!p) return;

    p[tab] = data;
    save();
};
</script>

<template>
    <Fill flex-col class="py-1 pl-2" :overflow-scroll-y="false">
        <DashboardToolbar />
        <Fill :overflow-scroll-y="false">
            <KeepAlive>
                <DrawIOEmbed :saving="isSaving" :model-value="xml" @save="onSave" />
            </KeepAlive>
            <SequenceSection />
        </Fill>
    </Fill>
</template>

<style lang="scss" scoped></style>
