import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImports from 'unplugin-auto-import/vite'
import VueComponents from 'unplugin-vue-components'

import ui from '../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ['..']
    }
  },
  plugins: [
    vue(),
    ui({
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
    include: ['reka-ui/namespaced', 'vaul-vue', 'embla-carousel-vue', 'embla-carousel-autoplay', 'embla-carousel-auto-scroll', 'embla-carousel-auto-height', 'embla-carousel-class-names', 'embla-carousel-fade', 'embla-carousel-wheel-gestures']
  }
})
