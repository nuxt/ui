import { createResolver } from '@nuxt/kit'
import module from '../src/module'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  // extends: [
  //   process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs') : process.env.NUXT_GITHUB_TOKEN && ['github:nuxt/ui-pro/docs#dev', { giget: { auth: process.env.NUXT_GITHUB_TOKEN } }]
  // ],

  modules: [
    module,
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxthub/core',
    '@nuxtjs/plausible',
    '@vueuse/nuxt',
    'nuxt-component-meta',
    'nuxt-og-image'
  ],

  $production: {
    routeRules: {
      '/api/_mdc/highlight': { cache: { group: 'mdc', name: 'highlight', maxAge: 60 * 60 } },
      '/api/_content/query/**': { cache: { group: 'content', name: 'query', maxAge: 60 * 60 } }
    }
  },

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
    // sources: {
    //   pro: process.env.NUXT_UI_PRO_PATH
    //     ? {
    //         prefix: '/pro',
    //         driver: 'fs',
    //         base: resolve(process.env.NUXT_UI_PRO_PATH, 'docs/app/content/pro')
    //       }
    //     : process.env.NUXT_GITHUB_TOKEN
    //       ? {
    //           prefix: '/pro',
    //           driver: 'github',
    //           repo: 'nuxt/ui-pro',
    //           branch: 'dev',
    //           dir: 'docs/app/content/pro',
    //           token: process.env.NUXT_GITHUB_TOKEN || ''
    //         }
    //       : undefined
    // },
    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'ts', 'diff', 'vue', 'json', 'yml', 'css', 'mdc']
        }
      }
    }
  },

  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },

  routeRules: {
    '/': { redirect: '/getting-started', prerender: false },
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
        '/getting-started'
        // '/api/releases.json',
        // '/api/pulls.json'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
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
    cache: true
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
