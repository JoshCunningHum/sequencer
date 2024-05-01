<script lang="ts" setup>
const {
    overflowScrollY = true,
    overflowScrollX = false,
    noFlex = false,
    flexRow = false,
} = defineProps<{
    overflowScrollY?: boolean;
    overflowScrollX?: boolean;
    noFlex?: boolean;
    flexRow?: boolean;
}>();
</script>

<template>
    <div
        class="flex-grow h-full w-full min-h-0"
        :class="[
            overflowScrollY && 'overflow-y-auto',
            overflowScrollX && 'overflow-x-auto',
            !noFlex && 'flex',
            !flexRow && 'flex-col',
        ]"
    >
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped></style>
