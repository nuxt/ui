export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2024-07-09',

  vite: {
    optimizeDeps: {
      // prevents reloading page when navigating between components
      include: ['@ai-sdk/vue', '@internationalized/date', '@tanstack/vue-table', '@tanstack/vue-virtual', '@vue/devtools-core', '@vue/devtools-kit', '@vueuse/core', '@vueuse/integrations/useFuse', '@vueuse/shared', 'colortranslator', 'embla-carousel-auto-height', 'embla-carousel-auto-scroll', 'embla-carousel-autoplay', 'embla-carousel-class-names', 'embla-carousel-fade', 'embla-carousel-vue', 'embla-carousel-wheel-gestures', 'ohash/utils', 'reka-ui', 'reka-ui/namespaced', 'scule', 'tailwind-variants', 'tailwindcss/colors', 'ufo', 'vaul-vue', 'zod']
    }
  }
})
