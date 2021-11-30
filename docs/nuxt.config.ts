import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  meta: {
    title: '@nuxthq/ui',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
    ],
    htmlAttrs: {
      class: 'u-bg-white'
    },
    bodyAttrs: {
      class: 'u-bg-gray-50 u-text-gray-700'
    },
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter&family=Fira+Code&display=swap'
      }
    ]
  },
  buildModules: [
    '../src'
  ],
  ui: {
    colors: {
      primary: 'blue'
    },
    unocss: {
      theme: {
        fontFamily: {
          sans: '\'Inter\', sans-serif',
          mono: '\'Fira Code\', monospace'
        }
      }
    }
  }
})
