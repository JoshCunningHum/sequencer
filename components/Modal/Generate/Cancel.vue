<script lang="ts" setup>
const model = defineModel<boolean>({ default: false });
</script>

<template>
    <UModal v-model="model"> </UModal>
</template>

<style lang="scss" scoped></style>
