// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['../dist/module'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-09'
})
