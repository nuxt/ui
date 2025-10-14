import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { writeFileSync, mkdirSync, realpathSync } from 'node:fs'
import type { UnpluginOptions } from 'unplugin'
import type { NuxtUIOptions } from '../unplugin'
import { getTemplates } from '../templates'

/**
 * This plugin is responsible for getting the generated virtual templates and
 * making them available to the Vue build.
 */
export default function TemplatePlugin(options: NuxtUIOptions, appConfig: Record<string, any>) {
  let detectionComplete = false
  const aliases: Record<string, string> = {}

  // Write templates to a temporary directory (for Tailwind to read)
  const tempDir = join(tmpdir(), 'nuxt-ui-templates')
  mkdirSync(tempDir, { recursive: true })
  // Resolve to real path (handles symlinks like /var -> /private/var on macOS)
  const realTempDir = realpathSync(tempDir)

  async function initializeTemplates() {
    if (detectionComplete) return

    const templates = getTemplates(options, appConfig.ui, undefined)

    for (const template of templates) {
      if (template.write && template.filename) {
        const filepath = join(realTempDir, template.filename)
        const dir = join(filepath, '..')
        mkdirSync(dir, { recursive: true })
        const contents = await template.getContents!({} as any)
        writeFileSync(filepath, contents as string)

        aliases[`#build/${template.filename}`] = filepath
      }
    }

    detectionComplete = true
  }

  const initPromise = initializeTemplates()

  return {
    name: 'nuxt:ui:templates',
    enforce: 'pre',
    async resolveId(id) {
      await initPromise

      const aliasPath = aliases[id + '.ts']
      if (aliasPath) {
        return { id: aliasPath }
      }
    },
    vite: {
      async config() {
        await initPromise

        return {
          resolve: {
            alias: aliases
          }
        }
      }
    }
  } satisfies UnpluginOptions
}
