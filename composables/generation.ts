// A helper for managing the generation process

import { set } from "@vueuse/core";
import { generate_sequence } from "~/constants/prompt";
import { PlantUMLParser } from "~/logic/sequence/parser.plant";
import { ClassDiagramData } from "~/models/ClassDiagramData";
import { UseCaseDiagramData } from "~/models/UseCaseDiagramData";
import type { SequencePage } from "~/models/SequenceDiagramData";
import type { Project } from "~/server/database/project";
import { PlantUMLConverter } from "~/logic/sequence/converter.plant";

export enum GenerationStatus {
    Idle, // not generating
    EstablishConnection, // checks connection to the LLM
    FetchingResult, // waits for the LLM response
    SyntaxCheck, // checks for invalid syntax in the plant uml script
    Exhausted, // when maxRequest has reached for this generation attempt
}

export const useGeneration = (params: {
    project: Ref<Project | undefined>;

    // config
    maxRequest?: number;
    retryDelay?: number;
}) => {
    const { project, maxRequest = 25, retryDelay = 333 } = params || {};

    const errorEvent = createEventHook<[GenerationStatus, Error]>();
    const successEvent = createEventHook<[SequencePage[], string, string]>();

    const onerror = (err: Error) => errorEvent.trigger([status.value, err]);

    const status = ref(GenerationStatus.Idle);
    const prompts = computed(
        () => project.value && extractUmlScripts(project.value),
    );

    const generate = async () => {
        if (!project.value) return;

        const id = project.value.id;
        const { llm } = prompts.value!;

        // Establish connection
        status.value = GenerationStatus.EstablishConnection;
        const [modelError, model] = await safeAwait(
            useGenAi("gemini-1.5-flash-002"),
        );
        if (modelError) return onerror(modelError);

        // Fetch Generated Result
        status.value = GenerationStatus.FetchingResult;
        const [resultError, result] = await safeAwait(
            model.generateContent(llm),
        );
        if (resultError) return onerror(resultError);

        const txt = result.response.text();

        // Check for wrong syntax
        status.value = GenerationStatus.SyntaxCheck;
        const [dataError, data] = safeTry(() => PlantUMLParser.Parse(txt));
        if (dataError) return onerror(dataError);

        // Check for wrong grammer (rare)
        const [conversionError, converted] = safeTry(() =>
            PlantUMLConverter.Convert({ data }),
        );
        if (conversionError) return onerror(conversionError);

        // When switching different projects, cancel the processing
        if (project.value.id !== id) return;
        successEvent.trigger([data, txt, converted]);
    };

    const retries = ref(1);
    const retry = () => {
        if (maxRequest <= retries.value) {
            return errorEvent.trigger([
                GenerationStatus.Exhausted,
                new Error("Maximum retries exceeded"),
            ]);
        }

        retries.value++;
        status.value = GenerationStatus.Idle;
        setTimeout(generate, retryDelay);
    };

    const reset = () => {
        set(retries, 1);
        set(status, GenerationStatus.Idle);
    };
    whenever(project, reset);

    return {
        status,
        retries,
        retry,
        generate: () => {
            reset();
            generate();
        },
        onError: errorEvent.on,
        onSuccess: successEvent.on,
    };
};

const extractUmlScripts = (p: Project, strict: boolean = false) => {
    const [cd_error, cd] = safeTry(() => {
        const cd = new ClassDiagramData(p.class);
        cd.toJSON();
        cd.process();
        return cd.toPrompt();
    });

    const [ud_error, ud] = safeTry(() => {
        const ud = new UseCaseDiagramData(p.usecase);
        ud.toJSON();
        ud.process();
        return ud.toPrompt();
    });

    if (cd_error) console.error(`Error loading class`, cd_error);
    if (ud_error) console.error(`Error loading usecase`, ud_error);

    const llm = generate_sequence(cd || "", ud || "", { strict });

    return { class: cd, usecase: ud, llm };
};
