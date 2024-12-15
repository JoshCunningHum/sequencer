<script setup lang="ts">
const generateStore = useGenerateStore();

const { step, gen_status, error } = storeToRefs(generateStore);
const progress = computed(() => generateStore.output.progress);
const optimal = computed(() => generateStore.output.data);

// Show error toast
whenever(error, (err) => {
    console.error(err);
});
</script>

<template>
    <div class="flex h-full min-w-96 flex-col gap-2">
        <SequenceResultStatus
            :progress
            :description="GenerationStatus[gen_status]"
            v-if="step === GenerationStep.Generating"
        />
    </div>
</template>

<style lang="scss" scoped></style>
