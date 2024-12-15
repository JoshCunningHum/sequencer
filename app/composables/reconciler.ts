// Responsible for deleting the conflicts out from the sequence diagram (xml string) except for certain conflicts choosed by the user

import { get, set } from "@vueuse/core";
import { PlantUMLConverter } from "~/logic/sequence/converter.plant";
import { PlantUMLParser } from "~/logic/sequence/parser.plant";
import {
    ValidationErrorType,
    type ValidationError,
} from "~/logic/sequence/validator.plant";
import { type SequencePage } from "~/models/SequenceDiagramData";

type ReconcilerParams = {
    data: Ref<GeneratedResult | undefined>;
    filter: Ref<ValidationError[]>;
};

export const useReconciler = (params: ReconcilerParams) => {
    const resolved = ref<SequencePage[]>([]);
    const xml = computed(() =>
        PlantUMLConverter.Convert({ data: resolved.value }),
    );

    const resolve = () => {
        const filters = structuredClone(deepUnref(params.filter.value));
        const _data = deepUnref(params.data.value)?.response;
        const data = _data ? structuredClone(_data) : undefined;
        if (!data) return [];

        let result = "";

        forEachPage(data, (page) => {
            const parser = new PlantUMLParser(page);
            const { name: page_name } = parser.parse();

            const acc = filters.filter((f) => f.page === page_name);

            // Loop through all the warnings in the current page
            result +=
                acc.reduce((acc, w) => {
                    return acc
                        .split("\n")
                        .filter((line) => {
                            const sanitized = w.ref.replace(
                                /[.*+?^${}()|[\]\\]/g,
                                "\\$&",
                            );
                            if (sanitized !== w.ref) console.log(sanitized);
                            return !new RegExp(`\\b(${sanitized})\\b`).test(
                                line,
                            );
                        })
                        .join("\n");
                }, page) + "\n";
        });

        set(resolved, PlantUMLParser.Parse(result));
    };
    watch([params.filter, params.data], resolve);

    return { resolved, xml };
};

const forEachPage = (data: string, cb: (page: string) => void) => {
    const itemHook = createEventHook<string>();

    const pattern = /@startuml([\s\S]*?)@enduml/g;
    let match;

    while ((match = pattern.exec(data)) !== null) {
        cb(match[0]!);
    }
};
