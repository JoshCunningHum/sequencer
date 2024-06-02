import { defineStore } from "pinia";
import { ClassDiagramData } from "~/models/ClassDiagramData";
import type { Project } from "~/types";
import { usecase_default } from "../models/UseCaseDiagramData";
import { class_default } from "../models/ClassDiagramData";
import { UseCaseDiagramData } from "~/models/UseCaseDiagramData";
import { set, get } from "@vueuse/core";
import { SequenceDiagramData } from "~/models/SequenceDiagramData";
import { GenerationController } from "~/controllers/GenerationControl";

export enum GenerationProgress {
    "Generate Prompt" = 10,
    "Received Result" = 30,
    "Parsed Result" = 35,
    "Parsing Fail" = -30, // Go back to the received result
    "Update Database" = 25,
}

export const useGenerationStore = defineStore("Generation", () => {
    const devStore = useDevStore();
    const projectStore = useProjectsStore();

    //#region State

    const states = reactive({
        preparing: false,
        class: false,
        usecase: false,
        sequence: false,
    });

    const progress = ref<GenerationProgress[]>([]);
    const error = ref<string>();

    //#region Data
    const project = ref<Project>();

    const classxml = ref<string>("");
    const usecasexml = ref<string>("");
    const sequencexml = ref<string>("");

    const classdata = ref<ClassDiagramData>(
        new ClassDiagramData(class_default)
    );
    const usecasedata = ref<UseCaseDiagramData>(
        new UseCaseDiagramData(usecase_default)
    );
    const sequencedata = ref<SequenceDiagramData>(new SequenceDiagramData());

    const classjson = ref<Record<string, any>>({});
    const usecasejson = ref<Record<string, any>>({});
    const sequencetxt = ref<string>();

    const classprompt = ref<string>("");
    const usecaseprompt = ref<string>("");
    const sequenceprompt = ref<string>("");
    const sequencetestprompt = ref<string>(``);

    //#region Preperations

    const prepareclass = async (p: Project) => {
        set(classxml, p.class || class_default);

        const data = new ClassDiagramData(get(classxml));
        set(classjson, data.toJSON());

        data.process();
        set(classdata, data);

        set(classprompt, data.toPrompt());

        states.class = false;
    };

    const prepareusecase = async (p: Project) => {
        set(usecasexml, p.usecase || usecase_default);
        const data = new UseCaseDiagramData(get(usecasexml));
        set(usecasejson, data.toJSON());

        data.process();
        set(usecasedata, data);

        set(usecaseprompt, data.toPrompt());

        states.usecase = false;
    };

    const preparesequence = async (p: Project) => {
        const { sequence: xml } = p;
        if (!xml) return;
        // process json and create sequence data for dev-view
        set(sequencexml, xml);
        states.sequence = false;
    };

    const prepare = async (p: Project) => {
        set(project, p);

        states.preparing = true;
        states.class = true;
        states.usecase = true;
        states.sequence = true;

        await Promise.all([
            new Promise(async () => await prepareclass(p)),
            new Promise(async () => await prepareusecase(p)),
            new Promise(async () => await preparesequence(p)),
            new Promise(async () => {
                sequenceprompt.value = useSystemInstructions(
                    classprompt.value,
                    usecaseprompt.value
                );
            }),
        ]);

        states.preparing = false;
    };

    //#endregion

    //#region Generation

    const generate = async () => {
        get(progress).splice(0);

        // Generate prompt
        const classdiag = classdata.value;
        const usecasediag = usecasedata.value;
        const seqdiag = sequencedata.value;

        const generation = new GenerationController(
            classdiag,
            usecasediag,
            seqdiag
        );

        get(progress).push(GenerationProgress["Generate Prompt"]);

        console.log(`%c### Generating Sequence ###`, "color:magenta");

        let MAX_RETRY = 7;
        let success = false,
            xml = "";
        while (!success && MAX_RETRY > 0) {
            // Continously request for the result until it is a good result
            try {
                if (devStore.enabled && sequencetestprompt.value) {
                    xml = seqdiag.process(sequencetestprompt.value);
                    success = true;
                    get(progress).push(GenerationProgress["Received Result"]);
                } else {
                    xml = await generation.generateSequenceDiagram();
                    get(progress).push(GenerationProgress["Received Result"]);
                    success = true;
                }
            } catch (e) {
                get(progress).push(GenerationProgress["Received Result"]);
                get(progress).push(GenerationProgress["Parsing Fail"]);
                console.log(`%cParsing Failed. Retrying...`, "color:crimson");
            } finally {
                MAX_RETRY--;
            }
        }

        if (MAX_RETRY === 0) {
            error.value = `Error connecting to server. Please try again later.`;
            return;
        }

        get(progress).push(GenerationProgress["Parsed Result"]);

        console.log(
            `%cArrived Data: %c${seqdiag.txt}`,
            "color:green",
            "color:lightgrey"
        );

        // Change sequence text
        set(sequencetxt, seqdiag.txt);

        console.log(
            `%Resultant XML: %c${xml}`,
            "color:green",
            "color:lightgrey"
        );

        // Change xml ref
        set(sequencexml, xml);

        // update the xml in supabase
        const proj = get(project);
        if (proj) {
            proj.sequence = xml;
            await projectStore.update(proj);
        }

        get(progress).push(GenerationProgress["Update Database"]);
    };

    return {
        prepare,
        generate,
        states,
        progress,
        error,

        classxml,
        classdata,
        classjson,
        classprompt,

        usecasexml,
        usecasedata,
        usecasejson,
        usecaseprompt,

        sequencexml,
        sequenceprompt,
        sequencedata,
        sequencetxt,
        sequencetestprompt,
    };
});
