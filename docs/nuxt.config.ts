import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  extends: ['../', '@nuxt-themes/docus'],
  meta: {
    title: '@nuxthq/ui',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }
    ]
  },
  components: [
    {
      path: '~/components',
      global: true,
      prefix: ''
    }
  ],
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
            sans: ['"Inter var", sans-serif']
          }
        }
      }
    }
  }
})
