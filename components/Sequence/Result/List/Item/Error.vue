<script setup lang="ts">
const { result } = defineProps<{
  result: GeneratedResult;
}>();
</script>

<template>
  <SequenceResultListItemBase type="Error">
    <template #icon>
      <i class="pi pi-times bg-rose-500" />
    </template>
    <div class="flex w-full items-center justify-between">
      <span class="color">Error</span>
    </div>
    <template #right>
      <span class="label">
        <span class="color">
          {{ result.errors[0]!.title }}
        </span>
      </span>
    </template>
  </SequenceResultListItemBase>
</template>

<style lang="scss" scoped>
.color {
  @apply text-rose-400;
}

small {
  @apply hidden flex-grow text-center text-surface-400 group-hover:block;
}
</style>
