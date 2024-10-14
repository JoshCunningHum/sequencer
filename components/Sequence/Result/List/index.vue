<script setup lang="ts">
const { results } = defineProps<{
  results: GeneratedResult[];
}>();

// Warning Modal
const open_conflict_modal = ref(false);
const displayed_warnings = ref<Warning[]>([]);
const show_warnings = (warnings: Warning[]) => {
  open_conflict_modal.value = true;
  displayed_warnings.value.splice(0);
  displayed_warnings.value.push(...warnings);
};
provide("show_warnings", show_warnings);
</script>

<template>
  <Fill
    class="flex flex-col gap-1 rounded-md bg-surface-900 p-2"
    overflow-scroll-y
  >
    <Empty
      v-if="results.length === 0"
      class="text-surface-500"
      text="No results so far"
    />
    <SequenceResultListItem
      v-for="(result, i) in results"
      :key="result.id"
      :result
      :index="i"
    />

    <SequenceResultWarningModal
      v-model="open_conflict_modal"
      :warnings="displayed_warnings"
    />
  </Fill>
</template>

<style lang="scss" scoped></style>
