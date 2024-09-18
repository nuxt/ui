import { fileURLToPath } from 'node:url'
import { kebabCase } from 'scule'
import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from './module'
import * as theme from './theme'

export function addTemplates(options: ModuleOptions, nuxt: Nuxt) {
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

const colors = ${JSON.stringify(options.theme?.colors || [])} as const;
const icons = ${JSON.stringify(nuxt.options.appConfig.ui.icons)};

type AppConfigUI = {
  colors?: {
    primary?: Exclude<typeof colors[number], 'error' | 'primary'>
    error?: Exclude<typeof colors[number], 'primary' | 'error'>
    gray?: 'slate' | 'cool' | 'zinc' | 'neutral' | 'stone'
  }
  icons?: Partial<typeof icons>
} & DeepPartial<typeof ui, string>

declare module '@nuxt/schema' {
  interface AppConfigInput {
    ui?: AppConfigUI
  }
}

export {}
`
  })
}
