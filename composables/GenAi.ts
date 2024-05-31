import { GoogleGenerativeAI } from "@google/generative-ai";

// TODO: Add an adapter layer for multiple LLM services
export const useGenAi = async (
    modelType: "gemini-pro" | "gemini-1.5-flash"
) => {
    const apikey = import.meta.env.VITE_GEMINI_API;
    if (!apikey) throw new Error(`No GEMINI API provided`);

    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({
        model: modelType,
        systemInstruction: useSystemInstructions(),
        generationConfig: {
            temperature: 0.75,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        },
    });

    return model;
};
