<script setup lang="ts">
import { definePageMeta } from "../.nuxt/typed-router/__definePageMeta";

// Auth Middleware
definePageMeta({
    middleware: ["logged-in"],
});

const route = useRoute();
const isHome = computed(() => route.path === "/");
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
                <UButton
                    block
                    icon="i-mdi-google"
                    color="gray"
                    >Signin with Google</UButton
                >
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
