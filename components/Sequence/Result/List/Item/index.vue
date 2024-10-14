<script setup lang="ts">
const { result } = defineProps<{
  result: GeneratedResult;
  index: number;
}>();

const type = computed(() =>
  result.errors.length
    ? "Error"
    : result.warnings.length
      ? "Warning"
      : "Success",
);

const generation = useGenerationStore();
const view = () => {
  generation.view(result);
};
</script>

<template>
  <SequenceResultListItemWarning
    @click="view"
    v-if="type === 'Warning'"
    :result
  />
  <SequenceResultListItemSuccess
    @click="view"
    v-if="type === 'Success'"
    :result
  />
  <SequenceResultListItemError v-if="type === 'Error'" :result />
</template>
