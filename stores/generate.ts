import type { SequencePage } from "~/models/SequenceDiagramData";
import { defineStore, acceptHMRUpdate } from "pinia";
import { GenerationStatus } from "@/composables/generation";
import { get, set } from "@vueuse/core";
import { ValidationError } from "yup";

export enum GenerationStep {
    Idle,
    Generating,
    Validating,
    Saving,
}

export interface GeneratedResult {
    pages: SequencePage[];
    response: string;
    xml: string;
}

const MAX_SAMPLE = 5;

export const useGenerateStore = defineStore("generate", () => {
    const { project } = useProject();
    const projectStore = useProjectsStore();

    const strictMode = ref(true);

    const error = ref<string>();
    const step = ref<GenerationStep>(GenerationStep.Idle);

    // Handle Generation
    const results = ref<GeneratedResult[]>([]);
    const {
        status: gen_status,
        retry: gen_retry,
        generate: _generate,
        onError: onGenerationError,
        onSuccess: onGenerationSuccess,
    } = useGeneration({ project, retryDelay: 500 });

    onGenerationError(([status, err]) => {
        switch (status) {
            case GenerationStatus.EstablishConnection:
            case GenerationStatus.FetchingResult:
            case GenerationStatus.SyntaxCheck:
                gen_retry();
                break;
            case GenerationStatus.Exhausted:
                // Stop retrying and move into validation
                // But notify the user
                break;
            default:
                console.info(`I think this is not possible...`);
                break;
        }

        set(error, err.message);
    });

    onGenerationSuccess(([pages, response, xml]) => {
        // Add it on the successes record
        results.value.push({ pages, response, xml });
        // When strictmode is disabled. Show apply changes button
        if (!strictMode.value) set(step, GenerationStep.Validating);
        // Else, re-genearate until max sample size is reached
        else if (results.value.length < MAX_SAMPLE) gen_retry();
        else set(step, GenerationStep.Validating);
    });

    const generate = () => {
        cancel();
        set(step, GenerationStep.Generating);
        _generate();
    };

    // Handle Validation
    const warningsToKeep = ref<ValidationError[]>([]);
    const { optimal, warnings } = useValidation({
        sequences: results,
        project,
    });
    const removeConflicts = () => {};

    // Handle Saving
    const save = () => {
        if (!isDefined(project) || !isDefined(optimal)) return;
        set(step, GenerationStep.Saving);
        projectStore
            .update({ ...project.value, sequence: optimal.value.xml })
            .then(cancel);
    };

    // Cancel/Reset all the progress
    const cancel = () => {
        warningsToKeep.value.splice(0);
        results.value.splice(0);
        set(error, undefined);
        set(step, GenerationStep.Idle);
    };

    return {
        step,
        error,
        gen_status,
        strictMode,
        output: {
            data: optimal,
            warnings,
            progress: computed(() => get(results).length),
        },
        generate,
        cancel,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGenerateStore, import.meta.hot));
}
