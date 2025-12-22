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
      include: ['@ai-sdk/vue', '@internationalized/date', '@tanstack/vue-table', '@tanstack/vue-virtual', '@tiptap/extension-emoji', '@tiptap/vue-3/menus', '@tiptap/core', '@tiptap/extension-drag-handle-vue-3', '@tiptap/extension-horizontal-rule', '@tiptap/extension-image', '@tiptap/extension-mention', '@tiptap/extension-placeholder', '@tiptap/extension-text-align', '@tiptap/markdown', '@tiptap/starter-kit', '@tiptap/vue-3', '@floating-ui/dom', '@tiptap/suggestion', '@tiptap/pm/state', '@vue/devtools-core', '@vue/devtools-kit', '@vueuse/core', '@vueuse/integrations/useFuse', '@vueuse/shared', 'colortranslator', 'embla-carousel-auto-height', 'embla-carousel-auto-scroll', 'embla-carousel-autoplay', 'embla-carousel-class-names', 'embla-carousel-fade', 'embla-carousel-vue', 'embla-carousel-wheel-gestures', 'ohash/utils', 'prosemirror-state', 'reka-ui', 'reka-ui/namespaced', 'scule', 'tailwind-variants', 'tailwindcss/colors', 'ufo', 'vaul-vue', 'zod']
    }
  }
})
