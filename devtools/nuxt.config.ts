import { resolve } from 'node:path'

export default defineNuxtConfig({

  modules: ['../src/module', '@nuxt/test-utils/module'],

  ssr: false,

  devtools: { enabled: false },

  app: {
    baseURL: '/__nuxt_ui__/devtools'
  },

  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-04-03',

  nitro: {
    hooks: {
      'prerender:routes': function (routes) {
        routes.clear()
      }
    },
    output: {
      publicDir: resolve(__dirname, '../dist/client/devtools')
    }
  },

  vite: {
    server: {
      hmr: {
        clientPort: process.env.PORT ? +process.env.PORT : undefined
      }
    }
  }
})
