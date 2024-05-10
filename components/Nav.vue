<script lang="ts" setup>
const slots = defineSlots<{
    header(): any;
    actions(): any;
}>();

const { header } = defineProps<{
    header?: string;
}>();

const side_open = ref(false);
</script>

<template>
    <div
        class="px-4 py-2 flex justify-between bg-primary-emph border-secondary border-r border-b"
    >
        <div class="flex items-center gap-2">
            <UButton
                color="gray"
                icon="i-mdi-menu"
                variant="link"
                @click="side_open = true"
            />
            <slot name="header">
                <span class="font-semibold text-lg">
                    {{ header }}
                </span>
            </slot>
        </div>

        <!-- Slideover -->
        <USlideover
            v-model="side_open"
            side="left"
        >
            <Sidebar />
        </USlideover>
    </div>
</template>

<style lang="scss" scoped></style>
