import fs from 'node:fs'
import path from 'node:path'
import type { UnpluginOptions } from 'unplugin'
import type { NuxtUIOptions } from '../unplugin'
import { getTemplates } from '../templates'
import { resolveExtraScanDirs } from '../utils/components'

/**
 * This plugin is responsible for getting the generated virtual templates and
 * making them available to the Vue build.
 */
export default function TemplatePlugin(options: NuxtUIOptions, appConfig: Record<string, any>, componentDir?: string) {
  // `root` is assigned in the `vite.config` hook (below), before the `ui.css`
  // template's `getContents` runs — so `experimental.componentDetection` can scan the app.
  const vue: { root?: string, dirs?: string[], componentDir?: string } = { componentDir }
  const templates = getTemplates(options, appConfig.ui, undefined, undefined, vue)
  const templateKeys = new Set(templates.map(t => `#build/${t.filename}`))

  async function writeTemplates(root: string) {
    const map: Record<string, string> = {}
    const dir = path.join(root, 'node_modules', '.nuxt-ui')
    const createdDirs = new Set<string>()
    for (const template of templates) {
      if (!template.write || !template.filename) {
        continue
      }
      const filePath = path.join(dir, template.filename)
      const fileDir = path.dirname(filePath)
      if (!createdDirs.has(fileDir)) {
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, { recursive: true })
        }
        createdDirs.add(fileDir)
      }

      const contents = await template.getContents!({} as any)
      // Skip rewriting identical files so we don't churn mtimes on every config
      // resolve, which needlessly invalidates watchers and Tailwind's source scan.
      let existing: string | null = null
      try {
        existing = fs.readFileSync(filePath, 'utf8')
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          throw error
        }
      }
      if (existing !== contents) {
        fs.writeFileSync(filePath, contents)
      }

      map[`#build/${template.filename}`] = filePath
    }
    return map
  }

  return {
    name: 'nuxt:ui:templates',
    enforce: 'pre',
    vite: {
      async config(config) {
        // `config.root` is not resolved yet when `config` hooks run, so a
        // CLI-provided root (e.g. `vite some/dir`) can still be relative here.
        // Alias targets must be absolute: Vite 8 warns on relative targets and
        // resolvers like @tailwindcss/vite reject them, which silently drops
        // every theme class from the generated CSS.
        // `options.root` lets setups like `electron-vite` override the location
        // when `config.root` points to a sub-directory Tailwind doesn't scan.
        vue.root = path.resolve(options.root || config.root || '.')
        if (options.experimental?.componentDetection) {
          // `scanPackages` packages resolve Nuxt UI components from `node_modules`
          // and user component dirs can sit outside the root: detection has to
          // scan both or their components lose their theme CSS.
          vue.dirs = resolveExtraScanDirs(vue.root, options.scanPackages, options.components ? options.components.dirs : undefined)
        }
        const alias = await writeTemplates(vue.root)

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
