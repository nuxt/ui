import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, addVitePlugin, addPlugin, addTemplate, installModule } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'
import type { DeepPartial } from './runtime/types'
import * as theme from './runtime/theme'

type UI = {
  primary?: string
  gray?: string
  [key: string]: any
} & DeepPartial<typeof theme>

declare module 'nuxt/schema' {
  interface AppConfigInput {
    ui?: UI
  }
}
declare module '@nuxt/schema' {
  interface AppConfigInput {
    ui?: UI
  }
}

export default defineNuxtModule({
  meta: {
    name: 'ui',
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.10.0'
    }
  },
  async setup (_, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.alias['#ui'] = resolver.resolve('./runtime')

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, {
      primary: 'green',
      gray: 'cool',
      icons: {
        search: 'i-heroicons-magnifying-glass-20-solid',
        close: 'i-heroicons-x-mark-20-solid',
        check: 'i-heroicons-check-20-solid',
        loading: 'i-heroicons-arrow-path-20-solid',
        empty: 'i-heroicons-circle-stack-20-solid'
      }
    })

    await installModule('nuxt-icon')

    addVitePlugin(tailwindcss)

    addPlugin({
      src: resolver.resolve('./runtime/plugins/index')
    })

    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    const template = addTemplate({
      filename: 'main.css',
      write: true,
      getContents: () => `
      @import "tailwindcss";

      @theme {
        --color-cool-50: #f9fafb;
        --color-cool-100: #f3f4f6;
        --color-cool-200: #e5e7eb;
        --color-cool-300: #d1d5db;
        --color-cool-400: #9ca3af;
        --color-cool-500: #6b7280;
        --color-cool-600: #4b5563;
        --color-cool-700: #374151;
        --color-cool-800: #1f2937;
        --color-cool-900: #111827;
        --color-cool-950: #030712;

        ${shades.map(shade => `--color-primary-${shade}: var(--color-${nuxt.options.appConfig.ui.primary}-${shade});`).join('\n')}
        ${shades.map(shade => `--color-gray-${shade}: var(--color-${nuxt.options.appConfig.ui.gray}-${shade});`).join('\n')}
      }
      `
    })

    nuxt.options.css.push(template.dst)

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'U',
      pathPrefix: false
    })

    addImportsDir(resolver.resolve('./runtime/composables'))
  }
})
