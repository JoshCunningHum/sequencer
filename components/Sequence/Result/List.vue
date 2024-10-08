<script setup lang="ts">
const { results } = defineProps<{
    results: GeneratedResult[];
}>();
</script>

<template>
    <Fill class="rounded-md bg-surface-900 p-2 gap-1 flex flex-col" overflow-scroll-y>
        <Empty v-if="results.length === 0" class="text-surface-500" text="No results so far" />
        <SequenceResultListItem
            v-for="(result, i) in results"
            :key="result.id"
            :result
            :index="i"
        />
    </Fill>
</template>

<style lang="scss" scoped></style>
