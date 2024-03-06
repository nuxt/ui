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
        ${shades.map(shade => `--color-primary-${shade}: var(--color-primary-${shade});`).join('\n')}
        ${shades.map(shade => `--color-gray-${shade}: var(--color-gray-${shade});`).join('\n')}
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
