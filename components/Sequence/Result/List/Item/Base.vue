<script setup lang="ts">
// props
const { type, selected } = defineProps<{
  type: "Error" | "Warning" | "Success";
  selected?: boolean;
}>();

// slots
const slots = defineSlots<{
  default: () => any;
  icon: () => any;
  right: () => any;
}>();
</script>

<template>
  <div
    class="root group"
    :class="{
      'cursor-pointer': type !== 'Error',
      selected,
    }"
  >
    <div class="result-icon-container">
      <slot name="icon">
        <i class="success pi pi-check"></i>
      </slot>
    </div>

    <div class="flex flex-grow items-center gap-1">
      <slot> </slot>
    </div>

    <div class="right-container">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.result-icon-container i {
  @apply rounded-full p-1 px-1.5 text-xs font-bold text-surface-800;

  &.success {
    @apply bg-emerald-500;
  }
}
</style>

<style lang="scss" scoped>
.root {
  @apply flex gap-2 rounded p-2 hover:bg-surface-800;

  &.selected {
    @apply bg-surface-800 hover:bg-surface-700;
  }
}
</style>
