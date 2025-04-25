import { fileURLToPath } from 'node:url'
import { kebabCase } from 'scule'
import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt, NuxtTemplate, NuxtTypeTemplate } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import type { ModuleOptions } from './module'
import * as theme from './theme'
import colors from 'tailwindcss/colors'

export function buildTemplates(options: ModuleOptions) {
  return Object.entries(theme).reduce((acc, [key, component]) => {
    acc[key] = typeof component === 'function' ? component(options as Required<ModuleOptions>) : component
    return acc
  }, {} as Record<string, any>)
}

export function getTemplates(options: ModuleOptions, uiConfig: Record<string, any>) {
  const templates: NuxtTemplate[] = []

  for (const component in theme) {
    templates.push({
      filename: `ui/${kebabCase(component)}.ts`,
      write: true,
      getContents: async () => {
        const template = (theme as any)[component]
        const result = typeof template === 'function' ? template(options) : template

        const variants = Object.entries(result.variants || {})
          .filter(([_, values]) => {
            const keys = Object.keys(values as Record<string, unknown>)
            return keys.some(key => key !== 'true' && key !== 'false')
          })
          .map(([key]) => key)

        let json = JSON.stringify(result, null, 2)

        for (const variant of variants) {
          json = json.replace(new RegExp(`("${variant}": "[^"]+")`, 'g'), `$1 as typeof ${variant}[number]`)
          json = json.replace(new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, 'g'), (_, before, match, after) => {
            const replaced = match.replace(/("[^"]+")/g, `$1 as typeof ${variant}[number]`)
            return `${before}${replaced}${after}`
          })
        }

        function generateVariantDeclarations(variants: string[]) {
          return variants.map((variant) => {
            const keys = Object.keys(result.variants[variant])
            return `const ${variant} = ${JSON.stringify(keys, null, 2)} as const`
          })
        }

        // For local development, import directly from theme
        const isUiDev = true
        if (isUiDev) {
          const templatePath = fileURLToPath(new URL(`./theme/${kebabCase(component)}`, import.meta.url))
          return [
            `import template from ${JSON.stringify(templatePath)}`,
            ...generateVariantDeclarations(variants),
            `const result = typeof template === 'function' ? (template as Function)(${JSON.stringify(options, null, 2)}) : template`,
            `const theme = ${json}`,
            `export default result as typeof theme`
          ].join('\n\n')
        }

        // For production build
        return [
          ...generateVariantDeclarations(variants),
          `export default ${json}`
        ].join('\n\n')
      }
    })
  }

  templates.push({
    filename: 'ui.css',
    write: true,
    getContents: () => `@source "./ui";

@theme default {
  --color-old-neutral-50: ${colors.neutral[50]};
  --color-old-neutral-100: ${colors.neutral[100]};
  --color-old-neutral-200: ${colors.neutral[200]};
  --color-old-neutral-300: ${colors.neutral[300]};
  --color-old-neutral-400: ${colors.neutral[400]};
  --color-old-neutral-500: ${colors.neutral[500]};
  --color-old-neutral-600: ${colors.neutral[600]};
  --color-old-neutral-700: ${colors.neutral[700]};
  --color-old-neutral-800: ${colors.neutral[800]};
  --color-old-neutral-900: ${colors.neutral[900]};
  --color-old-neutral-950: ${colors.neutral[950]};
  ${[...(options.theme?.colors || []).filter(color => !colors[color as keyof typeof colors]), 'neutral'].map(color => [
    color !== 'neutral' && `--color-${color}: var(--ui-${color});`,
    ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => `--color-${color}-${shade}: var(--ui-color-${color}-${shade});`)
  ].filter(Boolean).join('\n\t')).join('\n\t')}
  --radius-xs: calc(var(--ui-radius) * 0.5);
  --radius-sm: var(--ui-radius);
  --radius-md: calc(var(--ui-radius) * 1.5);
  --radius-lg: calc(var(--ui-radius) * 2);
  --radius-xl: calc(var(--ui-radius) * 3);
  --radius-2xl: calc(var(--ui-radius) * 4);
  --radius-3xl: calc(var(--ui-radius) * 6);
  --text-color-dimmed: var(--ui-text-dimmed);
  --text-color-muted: var(--ui-text-muted);
  --text-color-toned: var(--ui-text-toned);
  --text-color-default: var(--ui-text);
  --text-color-highlighted: var(--ui-text-highlighted);
  --text-color-inverted: var(--ui-text-inverted);
  --background-color-default: var(--ui-bg);
  --background-color-muted: var(--ui-bg-muted);
  --background-color-elevated: var(--ui-bg-elevated);
  --background-color-accented: var(--ui-bg-accented);
  --background-color-inverted: var(--ui-bg-inverted);
  --background-color-border: var(--ui-border);
  --border-color-default: var(--ui-border);
  --border-color-muted: var(--ui-border-muted);
  --border-color-accented: var(--ui-border-accented);
  --border-color-inverted: var(--ui-border-inverted);
  --border-color-bg: var(--ui-bg);
  --ring-color-default: var(--ui-border);
  --ring-color-muted: var(--ui-border-muted);
  --ring-color-accented: var(--ui-border-accented);
  --ring-color-inverted: var(--ui-border-inverted);
  --ring-color-bg: var(--ui-bg);
  --divide-color-default: var(--ui-border);
  --divide-color-muted: var(--ui-border-muted);
  --divide-color-accented: var(--ui-border-accented);
  --divide-color-inverted: var(--ui-border-inverted);
  --divide-color-bg: var(--ui-bg);
  --outline-color-default: var(--ui-border);
  --outline-color-inverted: var(--ui-border-inverted);
  --stroke-default: var(--ui-border);
  --stroke-inverted: var(--ui-border-inverted);
  --fill-default: var(--ui-border);
  --fill-inverted: var(--ui-border-inverted);
}
`
  })

  templates.push({
    filename: 'ui/index.ts',
    write: true,
    getContents: () => Object.keys(theme).map(component => `export { default as ${component} } from './${kebabCase(component)}'`).join('\n')
  })

  // FIXME: `typeof colors[number]` should include all colors from the theme
  templates.push({
    filename: 'types/ui.d.ts',
    getContents: () => `import * as ui from '#build/ui'
import type { DeepPartial } from '@nuxt/ui'
import type { defaultConfig } from 'tailwind-variants'
import colors from 'tailwindcss/colors'

const icons = ${JSON.stringify(uiConfig.icons)};

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | (string & {})
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

type AppConfigUI = {
  colors?: {
    ${options.theme?.colors?.map(color => `'${color}'?: Color`).join('\n\t\t')}
    neutral?: NeutralColor
  }
  icons?: Partial<typeof icons>
  tv?: typeof defaultConfig
} & DeepPartial<typeof ui>

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /**
     * Nuxt UI theme configuration
     * @see https://ui.nuxt.com/getting-started/theme#customize-theme
     */
    ui?: AppConfigUI
  }
}

export {}
`
  })

  templates.push({
    filename: 'ui-image-component.ts',
    write: true,
    getContents: ({ app }) => {
      const image = app?.components?.find(c => c.pascalName === 'NuxtImg' && !c.filePath.includes('nuxt/dist/app'))

      return image ? `export { default } from "${image.filePath}"` : 'export default "img"'
    }
  })

  return templates
}

export function addTemplates(options: ModuleOptions, nuxt: Nuxt, resolve: Resolver['resolve']) {
  const templates = getTemplates(options, nuxt.options.appConfig.ui)
  for (const template of templates) {
    if (template.filename!.endsWith('.d.ts')) {
      addTypeTemplate(template as NuxtTypeTemplate)
    } else {
      addTemplate(template)
    }
  }

  nuxt.hook('prepare:types', ({ references }) => {
    references.push({ path: resolve('./runtime/types/app.config.d.ts') })
  })
}
