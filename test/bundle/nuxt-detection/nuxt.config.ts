export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],

  css: ['~/assets/css/main.css'],

  ui: {
    experimental: {
      componentDetection: true
    }
  },

  compatibilityDate: '2024-07-09'
})
