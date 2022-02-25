import { defineNuxtConfig } from 'nuxt3'
import module from '../src/module'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  meta: {
    title: '@nuxthq/ui',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }
    ]
  },
  buildModules: [
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
    },
    tailwindcss: {
      theme: {
        extend: {
          fontFamily: {
            sans: '"Inter var", sans-serif'
          }
        }
      }
    }
  }
})
