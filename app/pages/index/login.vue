<script setup lang="ts">
import * as yup from "yup";
import { login_schema as schema } from "~/schemas/auth";

const toast = useToast();
const { signIn } = useAuth();
const { sync } = useUserStore();

const { isLoading, execute } = useAsyncState(
    async (body: yup.InferType<typeof schema>) => {
        return await signIn("credentials", { ...body, redirect: true })
            .then(async () => await sync())
            .catch(() =>
                toast.add({
                    closable: true,
                    detail: "Invalid Credentials",
                    life: 1500,
                    severity: "error",
                    summary: "Login Failed",
                }),
            );
    },
    undefined,
    { immediate: false },
);

const onSubmit = (state: yup.InferType<typeof schema>) => execute(0, state);

//#region OAuth Providers
const onGithub = () => signIn("github", { redirect: true });

//#region Display Error after call back
</script>

<template>
    <Fill class="min-w-[400px]" flex-col center>
        <Fill class="max-w-[300px]" flex-col center>
            <DynamicForm
                :schema
                @submit="onSubmit"
                join-labels
                class="mx-auto w-full min-w-[300px]"
                confirm-text="Login"
                confirm-button-classes="w-full mt-2"
                :is-submitting="isLoading"
            />
            <Divider> <span>or</span> </Divider>
            <Button
                icon="pi pi-github"
                severity="secondary"
                label="Sign in with Github"
                class="w-full"
                @click="onGithub"
            />
            <div class="w-full max-w-[300px] text-right">
                <Anchor class="text-sm text-emerald-400" to="/register">
                    or register here
                </Anchor>
            </div>
        </Fill>
    </Fill>
</template>

<style lang="scss" scoped></style>
