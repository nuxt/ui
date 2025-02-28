import { createResolver } from '@nuxt/kit'
import pkg from '../package.json'
import yaml from '@rollup/plugin-yaml'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: [
    process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs') : process.env.NUXT_GITHUB_TOKEN && ['github:nuxt/ui-pro/docs#v3', { giget: { auth: process.env.NUXT_GITHUB_TOKEN } }]
  ],

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
    'motion-v/nuxt',
    (_, nuxt) => {
      nuxt.hook('components:dirs', (dirs) => {
        dirs.unshift({ path: resolve('./app/components/content/examples'), pathPrefix: false, prefix: '', global: true })
      })
    },
    'nuxt-llms'
  ],
  $development: {
    site: {
      url: 'http://localhost:3000'
    }
  },
  $production: {
    site: {
      url: 'https://ui3.nuxt.dev'
    }
  },

  devtools: {
    enabled: true
  },

  app: {
    head: {
      // LemonSqueezy affiliate
      script: [{
        key: 'lmsqueezy-config',
        innerHTML: 'window.lemonSqueezyAffiliateConfig = { store: "nuxt" };'
      }, {
        key: 'lmsqueezy',
        src: 'https://lmsqueezy.com/affiliate.js',
        defer: true
      }]
    },
    rootAttrs: {
      'vaul-drawer-wrapper': '',
      'class': 'bg-(--ui-bg)'
    }
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'ts', 'typescript', 'diff', 'vue', 'json', 'yml', 'css', 'mdc']
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
    '/composables': { redirect: '/composables/define-shortcuts', prerender: false }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-09',

  nitro: {
    prerender: {
      routes: [
        '/getting-started',
        '/api/countries.json',
        '/api/locales.json'
        // '/api/releases.json',
        // '/api/pulls.json'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: [
            '/components/*',
            '/getting-started/*',
            '/composables/*'
          ]
        }
      }
    }
  },

  vite: {
    plugins: [
      yaml()
    ]
  },

  componentMeta: {
    exclude: [
      '@nuxt/content',
      '@nuxt/icon',
      '@nuxt/image',
      '@nuxtjs/color-mode',
      '@nuxtjs/mdc',
      '@nuxtjs/plausible',
      'nuxt/dist',
      'nuxt-og-image',
      resolve('./app/components'),
      process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs', 'app', 'components') : '.c12'
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
  },

  llms: {
    domain: 'https://ui3.nuxt.dev',
    title: 'Nuxt UI v3',
    description: 'A comprehensive, Nuxt-integrated UI library providing a rich set of fully-styled, accessible and highly customizable components for building modern web applications.',
    full: {
      title: 'Nuxt UI v3 Full Documentation',
      description: 'This is the full documentation for Nuxt UI v3. It includes all the Markdown files written with the MDC syntax.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'content',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' }
        ]
      },
      {
        title: 'Components',
        contentCollection: 'content',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/components/%' }
        ]
      },
      {
        title: 'Composables',
        contentCollection: 'content',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/composables/%' }
        ]
      }
    ],
    notes: [
      'The documentation excludes Nuxt UI v2 content.',
      'The content is automatically generated from the same source as the official documentation.'
    ]
  },

  uiPro: {
    license: 'oss'
  }
})
