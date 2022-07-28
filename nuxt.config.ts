import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt'
import { resolve } from 'pathe'
import module from './app/module'

const themeDir = fileURLToPath(new URL('./', import.meta.url))
const resolveThemeDir = (path: string) => resolve(themeDir, path)

export default defineNuxtConfig({
  modules: ['@nuxt-themes/config/module', '@nuxtjs/design-tokens/module', module, '@nuxtjs/color-mode', '@nuxtjs/tailwindcss'],

  css: [
    resolveThemeDir('app/tailwind.css')
  ],

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
