<script lang="ts" setup>
import { AuthController } from "~/controllers/AuthController";

definePageMeta({
    middleware: "auth",
});

const logout = async () => {
    await AuthController.LogOut();
    window.location.href = "/";
};
</script>

<template>
    <div>
        <Nav header="Dashboard" />
    </div>
</template>

<style lang="scss" scoped></style>
