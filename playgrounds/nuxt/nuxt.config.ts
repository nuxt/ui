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
        '@vueuse/core',
        'tailwindcss/colors',
        'vaul-vue',
        'tailwind-variants',
        '@vueuse/integrations/useFuse',
        'ai',
        '@ai-sdk/vue',
        '@comark/vue',
        '@comark/vue/plugins/highlight'
      ]
    }
  }
})
