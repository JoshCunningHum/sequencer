/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly NUXT_HUB_PROJECT_KEY: string;
    readonly GITHUB_SECRET: string;
    readonly GITHUB_ID: string;
    readonly AUTH_SECRET: string;
    readonly AUTH_ORIGIN: string;
    readonly VITE_GEMINI_API: string;
    readonly VITE_VALIDATION_TESTING: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
