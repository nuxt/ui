import module from '../src/module'
import { resolve } from 'node:path'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
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

  modules: [module, '@nuxtjs/mdc', '@nuxt/test-utils/module'],

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

  compatibilityDate: '2024-04-03',

  mdc: {
    highlight: {
      theme: {
        light: 'material-theme-lighter',
        default: 'material-theme',
        dark: 'material-theme-palenight'
      }
    }
  }
})
