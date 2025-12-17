import { fileURLToPath } from 'node:url'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import ui from './src/vite'
import { resolve } from 'pathe'
import { glob } from 'tinyglobby'

const components = await glob('./src/runtime/components/*.vue', { absolute: true })
const vueComponents = await glob('./src/runtime/vue/components/*.vue', { absolute: true })
const vueRouterOverrides = await glob('./src/runtime/vue/overrides/vue-router/*.vue', { absolute: true })

export default defineConfig({
  test: {
    testTimeout: 5000,
    globals: true,
    silent: true,
    resolveSnapshotPath(path, extension, { config }) {
      if (config.name === 'vue') {
        return path.replace(/\/([^/]+)\.spec\.ts$/, `/__snapshots__/$1-vue.spec.ts${extension}`)
      } else {
        return path.replace(/\/([^/]+)\.spec\.ts$/, `/__snapshots__/$1.spec.ts${extension}`)
      }
    },
    projects: [
      await defineVitestProject({
        extends: true,
        test: {
          name: 'nuxt',
          include: ['./test/components/**/**.spec.ts', './test/composables/**.spec.ts', './test/utils/**/**.spec.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('test/nuxt/', import.meta.url))
            }
          },
          setupFiles: fileURLToPath(new URL('test/nuxt/setup.ts', import.meta.url))
        }
      }),
      {
        extends: true,
        test: {
          name: 'vue',
          environment: 'happy-dom',
          include: ['./test/components/**.spec.ts', './test/composables/**.spec.ts', './test/utils/**/**.spec.ts'],
          setupFiles: ['./test/utils/setup.ts']
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
                const resolvedComponents = [...vueRouterOverrides, ...vueComponents, ...components]
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
      }
    ]
  }
})
