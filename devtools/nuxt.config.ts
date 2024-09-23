// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  nitro: {
    hooks: {
      'prerender:routes': function (routes) {
        routes.clear()
      }
    }
  },

  modules: [
    '../src/module',
    '@nuxtjs/mdc'
  ],

  app: {
    baseURL: '/__nuxt_ui__/devtools'
  },

  future: {
    compatibilityVersion: 4
  },

  vite: {
    server: {
      hmr: {
        clientPort: process.env.PORT ? +process.env.PORT : undefined
      }
    }
  },

  compatibilityDate: '2024-04-03'
})
