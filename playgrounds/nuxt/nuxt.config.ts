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
      // prevents reloading page when navigating between components
      include: ['@ai-sdk/vue', '@internationalized/date', '@tanstack/vue-table', '@tanstack/vue-virtual', '@tiptap/core', '@tiptap/extension-horizontal-rule', '@tiptap/markdown', '@tiptap/extension-image', '@floating-ui/dom', '@tiptap/extension-drag-handle-vue-3', '@tiptap/vue-3/menus', '@vue/devtools-core', '@vue/devtools-kit', '@vueuse/core', '@vueuse/integrations/useFuse', '@vueuse/shared', 'colortranslator', 'embla-carousel-auto-height', 'embla-carousel-auto-scroll', 'embla-carousel-autoplay', 'embla-carousel-class-names', 'embla-carousel-fade', 'embla-carousel-vue', 'embla-carousel-wheel-gestures', 'ohash/utils', 'reka-ui', 'reka-ui/namespaced', 'scule', 'tailwind-variants', 'tailwindcss/colors', 'ufo', 'vaul-vue', 'zod']
    }
  }
})
