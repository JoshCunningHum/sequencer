<script setup lang="ts">
const { fill = false } = defineProps<{
    fill?: boolean;
}>();
</script>

<template>
    <div
        class="flex size-10 items-center justify-center pb-1.5 pl-0.5"
        :class="{
            'rounded-full bg-amber-500 text-center text-surface-800': fill,
            'text-amber-500': !fill,
        }"
    >
        <i class="pi pi-exclamation-triangle text-2xl" />
    </div>
</template>

<style lang="scss" scoped></style>
