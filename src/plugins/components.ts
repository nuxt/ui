import { join, normalize } from 'pathe'
import type { UnpluginContextMeta, UnpluginOptions } from 'unplugin'
import { globSync } from 'tinyglobby'
import AutoImportComponents from 'unplugin-vue-components'
import type { Options as ComponentsOptions } from 'unplugin-vue-components/types'

import { runtimeDir } from '../unplugin'
import type { NuxtUIOptions } from '../unplugin'
import { defu } from 'defu'

/**
 * This plugin adds all the Nuxt UI components as auto-imports.
 */
export default function ComponentImportPlugin(options: NuxtUIOptions & { prefix: NonNullable<NuxtUIOptions['prefix']>, extraRuntimeDir?: string }, meta: UnpluginContextMeta) {
  const components = globSync('**/*.vue', { cwd: join(runtimeDir, 'components') })
  const componentNames = new Set(components.map(c => `${options.prefix}${c.replace(/\.vue$/, '')}`))

  const overrides = globSync('**/*.vue', { cwd: join(runtimeDir, 'vue/components') })
  const overrideNames = new Set(overrides.map(c => `${options.prefix}${c.replace(/\.vue$/, '')}`))

  const inertiaOverrides = globSync('**/*.vue', { cwd: join(runtimeDir, 'inertia/components') })
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
        if (overrideNames.has(componentName))
          return { name: 'default', from: join(runtimeDir, 'vue/components', `${componentName.slice(options.prefix.length)}.vue`) }
        if (componentNames.has(componentName))
          return { name: 'default', from: join(runtimeDir, 'components', `${componentName.slice(options.prefix.length)}.vue`) }
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
        if (!importer) {
          return
        }
        if (!normalize(importer).includes(runtimeDir) && (!options.extraRuntimeDir || !normalize(importer).includes(options.extraRuntimeDir))) {
          return
        }

        // only apply to relative imports or nuxt ui runtime components
        if (!RELATIVE_IMPORT_RE.test(id) && !id.startsWith('@nuxt/ui/components/')) {
          return
        }

        const filename = id.match(/([^/]+)\.vue$/)?.[1]
        if (filename && options.inertia && inertiaOverrideNames.has(`${options.prefix}${filename}`)) {
          return join(runtimeDir, 'inertia/components', `${filename}.vue`)
        }
        if (filename && overrideNames.has(`${options.prefix}${filename}`)) {
          return join(runtimeDir, 'vue/components', `${filename}.vue`)
        }
      }
    },
    AutoImportComponents.raw(pluginOptions, meta) as UnpluginOptions
  ] satisfies UnpluginOptions[]
}

const RELATIVE_IMPORT_RE = /^\.{1,2}\//
