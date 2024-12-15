<script setup lang="ts">
import { useActiveElement, useMagicKeys, whenever } from "@vueuse/core";
import { computed, ref } from "vue";

const props = defineProps<{
    hotkey: string;
    noClick?: boolean;
    preventDefault?: boolean;
    hidden?: boolean;
}>();

const emits = defineEmits<{
    (e: "press"): void;
}>();

const activeElement = useActiveElement();
const notUsingInput = computed(
    () =>
        activeElement.value?.tagName !== "INPUT" &&
        activeElement.value?.tagName !== "TEXTAREA" &&
        !activeElement.value?.classList.contains("tiptap") &&
        !activeElement.value?.isContentEditable,
);
const keys = useMagicKeys({
    passive: props.preventDefault,
    onEventFired(e) {
        if (props.preventDefault) e.preventDefault();
    },
});
const isPressing = computed(() => keys[props.hotkey]?.value);
const root = ref<InstanceType<typeof HTMLSpanElement>>();

const shouldClick = computed(() => isPressing.value && notUsingInput.value);

whenever(shouldClick, () => {
    if (root.value) root.value.click();
    emits("press");
});
</script>

<template>
    <span
        ref="root"
        class="badge"
        :class="{
            'text-surface-100 !border-green-500 bg-green-800': isPressing,
            '!hidden': hidden,
        }"
    >
        {{ hotkey.toUpperCase() }}
    </span>
</template>

<style lang="scss" scoped>
.badge {
    @apply border-surface-300 rounded border px-1.5 py-1 font-mono font-light;

    font-size: 0.7rem;
    line-height: 0.7rem;
}
</style>
