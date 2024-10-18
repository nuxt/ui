import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImports from 'unplugin-auto-import/vite'
import VueComponents from 'unplugin-vue-components'

import { NuxtUIPlugin } from '../src/unplugin'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ['..']
    }
  },
  plugins: [
    vue(),
    NuxtUIPlugin.vite({
      ui: {
        colors: {
          primary: 'green',
          neutral: 'slate'
        }
      }
    }),
    // these are required as we share the component pages with the Nuxt playground
    AutoImports({ imports: ['vue'] }),
    VueComponents.vite({
      dirs: ['../playground/app/components']
    })
  ],
  optimizeDeps: {
    // prevents reloading page when navigating between components
    include: ['radix-vue/namespaced', 'vaul-vue', 'fast-deep-equal', 'embla-carousel-vue', 'embla-carousel-autoplay', 'embla-carousel-auto-scroll', 'embla-carousel-auto-height', 'embla-carousel-class-names', 'embla-carousel-fade', 'embla-carousel-wheel-gestures']
  }
})
