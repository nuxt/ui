import { camelCase, kebabCase } from 'scule'
import { genExport } from 'knitwork'
import colors from 'tailwindcss/colors'
import { addTemplate, addTypeTemplate, hasNuxtModule, logger, updateTemplates, getLayerDirectories } from '@nuxt/kit'
import type { Nuxt, NuxtTemplate, NuxtTypeTemplate } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import type { ModuleOptions } from './module'
import { getThemeClasses } from './utils/theme'
import { detectUsedComponents } from './utils/components'
import * as theme from './runtime/theme'
import { colors as aliases } from './runtime/theme/color'
import * as themeProse from './runtime/theme/prose'
import * as themeContent from './runtime/theme/content'

// The accent roles every color resolves through, with the recipe each falls back to.
// A color scope points each one at `--ui-<color>-<role>`, and a role left unset
// keeps its recipe on the color.
const ACCENT_RECIPES: Record<string, string> = {
  'foreground': 'var(--ui-text-inverted)',
  'hover': 'color-mix(in oklab, var(--ui-accent) 75%, transparent)',
  'soft': 'color-mix(in oklab, var(--ui-accent) 10%, transparent)',
  'soft-hover': 'color-mix(in oklab, var(--ui-accent) 15%, transparent)',
  'soft-foreground': 'var(--ui-accent)',
  'soft-active': 'color-mix(in oklab, var(--ui-accent) 20%, transparent)',
  'border': 'color-mix(in oklab, var(--ui-accent) 50%, transparent)',
  'border-soft': 'color-mix(in oklab, var(--ui-accent) 25%, transparent)',
  'focus': 'color-mix(in oklab, var(--ui-accent) 25%, transparent)',
  'surface': 'transparent',
  'muted': 'var(--ui-accent)',
  'muted-hover': 'color-mix(in oklab, var(--ui-accent) 75%, transparent)',
  'line': 'var(--ui-accent)',
  'tint': 'color-mix(in oklab, var(--ui-accent) 10%, transparent)',
  'faint': 'color-mix(in oklab, var(--ui-accent) 75%, transparent)',
  'border-muted': 'color-mix(in oklab, var(--ui-accent) 25%, transparent)',
  'border-strong': 'color-mix(in oklab, var(--ui-accent) 50%, transparent)'
}

const ACCENT_ROLES = Object.keys(ACCENT_RECIPES)

// Neutral's roles default to the surface tokens it has always used
const NEUTRAL_ROLES: Record<string, string> = {
  'hover': 'color-mix(in oklab, var(--ui-bg-inverted) 90%, transparent)',
  'soft': 'var(--ui-bg-elevated)',
  'soft-hover': 'color-mix(in oklab, var(--ui-bg-accented) 75%, transparent)',
  'soft-foreground': 'var(--ui-text)',
  'border': 'var(--ui-border-accented)',
  'border-soft': 'var(--ui-border-accented)',
  'surface': 'var(--ui-bg)',
  'muted': 'var(--ui-text-muted)',
  'muted-hover': 'var(--ui-text)',
  'line': 'var(--ui-border)',
  'tint': 'color-mix(in oklab, var(--ui-bg-elevated) 50%, transparent)',
  'faint': 'var(--ui-text-dimmed)',
  'border-muted': 'var(--ui-border)'
}

export function getTemplates(options: ModuleOptions, uiConfig: Record<string, any>, nuxt: Nuxt | undefined, resolve: Resolver['resolve'], vue?: { detectedComponents?: Set<string> }) {
  const templates: NuxtTemplate[] = []

  let hasProse = false
  let hasContent = false
  let previousDetectedComponents: Set<string> | undefined

  // The package's themes. Tailwind scans them from `@source './theme'` in
  // `index.css`, and `#build/ui/*` re-exports them for app code.
  const themeDir = resolve('./runtime/theme')

  function writeThemeTemplate(theme: Record<string, any>, path?: string) {
    for (const component in theme) {
      const filename = `${path ? path + '/' : ''}${kebabCase(component)}`

      templates.push({
        filename: `ui/${filename}.ts`,
        write: true,
        getContents: () => `export { default } from ${JSON.stringify(`${themeDir}/${filename}`)}\n`
      })
    }
  }

  if (options.prose || options.mdc || options.content || (!!nuxt && (hasNuxtModule('@nuxtjs/mdc') || hasNuxtModule('@nuxt/content')))) {
    hasProse = true

    const path = 'prose'

    writeThemeTemplate(themeProse, path)

    templates.push({
      filename: `ui/${path}/index.ts`,
      write: true,
      getContents: () => Object.keys(themeProse).map(component => `export { default as ${component} } from './${kebabCase(component)}'`).join('\n')
    })
  }

  if (options.content || (!!nuxt && hasNuxtModule('@nuxt/content'))) {
    hasContent = true

    writeThemeTemplate(themeContent, 'content')
  }

  writeThemeTemplate(theme)

  async function generateSources() {
    const sources: string[] = []

    // Layer + inline sources are Nuxt-only; the Vue integration relies on the
    // user's own Vite/Tailwind setup to scan their source.
    const layers = nuxt ? getLayerDirectories(nuxt).map(layer => layer.app) : []

    if (nuxt) {
      // Add layer sources
      for (const layer of layers) {
        sources.push(`@source "${layer}**/*";`)
      }

      // Add inline sources from Nuxt config (classes defined in config)
      const inlineConfigs = [
        nuxt.options.app?.rootAttrs?.class,
        nuxt.options.app?.head?.htmlAttrs?.class,
        nuxt.options.app?.head?.bodyAttrs?.class
      ]

      for (const value of inlineConfigs) {
        if (value && typeof value === 'string') {
          sources.push(`@source inline(${JSON.stringify(value)});`)
        }
      }
    }

    // With `experimental.componentDetection`, only the themes of the detected
    // components, their dependencies included, reach the CSS.
    const componentDir = resolve('./runtime/components')

    let detectedComponents = vue?.detectedComponents

    if (options.experimental?.componentDetection && nuxt && componentDir && layers.length) {
      detectedComponents = await detectUsedComponents(
        layers,
        options.prefix!,
        componentDir,
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
      } else {
        if (!previousDetectedComponents || previousDetectedComponents.size > 0) {
          logger.info('Nuxt UI detected no components in use, including all components')
        }
        previousDetectedComponents = new Set()
      }
    }

    const themes: Record<string, any>[] = []

    if (detectedComponents?.size) {
      if (hasProse) {
        themes.push(...Object.values(themeProse))
      }

      for (const component of detectedComponents) {
        const camelComponent = camelCase(component)

        if (hasContent && (themeContent as any)[camelComponent]) {
          themes.push((themeContent as any)[camelComponent])
        } else if ((theme as any)[camelComponent]) {
          themes.push((theme as any)[camelComponent])
        }
      }
    } else {
      themes.push(...Object.values(theme), ...(hasContent ? Object.values(themeContent) : []), ...(hasProse ? Object.values(themeProse) : []))
    }

    // Scanning the theme files can't narrow them to the detected components: a
    // theme that extends another (Select from Input) only holds its own classes.
    // Tailwind also only generates prefixed candidates, while the themes keep
    // their classes unprefixed since the engine prefixes them at runtime. So
    // either way, the themes' resolved classes are listed inline instead.
    if (detectedComponents?.size || options.theme?.prefix) {
      sources.push(`@source not "${themeDir}";`)
      sources.push(`@source inline(${JSON.stringify(getThemeClasses(themes, options.theme?.prefix).join(' '))});`)
    } else {
      if (!hasProse) {
        sources.push(`@source not "${themeDir}/prose";`)
      }
      if (!hasContent) {
        sources.push(`@source not "${themeDir}/content";`)
      }
    }

    return sources.join('\n')
  }

  const themeBlocks = `@theme static {
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
  ${aliases.map(color => [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => `--color-${color}-${shade}: var(--ui-color-${color}-${shade});`).join('\n\t')).join('\n\t')}
  ${aliases.map(color => `--color-${color}: var(--ui-${color});`).join('\n\t')}
  --color-accent: var(--ui-accent);
  ${ACCENT_ROLES.map(role => `--color-accent-${role}: var(--ui-accent-${role}, ${ACCENT_RECIPES[role]});`).join('\n  ')}
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
  --stroke-bg: var(--ui-bg);
  --stroke-default: var(--ui-border);
  --stroke-inverted: var(--ui-border-inverted);
  --fill-bg: var(--ui-bg);
  --fill-default: var(--ui-border);
  --fill-inverted: var(--ui-border-inverted);
}
`

  templates.push({
    filename: 'ui.css',
    write: true,
    getContents: async () => {
      const sources = await generateSources()
      const prefix = options.theme?.prefix ? `${options.theme.prefix}:` : ''

      return `${sources}

@layer base {
  body {
    @apply ${prefix}antialiased ${prefix}text-default ${prefix}bg-default ${prefix}scheme-light ${prefix}dark:scheme-dark;
  }

  /* Any \`--ui-accent\` scope resets the accent roles, so a colored component nested
     in another doesn't inherit them and every role falls back to its recipe. */
  [class*="[--ui-accent:"] {
    ${ACCENT_ROLES.map(role => `--ui-accent-${role}: initial;`).join('\n    ')}
  }

  /* A color's scope reads its roles from \`--ui-<color>-<role>\`. An unset variable
     leaves the role unset, so it keeps its recipe, or for neutral its surface token.
     Neutral also resolves \`--ui-neutral\` on the element, so it follows a surface
     that redefines \`--ui-bg-inverted\`. */
  ${aliases.map(color => `[class~="${prefix}[--ui-accent:var(--ui-${color})]"] {
    ${color === 'neutral' ? '--ui-neutral: var(--ui-bg-inverted);\n    ' : ''}${ACCENT_ROLES.map(role => `--ui-accent-${role}: var(--ui-${color}-${role}${color === 'neutral' && NEUTRAL_ROLES[role] ? `, ${NEUTRAL_ROLES[role]}` : ''});`).join('\n    ')}
  }`).join('\n\n  ')}
}

${themeBlocks}`
    }
  })

  // Static fallback shipped in the published npm package and exposed via
  // `package.json` `imports` so tooling that resolves `#build/ui.css` through
  // Node module resolution (Prettier, Tailwind IntelliSense) has something to
  // read. Strips `@source` directives (paths don't exist on consumer machines)
  // and the body rule (runtime template handles it with the user's prefix).
  templates.push({
    filename: 'ui.static.css',
    write: true,
    getContents: () => themeBlocks
  })

  templates.push({
    filename: 'ui/index.ts',
    write: true,
    getContents: () => [
      ...Object.keys(theme).map(component => `export { default as ${component} } from './${kebabCase(component)}'`),
      ...(hasContent ? Object.keys(themeContent).map(component => `export { default as ${component} } from './content/${kebabCase(component)}'`) : []),
      ...(hasProse ? [`export * as prose from './prose'`] : [])
    ].join('\n')
  })

  // FIXME: `typeof colors[number]` should include all colors from the theme
  templates.push({
    filename: 'types/ui.d.ts',
    getContents: () => {
      const iconKeys = Object.keys(uiConfig?.icons || {})
      const iconUnion = iconKeys.length ? iconKeys.map(i => JSON.stringify(i)).join(' | ') : 'string'

      return `import * as ui from '#build/ui'
import type { TVConfig, TVMergeConfig, DeepRequired, ThemeDefaultVariants } from '@nuxt/ui'
import colors from 'tailwindcss/colors'

type IconsConfig = Record<${iconUnion} | (string & {}), string>

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'taupe' | 'mauve' | 'mist' | 'olive'
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

type AppConfigUI = {
  colors?: {
    ${aliases.filter(color => color !== 'neutral').map(color => `'${color}'?: Color`).join('\n\t\t')}
    neutral?: NeutralColor | (string & {})
  }
  icons?: Partial<IconsConfig>
  prefix?: string
  tv?: TVMergeConfig
  defaultVariants?: ThemeDefaultVariants
  unstyled?: boolean
} & TVConfig<typeof ui>

type AppConfigRuntimeUI = DeepRequired<Pick<AppConfigUI, 'colors' | 'icons' | 'tv'>> & typeof ui

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /**
     * Nuxt UI theme configuration
     * @see https://ui.nuxt.com/docs/getting-started/theme/components
     */
    ui?: AppConfigUI
  }
  interface CustomAppConfig {
    ui: AppConfigRuntimeUI
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
      if (/\.(?:vue|ts|mts|js|mjs|cjs|tsx|jsx)$/.test(path)) {
        await updateTemplates({ filter: template => template.filename === 'ui.css' })
      }
    })
  }
}
