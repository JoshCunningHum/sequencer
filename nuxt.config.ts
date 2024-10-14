import Theme from "./assets/preset";
import { resolve } from "node:path";

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
    "@hebilicious/authjs-nuxt",
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

    optimizeDeps: {
      include: ["@auth/core"],
    },
  },

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
        baseURL:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/api/auth"
            : "https://sequencer.nuxt.dev/api/auth", // The URL of your deployed app (used for origin Check in production),
        verifyClientOnEveryRequest: false,
      },
    },
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_ORIGIN: import.meta.env.DEV
      ? "http://localhost:3000"
      : "https://sequencer.nuxt.dev",
  },

  build: {
    // @ts-expect-error bro trust me
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
    },
  },

  alias: {
    cookie: resolve(__dirname, "node_modules/cookie"),
  },
});
