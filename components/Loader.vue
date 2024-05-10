<script lang="ts" setup>
defineOptions({
    inheritAttrs: false,
});

const slots = defineSlots<{
    default(): any;
    loader(): any;
}>();

const { finished = false, text = "Loading" } = defineProps<{
    finished?: boolean;
    text?: string;
}>();
</script>

<template>
    <slot
        v-if="finished"
        :="$attrs"
    ></slot>
    <slot
        v-else
        name="loader"
    >
        <Fill
            :="$attrs"
            class="justify-center items-center"
        >
            <Loading :data="text" />
        </Fill>
    </slot>
</template>

<style lang="scss" scoped></style>
