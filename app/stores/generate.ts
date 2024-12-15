import { GenerationStatus } from "@/composables/generation";
import { get, set } from "@vueuse/core";
import { defineStore } from "pinia";
import { PlantUMLConverter } from "~/logic/sequence/converter.plant";
import type { ValidationError } from "~/logic/sequence/validator.plant";
import type { SequencePage } from "~/models/SequenceDiagramData";

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
    const drawioStore = useDrawioStore();

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
        if (!strictMode.value) nextTick().then(save);
        // Else, re-genearate until max sample size is reached
        else if (results.value.length < MAX_SAMPLE) gen_retry();
        else {
            set(step, GenerationStep.Validating);
            // set optimal xml to drawio preview
            nextTick().then(() => {
                drawioStore.xml = resolved_xml.value;
            });
        }
    });

    const generate = () => {
        cancel();
        set(step, GenerationStep.Generating);
        _generate();
    };

    // Handle Validation
    const warningsToKeep = ref<string[]>([]);
    const { optimal, warnings } = useValidation({
        sequences: results,
        project,
    });
    const removed_conflicts = useArrayFilter(
        warnings,
        (w) => !get(warningsToKeep).includes(w.id),
    );
    const { resolved, xml: resolved_xml } = useReconciler({
        data: optimal,
        filter: removed_conflicts,
    });
    watch(resolved_xml, (v) => strictMode.value && (drawioStore.xml = v));

    // Handle Saving
    const save = () => {
        if (!isDefined(project) || !isDefined(optimal)) return;
        const sequence = strictMode.value
            ? resolved_xml.value
            : optimal.value.xml;

        console.log(optimal.value.xml);

        set(step, GenerationStep.Saving);
        projectStore
            .update({
                ...project.value,
                sequence,
            })
            .then(cancel)
            .then(() => {
                drawioStore.xml = undefined;
            });
    };

    // Cancel/Reset all the progress
    const cancel = () => {
        warningsToKeep.value.splice(0);
        results.value.splice(0);
        set(warningsToKeep, []);
        set(error, undefined);
        set(step, GenerationStep.Idle);
    };

    return {
        step,
        error,
        gen_status,
        strictMode,
        data: optimal,
        warnings,
        progress: computed(() => get(results).length),
        warningsToKeep,
        generate,
        cancel,
        save,
    };
});
