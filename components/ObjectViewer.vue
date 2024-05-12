<script setup lang="ts">
import "vanilla-jsoneditor/themes/jse-theme-dark.css";
import JsonEditorVue from "json-editor-vue";
import { Mode } from "vanilla-jsoneditor";

const props = defineProps<{
    obj: Record<string, any>;
}>();
</script>

<template>
    <JsonEditorVue
        :model-value="obj"
        :mode="Mode.tree"
        class="jse-theme-dark"
        read-only
        :main-menu-bar="false"
        :identation="2"
        :tabSize="2"
    />
</template>

<style lang="scss" scoped></style>
