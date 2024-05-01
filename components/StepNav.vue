<script lang="tsx" setup>
import UButton from "#ui/components/elements/Button.vue";

interface Step {
    label: string;
    click: () => void;
}

// Props
const {
    orientation = "vertical",
    steps,
    noCurrent = false,
    disabled = false,
} = defineProps<{
    orientation?: "vertical" | "horizontal";
    steps: (Step | string)[];
    noCurrent?: boolean;
    disabled?: boolean;
}>();

// Handles highlighting
const current = defineModel<number>({ default: -1 });

// Container Ref
const container = ref<InstanceType<typeof HTMLDivElement>>();

// Step Component
const Step = ({ value, index }: { value: Step | string; index: number }) => {
    const txt = typeof value === "string" ? value : value.label;
    const isCurrent = index === current.value;

    return (
        <div
            onClick={() => {
                if (noCurrent) return;
                current.value = index;
            }}
            class={`z-10 bg-primary ${disabled ? "cursor-not-allowed" : ""}`}
        >
            <UButton
                disabled={disabled}
                block
                color={isCurrent ? "primary" : "gray"}
                class="z-10 break-keep"
                size="sm"
            >
                <span
                    style={{
                        "word-break": "keep-all",
                        hyphens: "none",
                        "white-space": "nowrap",
                    }}
                >
                    {txt}
                </span>
            </UButton>
        </div>
    );
};

// Correct the height of the "Step Line"
const stepLineHeight = ref(0);
onMounted(() => {
    if (container.value) stepLineHeight.value = container.value.clientHeight;
});
</script>

<template>
    <div class="p-3 relative">
        <div
            class="absolute w-1 bg-secondary top-[1rem] left-[50%]"
            :style="{ height: `calc(${stepLineHeight}px - 1rem)` }"
        ></div>
        <div
            :class="[orientation === 'vertical' ? 'flex flex-col' : 'flex']"
            class="gap-3"
            ref="container"
        >
            <Step
                v-for="(step, i) in steps"
                :value="step"
                :index="i"
                :key="i"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "~/assets/_colors.scss" as *;
</style>
