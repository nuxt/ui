export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2024-07-09',

  hooks: {
    // Register every Nuxt UI component globally so the client bundle ships all of them
    'components:extend'(components) {
      for (const component of components) {
        if (component.pascalName.startsWith('U')) {
          component.global = true
        }
      }
    }
  }
})
