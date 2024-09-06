import PrimeVueStyle from "@primevue/themes/aura";

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
                preset: PrimeVueStyle,
            },
            ripple: true,
        },
    },

    hub: {
        database: true,
    },

    auth: {
        isEnabled: false,
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

    vite: {
        vue: {
            script: {
                propsDestructure: true,
            },
        },
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
