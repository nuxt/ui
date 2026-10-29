import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, normalize } from 'pathe'
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import ColorsPlugin from '../../src/plugins/colors'
import { defaultOptions } from '../../src/utils/defaults'

describe('colors declaration in the Vite build', () => {
  let root: string

  beforeEach(() => {
    root = normalize(realpathSync.native(mkdtempSync(join(tmpdir(), 'nuxt-ui-colors-plugin-'))))
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  function setup(colors: string, options: Record<string, any> = {}) {
    writeFileSync(join(root, 'colors.css'), colors)
    writeFileSync(join(root, 'main.css'), '@import "tailwindcss";\n@import "@nuxt/ui";\n@import "./colors.css";')
    const plugin = ColorsPlugin({ ...defaultOptions, ...options } as any) as any
    plugin.vite.configResolved({ root })
    return plugin
  }

  const main = () => join(root, 'main.css')
  const dts = () => join(root, 'ui.d.ts')

  it('writes no file when the app adds no color', async () => {
    const plugin = setup('')

    expect(plugin.transformInclude(main())).toBe(true)
    expect(plugin.transformInclude(join(root, 'node_modules/pkg/style.css'))).toBe(false)
    await plugin.transform('', main())
    expect(existsSync(dts())).toBe(false)
  })

  it('types the colors of the stylesheet and the ones it imports', async () => {
    const plugin = setup('@plugin "@nuxt/ui/colors" { tertiary: indigo; }')

    await plugin.transform('', `${main()}?direct`)
    expect(readFileSync(dts(), 'utf8')).toContain('"tertiary": true')
  })

  it('empties the file once the color is gone', async () => {
    const plugin = setup('@plugin "@nuxt/ui/colors" { tertiary: indigo; }')
    await plugin.transform('', main())
    expect(readFileSync(dts(), 'utf8')).toContain('"tertiary": true')

    writeFileSync(join(root, 'colors.css'), '@plugin "@nuxt/ui/colors" { secondary: violet; }')
    await plugin.transform('', main())
    expect(readFileSync(dts(), 'utf8')).not.toContain('UIColors')
  })

  it('writes nothing with `dts: false`', async () => {
    const plugin = setup('@plugin "@nuxt/ui/colors" { tertiary: indigo; }', { dts: false })

    await plugin.transform('', main())
    expect(existsSync(dts())).toBe(false)
  })
})
