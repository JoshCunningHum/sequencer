<script setup lang="ts">
import type { SidebarItem } from "~~/layers/core/components/CoreSidebar/types";
import stringInitials from "~~/layers/core/utils/stringInitials";
import { field } from "../../../layers/core/composables/field";
import { useUserStore } from "../../stores/user";
import { computed, onMounted } from "vue";
import { ref } from "yup";

//#region Sidenav Configuration

const user = ref({
    image: undefined,
    name: 'Test User',
    id: 2,
    email: 't@gmail.com'
})
const image = field(user, "image");
const name = field(user, "name");

const initials = computed(() =>
    image.value ? "" : stringInitials(name.value),
);

const { sync } = useUserStore();
onMounted(sync);

// Menu Items
const { signOut } = useAuth();
const menus = [
    {
        name: "cdudsd",
        icon: "pi pi-sparkles",
        label: "Sequencer",
        route: "/dashboard",
        tooltip: /* html */ `Convert class diagrams and use case diagrams to sequence diagrams`,
    },
    {
        name: "useclass",
        icon: "pi pi-credit-card",
        label: "Useclass",
        route: "/useclass",
        tooltip: /* html */ `Use-class integration from the bontilao twins sheesh`,
    },
    {
        name: "logout",
        label: "Log out",
        last: true,
        icon: "pi pi-sign-out",
        route: "/login",
        click: signOut,
    },
] satisfies SidebarItem[];
</script>

<template>
    <CoreSidebar :items="menus" class="bg">
        <template #top>
            <div class="mb-2 flex overflow-hidden">
                <Avatar :label="initials" :image size="large" shape="circle" />
                <div
                    class="flex max-w-0 flex-col overflow-hidden transition-all group-hover:ml-3 group-hover:max-w-52"
                >
                    <span class="whitespace-nowrap break-keep text-lg">
                        {{ user?.name }}
                    </span>
                    <span class="text-sm text-surface-400">
                        {{ user?.email }}
                    </span>
                </div>
            </div>
            <Divider class="!my-1 !mb-2" />
        </template>
    </CoreSidebar>
</template>

<style lang="scss" scoped></style>
