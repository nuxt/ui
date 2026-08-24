import { existsSync, readFileSync } from 'node:fs'
import fsp from 'node:fs/promises'
import { join } from 'pathe'
import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'component-example'
  },
  async setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)
    let _configResolved: any
    let components: Record<string, any>
    const outputDir = join(nuxt.options.buildDir, 'component-examples')

    async function ensureOutputDir() {
      if (!existsSync(outputDir)) {
        await fsp.mkdir(outputDir, { recursive: true })
      }
    }

    async function stubOutput() {
      await ensureOutputDir()
      const indexPath = join(outputDir, '_index.json')
      if (!existsSync(indexPath)) {
        await fsp.writeFile(indexPath, '[]', 'utf-8')
      }
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

    async function writeComponentFile(name: string) {
      const comp = components[name]
      if (!comp?.code) return
      await fsp.writeFile(
        join(outputDir, `${name}.json`),
        JSON.stringify({ code: comp.code, filePath: comp.filePath, pascalName: comp.pascalName }),
        'utf-8'
      )
    }

    async function writeIndex() {
      const names = Object.keys(components).filter(k => components[k]?.code)
      await fsp.writeFile(join(outputDir, '_index.json'), JSON.stringify(names), 'utf-8')
    }

    async function updateOutput() {
      await ensureOutputDir()
      await Promise.all(Object.keys(components).map(writeComponentFile))
      await writeIndex()
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
        }, {} as Record<string, any>)
      await stubOutput()
    })

    nuxt.hook('vite:extend', (vite: any) => {
      vite.config.plugins = vite.config.plugins || []
      vite.config.plugins.push({
        name: 'component-example',
        enforce: 'post',
        async buildStart() {
          if (_configResolved?.build.ssr) {
            return
          }
          await fetchComponents()
          await updateOutput()
        },
        configResolved(config: any) {
          _configResolved = config
        },
        async handleHotUpdate({ file }: { file: any }) {
          if (
            Object.entries(components).some(
              ([, comp]: any) => comp.filePath === file
            )
          ) {
            await fetchComponent(file)
            const entry = Object.entries(components).find(
              ([, comp]: any) => comp.filePath === file
            )
            if (entry) {
              await ensureOutputDir()
              await writeComponentFile(entry[0])
              await writeIndex()
            }
          }
        }
      })
    })

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.virtual = nitroConfig.virtual || {}
      nitroConfig.virtual['#component-example/nitro'] = () => {
        const indexPath = join(outputDir, '_index.json')
        const names: string[] = existsSync(indexPath)
          ? JSON.parse(readFileSync(indexPath, 'utf-8'))
          : []

        // The examples are inlined rather than read from `outputDir` at
        // runtime: that directory only exists on the build machine, so on a
        // serverless deployment every read failed and the handler answered a
        // 404 for anything that was not prerendered as a static file (which
        // is every request the MCP `get-example` tool makes, since its
        // internal `$fetch` reaches the handler instead of the CDN).
        const examples: Record<string, unknown> = {}
        for (const name of names) {
          try {
            examples[name] = JSON.parse(readFileSync(join(outputDir, `${name}.json`), 'utf-8'))
          } catch {
            // A missing file means the example was removed between the scan
            // and codegen; leave it out rather than failing the build.
          }
        }

        return `const names = ${JSON.stringify(names)}
const examples = ${JSON.stringify(examples)}

function _load(name) {
  return examples[name] || null
}

export function getComponentExample(name) {
  return _load(name)
}

export function listComponentExamples() {
  return names
}

export default new Proxy(Object.create(null), {
  get(_, prop) {
    if (typeof prop !== 'string') return undefined
    return _load(prop)
  },
  ownKeys() { return names },
  getOwnPropertyDescriptor(_, prop) {
    if (names.includes(prop)) return { configurable: true, enumerable: true }
    return undefined
  }
})
`
      }
    })

    addServerHandler({
      method: 'get',
      route: '/api/component-example/:component?',
      handler: resolver.resolve('../server/api/component-example.get')
    })
  }
})
