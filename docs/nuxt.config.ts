import { createResolver } from '@nuxt/kit'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  // extends: [
  //   process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs') : process.env.NUXT_GITHUB_TOKEN && ['github:nuxt/ui-pro/docs#dev', { giget: { auth: process.env.NUXT_GITHUB_TOKEN } }]
  // ],

  modules: [
    '../src/module',
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxthub/core',
    '@nuxtjs/plausible',
    '@vueuse/nuxt',
    'nuxt-component-meta',
    'nuxt-og-image',
    (_, nuxt) => {
      nuxt.hook('components:dirs', (dirs) => {
        dirs.unshift({ path: resolve('./app/components/content/examples'), pathPrefix: false, prefix: '', global: true })
      })
    }
  ],

  app: {
    rootAttrs: {
      'vaul-drawer-wrapper': '',
      'class': 'bg-[var(--ui-bg)]'
    }
  },

  site: {
    url: 'https://ui3.nuxt.dev'
  },

  content: {
    database: {
      type: 'd1',
      binding: 'DB'
    },

    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'ts', 'typescript', 'diff', 'vue', 'json', 'yml', 'css', 'mdc']
        },
        remarkPlugins: {
          'remark-mdc': {
            options: {
              experimental: {
                autoUnwrap: false
              }
            }
          }
        }
      }
    }
  },

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },

  routeRules: {
    '/': { redirect: '/getting-started', prerender: false },
    '/getting-started/installation': { redirect: '/getting-started/installation/nuxt', prerender: false },
    '/getting-started/icons': { redirect: '/getting-started/icons/nuxt', prerender: false },
    '/getting-started/color-mode': { redirect: '/getting-started/color-mode/nuxt', prerender: false },
    '/getting-started/i18n': { redirect: '/getting-started/i18n/nuxt', prerender: false },
    '/composables': { redirect: '/composables/define-shortcuts', prerender: false },
    '/components': { redirect: '/components/app', prerender: false }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-09',

  nitro: {
    prerender: {
      routes: [
        // '/getting-started',
        '/api/countries.json',
        '/api/locales.json'
        // '/api/releases.json',
        // '/api/pulls.json'
      ]
      // crawlLinks: true,
      // autoSubfolderIndex: false
      // ignore: !process.env.NUXT_GITHUB_TOKEN ? ['/pro'] : []
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: [
            '/components/*',
            '/getting-started/*',
            '/composables/*',
            '/api/*'
          ]
        }
      }
    }
  },

  hub: {
    cache: true,
    database: true
  },

  componentMeta: {
    exclude: [
      '@nuxt/content',
      '@nuxt/icon',
      '@nuxt/image',
      '@nuxt/ui-pro',
      '@nuxtjs/color-mode',
      '@nuxtjs/mdc',
      '@nuxtjs/plausible',
      'nuxt/dist',
      'nuxt-og-image',
      resolve('./app/components')
      // process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs', 'components') : '.c12'
    ],
    metaFields: {
      type: false,
      props: true,
      slots: true,
      events: true,
      exposed: false
    }
  },

  icon: {
    customCollections: [{
      prefix: 'custom',
      dir: resolve('./app/assets/icons')
    }],
    clientBundle: {
      scan: true,
      includeCustomCollections: true
    },
    provider: 'iconify'
  },

  image: {
    provider: 'ipx'
  }
})
