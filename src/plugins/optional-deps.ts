import { normalize } from 'pathe'
import { resolvePathSync } from 'mlly'
import type { UnpluginOptions } from 'unplugin'

/**
 * Optional peer dependencies that only some components need. They are not installed with Nuxt UI,
 * so when a component that needs them is used without them installed, explain what to install
 * instead of letting the bundler fail on the bare import.
 */
export const optionalDependencies = [
  {
    component: 'Editor',
    test: (id: string) => id.startsWith('@tiptap/'),
    packages: [
      '@tiptap/core',
      '@tiptap/extension-bubble-menu',
      '@tiptap/extension-code',
      '@tiptap/extension-drag-handle',
      '@tiptap/extension-drag-handle-vue-3',
      '@tiptap/extension-floating-menu',
      '@tiptap/extension-horizontal-rule',
      '@tiptap/extension-image',
      '@tiptap/extension-mention',
      '@tiptap/extension-placeholder',
      '@tiptap/markdown',
      '@tiptap/pm',
      '@tiptap/starter-kit',
      '@tiptap/suggestion',
      '@tiptap/vue-3'
    ]
  },
  {
    component: 'Table',
    test: (id: string) => id.startsWith('@tanstack/vue-table'),
    packages: ['@tanstack/vue-table']
  },
  {
    component: 'Carousel',
    test: (id: string) => id.startsWith('embla-carousel'),
    packages: [
      'embla-carousel',
      'embla-carousel-auto-height',
      'embla-carousel-auto-scroll',
      'embla-carousel-autoplay',
      'embla-carousel-class-names',
      'embla-carousel-fade',
      'embla-carousel-vue',
      'embla-carousel-wheel-gestures'
    ]
  }
]

export function missingDependencyMessage(id: string, component: string, packages: string[]) {
  return `[nuxt-ui] \`${id}\` is not installed. The \`${component}\` component needs these optional peer dependencies:\n\n  pnpm add ${packages.join(' ')}\n`
}

/**
 * This plugin turns an unresolved optional peer dependency imported by a Nuxt UI component
 * into an error that names the component and the packages to install.
 */
export default function OptionalDepsPlugin(runtimeDir: string) {
  const dir = normalize(runtimeDir)

  return {
    name: 'nuxt:ui:optional-deps',
    enforce: 'pre',
    resolveId(id, importer) {
      if (!importer || !normalize(importer).includes(dir)) {
        return
      }

      const dependency = optionalDependencies.find(dependency => dependency.test(id))
      if (!dependency) {
        return
      }

      try {
        resolvePathSync(id, { url: importer })
      } catch {
        throw new Error(missingDependencyMessage(id, dependency.component, dependency.packages))
      }
    }
  } satisfies UnpluginOptions
}
