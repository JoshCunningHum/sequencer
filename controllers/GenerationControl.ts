import { ClassDiagramData } from "~/models/ClassDiagramData";
import { SequenceDiagramData } from "~/models/SequenceDiagramData";
import { UseCaseDiagramData } from "~/models/UseCaseDiagramData";

export enum GenerationStatus {
    Idle,
    PromptGenerate,
    ResultPending,
    AnalyzeResult,
}

export class GenerationController {
    drawIOClass: ClassDiagramData;
    drawIOUseCase: UseCaseDiagramData;
    drawIOSequence: SequenceDiagramData;
    status: GenerationStatus = GenerationStatus.Idle;

    constructor(
        classdiag: ClassDiagramData,
        usecasediag: UseCaseDiagramData,
        seqdiag: SequenceDiagramData
    ) {
        // Expects that the class and usecases are already finished processing
        this.drawIOClass = classdiag;
        this.drawIOUseCase = usecasediag;
        this.drawIOSequence = seqdiag;
    }

    async generateSequenceDiagram(): Promise<string> {
        const { drawIOClass: cl, drawIOUseCase: uc, drawIOSequence: sq } = this;

        // Generate Prompt
        const prompt = useSystemInstructions(cl.toPrompt(), uc.toPrompt());

        console.log(
            `%cGenerated Prompt: %c${prompt}`,
            "color:lime",
            "color:lightgrey"
        );

        // Fetch for result
        const model = await useGenAi("gemini-1.5-flash");

        console.log(`%cModel Created`, "color:lime");

        const result = await model.generateContent(prompt);

        console.log(`%cResult Done`, "color:lime");

        const response = result.response;
        const txt = response.text();

        console.log(
            `%cResponse from GEMINI: %c${txt}`,
            "color:cyan",
            "color:lightgrey"
        );

        // Analyze Result
        const xml = sq.process(txt);

        console.log(
            `%Processed XML: %c${xml}`,
            "color:cyan",
            "color:lightgrey"
        );

        return xml;
    }
}
