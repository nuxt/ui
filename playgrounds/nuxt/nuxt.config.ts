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
        '@internationalized/date',
        '@tanstack/charts',
        '@tanstack/charts/crosshair',
        '@tanstack/charts/mark/decorative',
        '@tanstack/charts/polar',
        '@tanstack/charts/scales/band',
        '@tanstack/charts/scales/linear',
        '@tanstack/charts/scales/ordinal',
        '@tanstack/charts/scales/point',
        '@tanstack/charts/vue',
        '@vueuse/core',
        '@vueuse/integrations/useFuse',
        '@vueuse/shared',
        'ai',
        'cn/engine',
        'cn/tables',
        'colortranslator',
        'embla-carousel-auto-height',
        'embla-carousel-auto-scroll',
        'embla-carousel-autoplay',
        'embla-carousel-class-names',
        'embla-carousel-fade',
        'embla-carousel-vue',
        'embla-carousel-wheel-gestures',
        'motion-v',
        'tailwindcss/colors',
        'zod'
      ]
    }
  }
})
