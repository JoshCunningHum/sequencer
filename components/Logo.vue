<script lang="ts" setup>
const { description } = defineProps<{
    description?: boolean | string;
}>();

const slots = defineSlots<{
    description(): any;
}>();

const descriptiontxt = computed(() =>
    typeof description === "boolean" || !description ? undefined : description
);
</script>

<template>
    <div class="DMSans flex flex-col items-center w-min">
        <div class="text-7xl font-bold text-gray-100">SQNCR</div>
        <slot
            v-if="!!slots.description || description"
            name="description"
        >
            <div
                v-if="!descriptiontxt"
                class="text-lg text-center text-gray-300 break-keep w-max"
            >
                Generate sequence diagram from your class and use case diagrams
                <br />
                with the power of <span class="text-accent">AI</span>
            </div>
            <div v-else>
                {{ descriptiontxt }}
            </div>
        </slot>
    </div>
</template>

<style lang="scss" scoped></style>
