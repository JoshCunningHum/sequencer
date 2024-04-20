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
        Hello this is dashboard

        <UButton
            label="Logout"
            color="red"
            @click="logout"
        />
    </div>
</template>

<style lang="scss" scoped></style>
