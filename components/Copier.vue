<script lang="ts" setup>
import UButton from "#ui/components/elements/Button.vue";
import { set } from "@vueuse/core";
const { text } = defineProps<{
    text: string;
}>();

const copied = ref(false);
const button = ref<InstanceType<typeof UButton>>();

onClickOutside(button, () => {
    set(copied, false);
});

const copy = async () => {
    await copyToClipboard(text);
    set(copied, true);
    setTimeout(() => set(copied, false), 1000);
};
</script>

<template>
    <div class="relative min-h-[32px]">
        <div class="absolute top-0 right-0 h-min w-min bg-primary">
            <UButton
                ref="button"
                color="gray"
                :icon="copied ? 'i-mdi-check' : 'i-mdi-content-paste'"
                @click="copy"
            />
        </div>
        <div class="overflow-auto">
            <slot> {{ text }} </slot>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
