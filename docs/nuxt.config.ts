import { createResolver } from '@nuxt/kit'
import module from '../src/module'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  app: {
    head: {
      bodyAttrs: {
        class: 'antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900'
      }
    }
  },
  extends: [
    process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs') : process.env.NUXT_GITHUB_TOKEN && ['github:nuxt/ui-pro/docs#dev', { giget: { auth: process.env.NUXT_GITHUB_TOKEN } }]
  ],
  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/image',
    module,
    '@nuxt/ui-pro',
    '@nuxtjs/plausible',
    '@vueuse/nuxt',
    'nuxt-og-image',
    // 'modules/content-examples-code'
  ],
  future: {
    compatibilityVersion: 4
  },
  runtimeConfig: {
    public: {
      version: pkg.version
    }
  },
  // ui: {
  //   global: true
  // },
  content: {
    sources: {
      pro: process.env.NUXT_UI_PRO_PATH ? {
        prefix: '/pro',
        driver: 'fs',
        base: resolve(process.env.NUXT_UI_PRO_PATH, 'docs/content/pro')
      } : process.env.NUXT_GITHUB_TOKEN ? {
        prefix: '/pro',
        driver: 'github',
        repo: 'nuxt/ui-pro',
        branch: 'dev',
        dir: 'docs/content/pro',
        token: process.env.NUXT_GITHUB_TOKEN || ''
      } : undefined
    }
  },
  image: {
    provider: 'ipx'
  },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/getting-started',
        '/dev/getting-started',
        '/api/releases.json',
        '/api/pulls.json'
      ],
      ignore: !process.env.NUXT_GITHUB_TOKEN ? ['/pro'] : []
    }
  },
  routeRules: {
    '/components': { redirect: '/components/app', prerender: false },
    '/dev/components': { redirect: '/dev/components/app', prerender: false }
  },
  // componentMeta: {
  //   exclude: [
  //     // '@nuxt/content',
  //     // '@nuxt/ui-templates',
  //     // '@nuxtjs/color-mode',
  //     // '@nuxtjs/mdc',
  //     // 'nuxt/dist',
  //     // 'nuxt-og-image',
  //     // 'nuxt-site-config',
  //     resolve('./components'),
  //     // process.env.NUXT_UI_PRO_PATH ? resolve(process.env.NUXT_UI_PRO_PATH, 'docs', 'components') : '.c12'
  //   ],
  //   // metaFields: {
  //   //   type: false,
  //   //   props: true,
  //   //   slots: true,
  //   //   events: false,
  //   //   exposed: false
  //   // }
  // },
  hooks: {
    // Related to https://github.com/nuxt/nuxt/pull/22558
    // 'components:extend': (components) => {
    //   components.forEach((component) => {
    //     if (component.shortPath.includes('@nuxt/ui-pro')) {
    //       component.global = true
    //     } else if (component.global) {
    //       component.global = 'sync'
    //     }
    //   })
    // }
  },
  vite: {
    optimizeDeps: {
      include: ['date-fns']
    }
  }
})
