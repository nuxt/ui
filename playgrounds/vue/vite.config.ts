import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ui({
      autoImport: {
        dirs: ['../nuxt/app/composables'],
        imports: ['vue']
      },
      components: {
        dirs: ['../nuxt/app/components']
      },
      // The pages come from the Nuxt playground, outside this root, which detection doesn't scan
      componentDetection: false
    })
  ]
})
