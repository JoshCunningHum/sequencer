<script lang="ts" setup>
// Props and Emits
const emit = defineEmits<{
    (e: "loaded"): void;
}>();

const class_default = useDrawIOClassDefault();

const params = {
    embed: 1,
    spin: 1,
    ui: "min",
    dark: 1,
    proto: "json",
    format: "xml",
    noExitBtn: 1,
};

const embedlink = "https://embed.diagrams.net";

const params_processed = computed(() =>
    Object.entries(params)
        .map(([key, val]) => `${key}=${val}`)
        .join("&")
);

const frame = ref<InstanceType<typeof HTMLIFrameElement>>();

const post = (msg: any) => {
    if (!frame.value) return;
    frame.value.contentWindow?.postMessage(JSON.stringify(msg), "*");
};

interface DrawIOMsg {
    event: "init" | "export" | "autosave" | "save" | "exit";
    xml?: string;
}

const receive = (evt: MessageEvent) => {
    if (evt.origin !== embedlink) return;

    const msg = JSON.parse(evt.data) as DrawIOMsg;

    switch (msg.event) {
        case "init":
            post({ action: "load", autosave: 1, xml: class_default });
            emit("loaded");
        case "save":
            console.log(msg);
    }
};

onMounted(() => {
    window.addEventListener("message", receive);
});

onUnmounted(() => {
    window.removeEventListener("message", receive);
});
</script>

<template>
    <Fill>
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
