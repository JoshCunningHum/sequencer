<script setup lang="ts">
import { definePageMeta } from "../.nuxt/typed-router/__definePageMeta";
import { AuthController } from "../controllers/AuthController";

// Auth Middleware
definePageMeta({
    middleware: ["logged-in"],
});

const route = useRoute();
const isHome = computed(() => route.path === "/");

const signin_github = () => {
    AuthController.SignInOAuth("github");
};
</script>

<template>
    <div :class="!isHome ? 'flex my-24 w-full h-full' : 'w-fit mx-auto'">
        <div class="flex-grow">
            <div class="my-48"></div>
            <Logo
                class="mx-auto"
                description
            />
        </div>
        <UDivider
            :orientation="isHome ? 'horizontal' : 'vertical'"
            :class="isHome ? 'my-24' : 'mx-24'"
        />
        <div
            class="mx-auto flex flex-col gap-2 w-48"
            v-if="isHome"
        >
            <UButton
                block
                color="primary"
                variant="outline"
                to="/login"
                >Login</UButton
            >
            <UButton
                block
                color="primary"
                to="/register"
                >Register</UButton
            >
        </div>
        <div
            class="flex items-center flex-grow"
            v-else
        >
            <div class="w-62 mx-auto flex flex-col gap-4">
                <NuxtPage class="w-full" />
                <UDivider label="OR" />
                <div class="flex flex-col gap-1">
                    <UButton
                        block
                        icon="i-mdi-google"
                        color="gray"
                        >Signin with Google</UButton
                    >
                    <UButton
                        block
                        icon="i-mdi-github"
                        color="gray"
                        @click="signin_github"
                        >Signin with Github</UButton
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
