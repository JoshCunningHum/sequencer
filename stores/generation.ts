import { set } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import { generate_sequence } from "~/constants/prompt";
import { PlantUMLConverter } from "~/logic/sequence/converter.plant";
import { PlantUMLParser } from "~/logic/sequence/parser.plant";
import { ClassDiagramData } from "~/models/ClassDiagramData";
import { SequenceDiagramData } from "~/models/SequenceDiagramData";
import { UseCaseDiagramData } from "~/models/UseCaseDiagramData";
import type { Project } from "~/server/database/project";

export enum GenerationStatus {
    Idle,
    GeneratingPrompt,
    PendingResult,
    ValidatingResult,
    Success,
}

export interface GeneratedResult {
    id: string;
    xml: string;
    warnings: Warning[];
    errors: Error[];
    prompt: string;
}

export interface Warning {
    title: string;
    description: string;
}

export interface Error {
    title: string;
    description: string;
}

export const useGenerationStore = defineStore("generation", () => {
    const drawio = useDrawioStore();

    const strictMode = ref(true);

    const projectStore = useProjectsStore();
    const { project, update: updateCurrent } = useProject();

    const prompts = ref({
        class: "",
        usecase: "",
        sequence: "",
        llm: "",
    });

    // Initialize on setup
    const init = (p: Project) => {
        const [err] = safeTry(() => {
            // Create new instances
            const cd = new ClassDiagramData(p.class);
            const ud = new UseCaseDiagramData(p.usecase);
            const sd = new SequenceDiagramData();

            cd.toJSON();
            ud.toJSON();

            cd.process();
            ud.process();

            const cp = cd.toPrompt();
            const up = ud.toPrompt();
            const llm = generate_sequence(cp, up, { strict: strictMode.value });

            // Apply the new objects to refs
            set(prompts, {
                class: cd.toPrompt(),
                usecase: ud.toPrompt(),
                sequence: llm,
                llm,
            });
        });
        if (err) console.error(err);
    };

    onMounted(() => project.value && init(project.value));

    whenever(project, init, { immediate: true, deep: true });

    //#region Updating
    const update = async () => {
        if (!project.value) return;
        return await updateCurrent(project.value);
    };

    //#region Generation

    const is_generating = ref(false);
    const status = ref<GenerationStatus>(GenerationStatus.Idle);
    const results = ref<GeneratedResult[]>([]);
    const forced_stop = ref(false);
    const has_applied = ref(false);

    const add_result = ({
        xml,
        errors,
        warnings,
        prompt,
    }: {
        xml: string;
        errors?: Error[];
        warnings?: Warning[];
        prompt?: string;
    }) => {
        const result: GeneratedResult = {
            id: uuid(20),
            xml,
            errors: errors || [],
            warnings: warnings || [],
            prompt: prompt || xml,
        };

        results.value.push(result);
    };

    const generate = async () => {
        set(is_generating, true);
        set(forced_stop, false);
        set(viewing, undefined);

        // TODO: Add a check for class and usecase validity
        const prompt = prompts.value.llm;

        let validation_dummy_counter = 5;
        let valid = false;

        do {
            if (forced_stop.value) return;

            validation_dummy_counter--;
            valid = validation_dummy_counter <= 0;

            set(status, GenerationStatus.GeneratingPrompt);
            const model = await useGenAi("gemini-1.5-flash-002");

            set(status, GenerationStatus.PendingResult);
            const [err, result] = await safeAwait(model.generateContent(prompt));
            if (err) {
                add_result({
                    xml: prompt,
                    errors: [
                        {
                            title: err.message,
                            description: err.message,
                        },
                    ],
                });
                set(status, GenerationStatus.GeneratingPrompt);
                continue;
            }

            const txt = result.response.text();

            set(status, GenerationStatus.ValidatingResult);
            const [parse_err, parse_data] = safeTry(() => PlantUMLParser.Parse(txt));
            if (parse_err) {
                add_result({
                    xml: txt,
                    errors: [
                        {
                            title: "Parsing Error",
                            description: parse_err.message,
                        },
                    ],
                });
                set(status, GenerationStatus.GeneratingPrompt);
                continue;
            }

            const [convert_err, convert_data] = safeTry(() =>
                PlantUMLConverter.Convert({ data: parse_data })
            );
            if (convert_err) {
                add_result({
                    xml: txt,
                    errors: [
                        {
                            title: "Conversion Error",
                            description: convert_err.message,
                        },
                    ],
                });
                set(status, GenerationStatus.GeneratingPrompt);
                continue;
            }

            // Success
            add_result({ xml: convert_data, prompt: txt });
            break;
        } while (!valid);

        set(status, GenerationStatus.Success);
    };

    // View the selected generated result (only accessible when strict mode is true)
    const viewing = ref<GeneratedResult>();
    const view = (result: GeneratedResult) => {
        set(viewing, result);
    };
    watchImmediate(viewing, (value) => (drawio.xml = value?.xml));

    // Choose the selected generated result and delete all records of generated results
    const is_applying = ref(false);
    const choose = (result: GeneratedResult) => {
        set(has_applied, true);
        if (!project.value) return;
        set(is_applying, true);
        projectStore
            .update({ ...project.value, sequence: result.xml })
            .then(stop)
            .then(() => {
                set(is_applying, false);
                set(results, []);
            });
    };

    const { ask } = useQuery();

    const stop = async () => {
        if (
            !has_applied.value &&
            results.value.some((r) => !r.errors.length && !r.warnings.length)
        ) {
            // Trying to close the generation without applying any sucessful results
            const confirmation = !!(await confirm_close());
            if (!confirmation) return;
        }

        // stop generation
        set(forced_stop, true);
        set(is_generating, false);
        set(viewing, undefined);
    };

    const confirm_close = async () => {
        return await ask({
            title: "Are you sure you want to continue?",
            description: "There are successful results but you haven't applied anything yet",
            approveText: "Confirm",
        });
    };

    return {
        strictMode,
        project,
        prompts,
        update,

        is_generating,
        is_applying,
        viewing,
        status,
        results,
        generate,
        view,
        choose,
        stop,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGenerationStore, import.meta.hot));
}
