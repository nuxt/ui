import fs from 'node:fs'
import path from 'node:path'
import type { UnpluginOptions } from 'unplugin'
import type { NuxtUIOptions } from '../unplugin'
import { getTemplates } from '../templates'

/**
 * This plugin is responsible for getting the generated virtual templates and
 * making them available to the Vue build.
 */
export default function TemplatePlugin(options: NuxtUIOptions, appConfig: Record<string, any>) {
  const templates = getTemplates(options, appConfig.ui)
  const templateKeys = new Set(templates.map(t => `#build/${t.filename}`))

  async function writeTemplates(root: string) {
    const map: Record<string, string> = {}
    const dir = path.join(root, 'node_modules', '.nuxt-ui')
    for (const template of templates) {
      if (!template.write || !template.filename) {
        continue
      }
      const filePath = path.join(dir, template.filename)
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
      }
      fs.writeFileSync(filePath, await template.getContents!({} as any))

      map[`#build/${template.filename}`] = filePath
    }
    return map
  }

  return {
    name: 'nuxt:ui:templates',
    enforce: 'pre',
    vite: {
      async config(config) {
        const alias = await writeTemplates(config.root || process.cwd())

        return {
          resolve: {
            alias
          }
        }
      }
    },
    resolveId(id) {
      if (templateKeys.has(id + '.ts')) {
        return id.replace('#build/', 'virtual:nuxt-ui-templates/') + '.ts'
      }
    },
    loadInclude: id => templateKeys.has(id.replace('virtual:nuxt-ui-templates/', '#build/')),
    load(id) {
      id = id.replace('virtual:nuxt-ui-templates/', '#build/')
      return templates.find(t => `#build/${t.filename}` === id)!.getContents!({} as any)
    }
  } satisfies UnpluginOptions
}
