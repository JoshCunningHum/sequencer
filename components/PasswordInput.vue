<script setup lang="ts">
const modelValue = defineModel<string>();
const showpassword = ref(false);

const input_ui = /* ui */ {
    icon: {
        trailing: {
            pointer: "",
        },
    },
};
</script>

<template>
    <UInput
        :ui="input_ui"
        v-model="modelValue"
        trailing-icon="i-mdi-eye"
        :type="showpassword ? 'text' : 'password'"
    >
        <template #trailing>
            <UButton
                v-if="showpassword"
                variant="link"
                color="gray"
                :padded="false"
                icon="i-mdi-eye-off"
                @click="showpassword = false"
            />
            <UButton
                v-else
                variant="link"
                color="gray"
                :padded="false"
                icon="i-mdi-eye"
                @click="showpassword = true"
            />
        </template>
    </UInput>
</template>

<style lang="scss" scoped></style>
