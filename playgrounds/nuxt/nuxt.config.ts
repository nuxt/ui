export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  routeRules: {
    '/docs/components/**': { redirect: { to: '/components/**', statusCode: 301 }, prerender: false }
  },

  future: {
    compatibilityVersion: 5
  },

  experimental: {
    // `@nuxt/content` still imports Nitro helpers from `#imports`, which compat v5
    // no longer provides. Remove once nuxt/content#3889 is released.
    nitroAutoImports: true
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
  }
})
