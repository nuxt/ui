import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImports from 'unplugin-auto-import/vite'

import { NuxtUIPlugin } from '@nuxt/ui/unplugin'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ['../playground', '..']
    }
  },
  plugins: [
    vue(),
    AutoImports({ imports: ['vue'] }),
    NuxtUIPlugin.vite({
      ui: {
        colors: {
          primary: 'green',
          neutral: 'slate'
        }
      }
    })
  ]
})
