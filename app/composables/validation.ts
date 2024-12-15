import { type GeneratedResult } from "~/stores/generate.js";
import { ClassDiagramData } from "~/models/ClassDiagramData";
import type { SequencePage } from "~/models/SequenceDiagramData";
import type { Project } from "~~/server/database/project";
import {
    validateSequence,
    type ValidationError,
} from "~/logic/sequence/validator.plant";
import { get, set } from "@vueuse/core";

export const useValidation = (params: {
    sequences: Ref<GeneratedResult[]>;
    project: Ref<Project | undefined>;
}) => {
    const { project, sequences } = params;

    const optimal = ref<GeneratedResult>();
    const warnings = ref<ValidationError[]>([]);

    const cd = computed(
        () => isDefined(project) && getClassDiagramData(project.value),
    );

    const validate = (result: GeneratedResult) => {
        if (!cd.value) return;
        const { pages, response, xml } = result;
        console.log(pages);

        const conflicts = validateSequence(pages, cd.value.pages, response);
        console.log(conflicts);

        console.log(response);

        // Choose the least-error output
        if (warnings.value.length > conflicts.length || !optimal.value) {
            set(warnings, conflicts);
            set(optimal, result);
        }
    };

    const reset = () => {
        get(warnings).splice(0);
        set(optimal, undefined);
    };

    watchArray(
        sequences,
        (curr, _, added) => {
            console.log(curr, added);

            // When the sequences result is erased. Also erase the warnings array
            if (!curr.length) reset();
            else added.forEach(validate);
        },
        { deep: true },
    );

    return {
        warnings,
        optimal,
    };
};

const getClassDiagramData = (project: Project) => {
    const data = new ClassDiagramData(project.class);
    safeTry(() => {
        data.toJSON();
        data.process();
    });
    return data;
};
