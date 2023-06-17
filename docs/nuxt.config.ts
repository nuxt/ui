import ui from '../src/module'
import { excludeColors } from '../src/colors'
import colors from 'tailwindcss/colors'

export default defineNuxtConfig({
  // @ts-ignore
  modules: [
    ui,
    '@vueuse/nuxt',
    '@nuxt/content',
    '@nuxt/devtools',
    '@nuxthq/studio',
    '@nuxtjs/plausible',
    'nuxt-lodash',
    'nuxt-component-meta'
  ],
  content: {
    highlight: {
      theme: {
        light: 'material-lighter',
        default: 'material-default',
        dark: 'material-palenight'
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini']
    }
  },
  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons'],
    safelistColors: excludeColors(colors)
  },
  typescript: {
    strict: false,
    includeWorkspace: true
  },
  routeRules: {
    '/': { redirect: '/getting-started' }
  },
  generate: {
    routes: ['/getting-started']
  },
  componentMeta: {
    metaFields: {
      props: true,
      slots: false,
      events: false,
      exposed: false
    }
  }
})
