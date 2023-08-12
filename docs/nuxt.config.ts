import { createResolver } from '@nuxt/kit'
import colors from 'tailwindcss/colors'
import module from '../src/module'
import { excludeColors } from '../src/colors'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: '@nuxthq/elements',
  modules: [
    '@nuxt/content',
    // '@nuxt/devtools',
    // '@nuxthq/studio',
    module,
    '@nuxtjs/fontaine',
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
  experimental: {
    payloadExtraction: false
  },
  componentMeta: {
    globalsOnly: true,
    exclude: [resolve('./components'), resolve('@nuxthq/elements/components')],
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
