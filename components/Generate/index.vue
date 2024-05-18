<script lang="ts" setup>
import { useDevStore } from "../../stores/dev";
import { set } from "@vueuse/core";

// Dev Mode Toggling
const devStore = useDevStore();
const { enabled: devmode } = storeToRefs(devStore);

// Show of progress
const showProgress = ref(false);

// Cancel
const cancel = ref(false);

const onCancel = () => {
    set(cancel, true);
};

// Generate

const onGenerate = () => {
    set(showProgress, true);
};
</script>

<template>
    <Fill
        class="gap-2 p-4 DMSans"
        flex-col
    >
        <ModalGenerateCancel v-model="cancel" />
        <ModalGenerateNew />

        <div class="flex gap-2">
            <GenerateProgress :expand="showProgress" />
            <GenerateResultContainer> </GenerateResultContainer>
        </div>

        <UFormGroup
            label="Additional Context"
            hint="Optional"
        >
            <UInput
                placeholder="Enter additional details you want to include..."
            />
        </UFormGroup>

        <div class="relevant mx-auto">
            <TransitionExpand
                group
                appear
                axis="x"
            >
                <UButton
                    v-if="!showProgress"
                    class="mx-auto"
                    icon="i-mdi-play"
                    @click="onGenerate"
                    >Generate</UButton
                >
                <UButton
                    color="red"
                    v-if="showProgress"
                    class="mx-auto"
                    icon="i-mdi-close"
                    @click="onCancel"
                    >Cancel</UButton
                >
            </TransitionExpand>
        </div>
    </Fill>
</template>

<style lang="scss" scoped></style>
