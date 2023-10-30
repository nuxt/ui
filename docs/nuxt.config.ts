import { createResolver } from '@nuxt/kit'
import colors from 'tailwindcss/colors'
import module from '../src/module'
import { excludeColors } from '../src/colors'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  // @ts-ignore
  extends: process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro',
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
    'nuxt-cloudflare-analytics',
    'modules/content-examples-code'
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
      dev: {
        prefix: '/dev',
        driver: 'fs',
        base: resolve('./content')
      },
      // overwrite default source AKA `content` directory
      content: {
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
    exclude: ['@nuxtjs/mdc', resolve('./components'), resolve('@nuxt/ui-pro/components')],
    metaFields: {
      props: true,
      slots: false,
      events: false,
      exposed: false
    }
  },
  cloudflareAnalytics: {
    token: '1e2b0c5e9a214f0390b9b94e043d8d4c',
    scriptPath: false
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
