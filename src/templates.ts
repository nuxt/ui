import { fileURLToPath } from 'node:url'
import { kebabCase } from 'scule'
import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from './module'
import * as theme from './theme'

export function addTemplates(options: ModuleOptions, nuxt: Nuxt) {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  const template = addTemplate({
    filename: 'tailwind.css',
    write: true,
    getContents: () => `@import "tailwindcss";

@layer base {
  :root {
    color-scheme: light dark;
  }
}

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

  --spacing-4_5: 1.125rem;

  ${shades.map(shade => `--color-primary-${shade}: var(--color-primary-${shade});`).join('\n\t')}
  ${shades.map(shade => `--color-gray-${shade}: var(--color-gray-${shade});`).join('\n\t')}
}
`
  })

  nuxt.options.css.unshift(template.dst)

  for (const component in theme) {
    addTemplate({
      filename: `ui/${kebabCase(component)}.ts`,
      write: true,
      getContents: async () => {
        const template = (theme as any)[component]
        const result = typeof template === 'function' ? template(options) : template

        const variants = Object.keys(result.variants || {})

        let json = JSON.stringify(result, null, 2)

        for (const variant of variants) {
          json = json.replace(new RegExp(`("${variant}": "[^"]+")`, 'g'), '$1 as const')
          json = json.replace(new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, 'g'), (_, before, match, after) => {
            const replaced = match.replace(/("[^"]+")/g, '$1 as const')
            return `${before}${replaced}${after}`
          })
        }

        // For local development, directly import from theme
        if (process.env.DEV) {
          return [
            `import template from ${JSON.stringify(fileURLToPath(new URL(`./theme/${kebabCase(component)}`, import.meta.url)))}`,
            `const result = typeof template === 'function' ? template(${JSON.stringify(options)}) : template`,
            `const json = ${json}`,
            `export default result as typeof json`
          ].join('\n')
        }

        return `export default ${json}`
      }
    })
  }

  addTemplate({
    filename: 'ui/index.ts',
    write: true,
    getContents: () => Object.keys(theme).map(component => `export { default as ${component} } from './${kebabCase(component)}'`).join('\n')
  })

  // FIXME: `typeof colors[number]` should include all colors from the theme
  addTypeTemplate({
    filename: 'types/ui.d.ts',
    getContents: () => `import * as ui from '#build/ui'
import type { DeepPartial } from '#ui/types/utils'

const colors = ${JSON.stringify(options.colors)} as const;
const icons = ${JSON.stringify(nuxt.options.appConfig.ui.icons)};

type AppConfigUI = {
  colors?: {
    primary?: typeof colors[number]
    gray?: 'slate' | 'cool' | 'zinc' | 'neutral' | 'stone'
  }
  icons?: Partial<typeof icons>
} & DeepPartial<typeof ui>

declare module 'nuxt/schema' {
  interface AppConfigInput {
    ui?: AppConfigUI
  }
}
declare module '@nuxt/schema' {
  interface AppConfigInput {
    ui?: AppConfigUI
  }
}
export {}
`
  })
}
