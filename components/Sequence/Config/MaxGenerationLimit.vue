<script setup lang="ts">
// Config values
const generationStore = useGenerationStore();
const { strictMode, generationLimit } = storeToRefs(generationStore);
</script>

<template>
    <div
        v-if="strictMode"
        class="card mt-1 label text-justify flex max-w-96"
        style="word-wrap: break-word"
    >
        Due to token restrictions, there is a max generation limit when re-fetching from conflicting
        sequence diagram output based on its input
    </div>
</template>

<style lang="scss" scoped></style>
