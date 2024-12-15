export enum PromptStatus {
    Idle,
    Initialize,
    SendClass,
    SendUsecase,
    ReceiveResponse,
    Error,
}

export abstract class LLMLayer {
    public name: string = "";

    abstract init(): Promise<void>;
    abstract prompt(
        statuscb: (status: PromptStatus) => void,
        dusecase: string,
        dclass: string,
        context: string
    ): Promise<string>;
}
