import { GoogleGenerativeAI } from "@google/generative-ai";

// TODO: Add an adapter layer for multiple LLM services
export const useGenAi = async (modelType: "gemini-pro") => {
    const apikey = process.env.GEMINI_API;
    if (!apikey) throw new Error(`No GEMINI API provided`);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || "");
    const model = genAI.getGenerativeModel({ model: modelType });

    return model;
};
