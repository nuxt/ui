import { genSafeVariableName } from 'knitwork'
import { resolvePathSync } from 'mlly'
import { join } from 'pathe'
import { globSync } from 'tinyglobby'
import type { UnpluginOptions } from 'unplugin'
import { runtimeDir, runtimeUrl } from '../unplugin'
import type { NuxtUIOptions } from '../unplugin'

/**
 * This plugin installs the Vue plugins that stand in for what Nuxt provides
 * (icons, head, router, color mode) and registers the prose components, through
 * `@nuxt/ui/vue-plugin`.
 */
export default function PluginsPlugin(options: NuxtUIOptions) {
  const plugins = [
    resolvePathSync('./vue/plugins/icons', { extensions: ['.ts', '.mjs', '.js'], url: runtimeUrl }),
    resolvePathSync('./vue/plugins/head', { extensions: ['.ts', '.mjs', '.js'], url: runtimeUrl }),
    resolvePathSync('./vue/plugins/router', { extensions: ['.ts', '.mjs', '.js'], url: runtimeUrl })
  ]

  if (options.colorMode) {
    plugins.push(resolvePathSync('./vue/plugins/color-mode', { extensions: ['.ts', '.mjs', '.js'], url: runtimeUrl }))
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
