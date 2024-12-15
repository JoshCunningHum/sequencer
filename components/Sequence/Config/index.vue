<script setup lang="ts">
const generateStore = useGenerateStore();
const { step, strictMode } = storeToRefs(generateStore);
const { generate } = generateStore;
</script>

<template>
    <div class="flex min-w-96 flex-col">
        <label class="label">Generation options</label>
        <SequenceConfigStrictMode v-model="strictMode" />

        <div
            v-if="strictMode"
            class="card label mt-1 flex max-w-96 text-justify"
            style="word-wrap: break-word"
        >
            Due to token restrictions, there is a max generation limit when
            re-fetching from conflicting sequence diagram output based on its
            input
        </div>

        <Divider />
        <Button
            fluid
            icon="pi pi-sparkles"
            label="Generate"
            @click="generate()"
        />
    </div>
</template>

<style lang="scss" scoped></style>
