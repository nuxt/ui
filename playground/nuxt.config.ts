// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['../src/module'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-09'
})
