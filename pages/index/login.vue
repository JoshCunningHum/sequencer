<script setup lang="ts">
import * as yup from "yup";
import type { QuerySchemaMeta } from "~/components/DynamicForm/types";
import { loginSchema as schema } from "~/schemas/auth";
import type { User } from "~/server/utils/drizzle";

const toast = useToast();

const { isLoading, execute } = useAsyncState(
    async (body: yup.InferType<typeof schema>) =>
        await $fetch("/api/users/login", { method: "POST", body })
            .then(() =>
                toast.add({
                    severity: "success",
                    summary: "Login Success",
                    detail: "Please enjoy using the app",
                    life: 1000,
                })
            )
            .catch((err) =>
                toast.add({
                    severity: "error",
                    summary: "Login Failed",
                    detail: err.statusMessage,
                    closable: true,
                    life: 1500,
                })
            ),
    undefined,
    { immediate: false }
);

const onSubmit = (state: yup.InferType<typeof schema>) => execute(0, state);
</script>

<template>
    <Fill class="min-w-[400px]" flex-col center>
        <DynamicForm
            :schema
            @submit="onSubmit"
            join-labels
            class="mx-auto w-full max-w-[300px]"
            confirm-text="Login"
            :is-submitting="isLoading"
        />
        <div class="w-full text-right max-w-[300px]">
            <Anchor class="text-emerald-400 text-sm" to="/register">or register here</Anchor>
        </div>
    </Fill>
</template>

<style lang="scss" scoped></style>
