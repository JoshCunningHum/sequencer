<script lang="ts" setup>
import { useDevStore } from "../../stores/dev";
import { set, promiseTimeout } from "@vueuse/core";
import { useAsyncStateTimeout } from "../../composables/AsyncStateTimeout";

// Dev Mode Toggling
const devStore = useDevStore();
const { enabled: devmode } = storeToRefs(devStore);

// Generate Store
const generatestore = useGenerationStore();

// Cancel
const cancel = ref(false);

const onCancel = () => {
    set(cancel, true);
};

const {
    error,
    execute: onGenerate,
    isLoading: showProgress,
    isReady,
    then,
} = useAsyncStateTimeout(generatestore.generate, null, {
    timeout: 30000,
    immediate: false,
});

then(
    () => promiseTimeout(500),
    () => promiseTimeout(500)
);
</script>

<template>
    <Fill
        class="gap-2 p-4 DMSans"
        flex-col
    >
        <GenerateErrorModal />

        <ModalGenerateCancel v-model="cancel" />
        <ModalGenerateNew />

        <div class="flex gap-2">
            <GenerateProgress :expand="showProgress" />
            <GenerateResultContainer />
        </div>

        <!-- Additional Context -->
        <!-- <UFormGroup
            label="Additional Context"
            hint="Optional"
        >
            <UInput
                placeholder="Enter additional details you want to include..."
            />
        </UFormGroup> -->

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
