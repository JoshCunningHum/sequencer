<script setup lang="ts">
definePageMeta({
    layout: "authenticated",
    middleware: "auth",
    auth: {
        guestRedirectTo: "/login",
    },
});
</script>

<template>
    <Fill>This is useclass</Fill>
</template>

<style lang="scss" scoped></style>
