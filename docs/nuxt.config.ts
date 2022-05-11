import { defineNuxtConfig } from 'nuxt'
import module from '../src/module'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  extends: ['../node_modules/@docus/base'],
  meta: {
    title: '@nuxthq/ui',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }
    ]
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
