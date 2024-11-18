import { join } from 'pathe'
import { globSync } from 'tinyglobby'
import { genSafeVariableName } from 'knitwork'
import MagicString from 'magic-string'
import { resolvePathSync } from 'mlly'

import { runtimeDir, type NuxtUIOptions } from '../unplugin'

import type { UnpluginOptions } from 'unplugin'

/**
 * This plugin provides the necessary transforms to allow loading the
 * Nuxt UI _Nuxt_ plugins in `src/runtime/plugins/` in a pure Vue environment.
 */
export default function PluginsPlugin(options: NuxtUIOptions) {
  const plugins = globSync(['**/*', '!*.d.ts'], { cwd: join(runtimeDir, 'plugins'), absolute: true })

  plugins.unshift(resolvePathSync(join(runtimeDir, 'vue/plugins/head'), { extensions: ['.ts', '.mjs', '.js'] }))
  if (options.colorMode) {
    plugins.push(resolvePathSync(join(runtimeDir, 'vue/plugins/color-mode'), { extensions: ['.ts', '.mjs', '.js'] }))
  }

  return {
    name: 'nuxt:ui:plugins',
    enforce: 'pre',
    resolveId(id) {
      if (id === '@nuxt/ui/vue-plugin') {
        return 'virtual:nuxt-ui-plugins'
      }
    },
    transform(code, id) {
      if (plugins.some(p => id.startsWith(p)) && code.includes('import.meta.client')) {
        const s = new MagicString(code)
        s.replaceAll('import.meta.client', 'true')

        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ hires: true })
          }
        }
      }
    },
    loadInclude: id => id === 'virtual:nuxt-ui-plugins',
    load() {
      return `
        ${plugins.map(p => `import ${genSafeVariableName(p)} from "${p}"`).join('\n')}
export default {
  install (app) {
${plugins.map(p => `    app.use(${genSafeVariableName(p)})`).join('\n')}
  }
}
        `
    }
  } satisfies UnpluginOptions
}
