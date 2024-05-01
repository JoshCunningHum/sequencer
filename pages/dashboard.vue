<script lang="ts" setup>
import { get, set } from "@vueuse/core";

definePageMeta({
    middleware: "auth",
});

const step = ref(-1);
const reloaded = ref(false);
const preloading = ref(false);

enum Diagram {
    Class,
    UseCase,
}

const diag = ref(Diagram.Class);

watch(step, (v) => {
    if (get(reloaded)) return;
    if (v === 0) set(preloading, true);
});

const onDrawIoLoaded = () => {
    set(reloaded, true);
    set(preloading, false);
};
</script>

<template>
    <Fill>
        <Nav header="Dashboard" />
        <Fill flex-row>
            <StepNav
                :disabled="preloading"
                v-model="step"
                :steps="['Requirements', 'Generate']"
            />
            <UDivider orientation="vertical" />
            <StepNav
                :disabled="preloading"
                v-if="step === 0"
                v-model="diag"
                :steps="['Class', 'Use Case']"
            />
            <UDivider orientation="vertical" />
            <template v-if="preloading || reloaded">
                <DrawIOEmbed
                    @loaded="onDrawIoLoaded"
                    v-show="step === 0"
                />
            </template>
        </Fill>
    </Fill>
</template>

<style lang="scss" scoped></style>
