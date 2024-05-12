<script lang="ts" setup>
import { ClassData } from "../../models/ClassDiagramData";

// Arguments
const props = defineProps<{
    data: ClassData;
}>();

const { data } = toRefs(props);
</script>

<template>
    <ConfirmationListItem class="flex flex-col !p-0 min-w-fit">
        <div
            class="text-lg font-semibold border-b p-2 py-1 border-secondary-emph"
        >
            {{ data.name }}
        </div>
        <div class="p-2">
            <div v-for="field in data.properties">
                {{ field }}
            </div>
            <div
                v-if="!data.properties || !data.properties.length"
                class="text-secondary-emph text-center"
            >
                -- Nothing --
            </div>
        </div>
    </ConfirmationListItem>
</template>

<style lang="scss" scoped></style>
