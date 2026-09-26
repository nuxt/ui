import { readFile } from 'node:fs/promises'
import { camelCase, kebabCase } from 'scule'
import { genExport } from 'knitwork'
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

  templates.push({
    filename: 'ui.css',
    write: true,
    getContents: async () => {
      const sources = await generateSources()
      const prefix = options.theme?.prefix

      if (!prefix) {
        return sources
      }

      // The color scopes key their accent roles on the scope class, which the
      // engine prefixes at runtime, so the rules repeat for the prefixed class.
      const accent = await readFile(resolve('./runtime/accent.css'), 'utf8')

      return `${sources}\n\n${accent.replaceAll('[class~="[--ui-accent:', `[class~="${prefix}:[--ui-accent:`)}`
    }
  })

  // Static fallback shipped in the published npm package and exposed via
  // `package.json` `imports`, so tooling that resolves `#build/ui.css` through
  // Node module resolution (Prettier, Tailwind IntelliSense) finds a file. What
  // it generates is per app, the tokens and styles ship in `sources.css` and
  // `base.css`.
  templates.push({
    filename: 'ui.static.css',
    write: true,
    getContents: () => ''
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
