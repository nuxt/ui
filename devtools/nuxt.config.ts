import module from '../src/module'
import { resolve } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4
  },

  devtools: { enabled: false },

  ssr: false,

  modules: [module, '@nuxtjs/mdc', '@nuxt/test-utils/module'],

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

  app: {
    baseURL: '/__nuxt_ui__/devtools'
  },

  vite: {
    server: {
      hmr: {
        clientPort: process.env.PORT ? +process.env.PORT : undefined
      }
    }
  },

  mdc: {
    highlight: {
      theme: {
        light: 'material-theme',
        default: 'material-theme',
        dark: 'material-theme-palenight'
      }
    }
  }
})
