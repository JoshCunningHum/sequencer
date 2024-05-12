import { DrawIOXML } from "./DrawIOXML";

export const usecase_default = useDrawIOUseCaseDefault();

export class UseCaseDiagramData extends DrawIOXML {
    public actors: string[] = [];
    public useCases: UseCaseData[] = [];

    constructor(xml: string) {
        super(xml);
    }

    toPrompt(): string {
        throw new Error("Method not implemented.");
    }
    process(): void {
        throw new Error("Method not implemented.");
    }
}

export class UseCaseData {
    public from: UseCaseData | string;
    public type: UseCaseType = UseCaseType.Default;

    constructor(from: UseCaseData | string, type?: UseCaseType) {
        this.from = from;
        if (type) this.type = type;
    }
}

export enum UseCaseType {
    Default,
    Include,
    Extends,
}
