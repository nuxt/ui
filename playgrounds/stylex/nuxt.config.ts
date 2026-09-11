import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: [fileURLToPath(new URL('./assets/main.css', import.meta.url))],

  ui: {
    theme: {
      engine: 'stylex'
    }
  },

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  routeRules: {
    '/docs/components/**': { redirect: { to: '/components/**', statusCode: 301 }, prerender: false }
  },

  compatibilityDate: '2024-07-09',

  vite: {
    optimizeDeps: {
      include: [
        '@ai-sdk/vue',
        '@comark/vue',
        '@comark/vue/plugins/shiki',
        '@vueuse/core',
        '@vueuse/integrations/useFuse',
        'ai',
        'tailwind-variants',
        'tailwindcss/colors',
        'vaul-vue'
      ]
    }
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@nuxt/ui': ['../node_modules/@nuxt/ui/dist/module.d.mts'],
          'zod': ['../node_modules/zod']
        }
      }
    }
  }
})
