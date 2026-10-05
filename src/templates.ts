import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { camelCase, kebabCase } from 'scule'
import { genExport } from 'knitwork'
import { join } from 'pathe'
import { addTemplate, addTypeTemplate, hasNuxtModule, logger, updateTemplates, getLayerDirectories } from '@nuxt/kit'
import type { Nuxt, NuxtApp, NuxtPage, NuxtTemplate, NuxtTypeTemplate } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import type { ModuleOptions } from './module'
import { getThemeClasses } from './utils/theme'
import { detectUsedComponents } from './utils/components'
import * as theme from './runtime/theme'
import { colors } from './runtime/theme/color'
import * as themeProse from './runtime/theme/prose'
import * as themeContent from './runtime/theme/content'

// The classes components pass to `usePrefix`, which only adds the prefix at
// runtime, so Tailwind never sees them prefixed
export const prefixedClasses = ['absolute', 'dark:block', 'dark:hidden', 'dark:inline-block', 'focus:outline-none', 'hidden', 'inset-0', 'lg:block', 'lg:flex', 'lg:hidden', 'peer', 'sm:block']

export function getTemplates(options: ModuleOptions, uiConfig: Record<string, any>, nuxt: Nuxt | undefined, resolve: Resolver['resolve'], vue?: { detectedComponents?: Set<string>, dev?: boolean }) {
  const templates: NuxtTemplate[] = []

  let hasProse = false
  let hasContent = false
  let previousDetectedComponents: Set<string> | undefined

  // The package's themes. Tailwind scans them from `@source '../theme'` in
  // `css/sources.css`, and `#build/ui/*` re-exports them for app code.
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

  // `ui.css` and `ui/detected.ts` read the same detection, run once per generation
  let detection: Promise<Set<string> | undefined> | undefined
  nuxt?.hook('builder:generateApp', () => {
    detection = undefined
  })

  // Read when a template generates: the Vue plugin only knows the command by then
  function isDev() {
    return nuxt ? nuxt.options.dev : !!vue?.dev
  }

  function getDetectedComponents(app?: NuxtApp) {
    return nuxt ? (detection ??= detectComponents(app)) : Promise.resolve(vue?.detectedComponents)
  }

  async function detectComponents(app?: NuxtApp) {
    const layers = getLayerDirectories(nuxt!).map(layer => layer.app)
    if (!options.componentDetection || !layers.length) {
      return undefined
    }

    // Markdown content lives next to each layer's app dir, in `content/`
    const contentDirs = hasProse ? getLayerDirectories(nuxt!).map(layer => `${layer.root}content`).filter(dir => existsSync(dir)) : []

    // Components and pages registered from outside the layers, by another
    // `components.dirs` entry, a module or a package, render components too
    const runtimeDir = resolve('./runtime')
    const pageFiles = (pages: NuxtPage[] = []): string[] => pages.flatMap(page => [page.file, ...pageFiles(page.children)]).filter((file): file is string => !!file)
    const files = [...(app?.components ?? []).map(component => component.filePath), ...pageFiles(app?.pages)]
      .filter(file => !file.startsWith(runtimeDir) && !layers.some(layer => file.startsWith(layer)))

    const detectedComponents = await detectUsedComponents(
      [...layers, ...contentDirs],
      options.prefix!,
      resolve('./runtime/components'),
      Array.isArray(options.componentDetection) ? options.componentDetection : undefined,
      { prose: hasProse, files }
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

    return detectedComponents
  }

  async function generateSources(app?: NuxtApp) {
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

    // With `componentDetection`, only the themes of the detected components,
    // their dependencies included, reach the CSS.
    const detectedComponents = await getDetectedComponents(app)

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
    // Detection only narrows the build: the list comes from the themes imported
    // at startup, so in dev the files are scanned for an edit to reach the CSS.
    if ((detectedComponents?.size && !isDev()) || options.tailwindPrefix) {
      sources.push(`@source not "${themeDir}";`)
      sources.push(`@source inline(${JSON.stringify(getThemeClasses(themes, options.tailwindPrefix).join(' '))});`)
      if (options.tailwindPrefix) {
        sources.push(`@source inline(${JSON.stringify(prefixedClasses.map(cls => `${options.tailwindPrefix}:${cls}`).join(' '))});`)
      }
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
    getContents: ({ app }) => generateSources(app)
  })

  // The themes detection puts in the build's CSS, for the dev warning in
  // `useComponentProps` when a component renders that the build would leave
  // without its classes. `null` when there's nothing to check.
  templates.push({
    filename: 'ui/detected.ts',
    write: true,
    getContents: async ({ app }) => {
      if (!options.componentDetection || !isDev()) {
        return 'export default null as Set<string> | null\n'
      }

      const detectedComponents = await getDetectedComponents(app)
      // Nothing detected keeps every theme
      const names = detectedComponents?.size
        ? [...detectedComponents].map(component => camelCase(component))
        : [...Object.keys(theme), ...(hasContent ? Object.keys(themeContent) : [])]

      return `const names: string[] = ${JSON.stringify(names)}

// Detection runs again as files change. Each version of this module refills the
// one set components read, kept across updates in \`import.meta.hot.data\`
const detected: Set<string> = import.meta.hot?.data.detected ?? new Set()
detected.clear()
for (const name of names) {
  detected.add(name)
}
if (import.meta.hot) {
  import.meta.hot.data.detected = detected
  import.meta.hot.accept()
}

export default detected as Set<string> | null
`
    }
  })

  // The color scopes key their accent roles on the scope class, which the engine
  // prefixes at runtime, so the rules repeat for the prefixed class. Imported from
  // `base.css`, so they land in the same cascade layer as `accent.css`.
  templates.push({
    filename: 'ui.base.css',
    write: true,
    getContents: async () => {
      const prefix = options.tailwindPrefix
      if (!prefix) {
        return ''
      }

      // A Windows checkout can hold the file with CRLF line endings
      const accent = (await readFile(resolve('./runtime/css/accent.css'), 'utf8')).replace(/\r\n/g, '\n')
      const scopes = accent.match(/\.\\\[--ui-accent\\:var\\\(--ui-[a-z]+\\\)\\\]\s*\{[^}]*\}/g) ?? []
      // One rule per color: fewer means the shipped CSS no longer looks the way this reads it
      if (scopes.length < colors.length) {
        throw new Error(`[@nuxt/ui] Found ${scopes.length} color scope rules in \`accent.css\` for the prefix, expected ${colors.length}.`)
      }

      return `@layer base {\n  ${scopes.map(rule => rule.replace('.\\[--ui-accent', `.${prefix}\\:\\[--ui-accent`)).join('\n\n  ')}\n}\n`
    }
  })

  // Static fallback shipped in the published npm package and exposed via
  // `package.json` `imports`, so tooling that resolves `#build/ui.css` or
  // `#build/ui.base.css` through Node module resolution (Prettier, Tailwind
  // IntelliSense) finds a file. What they generate is per app, the tokens and
  // styles ship in `tailwind.css` and `base.css`.
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

  templates.push({
    filename: 'types/ui.d.ts',
    getContents: () => {
      const iconKeys = Object.keys(uiConfig?.icons || {})
      const iconUnion = iconKeys.length ? iconKeys.map(i => JSON.stringify(i)).join(' | ') : 'string'

      return `import * as ui from '#build/ui'
import type { TVConfig, TVMergeConfig, DeepRequired, ThemeDefaultVariants } from '@nuxt/ui'

type IconsConfig = Record<${iconUnion} | (string & {}), string>

type AppConfigUI = {
  icons?: Partial<IconsConfig>
  /** Removed in v5: set the colors in your CSS with the @nuxt/ui/colors plugin. */
  colors?: never
  tv?: TVMergeConfig
  defaultVariants?: ThemeDefaultVariants
  unstyled?: boolean
} & TVConfig<typeof ui>

// The module writes \`prefix\` from \`tailwindPrefix\`, so it's read at runtime but not set here
type AppConfigRuntimeUI = DeepRequired<Pick<AppConfigUI, 'icons' | 'tv'>> & { prefix?: string } & typeof ui

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

  if (options.componentDetection && nuxt.options.dev) {
    let watcher: { emit: (event: string, file: string) => unknown } | undefined
    nuxt.hook('vite:serverCreated', (server, { isClient }) => {
      if (isClient) {
        watcher = server.watcher
      }
    })

    nuxt.hook('builder:watch', async (_, path) => {
      if (/\.(?:vue|ts|mts|js|mjs|cjs|tsx|jsx|md|html)$/.test(path)) {
        const file = join(nuxt.options.buildDir, 'ui.css')
        const before = await readFile(file, 'utf8').catch(() => '')
        await updateTemplates({ filter: template => template.filename === 'ui.css' || template.filename === 'ui/detected.ts' })

        // Vite doesn't watch the build dir, so tell it `ui.css` changed for
        // Tailwind to rebuild the CSS importing it
        if (watcher && await readFile(file, 'utf8').catch(() => '') !== before) {
          watcher.emit('change', file)
        }
      }
    })
  }
}
