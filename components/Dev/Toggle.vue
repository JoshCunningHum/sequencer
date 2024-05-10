import { useDevStore } from '../../stores/dev';
<script lang="ts" setup>
const { label = "Dev Mode" } = defineProps<{
    label?: string;
}>();

const devStore = useDevStore();
const { enabled } = storeToRefs(devStore);

const customid = genid();
</script>

<template>
    <div class="flex items-center gap-2">
        <label
            :for="customid"
            v-if="!!label"
            class="DMSans text-sm cursor-pointer"
            >{{ label }}</label
        >
        <UToggle
            v-model="enabled"
            :id="customid"
        />
    </div>
</template>

<style lang="scss" scoped></style>
