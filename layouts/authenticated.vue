<script lang="ts" setup>
import type { SidebarItem } from "~/components/Sidenav/types";

//#region Sidenav Configuration

const { signOut } = useAuth();

const items = [
    {
        name: "cdudsd",
        icon: "pi pi-sparkles",
        label: "Sequencer",
        route: "/dashboard",
        tooltip: /* html */ `Convert class diagrams and use case diagrams to sequence diagrams`,
    },
    {
        name: "logout",
        label: "Log out",
        last: true,
        icon: "pi pi-sign-out",
        route: "/login",
        click: signOut,
    },
] as const as SidebarItem[];

const { user } = useAuth();
const initials = computed(() =>
    !!user.value?.image
        ? undefined
        : (user.value?.name || "")
              .split(" ")
              .map(([f]) => f)
              .join("")
              .toUpperCase()
);
const avatar = computed(() => {
    const { image } = user.value || {};
    return image || undefined;
});
</script>

<template>
    <Screen class="bg-surface-950/50">
        <Fill>
            <Sidenav :items class="bg">
                <template #top>
                    <div class="mb-2 flex overflow-hidden">
                        <Avatar :label="initials" :image="avatar" size="large" shape="circle" />
                        <div
                            class="group-hover:max-w-52 transition-all max-w-0 overflow-hidden group-hover:ml-3 flex flex-col"
                        >
                            <span class="break-keep whitespace-nowrap text-lg">
                                {{ user?.name }}</span
                            >
                            <span class="text-sm text-surface-400">{{ user?.email }}</span>
                        </div>
                    </div>
                    <Divider class="!my-1 !mb-2" />
                </template>
            </Sidenav>
            <slot></slot>
        </Fill>
    </Screen>
</template>
