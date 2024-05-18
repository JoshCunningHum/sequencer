<script lang="ts" setup></script>

<template>
    <div
        class="w-full border-2 border-dashed rounded-md min-h-80 border-secondary-emph"
    >
        <slot>
            <Fill
                center
                class="text-secondary-emph select-none"
                >No Data Saved</Fill
            >
        </slot>
    </div>
</template>

<style lang="scss" scoped></style>
