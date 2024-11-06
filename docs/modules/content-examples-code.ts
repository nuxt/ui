import { existsSync, readFileSync } from 'node:fs'
import fsp from 'node:fs/promises'
import { dirname, join } from 'pathe'
import {
  defineNuxtModule,
  addTemplate,
  addServerHandler,
  createResolver
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'content-examples-code'
  },
  async setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)
    let _configResolved: any
    let components: Record<string, any>
    const outputPath = join(nuxt.options.buildDir, 'content-examples-code')

    async function stubOutput() {
      if (existsSync(outputPath + '.mjs')) {
        return
      }
      await updateOutput('export default {}')
    }

    async function fetchComponent(component: string | any) {
      if (typeof component === 'string') {
        if (components[component]) {
          component = components[component]
        } else {
          component = Object.entries(components).find(
            ([, comp]: any) => comp.filePath === component
          )
          if (!component) {
            return
          }

          component = component[1]
        }
      }

      if (!component?.filePath || !component?.pascalName) {
        return
      }
      const code = await fsp.readFile(component.filePath, 'utf-8')
      components[component.pascalName] = {
        code,
        filePath: component.filePath,
        pascalName: component.pascalName
      }
    }
    const getStringifiedComponents = () => JSON.stringify(components, null, 2)

    const getVirtualModuleContent = () =>
      `export default ${getStringifiedComponents()}`

    async function updateOutput(content?: string) {
      const path = outputPath + '.mjs'
      if (!existsSync(dirname(path))) {
        await fsp.mkdir(dirname(path), { recursive: true })
      }
      if (existsSync(path)) {
        await fsp.unlink(path)
      }
      await fsp.writeFile(path, content || getVirtualModuleContent(), 'utf-8')
    }

    async function fetchComponents() {
      await Promise.all(Object.keys(components).map(fetchComponent))
    }

    nuxt.hook('components:extend', async (_components) => {
      components = _components
        .filter(v => v.shortPath.includes('components/content/examples/'))
        .reduce((acc, component) => {
          acc[component.pascalName] = component
          return acc
        }, {})
      await stubOutput()
    })

    addTemplate({
      filename: 'content-examples-code.mjs',
      getContents: () => 'export default {}',
      write: true
    })

    nuxt.hook('vite:extend', (vite: any) => {
      vite.config.plugins = vite.config.plugins || []
      vite.config.plugins.push({
        name: 'content-examples-code',
        enforce: 'post',
        async buildStart() {
          if (_configResolved?.build.ssr) {
            return
          }
          await fetchComponents()
          await updateOutput()
        },
        configResolved(config) {
          _configResolved = config
        },
        async handleHotUpdate({ file }) {
          if (
            Object.entries(components).some(
              ([, comp]: any) => comp.filePath === file
            )
          ) {
            await fetchComponent(file)
            await updateOutput()
          }
        }
      })
    })

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.virtual = nitroConfig.virtual || {}
      nitroConfig.virtual['#content-examples-code/nitro'] = () =>
        readFileSync(
          join(nuxt.options.buildDir, '/content-examples-code.mjs'),
          'utf-8'
        )
    })

    addServerHandler({
      method: 'get',
      route: '/api/content-examples-code/:component?',
      handler: resolver.resolve('../server/api/content-examples-code.get')
    })
  }
})
