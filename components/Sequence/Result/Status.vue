<script setup lang="ts">
const generationStore = useGenerationStore();
const { is_applying, status, viewing } = storeToRefs(generationStore);

const status_messages: Record<keyof typeof GenerationStatus, string> = {
    GeneratingPrompt: "Generating prompt",
    Idle: "Idle",
    PendingResult: "Awaiting for result",
    ValidatingResult: "Checking for errors",
    Success: "Generation completed",
};
const status_key = computed(() => GenerationStatus[status.value] as keyof typeof GenerationStatus);
const status_message = computed(() => status_messages[status_key.value]);
const status_progress = computed(() => (Number(status.value) / 4) * 100);
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
            <Loading no-text class="text-primary-500" v-if="status_key !== 'Success'" />
            <i class="pi pi-check-circle text-primary-500" v-else />

            <div class="flex-grow flex flex-col">
                <span>{{ status_message }}</span>
                <ProgressBar :value="status_progress" style="height: 2px" :show-value="false" />
            </div>
            <Button
                icon="pi pi-times"
                v-tip="{
                    text: status_key === 'Success' ? 'Exit' : 'Cancel',
                }"
                severity="danger"
                text
                @click="generationStore.stop()"
            />
        </div>
        <Button
            v-if="!!viewing"
            label="Apply selected result"
            :loading="is_applying"
            @click="generationStore.choose(viewing)"
        />
    </div>
</template>

<style lang="scss" scoped></style>
