import type { ViteDevServer } from 'vite'
import { kebabCase, camelCase } from 'scule'
import defu from 'defu'
import fs from 'node:fs'
import type { Resolver } from '@nuxt/kit'
import type { ComponentMeta } from 'vue-component-meta'
import type { DevtoolsMeta } from '../runtime/composables/extendDevtoolsMeta'
import type { ModuleOptions } from '../module'

export type Component = {
  slug: string
  label: string
  meta?: ComponentMeta & { devtools: DevtoolsMeta<any> }
  defaultVariants: Record<string, any>
}

const devtoolsComponentMeta: Record<string, any> = {}

function extractDevtoolsMeta(code: string): string | null {
  const match = code.match(/extendDevtoolsMeta(?:<.*?>)?\(/)
  if (!match) return null

  const startIndex = code.indexOf(match[0]) + match[0].length
  let openBraceCount = 0
  let closeBraceCount = 0
  let endIndex = startIndex

  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === '{') openBraceCount++
    if (code[i] === '}') closeBraceCount++

    if (openBraceCount > 0 && openBraceCount === closeBraceCount) {
      endIndex = i + 1
      break
    }
  }
  // Return only the object inside extendDevtoolsMeta
  return code.slice(startIndex, endIndex).trim()
}

// A Plugin to parse additional metadata for the Nuxt UI Devtools.
export function devtoolsMetaPlugin({ resolve, options, templates }: { resolve: Resolver['resolve'], options: ModuleOptions, templates: Record<string, any> }) {
  return {
    name: 'ui-devtools-component-meta',
    enforce: 'pre' as const,

    async transform(code: string, id: string) {
      if (!id.match(/\/runtime\/components\/\w+.vue/)) return
      const fileName = id.split('/')[id.split('/').length - 1]

      if (code && fileName) {
        const slug = kebabCase(fileName.replace(/\..*/, ''))
        const match = extractDevtoolsMeta(code)

        if (match) {
          const metaObject = new Function(`return ${match}`)()
          devtoolsComponentMeta[slug] = { meta: { devtools: { ...metaObject } } }
        }
      }

      return {
        code
      }
    },

    configureServer(server: ViteDevServer) {
      server.middlewares.use('/__nuxt_ui__/devtools/api/component-meta', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const componentMeta = await import('./.component-meta/component-meta')

          const meta = defu(
            Object.entries(componentMeta.default).reduce((acc, [key, value]: [string, any]) => {
              if (!key.startsWith('U')) return acc

              const name = key.substring(1)
              const slug = kebabCase(name)
              const template = templates?.[camelCase(name)]

              if (devtoolsComponentMeta[slug] === undefined) {
                const path = resolve(`./runtime/components/${name}.vue`)
                const code = fs.readFileSync(path, 'utf-8')
                const match = extractDevtoolsMeta(code)
                if (match) {
                  const metaObject = new Function(`return ${match}`)()
                  devtoolsComponentMeta[slug] = { meta: { devtools: { ...metaObject } } }
                } else {
                  devtoolsComponentMeta[slug] = null
                }
              }

              value.meta.props = value.meta.props.map((prop: any) => {
                let defaultValue = prop.default
                  ? prop.default
                  : prop?.tags?.find((tag: any) =>
                    tag.name === 'defaultValue'
                    && !tag.text?.includes('appConfig'))?.text
                    ?? template?.defaultVariants?.[prop.name]

                if (typeof defaultValue === 'string') defaultValue = defaultValue?.replaceAll(/["'`]/g, '')
                if (defaultValue === 'true') defaultValue = true
                if (defaultValue === 'false') defaultValue = false
                if (!Number.isNaN(Number.parseInt(defaultValue))) defaultValue = Number.parseInt(defaultValue)

                return {
                  ...prop,
                  default: defaultValue
                }
              })

              const label = key.replace(/^U/, options.prefix ?? 'U')
              acc[kebabCase(key.replace(/^U/, ''))] = { ...value, label, slug }
              return acc
            }, {} as Record<string, any>),
            devtoolsComponentMeta
          )
          res.end(JSON.stringify(meta))
        } catch (error) {
          console.error(`Failed to fetch component meta`, error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Failed to fetch component meta' }))
        }
      })

      server.middlewares.use('/__nuxt_ui__/devtools/api/component-example', async (req, res) => {
        const query = new URL(req.url!, 'http://localhost').searchParams
        const name = query.get('component')
        if (!name) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Component name is required' }))
          return
        }

        try {
          const path = resolve(`./devtools/runtime/examples/${name}.vue`)
          const source = fs.readFileSync(path, 'utf-8')

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ component: name, source }))
        } catch (error) {
          console.error(`Failed to read component source for ${name}:`, error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Failed to read component source' }))
        }
      })
    }
  }
}
