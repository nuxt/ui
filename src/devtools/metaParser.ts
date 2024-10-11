import { defu } from 'defu'

export const devtoolsComponentMeta: Record<string, any> = {}

export function devtoolsMetaPlugin() {
  return {
    name: 'ui-devtools-component-meta',
    enforce: 'pre',

    transform(code: string, id: string) {
      // Only process Vue Single File Components (.vue files)
      if (!id.endsWith('.vue')) return
      const metaRegex = /extendComponentMeta<.*>\((\{[\s\S]*?\})\)/

      if (code) {
        // Regular expression to match `extendComponentMeta({ ... })`
        // Check if the macro `extendComponentMeta` is present in the code
        const match = code.match(metaRegex)
        if (match) {
          // Parse the matched object inside `extendComponentMeta({ ... })`
          const metaObject = eval(`(${match[1]})`)
          // Add the parsed metadata to the globalComponentMeta
          devtoolsComponentMeta[id] = defu(metaObject)
        }
      }

      return {
        code
      }
    },

    // Hook into Vite dev server to expose the API
    configureServer(server) {
      server.middlewares.use('/__ui_devtools__/api/component-meta', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(devtoolsComponentMeta, null, 2))
      })
    }
  }
}
