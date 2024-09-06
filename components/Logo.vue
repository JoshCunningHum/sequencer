<script lang="ts" setup>
const { description } = defineProps<{
    description?: boolean | string;
}>();

const slots = defineSlots<{
    description: any;
}>();

const descriptiontxt = computed(() =>
    typeof description === "boolean" || !description ? undefined : description
);

//#region Logo Parallax
const parent = useParentElement();
const { roll, source, tilt } = useParallax(parent);
</script>

<template>
    <div class="flex flex-col items-center w-min">
        <div class="text-7xl font-bold text-gray-100 logo mb-4">SQNCR</div>
        <slot v-if="!!slots.description || description" name="description">
            <div v-if="!descriptiontxt" class="text-lg text-center text-gray-300 break-keep w-max">
                Generate sequence diagram from your class and use case diagrams
                <br />
                with the power of <span class="text-primary-500">AI</span>
            </div>
            <div v-else>
                {{ descriptiontxt }}
            </div>
        </slot>
    </div>
</template>

<style lang="scss" scoped>
.logo {
    transform: rotateX(v-bind('-roll * 50 + "deg"')) rotateY(v-bind('-tilt * 50 + "deg"'));
}
</style>
