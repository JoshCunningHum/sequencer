<script lang="ts" setup>
defineOptions({
    inheritAttrs: false,
});

// Dev Mode
const devStore = useDevStore();
const { enabled: dev_enabled } = storeToRefs(devStore);

const devgenerationitems = [
    {
        label: "Prompt",
        icon: "i-mdi-message-outline",
        slot: "prompt",
    },
    {
        label: "Result Text Representation",
        icon: "i-mdi-dots-hexagon",
        slot: "result",
    },
    {
        label: "XML Raw",
        icon: "i-mdi-xml",
        slot: "xml",
    },
    {
        label: "XML Parsed Data",
        icon: "i-mdi-xml",
        slot: "xml-parsed",
    },
];

// Generate Store
const generationStore = useGenerationStore();
const { sequencetxt, sequenceprompt, sequencexml, sequencetestprompt } =
    storeToRefs(generationStore);
</script>

<template>
    <div class="flex flex-col w-full gap-2">
        <div
            :="$attrs"
            class="w-full border-2 border-dashed rounded-md border-secondary-emph"
            :class="[!sequencexml ? 'min-h-80' : 'min-h-screen']"
        >
            <ForcedPreloader
                :show="!!sequencexml"
                v-slot="{ done }"
            >
                <DrawIOEmbed
                    v-model="sequencexml"
                    @loaded="done"
                    v-show="!!sequencexml"
                    view-only
                />
            </ForcedPreloader>
            <Fill
                v-if="!sequencexml || sequencexml.length < 1"
                center
                class="text-secondary-emph select-none z-10"
                >No Data Saved</Fill
            >
        </div>
        <UTextarea
            v-if="dev_enabled"
            placeholder="Input prompt data here"
            v-model="sequencetestprompt"
            autoresize
            :maxrows="10"
        />
        <ConfirmationListItem v-if="dev_enabled">
            <UAccordion
                multiple
                :items="devgenerationitems"
            >
                <template #default="{ item, index, open }">
                    <ConfirmationListButton
                        :index="index"
                        :open="open"
                        :item="item"
                    />
                </template>

                <template #prompt>
                    <Copier
                        :text="sequenceprompt"
                        v-if="sequenceprompt !== ''"
                    >
                        <pre>{{ sequenceprompt }}</pre>
                    </Copier>
                    <Empty
                        no-icon
                        v-else
                    >
                        No Prompt Made Yet
                    </Empty>
                </template>

                <template #result>
                    <Copier
                        :text="sequencetxt"
                        v-if="!!sequencetxt"
                    >
                        <pre>{{ sequencetxt }}</pre>
                    </Copier>
                    <Empty
                        no-icon
                        v-else
                    >
                        No Result Yet
                    </Empty>
                </template>

                <template #xml>
                    <Copier
                        :text="sequencexml"
                        v-if="!!sequencexml"
                    >
                        <pre>{{ sequencexml }}</pre>
                    </Copier>
                    <Empty
                        no-icon
                        v-else
                    >
                        No Result Yet
                    </Empty>
                </template>

                <!-- XML -->
                <template #xml-parsed>
                    <ConfirmationListItem v-if="!!sequencexml">
                        <Copier :text="sequencexml">
                            <XMLViewer :xml="sequencexml" />
                        </Copier>
                    </ConfirmationListItem>
                    <Empty
                        no-icon
                        v-else
                    >
                        No XML Yet
                    </Empty>
                </template>
            </UAccordion>
        </ConfirmationListItem>
    </div>
</template>

<style lang="scss" scoped></style>
