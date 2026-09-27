import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      router: false,
      // Components typed into the REPL can't be detected at build time
      componentDetection: false,
      autoImport: {
        imports: ['vue']
      }
    })
  ],
  optimizeDeps: {
    exclude: ['@vue/repl']
  },
  build: {
    outDir: resolve(__dirname, 'dist')
  }
})
