<script lang="ts" setup>
const {
    iconClass = "text-6xl",
    noIcon = false,
    selectable = false,
    icon = "i-mdi-database",
} = defineProps<{
    iconClass?: string;
    noIcon?: boolean;
    selectable?: boolean;
    icon?: string;
}>();
</script>

<template>
    <Fill
        flex-col
        class="items-center justify-center text-secondary-emph text-sm flex flex-col gap-2"
        :class="!selectable && 'select-none'"
    >
        <UIcon
            v-if="!noIcon"
            dynamic
            :class="iconClass"
            :name="icon"
        />
        <slot>
            <span>Empty</span>
        </slot>
    </Fill>
</template>

<style lang="scss" scoped></style>
