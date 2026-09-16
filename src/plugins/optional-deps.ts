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

/**
 * This plugin turns an unresolved optional peer dependency imported by a Nuxt UI component
 * into an error that names the component and the packages to install.
 */
export default function OptionalDepsPlugin(runtimeDir: string) {
  const dir = normalize(runtimeDir)
  const resolved = new Set<string>()

  return {
    name: 'nuxt:ui:optional-deps',
    enforce: 'pre',
    resolveId: {
      filter: { id: filter },
      handler(id, importer) {
        if (resolved.has(id) || !importer || !normalize(importer).includes(dir)) {
          return
        }

        const dependency = optionalDependencies.find(dependency => id.startsWith(dependency.prefix))
        if (!dependency) {
          return
        }

        try {
          resolvePathSync(id, { url: importer })
          resolved.add(id)
        } catch {
          throw new Error(missingDependencyMessage(id, dependency.component, dependency.packages))
        }
      }
    }
  } satisfies UnpluginOptions
}
