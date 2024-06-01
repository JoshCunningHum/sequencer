import { defineStore } from "pinia";
import { ClassDiagramData } from "~/models/ClassDiagramData";
import type { Project } from "~/types";
import { usecase_default } from "../models/UseCaseDiagramData";
import { class_default } from "../models/ClassDiagramData";
import { UseCaseDiagramData } from "~/models/UseCaseDiagramData";
import { set, get } from "@vueuse/core";
import { SequenceDiagramData } from "~/models/SequenceDiagramData";
import { GenerationController } from "~/controllers/GenerationControl";

export const useGenerationStore = defineStore("Generation", () => {
    const devStore = useDevStore();

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
    const sequencetxt = ref<string>();

    const classprompt = ref<string>("");
    const usecaseprompt = ref<string>("");
    const sequenceprompt = ref<string>("");
    const sequencetestprompt = ref<string>(`Participants:    
    User Server LLM_API Database EmailService    
    
    User -> Server: Login(email, password)
    Server -> Database: CheckCredentials(email, password)
    Database --> Server: CredentialsValid    
    
    alt CredentialsValid    
      Server --> User: ShowDashboard    
      User -> Server: UploadDocument(document)    
      Server -> Database: StoreDocument(document)    
      Database --> Server: DocumentStored    
      alt DocumentStored        
        Server -> User: ShowDocumentUploaded        
        User -> Server: GenerateResult(document)        
        Server -> LLM_API: ProcessDocument(document)        
        LLM_API --> Server: ResultGenerated        
        alt ResultGenerated            
          Server -> Database: StoreResult(result)            
          Database --> Server: ResultStored            
          Server -> User: ShowResult(result)        
        else ResultNotGenerated            
          Server -> User: ShowError(error)        
        end    
      else DocumentNotStored        
        Server -> User: ShowError(error)    
      end
    else CredentialsInvalid    
      Server --> User: ShowLoginError
    end
  
    User -> Server: Register(email, password, username)
    Server -> Database: CheckEmailExists(email)
    Database --> Server: EmailExists    
    
    alt EmailExists    
      Server -> User: ShowEmailExistsError
    else EmailNotExists    
      Server -> Database: StoreUser(email, password, username)    
      Database --> Server: UserStored    
      alt UserStored        
        Server -> EmailService: SendWelcomeEmail(email)        
        EmailService --> Server: EmailSent        
        Server -> User: ShowRegistrationSuccess    
      else UserNotStored        
        Server -> User: ShowRegistrationError    
      end
    end
    
    User -> Server: Logout
    Server -> User: ClearSession
    Server --> User: ShowLogin`);

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
        // Generate prompt
        const classdiag = classdata.value;
        const usecasediag = usecasedata.value;
        const seqdiag = sequencedata.value;

        const generation = new GenerationController(
            classdiag,
            usecasediag,
            seqdiag
        );

        console.log(`%c### Generating Sequence ###`, "color:magenta");

        const xml = await (devStore.enabled && sequencetestprompt.value
            ? seqdiag.process(sequencetestprompt.value)
            : generation.generateSequenceDiagram());

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
    };

    return {
        prepare,
        generate,
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
        sequencetxt,
        sequencetestprompt,
    };
});
