export default defineNuxtConfig({
    future: { compatibilityVersion: 4 },
    compatibilityDate: "2024-07-30",
    devtools: { enabled: true },

    modules: [
        "@nuxthub/core",
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "@nuxt/fonts",
        "@hebilicious/authjs-nuxt",
        "nuxt-typed-router",
    ],

    runtimeConfig: {
        authJs: {
            secret: process.env.AUTH_SECRET, // You can generate one with `openssl rand -base64 32`
        },
        github: {
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        },
        GITHUB_CLIENT_SECRET: process.env.GITHUB_SECRET,
        public: {
            GITHUB_CLIENT_ID: process.env.GITHUB_ID,
            authJs: {
                baseUrl:
                    process.env.NODE_ENV === "development"
                        ? "http://localhost:3000/api/auth"
                        : "https://sequencer.nuxt.dev/api/auth", // The URL of your deployed app (used for origin Check in production),
                verifyClientOnEveryRequest: false,
            },
        },
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_ORIGIN: !import.meta.dev
            ? "http://localhost:3000"
            : "https://sequencer.nuxt.dev",
    },

    css: ["~/assets/main.scss"],

    hub: {
        database: true,
    },

    authJs: {
        verifyClientOnEveryRequest: false,
        guestRedirectTo: "/",
        authenticatedRedirectTo: "/dashboard",
        baseUrl:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000/api/auth"
                : "https://sequencer.nuxt.dev",
    },
    app: {
        head: {
            bodyAttrs: {
                class: "dark",
            },
            title: "Sequencer V2",
        },
    },
});
