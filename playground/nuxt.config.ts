import module from '../src/module'

export default defineNuxtConfig({
  modules: [
    module
  ],
  nitro: {
    prerender: {
      failOnError: false
    }
  }
})
