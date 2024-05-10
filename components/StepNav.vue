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

// Slot Definitions
const slots = defineSlots<{
    item(props: { step: Step | string; index: number; click: () => void }): any;
}>();

// click handler for slotted item
const onClick = (index: number) => {
    if (noCurrent) return;
    current.value = index;
};

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

const pad = "2rem";
</script>

<template>
    <div class="relative h-fit">
        <div
            :class="`absolute ${
                // Width
                orientation === 'vertical' ? 'w-1 h-[80%]' : 'w-[80%] h-1'
            } bg-secondary ${
                // translation
                orientation === 'vertical'
                    ? '-translate-x-0.5'
                    : '-translate-y-0.5'
            }`"
            :style="{
                // height
                height:
                    orientation === 'vertical' ? `calc(100% - ${pad})` : '4px',
                // width
                width:
                    orientation === 'horizontal'
                        ? `calc(100% - ${pad})`
                        : '4px',
                // positioning
                top: orientation === 'vertical' ? `calc(${pad} / 2)` : '50%',
                left: orientation === 'horizontal' ? `calc(${pad} / 2)` : '50%',
            }"
        ></div>
        <div
            :class="[orientation === 'vertical' ? 'flex flex-col' : 'flex']"
            class="gap-3"
            ref="container"
        >
            <template
                v-for="(step, i) in steps"
                :key="i"
            >
                <slot
                    name="item"
                    :step="step"
                    :click="() => onClick(i)"
                    :index="i"
                >
                    <Step
                        :value="step"
                        :index="i"
                    />
                </slot>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "~/assets/_colors.scss" as *;
</style>
