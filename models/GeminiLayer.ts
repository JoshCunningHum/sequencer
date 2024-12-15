import type { GenerativeModel } from "@google/generative-ai";
import { LLMLayer, PromptStatus } from "./LLMLayer";
import { useGenAi } from "~/composables/generate";

export class GeminiLayer extends LLMLayer {
    model?: GenerativeModel;

    async init(): Promise<void> {
        this.model = await useGenAi("gemini-pro");
    }
    async prompt(
        statusref: globalThis.Ref<PromptStatus>,
        dusecase: string,
        dclass: string,
        context: string
    ): Promise<string> {
        if (!this.model) await this.init();
        // This will never happen
        if (!this.model) return "";

        const { model } = this;

        return "";
    }
}
