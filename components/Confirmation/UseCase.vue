<script lang="ts" setup>
import { UseCaseData } from "~/models/UseCaseDiagramData";

const { data } = defineProps<{
    data: UseCaseData;
}>();

const getID = (value: string = data.value.toString()) => {
    return "conf-data-" + value.replaceAll(/\s/gi, "");
};
</script>

<template>
    <ConfirmationListItem
        :id="getID()"
        class="mb-2"
    >
        <div
            class="text-lg font-semibold border-b p-2 py-1 border-secondary-emph"
        >
            {{ data.value }}
        </div>
        <div
            class="p-2 flex flex-wrap content-start gap-2"
            v-if="data.involves.length"
        >
            <UBadge
                v-for="act in data.involves"
                :label="act"
                color="orange"
            />
        </div>
        <div
            class="p-2"
            v-if="data.incl.length"
        >
            <div class="text-secondary-emph DMSans">INCLUDES</div>
            <a
                v-for="incl in data.incl"
                :key="getID(incl.value)"
                :href="`#${getID(incl.value)}`"
            >
                <ConfirmationListItem>
                    {{ incl.value }}
                </ConfirmationListItem>
            </a>
        </div>
        <div
            class="p-2"
            v-if="data.exts.length"
        >
            <div class="text-secondary-emph DMSans">EXTENDS</div>
            <a
                v-for="ext in data.exts"
                :key="getID(ext.value)"
                :href="`#${getID(ext.value)}`"
            >
                <ConfirmationListItem>
                    {{ ext.value }}
                </ConfirmationListItem>
            </a>
        </div>
    </ConfirmationListItem>
</template>

<style lang="scss" scoped></style>
