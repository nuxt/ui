import module from '../src/module'

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

  modules: [module, '@nuxtjs/mdc', '@nuxt/content'],

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

  content: {
    highlight: {
      langs: ['bash', 'ts', 'diff', 'vue', 'json', 'yml', 'css', 'mdc']
    }
  },

  compatibilityDate: '2024-04-03'
})
