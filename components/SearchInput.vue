<script setup lang="ts">
const modelValue = defineModel<string>();
const clear = () => {
    modelValue.value = "";
};

const input_ui = /* ui */ {
    icon: {
        trailing: {
            pointer: "",
        },
    },
    base: "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white",
    rounded: "rounded-none",
    color: {
        white: {
            outline: "shadow-none! ring-0! ",
        },
    },
    variant: {
        none: "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-b border-gray-700 focus:outline-none",
    },
};
</script>

<template>
    <UInput
        :ui="input_ui"
        v-model="modelValue"
        variant="none"
        trailing-icon="i-mdi-search"
    >
        <template #trailing>
            <UButton
                v-if="modelValue?.length"
                variant="link"
                color="gray"
                :padded="false"
                icon="i-mdi-close"
                @click="clear"
            />
        </template>
    </UInput>
</template>

<style lang="scss" scoped></style>
