<script setup lang="ts">
import { get, set } from "@vueuse/core";
import type { ValidationError } from "~/logic/sequence/validator.plant";
import { response_tst, warnings_tst } from "./warnings.test";
import { PlantUMLParser } from "~/logic/sequence/parser.plant";
import { PlantUMLConverter } from "~/logic/sequence/converter.plant";

const open = defineModel<boolean>("open", { default: false });
const props = defineProps<{
    warnings: ValidationError[];
    accepted: string[];
}>();
const { warnings, accepted } = toRefs(props);

const emit = defineEmits<{
    accept: [id: string];
    unaccept: [id: string];
}>();

// Group pages together
const mapped_pages = useArrayMap(warnings, (p) => p.page);
const pages = useArrayUnique(mapped_pages);
const menu_pages = useArrayMap(pages, (p) => {
    const { accepted, warnings } = props;

    const ws_page = warnings.filter((w) => w.page === p);
    const ac_page = ws_page.filter((w) => accepted.includes(w.id));

    return {
        label: p,
        amount: ws_page.length - ac_page.length,
    };
});

// Viewing Pages
const selected_page = ref<string>("");
watchImmediate(pages, (v) => set(selected_page, v.at(0)));

// Viewing warnings
const shown_warnings = useArrayFilter(
    warnings,
    (w) => w.page === selected_page.value,
);

// Selectcing Warnings
const getWarningStatus = (id: string) => get(accepted).includes(id);
const setWarningStatus = (accepted: boolean, id: string) =>
    accepted ? emit("accept", id) : emit("unaccept", id);

const accepted_warnings_on_page = useArrayFilter(shown_warnings, (w) =>
    accepted.value.includes(w.id),
);
const pageWarningToggle = computed({
    get: () =>
        get(shown_warnings).length === get(accepted_warnings_on_page).length,
    set: (v) =>
        get(shown_warnings).forEach((w) =>
            v ? emit("accept", w.id) : emit("unaccept", w.id),
        ),
});

const allWarningToggle = computed({
    get: () => get(warnings).length === get(accepted).length,
    set: (v) =>
        get(warnings).forEach((w) =>
            v ? emit("accept", w.id) : emit("unaccept", w.id),
        ),
});

// TODO: Test
const drawioStore = useDrawioStore();
const responseToXML = (txt: string) => {
    const data = PlantUMLParser.Parse(txt);
    return PlantUMLConverter.Convert({ data });
};
watchImmediate(open, () => (drawioStore.xml = responseToXML(response_tst)));
</script>

<template>
    <Dialog
        v-model:visible="open"
        modal
        header="Conflicts"
        class="w-[95vw] lg:w-[60vw]"
        dismissable-mask
        close-on-escape
    >
        <template #container>
            <div class="root">
                <div class="flex gap-3">
                    <WarningIcon fill />
                    <div>
                        <h1 class="header">Accept Conflicts</h1>
                        <p class="text-muted-color">
                            Conflicts are found after several attempts to
                            generate. Please
                            <span class="success">
                                check the conflicts you wish to keep
                            </span>
                            and
                            <span class="warn">
                                leave the conflicts you wish to remove
                                unchecked.
                            </span>
                        </p>
                    </div>
                </div>
                <div class="warnings-gap items-center">
                    <div class="label pages-width">Pages</div>
                    <div class="label">Warnings</div>
                </div>
                <div class="warnings warnings-gap">
                    <div class="pages">
                        <SequenceResultValidationPageItem
                            v-for="page in menu_pages"
                            :key="page.label"
                            :name="page.label"
                            :warning_count="page.amount"
                            :selected="selected_page === page.label"
                            @select="(v) => (selected_page = v)"
                        />
                    </div>
                    <div class="wrapper">
                        <div class="page-operations">
                            <input
                                type="checkbox"
                                id="page-accept-all-checkbox"
                                v-model="pageWarningToggle"
                            />
                            <label for="page-accept-all-checkbox">
                                Select all in this page
                            </label>
                            <input
                                type="checkbox"
                                id="accept-all-checkbox"
                                v-model="allWarningToggle"
                            />
                            <label for="accept-all-checkbox">
                                Select all
                            </label>
                        </div>

                        <div class="warning-list">
                            <SequenceResultValidationWarningItem
                                v-for="warning in shown_warnings"
                                :key="warning.id"
                                :warning
                                :model-value="getWarningStatus(warning.id)"
                                @update:model-value="
                                    (v) => setWarningStatus(v, warning.id)
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style lang="scss" scoped>
.pages-width {
    @apply w-full max-w-[20%];
}
.warnings-gap {
    @apply flex gap-2;
}

span.warn {
    @apply mx-1 text-amber-500;
}

span.success {
    @apply mx-1 text-primary-500;
}

.root {
    @apply space-y-1 px-3.5 py-3;

    .header {
        @apply text-xl font-bold text-surface-200;
    }

    .warnings {
        @apply min-h-[50vh] py-2;
        height: 70ch;

        .pages {
            @apply pages-width;
            @apply flex flex-col gap-2;
            @apply h-full;
            @apply min-h-0 overflow-y-auto;
            @apply p-2;
            @apply rounded-lg;
            @apply bg-surface-950/50;
        }

        .wrapper {
            @apply flex h-full min-h-0 grow flex-col;

            .page-operations {
                @apply pb-2;

                input:not(:first-child) {
                    @apply ml-4;
                }

                input + label {
                    @apply ml-2;
                }
            }

            .warning-list {
                @apply space-y-2;
                @apply min-h-0 grow overflow-y-auto;
            }
        }
    }

    .operations {
        @apply flex justify-end gap-2;
    }
}
</style>
