// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-typed-router',
    "@nuxtjs/supabase",
    "@nuxt/fonts"
  ],
  ui: {
    global: true,
    icons: ['mdi']
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/login',
      include: undefined,
      exclude: [],
      cookieRedirect: false,
    }  
  }
})