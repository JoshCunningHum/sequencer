<script setup lang="ts">
const generationStore = useGenerationStore();
const { generate } = generationStore;
</script>

<template>
    <div class="min-w-96 flex flex-col">
        <label class="label">Generation options</label>
        <SequenceConfigStrictMode />
        <SequenceConfigMaxGenerationLimit />
        <Divider />
        <Button fluid icon="pi pi-sparkles" label="Generate" @click="generate()" />
    </div>
</template>

<style lang="scss" scoped></style>
