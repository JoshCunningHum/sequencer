// Responsible for deleting the conflicts out from the sequence diagram (xml string) except for certain conflicts choosed by the user

import type { ValidationError } from "~/logic/sequence/validator.plant";
import type { SequencePage } from "~/models/SequenceDiagramData";

type ReconcilerParams = {
    data: Ref<GeneratedResult | undefined>;
    accepted: Ref<ValidationError[]>;
};

export const useReconciler = (params: ReconcilerParams) => {
    const resolved = computed(() => {
        const accepted = deepUnref(params.accepted.value);
        const data = deepUnref(params.data.value)?.pages;
        console.log(data);
        if (!data) return [];

        // Loop through every page
        return data.map(({ actors, elements, messages, name }) => {
            // Get all warnings found in this page
            const acc = accepted.filter((w) => w.page === name);
            // Loop through all the warnings and
        });
    });

    return { resolved };
};
