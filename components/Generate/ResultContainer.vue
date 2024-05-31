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

const testxml = `<mxfile host="embed.diagrams.net" modified="2024-05-30T13:48:17.390Z" agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0" etag="ItmFtOYEZE0iKiL0W8Hc" version="24.4.10" type="embed">
  <diagram name="Page-1" id="1JH53qiQk0_ZUpMnK-7I">
    <mxGraphModel dx="1325" dy="603" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="36" value="Actor" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;dropTarget=0;collapsible=0;recursiveResize=0;outlineConnect=0;portConstraint=eastwest;newEdgeStyle={&quot;curved&quot;:0,&quot;rounded&quot;:0};size=100;" parent="1" vertex="1">
          <mxGeometry x="10" y="10" width="100" height="300" as="geometry" />
        </mxCell>
        <mxCell id="37" value="Participant" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;dropTarget=0;collapsible=0;recursiveResize=0;outlineConnect=0;portConstraint=eastwest;newEdgeStyle={&quot;curved&quot;:0,&quot;rounded&quot;:0};" parent="1" vertex="1">
          <mxGeometry x="270" y="10" width="100" height="1070" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`;

// Generate Store
const generationStore = useGenerationStore();
const { sequencetxt, sequenceprompt, sequencexml, sequencetestprompt } =
    storeToRefs(generationStore);
</script>

<template>
    <div class="flex flex-col w-full gap-2">
        <div
            :="$attrs"
            class="w-full border-2 border-dashed rounded-md min-h-80 border-secondary-emph"
        >
            <ForcedPreloader
                :show="!!sequencexml"
                v-slot="{ done }"
            >
                <DrawIOEmbed
                    v-model="sequencexml"
                    @loaded="done"
                    v-show="!!sequencexml"
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
