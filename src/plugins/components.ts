import { defu } from 'defu'
import { join, normalize } from 'pathe'
import { globSync } from 'tinyglobby'
import type { UnpluginContextMeta, UnpluginOptions } from 'unplugin'
import AutoImportComponents from 'unplugin-vue-components'
import type { Options as ComponentsOptions } from 'unplugin-vue-components/types'
import type { NuxtUIOptions } from '../unplugin'
import { runtimeDir } from '../unplugin'

/**
 * This plugin adds all the Nuxt UI components as auto-imports.
 */
export default function ComponentImportPlugin(options: NuxtUIOptions & { prefix: NonNullable<NuxtUIOptions['prefix']> }, meta: UnpluginContextMeta) {
  const components = globSync('**/*.vue', {
    cwd: join(runtimeDir, 'components'),
    ignore: [
      !options.colorMode && 'color-mode/**/*.vue',
      'content/*.vue',
      'prose/**/*.vue'
    ].filter(Boolean) as string[]
  })
  const componentNames = new Set(components.map(c => `${options.prefix}${c.split('/').pop()?.replace(/\.vue$/, '')}`))
  const componentPaths = new Map(components.map((c) => {
    const name = c.replace(/\.vue$/, '')
    const componentName = `${options.prefix}${name.split('/').pop()}`
    return [componentName, c]
  }))

  const overrides = globSync('**/*.vue', {
    cwd: join(runtimeDir, 'vue/components'),
    ignore: [
      !options.colorMode && 'color-mode/**/*.vue'
    ].filter(Boolean) as string[]
  })
  const overrideNames = new Set(overrides.map(c => `${options.prefix}${c.split('/').pop()?.replace(/\.vue$/, '')}`))
  const overridePaths = new Map(overrides.map((c) => {
    const name = c.replace(/\.vue$/, '')
    const componentName = `${options.prefix}${name.split('/').pop()}`
    return [componentName, c]
  }))

  const inertiaOverrides = globSync('**/*.vue', {
    cwd: join(runtimeDir, 'inertia/components')
  })
  const inertiaOverrideNames = new Set(inertiaOverrides.map(c => `${options.prefix}${c.replace(/\.vue$/, '')}`))

  const pluginOptions = defu(options.components, <ComponentsOptions>{
    dts: options.dts ?? true,
    exclude: [
      /[\\/]node_modules[\\/](?!\.pnpm|@nuxt\/ui|@compodium\/examples)/,
      /[\\/]\.git[\\/]/,
      /[\\/]\.nuxt[\\/]/
    ],
    resolvers: [
      (componentName) => {
        if (options.inertia && inertiaOverrideNames.has(componentName)) {
          return { name: 'default', from: join(runtimeDir, 'inertia/components', `${componentName.slice(options.prefix.length)}.vue`) }
        }
        if (overrideNames.has(componentName)) {
          const relativePath = overridePaths.get(componentName)
          return { name: 'default', from: join(runtimeDir, 'vue/components', relativePath as string) }
        }
        if (componentNames.has(componentName)) {
          const relativePath = componentPaths.get(componentName)
          return { name: 'default', from: join(runtimeDir, 'components', relativePath as string) }
        }
      }
    ]
  })

  return [
    /**
     * This plugin aims to ensure we override certain components with Vue-compatible versions:
     * <UIcon> and <ULink> currently.
     */
    {
      name: 'nuxt:ui:components',
      enforce: 'pre',
      resolveId(id, importer) {
        // only apply to runtime nuxt ui components
        if (!importer || !normalize(importer).includes(runtimeDir)) {
          return
        }

        // only apply to relative imports
        if (!RELATIVE_IMPORT_RE.test(id)) {
          return
        }

        const filename = id.match(/([^/]+)\.vue$/)?.[1]
        if (filename && options.inertia && inertiaOverrideNames.has(`${options.prefix}${filename}`)) {
          return join(runtimeDir, 'inertia/components', `${filename}.vue`)
        }
        if (filename && overrideNames.has(`${options.prefix}${filename}`)) {
          const relativePath = overridePaths.get(`${options.prefix}${filename}`)
          return join(runtimeDir, 'vue/components', relativePath as string)
        }
      }
    },
    AutoImportComponents.raw(pluginOptions, meta) as UnpluginOptions
  ] satisfies UnpluginOptions[]
}

const RELATIVE_IMPORT_RE = /^\.{1,2}\//
