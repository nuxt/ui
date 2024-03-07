import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from './module'
import * as theme from './theme'

export default function createTemplates (options: ModuleOptions, nuxt: Nuxt) {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  const template = addTemplate({
    filename: 'ui.css',
    write: true,
    getContents: () => `
      @import "tailwindcss";

      @theme {
        --color-gray-*: initial;
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

  for (const component in theme) {
    addTemplate({
      filename: `ui/${component}.ts`,
      write: true,
      getContents: () => `export default ${JSON.stringify((theme as any)[component]({ colors: options.colors }), null, 2)}`
    })

    // addTypeTemplate({
    //   filename: `ui/${component}.d.ts`,
    //   write: true,
    //   getContents: () => `import ${component} from './${component}'

    //   type T = typeof ${component}
    //   export default T`
    // })
  }
}
