<script setup lang="ts">
import { PlantUMLConverter } from "~/logic/sequence/converter.plant";
import { tokenize, TokenType } from "~/logic/sequence/lexer.plant";
import { PlantUMLParser } from "~/logic/sequence/parser.plant";

const { result } = defineProps<{
    result: GeneratedResult;
    index: number;
}>();

const type = computed(() =>
    result.errors.length ? "Error" : result.warnings.length ? "Warning" : "Success"
);

const DEV = false;

const generation = useGenerationStore();
const { viewing } = storeToRefs(generation);
const view = () => {
    if (type.value === "Success" && DEV) {
        const prompt = result.prompt;
        console.log(prompt);
        const tokens = tokenize(prompt);
        const mapped = tokens.map((t) => ({ ...t, type: TokenType[t.type] }));
        console.log(mapped);

        const parsed = PlantUMLParser.Parse(prompt, true);
        console.log(parsed);
        const xml = PlantUMLConverter.Convert({ data: parsed });
        console.log(xml);
    }

    if (type.value !== "Error") {
        generation.view(result);
    }
};
const is_viewing = computed(() => viewing.value?.id === result.id);
</script>

<template>
    <div
        class="p-2 hover:bg-surface-800 group rounded flex gap-2"
        :class="{
            'cursor-pointer': type !== 'Error',
            selected: is_viewing,
        }"
        @click="view"
    >
        <div>
            <i class="result-type error pi pi-times" v-if="type === 'Error'" />
            <i class="result-type warning pi pi-warning" v-else-if="type === 'Warning'" />
            <i class="result-type success pi pi-check" v-else-if="type === 'Success'" />
        </div>

        <div class="flex gap-1 items-center flex-grow">
            <div class="flex flex-col">
                <label>{{ type }}</label>
                <small>{{ result.errors[0]?.title }}</small>
            </div>

            <small
                v-if="type !== 'Error'"
                class="flex-grow text-center group-hover:block"
                :class="{
                    'text-green-400': is_viewing,
                    'text-surface-400': !is_viewing,
                    hidden: !is_viewing,
                }"
            >
                {{ is_viewing ? "currently viewed" : "Click to view result" }}
            </small>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.result-type {
    @apply p-1 px-1.5 text-xs rounded-full text-surface-800 font-bold;

    &.success {
        @apply bg-emerald-500;
    }

    &.error {
        @apply bg-rose-500;
    }

    &.warning {
        @apply bg-amber-500;
    }
}

.selected {
    @apply bg-surface-800 hover:bg-surface-700;
}
</style>
