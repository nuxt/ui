import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt'
import { resolve } from 'pathe'
import module from './app/module'

const themeDir = fileURLToPath(new URL('./', import.meta.url))
const resolveThemeDir = (path: string) => resolve(themeDir, path)

const prefix = 'U'

export default defineNuxtConfig({
  modules: ['@nuxt-themes/config/module', '@nuxtjs/design-tokens/module', module, '@nuxtjs/color-mode'],

  css: [
    resolveThemeDir('app/tailwind.css')
  ],

  components: [
    {
      path: resolveThemeDir('components/elements'),
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/feedback'),
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/forms'),
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/layout'),
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/navigation'),
      prefix,
      watch: false
    },
    {
      path: resolveThemeDir('components/overlays'),
      prefix,
      watch: false
    }
  ],

  tailwindcss: {
    viewer: false
  }
})
