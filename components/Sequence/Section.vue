<script setup lang="ts">
import TestBtn from "./TestBtn.vue";

//#region Opening
const uiStore = useUiStore();
const { diagram, sidebar_tab: side_tab } = storeToRefs(uiStore);
const open = computed(
    () => !!side_tab.value && (diagram.value === "sequence" || side_tab.value !== "generate")
);

const generationStore = useGenerationStore();
const { is_generating } = storeToRefs(generationStore);
</script>

<template>
    <Transition name="expand">
        <div v-if="open" class="py-2 px-4">
            <template v-if="side_tab === 'generate'">
                <SequenceResult v-if="is_generating" />
                <SequenceConfig v-else />
            </template>
            <SequenceInfo v-else-if="side_tab === 'info'" />
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
.expand-leave-to,
.expand-enter-from {
    max-width: 0;
}

.expand-leave-from,
.expand-enter-to {
    @apply max-w-96;
}

.expand-leave-active,
.expand-enter-active {
    @apply transition-all;
}
</style>
