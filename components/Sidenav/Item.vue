<script setup lang="ts">
import { computed } from "vue";
import Hotkey from "../Hotkey.vue";
import type { SidebarItem } from "./types";
// ! Remove when no vue router installed
import { useRouter, RouterLink } from "vue-router";

const props = defineProps<{
    item: string | number | SidebarItem;
}>();

const label = computed(() => {
    const { item } = props;
    if (typeof item === "string") return item;
    if (typeof item === "number") return item.toString();
    return item.label || item.name;
});

const tooltip = computed(() => {
    const { item } = props;
    if (typeof item === "string") return "";
    if (typeof item === "number") return "";
    return {
        text: item.tooltip || "",
        hotkey: item.hotkey,
    };
});

//#region Handle clicking
// ! Remove when no vue router installed
const router = useRouter();
const onClick = () => {
    const { item } = props;
    if (typeof item === "object") {
        if (item.click) item.click();
        if (item.route) router.push(item.route);
    }
};
</script>

<template>
    <RouterLink
        v-if="typeof item === 'object' && item.route"
        :to="item.route"
        v-slot="{ isActive, href, navigate }"
    >
        <div
            class="flex cursor-pointer select-none items-center justify-center rounded p-3 text-surface-400 item"
            :class="{ selected: isActive, 'not-selected': !isActive }"
            @click="onClick"
            v-ripple
            v-tip="tooltip"
        >
            <template v-if="typeof item === 'number' || typeof item === 'string'">
                <div class="label">
                    {{ label }}
                </div>
            </template>
            <template v-else>
                <i class="pi text-xl" :class="item.icon" />
                <span class="label flex gap-2">
                    <span>{{ label }}</span>
                </span>
            </template>
        </div>
    </RouterLink>
    <div
        v-else
        class="flex cursor-pointer select-none items-center justify-center rounded p-3 text-surface-400"
        @click="onClick"
        v-ripple
        v-tip="tooltip"
    >
        <template v-if="typeof item === 'number' || typeof item === 'string'">
            <div class="label">
                {{ label }}
            </div>
        </template>
        <template v-else>
            <i class="pi text-xl" :class="item.icon" />
            <span class="label flex gap-2">
                <span>{{ label }}</span>
            </span>
        </template>
    </div>
</template>

<style lang="scss" scoped>
div.selected:not(.not-selected) {
    @apply bg-surface-800/60 text-surface-200 hover:bg-surface-800;
}

.label {
    @apply w-full max-w-0 overflow-hidden font-semibold transition-all group-hover:max-w-7xl group-hover:pl-3 break-keep whitespace-nowrap;
}

.item {
    @apply bg-inherit hover:bg-surface-900;
}
</style>
