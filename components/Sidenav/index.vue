<script setup lang="ts" generic="T extends string | number | SidebarItem">
import { computed, toRefs } from "vue";
import Item from "./Item.vue";
import type { SidebarItem } from "./types";
import { useArrayFilter } from "@vueuse/core";

const model = defineModel<T>({ required: false });
const props = defineProps<{
    items: T[];

    // optional states
    noSelection?: boolean;
}>();

const { items } = toRefs(props);

const top_items = useArrayFilter(items, (item) => typeof item !== "object" || !item.last);

const bottom_items = useArrayFilter(items, (item) => typeof item === "object" && !!item.last);

const selected = computed(() => {
    const { items } = props;
    const { value: chosen } = model;
    if (!chosen) return -1;
    if (typeof chosen === "string" || typeof chosen === "number") {
        return items.findIndex((str) => str === chosen);
    }

    const name = chosen.name;
    return items.findIndex((item) => typeof item === "object" && item.name === name);
});

//#region Slots
const slots = defineSlots<{
    top(): any;
    bottom(): any;
}>();
</script>

<template>
    <div class="relative h-full w-[55px] z-10">
        <div class="group absolute flex h-full flex-col min-w-[55px] bg-surface-950 p-2">
            <slot name="top"></slot>
            <div class="flex flex-grow flex-col gap-2">
                <Item
                    v-for="(item, key) in top_items"
                    :key
                    :item
                    :class="{
                        selected: selected === key && !noSelection,
                    }"
                    @click="model = item"
                />
            </div>
            <div class="flex flex-col gap-2">
                <Item
                    v-for="(item, key) in bottom_items"
                    :key
                    :item
                    :class="{
                        selected: selected === key + top_items.length && !noSelection,
                    }"
                    @click="model = item"
                />
            </div>
            <slot name="bottom"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
