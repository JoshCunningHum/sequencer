<script lang="ts" setup>
interface Step {}

const { orientation = "vertical" } = defineProps<{
    orientation: "vertical" | "horizontal";
    steps: Step[];
}>();
</script>

<template>
    <div></div>
</template>

<style lang="scss" scoped></style>
