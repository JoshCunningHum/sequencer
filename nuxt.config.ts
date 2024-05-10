// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: [
    "~/assets/global.css",
  ],
  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-typed-router',
    "@nuxtjs/supabase",
    "@nuxt/fonts",
    '@morev/vue-transitions/nuxt',
  ],
  ui: {
    global: true,
    icons: ['mdi']
  },
  colorMode: {
    preference: 'dark'
  },
  app: {
    head: {
      title: 'SQNCR',
    }
  },
  vite: {
    vue: {
      script: {
        propsDestructure: true
      }
    },
  },
  supabase: {
    redirect: false
  },
})