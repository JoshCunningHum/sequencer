<script setup lang="ts">
import type { ButtonProps } from "primevue/button";
import type { SequencerXMLTypes } from "~/stores/ui";

const uiStore = useUiStore();
const { minimized_sidebar, sequencer_tab } = storeToRefs(uiStore);

const isActive = (type: SequencerXMLTypes): ButtonProps["severity"] =>
    type === sequencer_tab.value ? "primary" : "secondary";
</script>

<template>
    <div class="flex gap-2 items-center">
        <i
            v-tip="'Expand/hide the sidebar'"
            class="transition-transform pi pi-chevron-right text-surface-400 cursor-pointer p-2.5 hover:bg-surface-800 rounded-full"
            :class="{
                'rotate-90': minimized_sidebar,
                'rotate-0': !minimized_sidebar,
            }"
            @click="minimized_sidebar = !minimized_sidebar"
        />
        <ButtonGroup>
            <Button @click="sequencer_tab = 'class'" :severity="isActive('class')">Class</Button>
            <Button @click="sequencer_tab = 'usecase'" :severity="isActive('usecase')"
                >Usecase</Button
            >
        </ButtonGroup>
        <i class="pi pi-angle-right text-surface-400" />
        <ButtonGroup>
            <Button @click="sequencer_tab = 'sequence'" :severity="isActive('sequence')"
                >Sequence</Button
            >
        </ButtonGroup>
    </div>
</template>

<style lang="scss" scoped></style>
