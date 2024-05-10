<script lang="ts" setup>
import { get, set } from "@vueuse/core";

// If prop
const props = defineProps<{
    show?: boolean;
}>();

const { show } = toRefs(props);

// Emits
const emit = defineEmits<{
    (e: "loaded"): void;
    (e: "started"): void;
}>();

// States
const loaded = ref(false);

// Scoped slots
const done = () => {
    set(loaded, true);
    emit("loaded");
};

// Watchers
watchImmediate(show, (v) => !!v && !loaded.value && emit("started"));
</script>

<template>
    <template v-if="loaded || show">
        <slot
            name="default"
            :done="done"
        ></slot>
    </template>
</template>

<style lang="scss" scoped></style>
