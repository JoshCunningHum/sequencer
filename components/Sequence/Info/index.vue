<script setup lang="ts">
import { set } from "@vueuse/core";

const uiStore = useUiStore();
const { diagram, sidebar_tab: tab } = storeToRefs(uiStore);

const generationStore = useGenerationStore();
const { prompts } = storeToRefs(generationStore);

const prompt = ref<string>();

watchImmediate(
    [diagram, prompts],
    ([d, ps]) => {
        const { class: cd, llm: sd, usecase: ud } = ps;

        const text = d === "class" ? cd : d === "usecase" ? ud : sd;
        set(prompt, text);
    },
    { deep: true }
);
</script>

<template>
    <Fill class="min-w-96 max-w-md flex flex-col" overflow-scroll-y>
        <label class="label">Diagram Info</label>
        <Copier class="min-h-0">
            <code class="font-mono! whitespace-pre w-max">{{ prompt }} </code>
        </Copier>
    </Fill>
</template>

<style lang="scss" scoped></style>
