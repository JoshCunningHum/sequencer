<script lang="ts" setup>
import { useGenerationStore } from "../../stores/generation";

const generationStore = useGenerationStore();
const { error } = storeToRefs(generationStore);

const show_error = computed({
    get: () => !!error.value && error.value !== "",
    set: (v) => (error.value = ""),
});
</script>

<template>
    <UModal
        v-model="show_error"
        :ui="{
            width: 'w-fit',
        }"
    >
        <div class="p-8 py-4 flex items-center flex-col w-fit">
            <UIcon
                name="i-mdi-alert"
                class="text-red-500 text-5xl rounded-full"
            />

            <div class="DMSans text-red-200">
                {{ error }}
            </div>
        </div>
    </UModal>
</template>

<style lang="scss" scoped></style>
