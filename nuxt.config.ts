import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt'
import { resolve } from 'pathe'
import module from './app/module'

const themeDir = fileURLToPath(new URL('./', import.meta.url))
const resolveThemeDir = (path: string) => resolve(themeDir, path)

const prefix = 'U'

export default defineNuxtConfig({
  modules: ['@nuxt-themes/config/module', '@nuxtjs/design-tokens/module', module, '@nuxtjs/color-mode', '@nuxtjs/tailwindcss'],

  css: [
    resolveThemeDir('app/tailwind.css')
  ],

  components: [
    {
      path: resolveThemeDir('components/elements'),
      global: true,
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/feedback'),
      global: true,
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/forms'),
      global: true,
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/layout'),
      global: true,
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/navigation'),
      global: true,
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/overlays'),
      global: true,
      prefix,
      watch: false
    }
  ],

  tailwindcss: {
    viewer: false
  },

  build: {
    transpile: ['@popperjs/core', '@headlessui/vue', '@iconify/vue']
  }
})
