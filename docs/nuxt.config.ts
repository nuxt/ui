import { defineNuxtConfig } from 'nuxt'
import module from '../src/module'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  extends: ['../node_modules/@docus/base'],
  app: {
    head: {
      title: '@nuxthq/ui',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
        },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' }
      ]
    }
  },
  modules: [
    module
  ],
  components: {
    global: true
  },
  ui: {
    colors: {
      primary: 'blue'
    },
    preset: {
    }
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Inter var", sans-serif']
          }
        }
      }
    }
  }
})
