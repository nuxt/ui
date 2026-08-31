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
          // The docs examples imported in `pages/components/form.vue` resolve
          // `@nuxt/ui` from `docs/`, which the isolated CI install can't reach.
          '@nuxt/ui': ['../node_modules/@nuxt/ui/dist/module.d.mts']
        }
      }
    }
  }
})
