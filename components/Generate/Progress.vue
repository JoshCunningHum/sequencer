<script lang="ts" setup>
const props = defineProps<{
    expand?: boolean;
}>();
</script>

<template>
    <TransitionExpand
        v-show="expand"
        axis="x"
    >
        <div class="w-[300px] flex flex-col min-h-0 max-h-[400px]">
            <div
                class="text-base loading-ellipsis flex items-center text-accent gap-1 min-h-0"
            >
                <UIcon
                    name="i-mdi-autorenew"
                    class="animate-spin text-2xl"
                />
                <span>Generating</span>
            </div>
            <Fill
                class="my-1"
                flex-col
            >
            </Fill>
            <UProgress
                size="sm"
                indicator
                :value="85"
            />
        </div>
    </TransitionExpand>
</template>

<style lang="scss" scoped></style>
