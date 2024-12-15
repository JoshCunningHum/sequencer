<script setup lang="ts">
import * as yup from "yup";
import { register_schema as schema } from "~/schemas/auth";

const toast = useToast();

const {
    isLoading,
    state: error,
    execute,
} = useAsyncState(
    async (body: yup.InferType<typeof schema>) =>
        await $fetch("/api/users/register", { method: "POST", body })
            .then(() => navigateTo("/login"))
            .then(() =>
                toast.add({
                    severity: "success",
                    summary: "Registration Success",
                    detail: "Please login using your credentials",
                    life: 2000,
                }),
            )
            .catch((err) => {
                toast.add({
                    severity: "error",
                    summary: "Registration Failed",
                    detail: err.statusMessage,
                    closable: true,
                    life: 2000,
                });
            }),
    undefined,
    { immediate: false },
);

const onSubmit = (state: yup.InferType<typeof schema>) => {
    execute(0, state);
};
</script>

<template>
    <Fill class="min-w-[400px]" flex-col center>
        <DynamicForm
            :schema
            @submit="onSubmit"
            join-labels
            class="mx-auto w-full max-w-[300px]"
            confirm-text="Register"
            :is-submitting="isLoading"
        />
        <div class="w-full max-w-[300px] text-right">
            <Anchor class="text-sm text-emerald-400" to="/login">
                or login here
            </Anchor>
        </div>
        {{ error }}
    </Fill>
</template>

<style lang="scss" scoped></style>
