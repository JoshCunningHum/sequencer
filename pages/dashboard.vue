<script setup lang="ts">
definePageMeta({
    layout: "authenticated",
    middleware: "auth",
    auth: {
        guestRedirectTo: "/login",
    },
});

const route = useRoute();
const isExact = computed(() => route.path === "/dashboard");

onMounted(() => (useUiStore().minimized_sidebar = false));
</script>

<template>
    <Fill>
        <DashboardSidebar />
        <Empty
            v-if="isExact"
            text="Select a project"
            class="text-surface-400"
            icon="pi pi-wave-pulse"
            icon-class="!text-7xl"
        />
        <NuxtPage v-else />
    </Fill>
</template>

<style lang="scss" scoped></style>
