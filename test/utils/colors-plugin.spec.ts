import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, normalize } from 'pathe'
import { describe, it, expect, afterAll } from 'vitest'
import ColorsPlugin from '../../src/plugins/colors'
import { defaultOptions } from '../../src/utils/defaults'

const root = normalize(realpathSync.native(mkdtempSync(join(tmpdir(), 'nuxt-ui-colors-plugin-'))))

afterAll(() => rmSync(root, { recursive: true, force: true }))

function setup(options: Record<string, any> = {}) {
  const plugin = ColorsPlugin({ ...defaultOptions, ...options } as any) as any
  plugin.vite.configResolved({ root })
  return plugin
}

describe('colors declaration in the Vite build', () => {
  const dts = join(root, 'ui.d.ts')
  const main = join(root, 'main.css')

  it('writes no file when the app adds no color', async () => {
    writeFileSync(main, '@import "tailwindcss";\n@import "@nuxt/ui";')
    const plugin = setup()

    expect(plugin.transformInclude(main)).toBe(true)
    expect(plugin.transformInclude(join(root, 'node_modules/pkg/style.css'))).toBe(false)
    await plugin.transform('', main)
    expect(existsSync(dts)).toBe(false)
  })

  it('types the colors of the stylesheet and the ones it imports', async () => {
    writeFileSync(join(root, 'colors.css'), '@plugin "@nuxt/ui/colors" { tertiary: indigo; }')
    writeFileSync(main, '@import "tailwindcss";\n@import "@nuxt/ui";\n@import "./colors.css";')
    const plugin = setup()

    await plugin.transform('', `${main}?direct`)
    expect(readFileSync(dts, 'utf8')).toContain('"tertiary": true')
  })

  it('empties the file once the color is gone', async () => {
    writeFileSync(join(root, 'colors.css'), '@plugin "@nuxt/ui/colors" { secondary: violet; }')
    const plugin = setup()

    await plugin.transform('', main)
    expect(readFileSync(dts, 'utf8')).not.toContain('UIColors')
  })

  it('writes nothing with `dts: false`', async () => {
    rmSync(dts)
    writeFileSync(join(root, 'colors.css'), '@plugin "@nuxt/ui/colors" { tertiary: indigo; }')
    const plugin = setup({ dts: false })

    await plugin.transform('', main)
    expect(existsSync(dts)).toBe(false)
  })
})
