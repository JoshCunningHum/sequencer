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
    rounded: "rounded-none",
    color: {
        white: {
            outline: "shadow-none! ring-0!",
        },
    },
};
</script>

<template>
    <UInput
        :ui="input_ui"
        v-model="modelValue"
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
