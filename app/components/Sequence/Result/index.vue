<script setup lang="ts">
import { get, set } from "@vueuse/core";
import { useGenerateStore, GenerationStep } from "../../../stores/generate";

const generateStore = useGenerateStore();

const {
    step,
    gen_status,
    error,
    progress,
    data: optimal,
    warningsToKeep,
    warnings,
} = storeToRefs(generateStore);

// Show error toast
whenever(error, (err) => {
    console.error(err);
});

// Show validation modal
const open_conflict_details = ref(true);
const is_validating = computed({
    get: () =>
        generateStore.strictMode && get(step) === GenerationStep.Validating,
    set: () => {},
});
const show_conflict_details = computed({
    get: () => get(open_conflict_details) && get(is_validating),
    set: (v) => set(open_conflict_details, v),
});

// Handle adding/removing accepting warnings
const addAccepted = (id: string) => {
    const alreadyAccepted = warningsToKeep.value.includes(id);
    if (alreadyAccepted) return;
    warningsToKeep.value.push(id);
};

const removeAccepted = (id: string) => {
    const index = warningsToKeep.value.findIndex((w) => id === w);
    if (index === -1) return;
    warningsToKeep.value.splice(index, 1);
};
</script>

<template>
    <div class="flex h-full min-w-96 flex-col gap-2">
        <SequenceResultStatus
            @cancel="generateStore.cancel"
            :progress
            :description="GenerationStatus[gen_status]"
            v-if="step === GenerationStep.Generating"
        />
        <div v-if="is_validating" class="space-y-2">
            <p>
                There are
                <span class="mx-1 text-amber-500">
                    {{ warnings.length - warningsToKeep.length || "no" }}
                </span>
                conflicts that will be removed
                <template v-if="warningsToKeep.length">
                    and
                    <span class="text-green-500">
                        {{
                            warningsToKeep.length === warnings.length
                                ? "all"
                                : warningsToKeep.length
                        }}
                    </span>
                    will be kept
                </template>
                .
            </p>
            <Button
                label="Review conflicts"
                icon="pi pi-list-check"
                severity="warn"
                fluid
                @click="open_conflict_details = true"
            />

            <Button
                label="Accept Output"
                fluid
                icon="pi pi-check-circle"
                @click="generateStore.save"
            />
            <Button label="Cancel" fluid icon="pi pi-times" @click="generateStore.cancel" />
        </div>
        <Fill center v-if="step === GenerationStep.Saving">
            <Loading data="Saving" />
        </Fill>

        <!-- Modal -->
        <SequenceResultValidation
            v-model:open="show_conflict_details"
            :accepted="warningsToKeep"
            :warnings
            @accept="addAccepted"
            @unaccept="removeAccepted"
        />
    </div>
</template>

<style lang="scss" scoped></style>
