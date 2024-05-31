export default defineEventHandler(async (event) => {
    return process.env.GEMINI_API;
});
