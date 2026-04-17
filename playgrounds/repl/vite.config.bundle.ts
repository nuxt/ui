import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      ui: {
        colors: {
          primary: 'green',
          neutral: 'slate'
        }
      },
      router: false,
      autoImport: false,
      components: false
    })
  ],
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/entry.ts'),
      formats: ['es'],
      fileName: 'nuxt-ui'
    },
    outDir: resolve(__dirname, 'public'),
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        assetFileNames: 'nuxt-ui.[ext]',
        inlineDynamicImports: true
      }
    }
  }
})
