import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { writeFileSync, mkdirSync } from 'node:fs'
import type { UnpluginOptions } from 'unplugin'
import type { NuxtUIOptions } from '../unplugin'
import { getTemplates } from '../templates'

/**
 * This plugin is responsible for getting the generated virtual templates and
 * making them available to the Vue build.
 */
export default function TemplatePlugin(options: NuxtUIOptions, appConfig: Record<string, any>) {
  const templates = getTemplates(options, appConfig.ui)

  // Write all templates to a temporary directory
  const tempDir = join(tmpdir(), 'nuxt-ui-' + Date.now())
  mkdirSync(tempDir, { recursive: true })

  const templatePaths = new Map<string, string>()

  // Write templates synchronously (they're actually sync despite being marked async)
  for (const template of templates) {
    if (template.write && template.filename) {
      const filepath = join(tempDir, template.filename)
      const dir = join(filepath, '..')
      mkdirSync(dir, { recursive: true })
      const contents = template.getContents!({} as any)
      // Handle both sync and async getContents
      const data = contents instanceof Promise ? '' : contents
      if (data) {
        writeFileSync(filepath, data as string)
        templatePaths.set(`#build/${template.filename}`, filepath)
      }
    }
  }

  return {
    name: 'nuxt:ui:templates',
    enforce: 'pre',
    async buildStart() {
      // Re-write templates properly with async support
      for (const template of templates) {
        if (template.write && template.filename) {
          const filepath = join(tempDir, template.filename)
          const contents = await template.getContents!({} as any)
          writeFileSync(filepath, contents as string)
          templatePaths.set(`#build/${template.filename}`, filepath)
        }
      }
    },
    resolveId(id) {
      // Resolve all #build/* imports to actual temp files
      if (templatePaths.has(id)) {
        return templatePaths.get(id)
      }
      if (templatePaths.has(id + '.ts')) {
        return templatePaths.get(id + '.ts')
      }
    },
    vite: {
      config() {
        // Set up aliases for Tailwind's enhanced-resolve
        const aliases: Record<string, string> = {}
        for (const [key, path] of templatePaths.entries()) {
          aliases[key] = path
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
