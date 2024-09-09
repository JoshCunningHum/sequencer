import Theme from "./assets/preset";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: false },

    future: {
        compatibilityVersion: 4,
    },

    modules: [
        "@pinia/nuxt",
        "nuxt-build-cache",
        "@vueuse/nuxt",
        "@primevue/nuxt-module",
        "@nuxthub/core",
        "@nuxtjs/tailwindcss",
        "@nuxt/fonts",
        "nuxt-typed-router",
        "@sidebase/nuxt-auth",
    ],

    primevue: {
        options: {
            theme: {
                preset: Theme,
            },
            ripple: true,
        },
    },

    hub: {
        database: true,
    },

    auth: {
        // provider: {
        //     type: "local",
        //     endpoints: {
        //         signIn: { path: "/login", method: "post" },
        //         signOut: { path: "/logout", method: "post" },
        //         signUp: { path: "/register", method: "post" },
        //         getSession: { path: "/session", method: "get" },
        //     },
        //     pages: {
        //         login: "/login",
        //     },
        // }
        globalAppMiddleware: true,
        baseURL:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000/api/auth"
                : "https://sequencer.nuxt.dev/api/auth",
    },

    app: {
        head: {
            bodyAttrs: {
                class: "dark",
            },
            title: "Sequencer V2",
        },
    },

    tailwindcss: {
        configPath: "~/tailwind.config.ts",
        cssPath: ["~/assets/base.scss", { injectPosition: 0 }],
        exposeConfig: true,
        viewer: false,
    },

    css: ["~/assets/theme.scss", "primeicons/primeicons.css"],

    nitro: {
        experimental: {
            openAPI: true,
        },
    },

    vite: {
        vue: {
            script: {
                propsDestructure: true,
            },
        },
    },

    runtimeConfig: {
        GITHUB_CLIENT_SECRET: process.env.GITHUB_SECRET,
        public: {
            GITHUB_CLIENT_ID: process.env.GITHUB_ID,
        },
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_ORIGIN: import.meta.env.DEV ? "http://localhost:3000" : "https://sequencer.nuxt.dev",
    },

    build: {
        // @ts-expect-error bro trust me
        extend(config, ctx) {
            if (ctx.isDev) {
                config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
            }
        },
    },
});
