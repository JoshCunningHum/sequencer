<script lang="ts" setup>
definePageMeta({
    middleware: "auth",
});

const step = ref(-1);

enum Diagram {
    Class,
    UseCase,
}

const diag = ref(Diagram.Class);
</script>

<template>
    <Fill>
        <Nav header="Dashboard" />
        <Fill flex-row>
            <StepNav
                v-model="step"
                :steps="['Requirements', 'Generate']"
            />
            <UDivider orientation="vertical" />
            <StepNav
                v-if="step === 0"
                v-model="diag"
                :steps="['Class', 'UseCase']"
            />
            <UDivider orientation="vertical" />
            <DrawIOEmbed />
        </Fill>
    </Fill>
</template>

<style lang="scss" scoped></style>
