<script setup lang="ts">
const { result } = defineProps<{
  result: GeneratedResult;
}>();
</script>

<template>
  <SequenceResultListItemBase type="Success">
    <template #icon>
      <i class="pi pi-check bg-emerald-500" />
    </template>
    <div class="flex w-full items-center justify-between">
      <span class="color">Success</span>
      <small>Click to view result</small>
    </div>
  </SequenceResultListItemBase>
</template>

<style lang="scss" scoped>
.color {
  @apply text-emerald-400;
}

small {
  @apply hidden flex-grow text-center text-surface-400 group-hover:block;
}
</style>
