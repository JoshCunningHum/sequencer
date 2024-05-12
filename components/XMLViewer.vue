<script lang="ts" setup>
// @ts-ignore
import XmlViewer from "vue3-xml-viewer";

const props = defineProps<{
    xml: string;
}>();
</script>

<template>
    <XmlViewer
        class="dark"
        :xml="xml"
    />
</template>

<style lang="scss" scoped></style>
