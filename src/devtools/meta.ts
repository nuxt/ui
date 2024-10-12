import type { ViteDevServer } from 'vite'
import { kebabCase } from 'scule'

const devtoolsComponentMeta: Record<string, any> = {}

export function extendComponentMeta<T extends Record<string, any>>(_meta: T) { }

// A Plugin to parse additional metadata for the Nuxt UI Devtools.
export function devtoolsMetaPlugin() {
  return {
    name: 'ui-devtools-component-meta',
    enforce: 'pre' as const,

    transform(code: string, id: string) {
      if (!id.endsWith('.vue')) return
      const metaRegex = /extendComponentMeta<.*>\((\{[\s\S]*?\})\)/

      const fileName = id.split('/')[id.split('/').length - 1]

      if (code && fileName) {
        const slug = kebabCase(fileName.replace(/\..*/, ''))

        const match = code.match(metaRegex)
        if (match) {
          const metaObject = eval(`(${match[1]})`)
          devtoolsComponentMeta[slug] = metaObject
        }
      }

      return {
        code
      }
    },

    configureServer(server: ViteDevServer) {
      server.middlewares.use('/__ui_devtools__/api/component-meta', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(devtoolsComponentMeta, null, 2))
      })
    }
  }
}
