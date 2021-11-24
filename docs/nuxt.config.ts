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
    }
  },
  buildModules: [
    '../src'
  ],
  ui: {
    colors: {
      primary: 'blue'
    }
  }
})
