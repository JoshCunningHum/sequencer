import { defineStore } from "pinia";
import { ClassDiagramData } from "~/models/ClassDiagramData";
import type { Project } from "~/types";
import { usecase_default } from "../models/UseCaseDiagramData";
import { class_default } from "../models/ClassDiagramData";
import { UseCaseDiagramData } from "~/models/UseCaseDiagramData";
import { set, get } from "@vueuse/core";

export const useGenerationStore = defineStore("Generation", () => {
    //#region State

    const states = reactive({
        preparing: false,
        class: false,
        usecase: false,
    });

    //#region Data

    const classxml = ref<string>("");
    const usecasexml = ref<string>("");

    const classdata = ref<ClassDiagramData>(
        new ClassDiagramData(class_default)
    );
    const usecasedata = ref<UseCaseDiagramData>(
        new UseCaseDiagramData(usecase_default)
    );

    const classjson = ref<Record<string, any>>({});
    const usecasejson = ref<Record<string, any>>({});

    const classprompt = ref<string>("");
    const usecaseprompt = ref<string>("");

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

        set(usecasedata, new UseCaseDiagramData(get(usecasexml)));

        states.usecase = false;
    };

    const prepare = async (p: Project) => {
        states.preparing = true;
        states.class = true;
        states.usecase = true;

        await Promise.all([
            new Promise(async () => prepareclass(p)),
            new Promise(async () => prepareusecase(p)),
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
    };
});
