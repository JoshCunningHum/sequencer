<script setup lang="ts">
const { progress, description } = defineProps<{
    progress: number;
    description?: string;
}>();

const emit = defineEmits<{
    cancel: [];
}>();
</script>

<template>
    <div class="flex items-center gap-2">
        <Loading no-text class="text-primary-500" v-if="progress !== 5" />
        <i class="pi pi-check-circle text-primary-500" v-else />

        <div class="flex flex-grow flex-col">
            <span>{{ description }}</span>
            <ProgressBar
                :value="progress * 20"
                style="height: 2px"
                :show-value="false"
            />
        </div>

        <Button
            text
            icon="pi pi-times"
            severity="danger"
            @click="emit('cancel')"
        />
    </div>
</template>

<style lang="scss" scoped></style>
