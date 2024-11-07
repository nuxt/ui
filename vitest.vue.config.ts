import vue from '@vitejs/plugin-vue'
import ui from './src/vite'
import { defineConfig } from 'vitest/config'
import { glob } from 'tinyglobby'
import { resolve } from 'pathe'

const components = await glob('./src/runtime/components/*.vue', { absolute: true })
const vueComponents = await glob('./src/runtime/vue/components/*.vue', { absolute: true })

export default defineConfig({
  test: {
    environment: 'happy-dom',
    silent: true,
    include: ['./test/components/**.spec.ts'],
    setupFiles: ['./test/utils/setup.ts'],
    resolveSnapshotPath(path, extension) {
      return path.replace(/\/([^/]+)\.spec\.ts$/, `/__snapshots__/$1-vue.spec.ts${extension}`)
    }
  },
  plugins: [
    vue(),
    ui({ dts: false }),
    {
      name: 'nuxt-ui-test:components',
      enforce: 'pre',
      resolveId(id) {
        if (id === '@nuxt/test-utils/runtime') {
          return resolve('./test/utils/mount')
        }
      }
    },
    {
      name: 'nuxt-ui-test:components',
      enforce: 'pre',
      resolveId(id) {
        if (id === '#components') {
          return '#components'
        }
      },
      load(id) {
        if (id === '#components' || id === '?#components') {
          const resolvedComponents = [...vueComponents, ...components]
          const renderedComponents = new Set<string>()
          return resolvedComponents.map((file) => {
            const componentName = file.split('/').pop()!.replace('.vue', '')
            if (renderedComponents.has(componentName)) {
              return ''
            }
            renderedComponents.add(componentName)
            return `export { default as U${componentName} } from '${file}'`
          }).join('\n')
        }
      }
    }
  ]
})
