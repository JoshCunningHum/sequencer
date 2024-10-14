<script setup lang="ts">
const { result } = defineProps<{
  result: GeneratedResult;
}>();

// tooltip
const conflicts_by_page = computed(
  () =>
    "<span class='text-surface-400'>Conflicts found:</span><br />" +
    mapReduce<string, number, Warning>(result.warnings, (map, item) => {
      map.set(item.page, (map.get(item.page) || 0) + 1);
    })
      .map(
        ([page, amount]) =>
          `<span class="text-amber-400">${amount}</span> - ${page}`,
      )
      .join("<br />"),
);

// show warning modal
const show_warnings = inject("show_warnings", (values: Warning[]) => {});
const show_conflicts = () => show_warnings(result.warnings);

// viewing status
const generation = useGenerationStore();
const { viewing } = storeToRefs(generation);
const is_viewing = computed(() => viewing.value?.id === result.id);
</script>

<template>
  <SequenceResultListItemBase type="Warning" :selected="is_viewing">
    <template #icon>
      <i class="pi pi-exclamation-triangle bg-amber-500" />
    </template>
    <div class="flex w-full items-center justify-between">
      <span class="color">Warning</span>
      <small :class="{ is_viewing }">
        {{ is_viewing ? "currently viewed" : "click to view result" }}
      </small>
    </div>
    <template #right>
      <Button
        v-tip="conflicts_by_page"
        :label="`${result.warnings.length} conflicts`"
        severity="warn"
        size="small"
        @click.stop="show_conflicts"
      />
    </template>
  </SequenceResultListItemBase>
</template>

<style lang="scss" scoped>
.color {
  @apply text-amber-400;
}

small {
  @apply flex-grow text-center text-surface-400 group-hover:block;

  &.is_viewing {
    @apply text-emerald-400;
  }

  &:not(.is_viewing) {
    @apply hidden;
  }
}
</style>
