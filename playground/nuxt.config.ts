// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      bodyAttrs: {
        class: 'antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900'
      }
    }
  },

  modules: ['../src/module'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-09'
})
