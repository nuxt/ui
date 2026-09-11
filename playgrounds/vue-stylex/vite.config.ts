import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import { pg } from '../stylex/app/pg.ts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ui({
      theme: {
        engine: 'stylex'
      },
      ui: {
        colors: {
          primary: 'green',
          neutral: 'slate'
        },
        pg
      } as any,
      autoImport: {
        dirs: ['../stylex/app/composables'],
        imports: ['vue']
      },
      components: {
        dirs: ['../stylex/app/components']
      }
    })
  ]
})
