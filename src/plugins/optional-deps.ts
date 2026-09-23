import { normalize } from 'pathe'
import { resolvePathSync } from 'mlly'
import type { UnpluginOptions } from 'unplugin'
import { peerDependencies } from '../../package.json'

const peers = Object.keys(peerDependencies)

/**
 * Optional peer dependencies that only some components need. They are not installed with Nuxt UI,
 * so when a component that needs them is used without them installed, explain what to install
 * instead of letting the bundler fail on the bare import. The package lists come from `package.json`.
 */
export const optionalDependencies = [
  { component: 'Editor', prefix: '@tiptap/' },
  { component: 'Table', prefix: '@tanstack/vue-table' },
  { component: 'Carousel', prefix: 'embla-carousel' }
].map(dependency => ({
  ...dependency,
  packages: peers.filter(name => name.startsWith(dependency.prefix))
}))

const filter = new RegExp(`^(${optionalDependencies.map(dependency => dependency.prefix).join('|')})`)

export function missingDependencyMessage(id: string, component: string, packages: string[]) {
  return `[nuxt-ui] \`${id}\` is not installed. The \`${component}\` component needs these optional peer dependencies:\n\n  npx nypm add ${packages.join(' ')}\n`
}

const VITE_OPTIONAL_PEER = '__vite-optional-peer-dep'

interface RollupResolveContext {
  resolve: (id: string, importer?: string, options?: Record<string, any>) => Promise<{ id: string } | null>
}

/**
 * This plugin turns an unresolved optional peer dependency imported by a Nuxt UI component
 * into an error that names the component and the packages to install.
 */
export default function OptionalDepsPlugin(runtimeDir: string) {
  const dir = normalize(runtimeDir)
  const resolved = new Set<string>()

  function match(id: string, importer: string | undefined) {
    if (resolved.has(id) || !importer || !normalize(importer).includes(dir)) {
      return
    }

    return optionalDependencies.find(dependency => id.startsWith(dependency.prefix))
  }

  function fail(id: string, dependency: typeof optionalDependencies[number]): never {
    throw new Error(missingDependencyMessage(id, dependency.component, dependency.packages))
  }

  // Rollup-based bundlers resolve through their own pipeline, so aliases, resolver plugins and PnP are honored.
  const rollupResolveId = {
    filter: { id: filter },
    async handler(this: RollupResolveContext, id: string, importer: string | undefined, options: Record<string, any>) {
      const dependency = match(id, importer)
      if (!dependency) {
        return
      }

      // `ssr`, `scan`, `attributes` and `custom` change what the bundler resolves to.
      const result = await this.resolve(id, importer, { ...options, skipSelf: true })
      // Vite resolves a missing optional peer to a stub that throws at runtime, which
      // would turn our message into a missing export error.
      if (!result || result.id.includes(VITE_OPTIONAL_PEER)) {
        fail(id, dependency)
      }

      resolved.add(id)
      return result
    }
  }

  return {
    name: 'nuxt:ui:optional-deps',
    enforce: 'pre',
    resolveId: {
      filter: { id: filter },
      handler(id, importer) {
        const dependency = match(id, importer)
        if (!dependency) {
          return
        }

        try {
          resolvePathSync(id, { url: importer })
          resolved.add(id)
        } catch {
          fail(id, dependency)
        }
      }
    },
    vite: { resolveId: rollupResolveId },
    rollup: { resolveId: rollupResolveId },
    rolldown: { resolveId: rollupResolveId }
  } satisfies UnpluginOptions
}
