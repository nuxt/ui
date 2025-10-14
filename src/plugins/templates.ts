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
  let templatePaths: Map<string, string>
  let detectionComplete = false

  // Write all templates to a temporary directory
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
    templatePaths = new Map<string, string>()

    // Write all templates with their actual content
    for (const template of templates) {
      if (template.write && template.filename) {
        const filepath = join(tempDir, template.filename)
        const dir = join(filepath, '..')
        mkdirSync(dir, { recursive: true })
        const contents = await template.getContents!({} as any)
        writeFileSync(filepath, contents as string)
        templatePaths.set(`#build/${template.filename}`, filepath)
      }
    }

    detectionComplete = true
  }

  // Initialize templates immediately during plugin creation
  const detectionPromise = initializeTemplates()

  return {
    name: 'nuxt:ui:templates',
    enforce: 'pre',
    async buildStart() {
      // Ensure detection is complete before build starts
      await detectionPromise
    },
    async resolveId(id) {
      // Wait for detection to complete before resolving
      await detectionPromise

      if (!templatePaths) return

      // Resolve all #build/* imports to actual temp files
      if (templatePaths.has(id)) {
        return { id: templatePaths.get(id)! }
      }
      if (templatePaths.has(id + '.ts')) {
        return { id: templatePaths.get(id + '.ts')! }
      }
    },
    vite: {
      async config() {
        // Wait for detection to complete
        await detectionPromise

        // Set up aliases for Tailwind's enhanced-resolve
        const aliases: Record<string, string> = {}
        if (templatePaths) {
          for (const [key, path] of templatePaths.entries()) {
            aliases[key] = path
            // Also add alias without .ts extension for TypeScript imports
            if (key.endsWith('.ts')) {
              aliases[key.slice(0, -3)] = path
            }
          }
        }
        return {
          resolve: {
            alias: aliases
          }
        }
      }
    }
  } satisfies UnpluginOptions
}
