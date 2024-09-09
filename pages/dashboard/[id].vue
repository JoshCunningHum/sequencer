<script setup lang="ts">
definePageMeta({
    key: "main-sequencer",
    keepalive: true,
    middleware: ["auth", "project-access"],
});
</script>

<template>
    <Fill flex-col class="py-1 pl-2">
        <DashboardToolbar />
        <KeepAlive>
            <DrawIOEmbed />
        </KeepAlive>
    </Fill>
</template>

<style lang="scss" scoped></style>
