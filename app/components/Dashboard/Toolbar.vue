<script setup lang="ts">
import { set } from "@vueuse/core";
import type { ButtonProps } from "primevue/button";
import type { SequencerXMLTypes, SidebarViews } from "~/stores/ui";

const uiStore = useUiStore();
const { minimized_sidebar, diagram, sidebar_tab: side_tab } = storeToRefs(uiStore);

const isCurrentDiagram = (type: SequencerXMLTypes): ButtonProps["severity"] =>
    type === diagram.value ? "primary" : "secondary";

//#region Sideview tab
const isCurrentTab = (type: SidebarViews): ButtonProps["severity"] =>
    type === side_tab.value ? "success" : "secondary";

const toggleSideTab = (type: SidebarViews) => {
    if (side_tab.value !== type) set(side_tab, type);
    else set(side_tab, undefined);
};
</script>

<template>
    <div class="flex gap-2 items-center">
        <!-- Left Part -->
        <ChevronToggle v-model="minimized_sidebar" v-tip="`Expand/hide the sidebar`" />
        <ButtonGroup>
            <Button @click="diagram = 'class'" :severity="isCurrentDiagram('class')">Class</Button>
            <Button @click="diagram = 'usecase'" :severity="isCurrentDiagram('usecase')">
                Usecase
            </Button>
        </ButtonGroup>
        <i class="pi pi-angle-right text-surface-400" />
        <Button
            @click="(diagram = 'sequence') && (side_tab = 'generate')"
            :severity="isCurrentDiagram('sequence')"
        >
            Sequence
        </Button>

        <!-- Right Part -->
        <ButtonGroup class="ml-auto mr-2">
            <Button
                @click="toggleSideTab('info')"
                icon="pi pi-info-circle"
                :text="side_tab !== 'info'"
                :severity="isCurrentTab('info')"
            />
            <Button
                v-if="diagram === 'sequence'"
                @click="toggleSideTab('generate')"
                icon="pi pi-cog"
                :text="side_tab !== 'generate'"
                :severity="isCurrentTab('generate')"
            />
        </ButtonGroup>
    </div>
</template>

<style lang="scss" scoped></style>
