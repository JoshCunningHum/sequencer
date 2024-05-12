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

    constructor() {
        const defclass = useDrawIOClassDefault();
        const defusecase = useDrawIOUseCaseDefault();

        this.drawIOClass = new ClassDiagramData(defclass);
        this.drawIOUseCase = new UseCaseDiagramData(defusecase);
        this.drawIOSequence = new SequenceDiagramData();
    }

    async generateSequenceDiagram(): Promise<string> {
        const { drawIOClass: cl, drawIOUseCase: uc, drawIOSequence: sq } = this;

        // Generate Prompt

        // Fetch for result

        // Analyze Result

        return sq.process("");
    }
}
