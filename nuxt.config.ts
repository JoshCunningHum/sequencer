// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },
    css: ["~/assets/global.css"],
    build: {
        // @ts-expect-error bro trust me
        extend(config, ctx) {
            if (ctx.isDev) {
                config.devtool = ctx.isClient
                    ? "source-map"
                    : "inline-source-map";
            }
        },
    },
    modules: [
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "@nuxt/image",
        "@nuxt/ui",
        "nuxt-typed-router",
        "@nuxtjs/supabase",
        "@nuxt/fonts",
        "@morev/vue-transitions/nuxt",
        "@morev/vue-transitions/nuxt",
        "@nuxt/test-utils/module",
    ],
    ui: {
        global: true,
        icons: ["mdi"],
    },
    colorMode: {
        preference: "dark",
    },
    app: {
        head: {
            title: "SQNCR",
        },
    },
    vite: {
        vue: {
            script: {
                propsDestructure: true,
            },
        },
    },
    supabase: {
        redirect: false,
    },
});
