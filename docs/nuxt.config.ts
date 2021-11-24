import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  buildModules: [
    '../dist'
  ],
  ui: {
    colors: {
      primary: 'blue'
    }
  }
})
