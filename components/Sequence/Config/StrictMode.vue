<script setup lang="ts">
//#region Generation Settings
const generationStore = useGenerationStore();
const { strictMode } = storeToRefs(generationStore);

const tooltip = /* html */ `Enables strict one to one checking <br /> of the generated sequence diagram <br /> to your class and usecases`;
</script>

<template>
    <div class="flex items-center gap-2">
        <Checkbox input-id="strict-mode" binary v-model="strictMode" />
        <label for="strict-mode">Strict Mode</label>
        <QuestionCircle :tooltip />
    </div>
    <small v-if="strictMode" class="text-amber-400">
        Warning: may take a while to generate an accepted result
    </small>
</template>
