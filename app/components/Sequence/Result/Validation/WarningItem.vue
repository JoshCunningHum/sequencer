<script setup lang="ts">
import {
    ValidationErrorType,
    type ValidationError,
} from "~/logic/sequence/validator.plant";

const checked = defineModel<boolean>();
const { warning } = defineProps<{ warning: ValidationError }>();
const title = computed(() => ValidationErrorType[warning.type]);
</script>

<template>
    <div class="warning" :class="{ checked }" @click="checked = !checked">
        <input type="checkbox" v-model="checked" />
        <div class="grow">
            <small class="label">{{ title }}</small>
            <div class="card !mb-0 !rounded-b-none pb-1">
                {{ warning.description }}
            </div>
            <pre>{{ warning.code_reference }}</pre>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.warning {
    @apply relative flex cursor-pointer gap-2 rounded-md px-2 py-1;

    .label {
        @apply text-surface-500;
    }

    pre {
        @apply rounded-b-md bg-surface-800 px-2 py-1.5 text-sm;
    }

    &.checked {
        @apply border border-amber-500;

        &::after {
            @apply absolute right-2 top-1 block text-sm text-amber-500;
            content: "maintained";
        }
    }
}
</style>
