<script setup lang="ts">
const { name, warning_count } = defineProps<{
    name: string;
    warning_count: number;
    selected?: boolean;
}>();

const emit = defineEmits<{
    select: [name: string];
}>();

// Tooltips
const chip_tooltip = computed(() =>
    warning_count > 0
        ? `<span class="text-amber-500">${warning_count}</span> warning references will be removed`
        : "No change in this page",
);
</script>

<template>
    <div
        class="page"
        :class="{ selected, ignored: warning_count === 0 }"
        @click="emit('select', name)"
        v-tip="name"
    >
        <div class="chip" v-tip="chip_tooltip">{{ warning_count }}</div>
        <span class="truncate">{{ name }}</span>
    </div>
</template>

<style lang="scss" scoped>
.page {
    @apply flex shrink-0 items-center gap-2;
    @apply cursor-pointer rounded-l-3xl rounded-r-md;
    @apply hover:bg-surface-800;

    .chip {
        @apply size-10 shrink-0 grow-0 text-center;
        @apply bg-amber-500 font-bold text-surface-900;
        @apply flex items-center justify-center rounded-full;
    }

    &.selected {
        @apply bg-amber-500 text-surface-900 hover:bg-amber-400;
    }

    &.ignored {
        &.selected {
            @apply bg-green-600 hover:bg-green-500;
        }

        .chip {
            @apply bg-green-600;
        }
    }
}
</style>
