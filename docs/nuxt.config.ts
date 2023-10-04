import { createResolver } from '@nuxt/kit'
import colors from 'tailwindcss/colors'
import module from '../src/module'
import { excludeColors } from '../src/colors'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: process.env.NUXT_UI_PRO_PATH ? [
    process.env.NUXT_UI_PRO_PATH,
    resolve(process.env.NUXT_UI_PRO_PATH, '.docs')
  ] : [
    '@nuxt/ui-pro',
    'github:nuxt/ui-pro/.docs'
  ],
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
    'nuxt-component-meta'
  ],
  runtimeConfig: {
    public: {
      version: pkg.version,
      uiProPath: process.env.NUXT_UI_PRO_PATH
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
      },
      pro: process.env.NUXT_UI_PRO_PATH ? {
        prefix: '/pro',
        driver: 'fs',
        base: resolve(process.env.NUXT_UI_PRO_PATH, '.docs/content')
      } : {
        prefix: '/pro',
        driver: 'github',
        repo: 'nuxt/ui-pro',
        branch: 'dev',
        dir: '.docs',
        token: process.env.NUXT_GITHUB_TOKEN || ''
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
        '/pro',
        '/pro/guide',
        '/pro/activate',
        '/api/search.json'
      ]
    }
  },
  componentMeta: {
    exclude: ['@nuxtjs/mdc', resolve('./components')],
    metaFields: {
      props: true,
      slots: true,
      events: false,
      exposed: false
    }
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
  },
  experimental: {
    appManifest: true
  }
})
