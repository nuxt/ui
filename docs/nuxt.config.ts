import { createResolver } from '@nuxt/kit'
import colors from 'tailwindcss/colors'
import module from '../src/module'
import { excludeColors } from '../src/colors'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: process.env.NUXT_ELEMENTS_PATH || '@nuxthq/elements',
  modules: [
    '@nuxt/content',
    'nuxt-og-image',
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
  content: {
    sources: {
      // overwrite default source AKA `content` directory
      content: {
        prefix: '/dev',
        driver: 'fs',
        base: resolve('./content')
      },
      main: {
        prefix: '/main',
        driver: 'github',
        repo: 'nuxt/ui',
        branch: 'main',
        dir: 'docs/content'
      }
    }
  },
  fontMetrics: {
    fonts: ['DM Sans']
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [400, 500, 600, 700]
    }
  },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/getting-started',
        '/dev/getting-started',
        '/api/search.json'
      ]
    }
  },
  componentMeta: {
    globalsOnly: true,
    exclude: ['@nuxtjs/mdc', resolve('./components'), resolve('@nuxthq/elements/components')],
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
  },
  hooks: {
    // Related to https://github.com/nuxt/nuxt/pull/22558
    'components:extend': (components) => {
      components.forEach((component) => {
        if (component.global) {
          component.global = 'sync'
        }
      })
    }
  }
})
