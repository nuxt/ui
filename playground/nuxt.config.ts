export default defineNuxtConfig({
  modules: [
    '../src/module'
  ],
  vite: {
    vue: {
      script: {
        defineModel: true
      }
    }
  }
})
