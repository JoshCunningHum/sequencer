<script setup lang="ts">
const route = useRoute();
const isHome = computed(() => route.path === "/");
</script>

<template>
    <Fill class="py-20">
        <Fill center flex-col class="gap-[20vh]">
            <Logo description />
            <div v-if="isHome" class="space-x-2">
                <Button link label="Login" as="a" href="/login" />
                <span class="pr-2">or</span>
                <Button outlined label="Register" as="a" href="/register" />
            </div>
        </Fill>
        <template v-if="!isHome">
            <Divider layout="vertical" />
            <NuxtPage />
        </template>
    </Fill>
</template>

<style lang="scss" scoped></style>
