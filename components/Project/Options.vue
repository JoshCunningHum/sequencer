<script lang="ts" setup>
import type { VerticalNavigationLink } from "#ui/types";
import type { Project } from "~/types";
import { useModalStore } from "../../stores/modal";

// Component Arguments
const { project } = defineProps<{
    project: Project;
    disabled?: boolean;
}>();

const modalStore = useModalStore();

// Project Options
const project_options: VerticalNavigationLink[] = [
    {
        label: "Rename",
        icon: "i-mdi-edit",
        labelClass: "text-xs",
        click: () => {
            modalStore.project_to_be_renamed = project;
            console.log("renaming");
        },
    },
    {
        label: "Remove",
        icon: "i-mdi-delete",
        labelClass: "text-xs",
        click: () => {
            modalStore.project_to_be_deleted = project;
            console.log("deleting");
        },
    },
];

// UI
const popoverui = /* ui */ {
    trigger: "flex",
    shadow: "",
    rounded: "rounded-sm",
};
</script>

<template>
    <div class="flex-1 flex justify-end items-end relative">
        <UPopover
            :ui="popoverui"
            :disabled="disabled"
            :popper="{ placement: 'right-start' }"
        >
            <UButton
                class="flex"
                variant="link"
                color="gray"
                icon="i-mdi-dots-horizontal"
                :padded="false"
            />

            <template #panel>
                <div class="p-0.5 bg-secondary">
                    <UVerticalNavigation :links="project_options" />
                </div>
            </template>
        </UPopover>
    </div>
</template>

<style lang="scss" scoped></style>
