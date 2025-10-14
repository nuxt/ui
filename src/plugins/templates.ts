import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { normalize } from 'pathe'
import type { UnpluginOptions } from 'unplugin'
import type { NuxtUIOptions } from '../unplugin'
import { getTemplates, detectUsedComponents } from '../templates'

/**
 * This plugin is responsible for getting the generated virtual templates and
 * making them available to the Vue build.
 */
export default function TemplatePlugin(options: NuxtUIOptions, appConfig: Record<string, any>) {
  let templates: ReturnType<typeof getTemplates>
  let templateKeys: Set<string>
  let cssFilePath: string | undefined
  let detectionComplete = false

  // Write CSS to a temporary directory (for Tailwind to read)
  const tempDir = join(tmpdir(), 'nuxt-ui-' + Date.now())
  mkdirSync(tempDir, { recursive: true })

  async function initializeTemplates() {
    if (detectionComplete) return

    let detectedComponents: Set<string> | undefined

    // Detect used components for tree-shaking (if experimental feature is enabled)
    if (options.experimental?.componentDetection) {
      const componentDir = normalize(fileURLToPath(new URL('../runtime/components', import.meta.url)))
      const rootDir = process.cwd()

      const includeComponents = Array.isArray(options.experimental.componentDetection)
        ? options.experimental.componentDetection
        : undefined

      detectedComponents = await detectUsedComponents(
        rootDir,
        options.prefix!,
        componentDir,
        includeComponents
      )

      if (detectedComponents && detectedComponents.size > 0) {
        console.log(`[Nuxt UI] ✔ Detected ${detectedComponents.size} components in use (including dependencies)`)
      } else {
        console.log('[Nuxt UI] ℹ No components detected, including all components')
      }
    }

    templates = getTemplates(options, appConfig.ui, undefined, detectedComponents)
    templateKeys = new Set(templates.map(t => `#build/${t.filename}`))

    // Write all templates to temp directory
    // - CSS file needs to be real for Tailwind to read
    // - TypeScript files need to be real for Tailwind's @source directive to scan them
    for (const template of templates) {
      if (template.write && template.filename) {
        const filepath = join(tempDir, template.filename)
        const dir = join(filepath, '..')
        mkdirSync(dir, { recursive: true })
        const contents = await template.getContents!({} as any)
        writeFileSync(filepath, contents as string)

        if (template.filename === 'ui.css') {
          cssFilePath = filepath
        }
      }
    }

    detectionComplete = true
  }

  // Initialize templates immediately (starts async process)
  const initPromise = initializeTemplates()

  return {
    name: 'nuxt:ui:templates',
    enforce: 'pre',
    async buildStart() {
      // Ensure templates are initialized before build starts
      await initPromise
    },
    async resolveId(id) {
      await initPromise

      if (templateKeys.has(id + '.ts')) {
        return id.replace('#build/', 'virtual:nuxt-ui-templates/') + '.ts'
      }
    },
    loadInclude: id => templateKeys.has(id.replace('virtual:nuxt-ui-templates/', '#build/')),
    async load(id) {
      await initPromise

      id = id.replace('virtual:nuxt-ui-templates/', '#build/')
      return templates.find(t => `#build/${t.filename}` === id)!.getContents!({} as any)
    },
    vite: {
      async config() {
        // Wait for initialization to complete during config phase
        await initPromise

        // Set up alias only for CSS file (for Tailwind's enhanced-resolve)
        if (cssFilePath) {
          return {
            resolve: {
              alias: {
                '#build/ui.css': cssFilePath
              }
            }
          }
        }
      }
    }
  } satisfies UnpluginOptions
}
