import { defu } from 'defu'
import type { ViteDevServer } from 'vite'

const devtoolsComponentMeta: Record<string, any> = {}

// A Plugin to parse additional metadata for the Nuxt UI Devtools.
export function devtoolsMetaPlugin() {
  return {
    name: 'ui-devtools-component-meta',
    enforce: 'pre' as const,

    transform(code: string, id: string) {
      if (!id.endsWith('.vue')) return
      const metaRegex = /extendComponentMeta<.*>\((\{[\s\S]*?\})\)/

      if (code) {
        const match = code.match(metaRegex)
        if (match) {
          const metaObject = eval(`(${match[1]})`)
          devtoolsComponentMeta[id] = defu(metaObject)
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
