<script setup lang="ts">
import { set, get } from "@vueuse/core";
import {
    LoginSchema as schema,
    type LoginSchemaType,
} from "@/composables/FormSchemas";
import type { FormSubmitEvent } from "#ui/types";
import { AuthController } from "../../controllers/AuthController";

// Router
const route = useRoute();
const router = useRouter();

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
const errorCause = ref("Login Error");
const errorMessage = ref("Please recheck your credentials");

const onSubmit = async (event: FormSubmitEvent<LoginSchemaType>) => {
    set(loading, true);

    const { email, password } = event.data;

    const result = await AuthController.SignIn(email, password);

    if (typeof result === "boolean") {
        set(isSuccess, true);
        router.push("/dashboard");
    } else {
        set(isError, true);
        set(errorMessage, result.message);
        set(errorCause, result.cause || "Login Error");
    }

    set(loading, false);
};
</script>

<template>
    <div class="flex items-center">
        <UModal v-model="isError">
            <UAlert
                title="Login Error"
                :description="errorMessage"
                color="red"
                variant="subtle"
                icon="i-mdi-alert"
            />
        </UModal>

        <UForm
            class="flex flex-col gap-2"
            :schema="schema"
            :state="state"
            @submit="onSubmit"
        >
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

            <UButton
                block
                class="my-1"
                :loading="loading"
                type="submit"
                >Login</UButton
            >

            <span class="text-sm"
                >Don't have an account?
                <ULink
                    to="/register"
                    active-class="text-primary"
                    inactive-class="text-neutral-400 hover:text-neutral-200"
                >
                    Register Here</ULink
                >
            </span>
        </UForm>
    </div>
</template>

<style lang="scss" scoped></style>
