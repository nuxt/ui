import { EventEmitter } from 'node:events'
import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { describe, it, expect, afterAll, vi } from 'vitest'
import TemplatePlugin from '../../src/plugins/templates'
import { defaultOptions, getDefaultConfig } from '../../src/utils/defaults'

const runtimeDir = join(process.cwd(), 'src/runtime')
const root = realpathSync(mkdtempSync(join(tmpdir(), 'nuxt-ui-redetect-')))

afterAll(() => rmSync(root, { recursive: true, force: true }))

describe('component detection in the Vite dev server', () => {
  it('rewrites `ui.css` when a newly used component shows up', async () => {
    writeFileSync(join(root, 'App.vue'), '<template><UButton /></template>\n')

    const plugin = TemplatePlugin({ ...defaultOptions } as any, { ui: getDefaultConfig() }, runtimeDir) as any
    const { resolve: { alias } } = await plugin.vite.config({ root })
    const uiCss = alias['#build/ui.css']
    expect(readFileSync(uiCss, 'utf8')).not.toContain('grid-cols-7')

    const watcher = Object.assign(new EventEmitter(), { emit: vi.fn(EventEmitter.prototype.emit), add: vi.fn() })
    plugin.vite.configureServer({ watcher })

    const file = join(root, 'Extra.vue')
    writeFileSync(file, '<template><UCalendar /></template>\n')
    watcher.emit('all', 'add', file)

    await vi.waitFor(() => expect(readFileSync(uiCss, 'utf8')).toContain('grid-cols-7'), { timeout: 5000 })
    // Vite doesn't watch `node_modules`, so the plugin reports the change itself
    expect(watcher.emit).toHaveBeenCalledWith('change', uiCss)
  })
})
