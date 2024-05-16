<script lang="ts" setup>
import { useGenerationStore } from "../../stores/generation";

// Store and data
const generateStore = useGenerationStore();
const {
    classdata,
    classjson,
    classxml,
    classprompt,
    usecasedata,
    usecasejson,
    usecasexml,
    usecaseprompt,
    states,
} = storeToRefs(generateStore);

const usecase_list = computed(() =>
    usecasedata.value.systems.flatMap((s) => s.data)
);

const isClassDone = computed(() => states.value.class);
const isUsecaseDone = computed(() => states.value.usecase);

// Accordion
const itemformat = [
    {
        label: "XML",
        icon: "i-mdi-xml",
        slot: "xml",
        defaultOpen: false,
    },
    {
        label: "JSON",
        icon: "i-mdi-json",
        slot: "json",
        defaultOpen: true,
    },
    {
        label: "Data",
        icon: "i-mdi-data",
        slot: "data",
        defaultOpen: true,
    },
    {
        label: "Prompt",
        icon: "i-mdi-text",
        slot: "prompt",
        defaultOpen: true,
    },
];
</script>

<template>
    <Fill class="gap-1 DMSans">
        <!-- Class-->
        <Fill
            class="p-2"
            flex-col
        >
            <Loader
                :finished="!isClassDone"
                text="Processing Class Diagram"
            >
                <div class="text-lg text-secondary-emph font-medium">
                    Class Diagram
                </div>
                <UAccordion
                    :items="itemformat"
                    multiple
                >
                    <template #default="{ item, index, open }">
                        <ConfirmationListButton
                            :index="index"
                            :open="open"
                            :item="item"
                        />
                    </template>

                    <!-- XML -->
                    <template #xml>
                        <ConfirmationListItem>
                            <Copier :text="classxml">
                                <XMLViewer :xml="classxml" />
                            </Copier>
                        </ConfirmationListItem>
                    </template>

                    <!-- JSON -->
                    <template #json>
                        <ConfirmationListItem v-if="classjson">
                            <ObjectViewer :obj="classjson" />
                        </ConfirmationListItem>
                    </template>

                    <!-- Data -->
                    <template #data>
                        <div
                            class="flex flex-wrap items-start justify-start gap-2 content-start"
                            v-if="classdata"
                        >
                            <ConfirmationClass
                                :key="i"
                                :data="c"
                                v-for="(c, i) in classdata.classes"
                            />
                        </div>
                    </template>

                    <!-- Prompt -->
                    <template #prompt>
                        <ConfirmationListItem>
                            <Copier :text="classprompt">
                                <pre
                                    class="overflow-auto p-1 px-2"
                                    v-if="classprompt"
                                    >{{ classprompt }}</pre
                                >
                            </Copier>
                        </ConfirmationListItem>
                    </template>
                </UAccordion>
            </Loader>
        </Fill>

        <UDivider orientation="vertical" />

        <!-- Usecase-->
        <Fill
            class="p-2"
            flex-col
        >
            <Loader
                :finished="!isUsecaseDone"
                text="Processing Use Case Diagram"
            >
                <div class="text-lg text-secondary-emph font-medium">
                    Usecase Diagram
                </div>
                <UAccordion
                    :items="itemformat"
                    multiple
                >
                    <template #default="{ item, index, open }">
                        <ConfirmationListButton
                            :index="index"
                            :open="open"
                            :item="item"
                        />
                    </template>

                    <!-- XML -->
                    <template #xml>
                        <ConfirmationListItem>
                            <Copier :text="usecasexml">
                                <XMLViewer :xml="usecasexml" />
                            </Copier>
                        </ConfirmationListItem>
                    </template>

                    <!-- JSON -->
                    <template #json>
                        <ConfirmationListItem v-if="usecasejson">
                            <ObjectViewer :obj="usecasejson" />
                        </ConfirmationListItem>
                    </template>

                    <!-- Data -->
                    <template #data>
                        <ConfirmationUseCase
                            v-for="(u, i) in usecase_list"
                            :data="u"
                            :key="i"
                        />
                    </template>

                    <!-- Prompt -->
                    <template #prompt>
                        <ConfirmationListItem>
                            <Copier :text="usecaseprompt">
                                <pre
                                    class="overflow-auto p-1 px-2"
                                    v-if="usecaseprompt"
                                    >{{ usecaseprompt }}</pre
                                >
                            </Copier>
                        </ConfirmationListItem>
                    </template>
                </UAccordion>
            </Loader>
        </Fill>
    </Fill>
</template>

<style lang="scss" scoped></style>
