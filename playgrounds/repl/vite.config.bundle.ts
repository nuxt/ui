import { resolve, normalize } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

const runtimeDir = normalize(resolve(__dirname, '../../src/runtime'))

const overrides: Record<string, string> = {
  'Icon.vue': resolve(__dirname, '../../src/runtime/vue/components/Icon.vue'),
  'Link.vue': resolve(__dirname, '../../src/runtime/vue/overrides/none/Link.vue')
}

export default defineConfig({
  plugins: [
    {
      name: 'repl:component-overrides',
      enforce: 'pre',
      resolveId: {
        order: 'pre',
        async handler(id, importer) {
          if (!importer || !id.endsWith('.vue')) return
          if (!normalize(importer).startsWith(runtimeDir)) return

          const filename = id.match(/([^/]+\.vue)$/)?.[1]
          if (!filename || !overrides[filename]) return

          const resolved = await this.resolve(id, importer, { skipSelf: true })
          if (resolved && normalize(resolved.id).startsWith(runtimeDir) && !normalize(resolved.id).includes('/vue/')) {
            return overrides[filename]
          }
        }
      }
    },
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
