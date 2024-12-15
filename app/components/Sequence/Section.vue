<script setup lang="ts">
import { get } from "@vueuse/core";

//#region Opening
const uiStore = useUiStore();
const { diagram, sidebar_tab: side_tab } = storeToRefs(uiStore);
const open = computed(
    () =>
        !!side_tab.value &&
        (diagram.value === "sequence" || side_tab.value !== "generate"),
);

const generateStore = useGenerateStore();
const { step } = storeToRefs(generateStore);
const isIdle = computed(() => get(step) === GenerationStep.Idle);
</script>

<template>
    <Transition name="expand">
        <div v-if="open" class="px-4 py-2">
            <template v-if="side_tab === 'generate'">
                <SequenceConfig v-if="isIdle" />
                <SequenceResult v-else />
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
