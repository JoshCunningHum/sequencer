import { defineStore } from "pinia";
import { ClassDiagramData } from "~/models/ClassDiagramData";
import type { Project } from "~/types";
import { usecase_default } from "../models/UseCaseDiagramData";
import { class_default } from "../models/ClassDiagramData";
import { UseCaseDiagramData } from "~/models/UseCaseDiagramData";
import { set, get } from "@vueuse/core";
import { SequenceDiagramData } from "~/models/SequenceDiagramData";

export const useGenerationStore = defineStore("Generation", () => {
    //#region State

    const states = reactive({
        preparing: false,
        class: false,
        usecase: false,
        sequence: false,
    });

    //#region Data

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
    // const sequencejson = ref<Record<string, any>>({});

    const classprompt = ref<string>("");
    const usecaseprompt = ref<string>("");
    const sequenceprompt = ref<string>("");

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
        const { sequence: datatxt } = p;
        if (!datatxt) return;

        const data = new SequenceDiagramData();

        // process json and create sequence data for dev-view
        const xml = data.process(datatxt);

        set(sequencexml, xml);
        set(sequencedata, data);

        states.sequence = false;
    };

    const prepare = async (p: Project) => {
        states.preparing = true;
        states.class = true;
        states.usecase = true;
        states.sequence = true;

        await Promise.all([
            new Promise(async () => prepareclass(p)),
            new Promise(async () => prepareusecase(p)),
            new Promise(async () => preparesequence(p)),
        ]);

        states.preparing = false;
    };

    return {
        prepare,
        states,

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
    };
});
