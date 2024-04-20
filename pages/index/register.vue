<script setup lang="ts">
import { set, get } from "@vueuse/core";
import type { FormSubmitEvent } from "#ui/types";
import { AuthController } from "~/controllers/AuthController";
import {
    RegisterSchema as schema,
    type RegisterSchemaType,
} from "@/composables/FormSchemas";

// Data
const state = reactive({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
});

// Fetching
const loading = ref(false);
const isSuccess = ref(false);
const isError = ref(false);

const onSubmit = async (event: FormSubmitEvent<RegisterSchemaType>) => {
    set(loading, true);

    const { email, password, username } = event.data;

    const result = await AuthController.SignUp(email, password, username);

    if (typeof result === "boolean") set(isSuccess, true);
    else set(isError, true);

    set(loading, false);
};
</script>

<template>
    <div class="flex items-center">
        <UModal v-model="isError">
            <UCard class="text-sm text-center"> Email already taken </UCard>
        </UModal>
        <UModal v-model="isSuccess">
            <UCard class="text-sm text-center">
                Success! Now please login using your email
            </UCard>
        </UModal>

        <UForm
            class="flex flex-col gap-2"
            :schema="schema"
            :state="state"
            @submit="onSubmit"
        >
            <UFormGroup
                label="Display Name"
                name="name"
                size="xs"
            >
                <UInput v-model="state.username" />
            </UFormGroup>

            <UFormGroup
                label="Email"
                name="email"
                size="xs"
            >
                <UInput v-model="state.email" />
            </UFormGroup>

            <UFormGroup
                label="Password"
                name="password"
                size="xs"
            >
                <PasswordInput v-model="state.password" />
            </UFormGroup>

            <UFormGroup
                label="Confirm Password"
                name="confirmPassword"
                size="xs"
            >
                <PasswordInput v-model="state.confirmPassword" />
            </UFormGroup>

            <UButton
                block
                class="my-1"
                :loading="loading"
                type="submit"
                >Register</UButton
            >

            <span class="text-sm"
                >Already have an account?
                <ULink
                    to="/login"
                    active-class="text-primary"
                    inactive-class="text-neutral-400 hover:text-neutral-200"
                >
                    Login Here</ULink
                >
            </span>
        </UForm>
    </div>
</template>

<style lang="scss" scoped></style>
