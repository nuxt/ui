import defaultTheme from 'tailwindcss/defaultTheme'
import ui from '../src/module'
import preset from './ui'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: [
    // @ts-ignore
    ui,
    '@nuxthq/studio',
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxtjs/plausible',
    'nuxt-lodash'
  ],
  content: {
    documentDriven: true,
    highlight: {
      theme: {
        dark: 'one-dark-pro',
        default: 'one-dark-pro'
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini']
    }
  },
  ui: {
    colors: {
      primary: 'sky',
      gray: 'slate'
    },
    preset,
    icons: ['heroicons', 'mdi'],
    tailwindcss: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter var', ...defaultTheme.fontFamily.sans]
          }
        }
      }
    }
  },
  typescript: {
    strict: false
  }
})
