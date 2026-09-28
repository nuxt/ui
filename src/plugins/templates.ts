import fs from 'node:fs'
import path from 'node:path'
import { join } from 'pathe'
import { consola } from 'consola'
import type { UnpluginOptions } from 'unplugin'
import type { NuxtUIOptions } from '../unplugin'
import { getTemplates } from '../templates'
import { detectUsedComponents, resolveExtraScanDirs } from '../utils/components'

/**
 * This plugin is responsible for getting the generated virtual templates and
 * making them available to the Vue build.
 */
export default function TemplatePlugin(options: NuxtUIOptions, appConfig: Record<string, any>, runtimeDir: string) {
  const componentDir = join(runtimeDir, 'components')
  // `detectedComponents` is assigned in the `vite.config` hook (below), before
  // any template's `getContents` runs — so `componentDetection`
  // can narrow the theme CSS to the used components (see `getTemplates`).
  const vue: { detectedComponents?: Set<string>, dev?: boolean } = {}
  const templates = getTemplates(options, appConfig.ui, undefined, (...paths: string[]) => join(runtimeDir, '..', ...paths), vue)

  let root = ''
  let scanDirs: string[] = []
  let templateFiles: Record<string, string> = {}

  // The first run warns about what it can't resolve, the dev server's reruns don't repeat it
  function detect(warn = true) {
    return detectUsedComponents(
      [root, ...scanDirs],
      options.prefix!,
      componentDir,
      Array.isArray(options.componentDetection) ? options.componentDetection : undefined,
      { prose: !!(options.prose || options.mdc), warn }
    )
  }
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
      async config(config, { command }) {
        // `config.root` is not resolved yet when `config` hooks run, so a
        // CLI-provided root (e.g. `vite some/dir`) can still be relative here.
        // Alias targets must be absolute: Vite 8 warns on relative targets and
        // resolvers like @tailwindcss/vite reject them, which silently drops
        // every theme class from the generated CSS.
        // `options.root` lets setups like `electron-vite` override the location
        // when `config.root` points to a sub-directory Tailwind doesn't scan.
        root = path.resolve(options.root || config.root || '.')

        vue.dev = command === 'serve'

        if (options.componentDetection) {
          // `scanPackages` packages resolve Nuxt UI components from `node_modules`
          // and user component dirs can sit outside the root: detection has to
          // scan both or their components lose their theme CSS.
          scanDirs = resolveExtraScanDirs(root, options.scanPackages, options.components ? options.components.dirs : undefined)
          vue.detectedComponents = await detect()

          if (vue.detectedComponents?.size) {
            consola.success(`Nuxt UI detected ${vue.detectedComponents.size} components in use (including dependencies)`)
          } else {
            consola.info('Nuxt UI detected no components in use, including all components')
          }
        }

        templateFiles = await writeTemplates(root)

        return {
          resolve: {
            alias: templateFiles
          }
        }
      },
      // A component used for the first time in dev needs its theme CSS: detect
      // again when the source changes, and rewrite `ui.css` when the set does
      configureServer(server) {
        if (!options.componentDetection) {
          return
        }

        async function update() {
          const detected = await detect(false)
          const previous = vue.detectedComponents
          if (detected?.size === previous?.size && [...(detected ?? [])].every(component => previous?.has(component))) {
            return
          }

          const added = [...(detected ?? [])].filter(component => !previous?.has(component))
          if (added.length) {
            consola.success(`Nuxt UI detected new components: ${added.join(', ')}`)
          }

          vue.detectedComponents = detected
          await writeTemplates(root)

          // The templates live in `node_modules`, which Vite doesn't watch, so
          // tell it `ui.css` changed for Tailwind to rebuild the CSS importing it
          const file = templateFiles['#build/ui.css']
          if (file) {
            server.watcher.emit('change', file)
          }

          // And send the new list to the dev warning, which accepts the update itself
          const module = server.moduleGraph.getModuleById('virtual:nuxt-ui-templates/ui/detected.ts')
          if (module) {
            await server.reloadModule(module)
          }
        }

        // One run at a time: a save during a run schedules one more after it
        let running = false
        let pending = false
        async function redetect() {
          if (running) {
            pending = true
            return
          }
          running = true
          do {
            pending = false
            try {
              await update()
            } catch (error) {
              consola.error('Nuxt UI could not detect the components in use', error)
            }
          } while (pending)
          running = false
        }

        // Component dirs and linked packages outside the root aren't watched otherwise
        const outside = scanDirs.filter(dir => !dir.startsWith(`${root}/`) && !dir.includes('/node_modules/'))
        if (outside.length) {
          server.watcher.add(outside)
        }

        let timer: ReturnType<typeof setTimeout> | undefined
        server.watcher.on('all', (event, file) => {
          if ((event === 'add' || event === 'change' || event === 'unlink') && /\.(?:vue|ts|mts|js|mjs|cjs|tsx|jsx|md|html)$/.test(file) && !file.includes('/node_modules/')) {
            clearTimeout(timer)
            timer = setTimeout(redetect, 100)
          }
        })
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
