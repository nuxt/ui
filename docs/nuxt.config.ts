import colors from 'tailwindcss/colors'
import module from '../src/module'
import { excludeColors } from '../src/colors'
import pkg from '../package.json'

export default defineNuxtConfig({
  extends: '@nuxthq/ui-kit',
  modules: [
    '@nuxt/content',
    '@nuxt/devtools',
    '@nuxthq/studio',
    module,
    '@nuxtjs/google-fonts',
    '@nuxtjs/plausible',
    '@vueuse/nuxt',
    'nuxt-component-meta',
    'nuxt-lodash'
  ],
  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },
  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons'],
    safelistColors: excludeColors(colors)
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    }
  },
  routeRules: {
    '/': { redirect: '/getting-started', prerender: false }
  },
  nitro: {
    prerender: {
      routes: ['/getting-started']
    }
  },
  componentMeta: {
    metaFields: {
      props: true,
      slots: false,
      events: false,
      exposed: false
    }
  },
  typescript: {
    strict: false,
    includeWorkspace: true
  }
})
