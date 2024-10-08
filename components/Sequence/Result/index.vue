<script setup lang="ts">
const generationStore = useGenerationStore();
const { results } = storeToRefs(generationStore);
</script>

<template>
    <div class="min-w-96 flex flex-col h-full gap-2">
        <label class="label">Received results</label>
        <SequenceResultList :results class="flex-grow" />
        <SequenceResultStatus class="mt-auto" />
    </div>
</template>

<style lang="scss" scoped></style>
