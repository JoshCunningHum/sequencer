<script lang="ts" setup>
import {
    useGenerationStore,
    GenerationProgress,
} from "../../stores/generation";

const props = defineProps<{
    expand?: boolean;
}>();

const { expand } = toRefs(props);

const generationStore = useGenerationStore();
const { progress } = storeToRefs(generationStore);
const totalprogress = useArrayReduce(progress, (total, p) => (total += p), 0);

const expand_debounced = refDebounced(expand, 1000);
</script>

<template>
    <transition-slide axis="x">
        <div
            v-show="expand || expand_debounced"
            class="w-[300px] flex flex-col min-h-0 max-h-[400px]"
        >
            <div
                v-if="totalprogress < 100"
                class="text-base loading-ellipsis flex items-center gap-1 min-h-0"
            >
                <UIcon
                    name="i-mdi-autorenew"
                    class="animate-spin text-2xl"
                />
                <span>Generating</span>
            </div>
            <div
                v-else
                class="text-base flex items-center text-accent gap-1 min-h-0"
            >
                <UIcon
                    name="i-mdi-check-circle-"
                    class="text-2xl"
                />
                <span>Success</span>
            </div>
            <Fill
                class="my-1"
                flex-col
            >
                <div
                    v-for="p in progress"
                    :class="[p < 0 ? 'text-red-400' : 'text-green-500']"
                    class="text-sm flex justify-between py-1 px-2 hover:bg-neutral-700 rounded cursor-default"
                >
                    <span class="flex items-center gap-2">
                        <UIcon
                            name="i-mdi-check-circle-outline"
                            v-if="p > 0"
                        />
                        <UIcon
                            v-else
                            name="i-mdi-close"
                            class="text-red-500"
                        />

                        {{ GenerationProgress[p] }}</span
                    >
                    <span>{{ p }}</span>
                </div>
            </Fill>
            <UProgress
                size="sm"
                indicator
                :value="totalprogress"
            />
        </div>
    </transition-slide>
</template>

<style lang="scss" scoped></style>
