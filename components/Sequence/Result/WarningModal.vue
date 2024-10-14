<script setup lang="ts">
const open = defineModel({ default: false });

const props = defineProps<{
  warnings: Warning[];
}>();
const { warnings } = toRefs(props);

// pages
const mapped_pages = useArrayMap(warnings, (p) => p.page);
const pages = useArrayUnique(mapped_pages);

// chosen pages
const chosen_page = ref(0);
const shown_warnings = useArrayFilter(
  warnings,
  (w) => w.page === pages.value[chosen_page.value],
);
</script>

<template>
  <Dialog
    v-model:visible="open"
    modal
    header="Conflicts"
    close-on-escape
    dismissable-mask
    class="w-[40vw] !rounded-md"
  >
    <template #container>
      <div class="root">
        <div class="header">
          <span class="text-amber-500">{{ warnings.length }}</span>
          Total Conflict{{ warnings.length > 1 ? "s" : "" }}
        </div>

        <div class="page-list-wrapper">
          <div class="page-list">
            <Button
              v-for="(page, i) in pages"
              :key="page"
              :label="page"
              size="small"
              severity="warn"
              :text="chosen_page !== i"
              @click="chosen_page = i"
            />
          </div>
        </div>

        <div class="warning-list">
          <div v-for="warning in shown_warnings" :key="warning.title">
            <small class="label">{{ warning.title }}</small>
            <div class="card !mb-0 !rounded-b-none !pb-1">
              {{ warning.description }}
            </div>
            <pre>{{ warning.code }}</pre>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
.root {
  @apply space-y-1 px-3.5 py-3;

  .header {
    @apply text-lg font-bold text-surface-400;
  }

  .page-list-wrapper {
    @apply w-full overflow-x-auto;

    .page-list {
      @apply flex w-max gap-1;

      .button {
        @apply w-max flex-shrink-0;
      }
    }
  }

  .warning-list {
    @apply flex max-h-[50vh] flex-col gap-2 overflow-y-auto;

    .label {
      @apply text-surface-500;
    }

    pre {
      @apply rounded-b-md bg-surface-800 px-2 py-1.5 text-sm;
    }
  }
}
</style>
