import { defineNuxtConfig } from 'nuxt'
import Inspect from 'vite-plugin-inspect'
import module from './app/module'

export default defineNuxtConfig({
  vite: {
    plugins: [
      Inspect()
    ]
  },

  modules: ['@nuxt-themes/config/module', '@nuxtjs/design-tokens/module', module, '@nuxtjs/color-mode', '@nuxtjs/tailwindcss'],

  css: [],

  tailwindcss: {
    viewer: false
  },

  build: {
    transpile: ['@popperjs/core', '@headlessui/vue', '@iconify/vue']
  },

  experimental: {
    viteNode: true
  }
})
