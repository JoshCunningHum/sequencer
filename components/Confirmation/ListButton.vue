<script lang="ts" setup>
import type { AccordionItem } from "#ui/types";

const {} = defineProps<{
    index: number;
    item: AccordionItem;
    open: boolean;
}>();
</script>

<template>
    <UButton
        color="gray"
        variant="ghost"
        :ui="{ rounded: 'rounded-full', padding: { sm: 'p-3' } }"
    >
        <template #leading>
            <div
                class="w-6 h-6 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center -my-1"
            >
                <UIcon
                    :name="item.icon || ''"
                    class="w-4 h-4 text-white dark:text-gray-900"
                />
            </div>
        </template>

        <span class="truncate">{{ item.label }}</span>

        <template #trailing>
            <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200"
                :class="[open && 'rotate-90']"
            />
        </template>
    </UButton>
</template>

<style lang="scss" scoped></style>
