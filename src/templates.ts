import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { join } from 'pathe'
import { globSync } from 'tinyglobby'
import { camelCase, kebabCase, pascalCase } from 'scule'
import { genExport } from 'knitwork'
import colors from 'tailwindcss/colors'
import { addTemplate, addTypeTemplate, hasNuxtModule, logger, updateTemplates } from '@nuxt/kit'
import type { Nuxt, NuxtTemplate, NuxtTypeTemplate } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import type { ModuleOptions } from './module'
import * as theme from './theme'
import * as themeProse from './theme/prose'
import * as themeContent from './theme/content'

/**
 * Build a dependency graph of components by scanning their source files
 */
async function buildComponentDependencyGraph(componentDir: string, componentPattern: RegExp): Promise<Map<string, Set<string>>> {
  const dependencyGraph = new Map<string, Set<string>>()

  const componentFiles = globSync(['**/*.vue'], {
    cwd: componentDir,
    absolute: true
  })

  for (const componentFile of componentFiles) {
    try {
      const content = await readFile(componentFile, 'utf-8')
      const componentName = pascalCase(componentFile.split('/').pop()!.replace('.vue', ''))
      const dependencies = new Set<string>()

      const matches = content.matchAll(componentPattern)
      for (const match of matches) {
        const depName = match[1] || match[2]
        if (depName && depName !== componentName) {
          dependencies.add(depName)
        }
      }

      dependencyGraph.set(componentName, dependencies)
    } catch {
      // Ignore files that can't be read
    }
  }

  return dependencyGraph
}

/**
 * Recursively resolve all dependencies for a component
 */
function resolveComponentDependencies(
  component: string,
  dependencyGraph: Map<string, Set<string>>,
  resolved: Set<string> = new Set()
): Set<string> {
  if (resolved.has(component)) {
    return resolved
  }

  resolved.add(component)
  const dependencies = dependencyGraph.get(component)

  if (dependencies) {
    for (const dep of dependencies) {
      resolveComponentDependencies(dep, dependencyGraph, resolved)
    }
  }

  return resolved
}

/**
 * Detect components used in the project by scanning source files
 */
async function detectUsedComponents(
  rootDir: string,
  prefix: string,
  componentDir: string,
  includeComponents?: string[]
): Promise<Set<string> | undefined> {
  const detectedComponents = new Set<string>()

  // Add manually specified components
  if (includeComponents && includeComponents.length > 0) {
    for (const component of includeComponents) {
      detectedComponents.add(component)
    }
  }

  // Scan all source files for component usage
  const appFiles = globSync(['**/*.{vue,ts,js,tsx,jsx}'], {
    cwd: rootDir,
    ignore: ['node_modules/**', '.nuxt/**', 'dist/**']
  })

  // Pattern to match:
  // - <UButton in templates
  // - UButton in script (imports, usage)
  // - <LazyUButton (lazy components)
  // - LazyUButton in script
  const componentPattern = new RegExp(`<(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)|\\b(?:Lazy)?${prefix}([A-Z][a-zA-Z]+)\\b`, 'g')

  for (const file of appFiles) {
    try {
      const filePath = join(rootDir, file)
      const content = await readFile(filePath, 'utf-8')
      const matches = content.matchAll(componentPattern)

      for (const match of matches) {
        const componentName = match[1] || match[2]
        if (componentName) {
          detectedComponents.add(componentName)
        }
      }
    } catch {
      // Ignore files that can't be read
    }
  }

  if (detectedComponents.size === 0) {
    return undefined
  }

  // Build dependency graph of components
  const dependencyGraph = await buildComponentDependencyGraph(componentDir, componentPattern)

  // Resolve all dependencies for detected components
  const allComponents = new Set<string>()
  for (const component of detectedComponents) {
    const resolved = resolveComponentDependencies(component, dependencyGraph)
    for (const resolvedComponent of resolved) {
      allComponents.add(resolvedComponent)
    }
  }

  return allComponents
}

export function getTemplates(options: ModuleOptions, uiConfig: Record<string, any>, nuxt?: Nuxt, resolve?: Resolver['resolve']) {
  const templates: NuxtTemplate[] = []

  let hasProse = false
  let hasContent = false
  let previousDetectedComponents: Set<string> | undefined

  const isDev = process.argv.includes('--uiDev')

  function writeThemeTemplate(theme: Record<string, any>, path?: string) {
    for (const component in theme) {
      templates.push({
        filename: `ui/${path ? path + '/' : ''}${kebabCase(component)}.ts`,
        write: true,
        getContents: async () => {
          const template = (theme as any)[component]
          const result = typeof template === 'function' ? template(options) : template

          // Override default variants from nuxt.config.ts
          if (result?.defaultVariants?.color && options.theme?.defaultVariants?.color) {
            result.defaultVariants.color = options.theme.defaultVariants.color
          }
          if (result?.defaultVariants?.size && options.theme?.defaultVariants?.size) {
            result.defaultVariants.size = options.theme.defaultVariants.size
          }

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
            return variants.filter(variant => json.includes(`as typeof ${variant}`)).map((variant) => {
              const keys = Object.keys(result.variants[variant])
              return `const ${variant} = ${JSON.stringify(keys, null, 2)} as const`
            })
          }

          // For local development, import directly from theme
          if (isDev) {
            const templatePath = fileURLToPath(new URL(`./theme/${path ? `${path}/` : ''}${kebabCase(component)}`, import.meta.url))
            return [
              `import template from ${JSON.stringify(templatePath)}`,
              ...generateVariantDeclarations(variants),
              `const options = ${JSON.stringify(options, null, 2)}`,
              `const result = typeof template === 'function' ? (template as Function)(options) : template`,
              `if (result?.defaultVariants?.color && options.theme?.defaultVariants?.color) result.defaultVariants.color = options.theme.defaultVariants.color`,
              `if (result?.defaultVariants?.size && options.theme?.defaultVariants?.size) result.defaultVariants.size = options.theme.defaultVariants.size`,
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
  }

  async function getSources() {
    let sources = ''

    if (!!nuxt && !!resolve && options.experimental?.componentDetection) {
      const detectedComponents = await detectUsedComponents(
        nuxt.options.rootDir,
        options.prefix!,
        resolve!('./runtime/components'),
        Array.isArray(options.experimental.componentDetection) ? options.experimental.componentDetection : undefined
      )

      if (detectedComponents && detectedComponents.size > 0) {
        if (previousDetectedComponents) {
          const newComponents = Array.from(detectedComponents).filter(
            component => !previousDetectedComponents!.has(component)
          )
          if (newComponents.length > 0) {
            logger.success(`Nuxt UI detected new components: ${newComponents.join(', ')}`)
          }
        } else {
          logger.success(`Nuxt UI detected ${detectedComponents.size} components in use (including dependencies)`)
        }

        previousDetectedComponents = detectedComponents

        const sourcesList: string[] = []

        if (hasProse) {
          sourcesList.push('@source "./ui/prose";')
        }

        for (const component of detectedComponents) {
          const kebabComponent = kebabCase(component)
          const camelComponent = camelCase(component)

          if (hasContent && (themeContent as any)[camelComponent]) {
            sourcesList.push(`@source "./ui/content/${kebabComponent}.ts";`)
          } else if ((theme as any)[camelComponent]) {
            sourcesList.push(`@source "./ui/${kebabComponent}.ts";`)
          }
        }

        sources = sourcesList.join('\n')
      } else {
        if (!previousDetectedComponents || previousDetectedComponents.size > 0) {
          logger.info('Nuxt UI detected no components in use, including all components')
        }
        previousDetectedComponents = new Set()
      }
    }

    return sources || '@source "./ui";'
  }

  if (!!nuxt && ((hasNuxtModule('@nuxtjs/mdc') || options.mdc) || (hasNuxtModule('@nuxt/content') || options.content))) {
    hasProse = true

    const path = 'prose'

    writeThemeTemplate(themeProse, path)

    templates.push({
      filename: `ui/${path}/index.ts`,
      write: true,
      getContents: () => Object.keys(themeProse).map(component => `export { default as ${component} } from './${kebabCase(component)}'`).join('\n')
    })
  }

  if (!!nuxt && (hasNuxtModule('@nuxt/content') || options.content)) {
    hasContent = true

    writeThemeTemplate(themeContent, 'content')
  }

  writeThemeTemplate(theme)

  templates.push({
    filename: 'ui.css',
    write: true,
    getContents: async () => {
      const sources = await getSources()

      return `${sources}

@theme static {
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
}

@theme default inline {
  ${[...(options.theme?.colors || []).filter(color => !colors[color as keyof typeof colors]), 'neutral'].map(color => [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => `--color-${color}-${shade}: var(--ui-color-${color}-${shade});`).join('\n\t')).join('\n\t')}
  ${options.theme?.colors?.map(color => `--color-${color}: var(--ui-${color});`).join('\n\t')}
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
  --ring-offset-color-default: var(--ui-border);
  --ring-offset-color-muted: var(--ui-border-muted);
  --ring-offset-color-accented: var(--ui-border-accented);
  --ring-offset-color-inverted: var(--ui-border-inverted);
  --ring-offset-color-bg: var(--ui-bg);
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
    }
  })

  templates.push({
    filename: 'ui/index.ts',
    write: true,
    getContents: () => {
      let contents = Object.keys(theme).map(component => `export { default as ${component} } from './${kebabCase(component)}'`).join('\n')
      if (hasContent) {
        contents += '\n'
        contents += Object.keys(themeContent).map(component => `export { default as ${component} } from './content/${kebabCase(component)}'`).join('\n')
      }
      if (hasProse) contents += `\nexport * as prose from './prose'\n`
      return contents
    }
  })

  // FIXME: `typeof colors[number]` should include all colors from the theme
  templates.push({
    filename: 'types/ui.d.ts',
    getContents: () => {
      const iconKeys = Object.keys(uiConfig?.icons || {})
      const iconUnion = iconKeys.length ? iconKeys.map(i => JSON.stringify(i)).join(' | ') : 'string'

      return `import * as ui from '#build/ui'
import type { TVConfig } from '@nuxt/ui'
import type { defaultConfig } from 'tailwind-variants'
import colors from 'tailwindcss/colors'

type IconsConfig = Record<${iconUnion} | (string & {}), string>

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

type AppConfigUI = {
  colors?: {
    ${options.theme?.colors?.map(color => `'${color}'?: Color`).join('\n\t\t')}
    neutral?: NeutralColor | (string & {})
  }
  icons?: Partial<IconsConfig>
  tv?: typeof defaultConfig
} & TVConfig<typeof ui>

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /**
     * Nuxt UI theme configuration
     * @see https://ui.nuxt.com/docs/getting-started/theme/components
     */
    ui?: AppConfigUI
  }
}

export {}
`
    }
  })

  templates.push({
    filename: 'ui-image-component.ts',
    write: true,
    getContents: ({ app }) => {
      const image = app?.components?.find(c => c.pascalName === 'NuxtImg' && !/nuxt(?:-nightly)?\/dist\/app/.test(c.filePath))

      return image ? genExport(image.filePath, [{ name: image.export, as: 'default' }]) : 'export default "img"'
    }
  })

  return templates
}

export function addTemplates(options: ModuleOptions, nuxt: Nuxt, resolve: Resolver['resolve']) {
  const templates = getTemplates(options, nuxt.options.appConfig.ui, nuxt, resolve)
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

  if (options.experimental?.componentDetection && nuxt.options.dev) {
    nuxt.hook('builder:watch', async (_, path) => {
      if (/\.(?:vue|ts|js|tsx|jsx)$/.test(path)) {
        await updateTemplates({ filter: template => template.filename === 'ui.css' })
      }
    })
  }
}
