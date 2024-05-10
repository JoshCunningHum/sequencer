<script lang="ts" setup>
import { AuthController } from "../controllers/AuthController";

const router = useRouter();

const user = useSupabaseUser();
const name = computed(() => user.value?.user_metadata.full_name || "No Name");
const email = computed(() => user.value?.email);

// Vertical Nav
const links = reactive([
    [
        {
            label: "Dashboard",
            icon: "i-mdi-view-dashboard",
            to: "/dashboard",
        },
        {
            label: "Logout",
            icon: "i-mdi-logout",
            labelClass: "group-hover:text-red-500 text-red-300",
            iconClass: "group-hover:text-red-500 text-red-300",
            click: async () => {
                const logoutlink = links
                    .flat()
                    .find((link) => link.label === "Logout");
                if (logoutlink) {
                    logoutlink.icon = "i-mdi-autorenew";
                    logoutlink.iconClass += " animate-spin";
                }
                await AuthController.LogOut();
                router.push("/");
            },
        },
    ],
]);
</script>

<template>
    <div class="h-full bg-primary">
        <!-- Avatar -->
        <div class="px-4 py-2 flex gap-4 items-center">
            <UAvatar
                :alt="name"
                size="lg"
            />
            <div class="flex flex-col">
                <span class="text-lg font-semibold">{{ name }}</span>
                <span class="text-xs text-secondary-emph">{{ email }}</span>
            </div>
        </div>
        <UDivider />

        <!-- Vertical Navigation -->
        <UVerticalNavigation
            class="mx-4 mt-2"
            :links="links"
        >
            <template #default="{ link }">
                <div
                    class="py-1 group-hover:text-white relative"
                    :class="link.labelClass"
                >
                    {{ link.label }}
                </div>
            </template>

            <template #icon="{ link }">
                <UIcon
                    class="text-xl"
                    :name="link.icon"
                    :class="link.iconClass"
                />
            </template>
        </UVerticalNavigation>
    </div>
</template>

<style lang="scss" scoped></style>
