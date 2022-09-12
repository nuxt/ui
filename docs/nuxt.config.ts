import { defineNuxtConfig } from 'nuxt'
import defaultTheme from 'tailwindcss/defaultTheme'
import nuxtUI from '../src/module'

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
  modules: [
    nuxtUI
  ],
  components: {
    global: true
  },
  ui: {
    colors: {
      primary: 'blue',
      gray: 'zinc'
    },
    preset: {
    },
    tailwindcss: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter var', ...defaultTheme.fontFamily.sans]
          }
        }
      }
    }
  }
})
