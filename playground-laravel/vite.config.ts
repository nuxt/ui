import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import path, { resolve } from 'node:path'
import { defineConfig } from 'vite'
import ui from '../src/vite'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.ts'],
      ssr: 'resources/js/ssr.ts',
      refresh: true
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false
        }
      }
    }),
    ui()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
      'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy')
    }
  }
})
