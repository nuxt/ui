import defaultTheme from 'tailwindcss/defaultTheme'
import nuxtUI from '../src/module'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: [
    nuxtUI
  ],
  components: {
    global: true
  },
  ui: {
    colors: {
      primary: 'blue',
      gray: 'zinc'
    },
    preset: {
    },
    tailwindcss: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter var', ...defaultTheme.fontFamily.sans]
          }
        }
      }
    }
  }
})
