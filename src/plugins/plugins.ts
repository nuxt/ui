import MagicString from 'magic-string'
import { genSafeVariableName } from 'knitwork'
import { resolvePathSync } from 'mlly'
import { join } from 'pathe'
import { globSync } from 'tinyglobby'
import type { UnpluginOptions } from 'unplugin'
import { runtimeDir } from '../unplugin'
import type { NuxtUIOptions } from '../unplugin'

/**
 * This plugin provides the necessary transforms to allow loading the
 * Nuxt UI _Nuxt_ plugins in `src/runtime/plugins/` in a pure Vue environment.
 */
export default function PluginsPlugin(options: NuxtUIOptions) {
  const plugins = globSync(['**/*', '!*.d.ts'], { cwd: join(runtimeDir, 'plugins'), absolute: true })

  plugins.unshift(resolvePathSync('../runtime/vue/plugins/router', { extensions: ['.ts', '.mjs', '.js'], url: import.meta.url }))
  plugins.unshift(resolvePathSync('../runtime/vue/plugins/head', { extensions: ['.ts', '.mjs', '.js'], url: import.meta.url }))

  if (options.colorMode) {
    plugins.push(resolvePathSync('../runtime/vue/plugins/color-mode', { extensions: ['.ts', '.mjs', '.js'], url: import.meta.url }))
  }

  const proseComponents = (options.prose || options.mdc)
    ? globSync(['**/*.vue'], { cwd: join(runtimeDir, 'components/prose'), absolute: true })
    : []

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
      const proseImports = proseComponents.map((p) => {
        const name = `Prose${p.split('/').pop()?.replace(/\.vue$/, '')}`
        return { name, path: p }
      })

      return `
        ${plugins.map(p => `import ${genSafeVariableName(p)} from "${p}"`).join('\n')}
        ${proseImports.map(c => `import ${c.name} from "${c.path}"`).join('\n')}

export default {
  install (app, pluginOptions = {}) {
${plugins.map(p => `    app.use(${genSafeVariableName(p)}, pluginOptions)`).join('\n')}
${proseImports.map(c => `    app.component('${c.name}', ${c.name})`).join('\n')}
  }
}
        `
    },
    // Argument Vite specific configuration
    vite: {
      config() {
        return {
          // Opt-out Nuxt UI from Vite's pre-bundling,
          // as we need Vite's pipeline to resolve imports like `#imports`
          optimizeDeps: {
            exclude: ['@nuxt/ui']
          }
        }
      }
    }
  } satisfies UnpluginOptions
}
