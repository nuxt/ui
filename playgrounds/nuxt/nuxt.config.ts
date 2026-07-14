export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/docs/components/**': { redirect: { to: '/components/**', statusCode: 301 }, prerender: false }
  },

  compatibilityDate: '2024-07-09',

  vite: {
    optimizeDeps: {
      include: [
        '@ai-sdk/vue',
        '@comark/vue',
        '@comark/vue/plugins/highlight',
        '@vueuse/core',
        '@vueuse/integrations/useFuse',
        'ai',
        'tailwind-variants',
        'tailwindcss/colors'
      ]
    }
  }
})
