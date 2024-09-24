import { createResolver } from '@nuxt/kit'
import module from '../src/module'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  app: {
    rootAttrs: {
      'vaul-drawer-wrapper': '',
      'class': 'bg-[--background]'
    }
  },

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

  hub: {
    cache: true
  },

  future: {
    compatibilityVersion: 4
  },

  experimental: {
    buildCache: true
  },

  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },

  icon: {
    customCollections: [{
      prefix: 'custom',
      dir: resolve('./app/assets/icons')
    }],
    clientBundle: {
      scan: true
    }
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
    highlight: {
      langs: ['bash', 'ts', 'diff', 'vue', 'json', 'yml', 'css', 'mdc']
    }
  },

  image: {
    provider: 'ipx'
  },

  nitro: {
    prerender: {
      routes: [
        '/getting-started'
        // '/api/releases.json',
        // '/api/pulls.json'
      ],
      crawlLinks: true
      // ignore: !process.env.NUXT_GITHUB_TOKEN ? ['/pro'] : []
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: [
            '/components/*',
            '/getting-started/',
            '/composables/',
            '/api/*',
            '/__og-image__/*'
          ]
        }
      }
    }
  },

  routeRules: {
    '/': { redirect: '/getting-started', prerender: false },
    '/composables': { redirect: '/composables/define-shortcuts', prerender: false },
    '/components': { redirect: '/components/app', prerender: false },
    '/api/_mdc/highlight': { cache: { group: 'mdc', name: 'highlight', maxAge: 60 * 60 } },
    '/api/_content/query/**': { cache: { group: 'content', name: 'query', maxAge: 60 * 60 } }
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

  hooks: {
    'components:extend': (components) => {
      const globals = components.filter(c => [
        'UAccordion',
        'UAlert',
        'UAvatar',
        'UAvatarGroup',
        'UBadge',
        'UBreadcrumb',
        'UButton',
        'UButtonGroup',
        'UCheckbox',
        'UChip',
        'UCollapsible',
        'UCommandPalette',
        'UContextMenu',
        'UDrawer',
        'UDropdownMenu',
        'UFormField',
        'UIcon',
        'UInput',
        'UKbd',
        'ULink',
        'UModal',
        'UNavigationMenu',
        'UPopover',
        'UProgress',
        'URadioGroup',
        'USelect',
        'USeparator',
        'USlider',
        'USlideover',
        'USwitch',
        'UTabs',
        'UTextarea',
        'UTooltip'
      ].includes(c.pascalName))

      globals.forEach(c => c.global = 'sync')
    }
  },

  site: {
    url: 'https://ui3.nuxt.com'
  },

  compatibilityDate: '2024-07-09'
})
