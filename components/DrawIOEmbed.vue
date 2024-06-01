<script lang="ts" setup>
import { set } from "@vueuse/core";
import { usecase_default } from "../models/UseCaseDiagramData";
import { class_default } from "../models/ClassDiagramData";

// Props and Emits
const {
    noAutosave = false,
    saving = false,
    viewOnly = false,
} = defineProps<{
    noAutosave?: boolean;
    saving?: boolean;
    viewOnly?: boolean;
}>();

const emit = defineEmits<{
    (e: "loaded"): void;
    (e: "save", data: string): void;
}>();

const model = defineModel<string>({
    default: class_default,
});

// DrawIO Source Config

const params: Record<string, number | string> = {
    embed: 1,
    spin: 1,
    ui: "min",
    dark: 1,
    proto: "json",
    format: "xml",
    noExitBtn: 1,
};

if (viewOnly) {
    params.noSaveBtn = 1;
    params.saveAndExit = 0;
}

const embedlink = "https://embed.diagrams.net";

const params_processed = computed(() =>
    Object.entries(params)
        .map(([key, val]) => `${key}=${val}`)
        .join("&")
);

// Functions
const setXML = (xml: string) => {
    post({ action: "load", autosave: !noAutosave, xml });
};

// Loading
const loaded = ref(false);

// Iframe

const frame = ref<InstanceType<typeof HTMLIFrameElement>>();

const post = (msg: any) => {
    if (!frame.value) return;
    frame.value.contentWindow?.postMessage(JSON.stringify(msg), "*");
};

interface DrawIOMsg {
    event: "init" | "export" | "autosave" | "save" | "exit" | "load";
    xml?: string;
}

const componentid = ref(genid(16));

const receive = (evt: MessageEvent, fromid: string) => {
    if (evt.origin !== embedlink || fromid !== componentid.value) return;

    const msg = JSON.parse(evt.data) as DrawIOMsg;

    switch (msg.event) {
        case "init":
            setXML(model.value);
            set(loaded, false);
            break;
        case "save":
            if (viewOnly) return;
            console.log(`%cSaving...`, "color: orange");
            model.value = msg.xml || "";
            emit("save", msg.xml || "");
            break;
        case "load":
            set(loaded, true);
            emit("loaded");
            break;
    }
};

const messagehandler = (e: MessageEvent) => {
    receive(e, componentid.value);
};

// Iframe event binding

onMounted(() => {
    componentid.value = genid(16);
    window.addEventListener("message", messagehandler);
});

onUnmounted(() => {
    window.removeEventListener("message", messagehandler);
});

watch(model, (xml) => setXML(xml));
</script>

<template>
    <Fill class="relative">
        <div
            v-if="!loaded"
            class="absolute z-10 w-full h-full flex justify-center items-center bg-primary"
        >
            <Loading data="Loading DrawIO UI" />
        </div>
        <div
            v-else-if="saving"
            class="absolute z-10 w-full h-full flex justify-center items-center bg-primary opacity-60"
        >
            <Loading data="Saving Data" />
        </div>
        <iframe
            :allowtransparency="true"
            ref="frame"
            class="w-full h-full bg-primary"
            style="background: black"
            :src="`${embedlink}/?${params_processed}`"
            :frameborder="0"
        />
    </Fill>
</template>

<style lang="scss" scoped></style>
