import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { describe, it, expect, afterAll } from 'vitest'
import nuxtUI from '../../src/eslint'

describe('nuxtUI', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nuxt-ui-eslint-'))
  afterAll(() => rmSync(dir, { recursive: true, force: true }))

  const file = (name: string, css: string) => {
    writeFileSync(join(dir, name), css)
    return join(dir, name)
  }

  // The message `no-palette-colors` gives a raw class of the palette, `bg-<palette>-500` by default,
  // filled in like the rule does
  const message = (entryPoint: string, palette: string, cls = `bg-${palette}-500`) => {
    const [, { restrict }] = nuxtUI({ entryPoint })[0]!.rules!['better-tailwindcss/no-restricted-classes'] as [string, { restrict: { pattern: string, message: string }[] }]
    const restriction = restrict.find(({ pattern }) => new RegExp(pattern).test(cls))!
    const matches = cls.match(restriction.pattern)!
    return restriction.message.replace(/\$(\d)/g, (_, i) => matches[Number(i)] ?? '')
  }

  it('suggests a color the app adds', () => {
    const entryPoint = file('added.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  tertiary: indigo 600 400;\n}')
    expect(message(entryPoint, 'indigo')).toContain('`tertiary` points at `indigo`, use `bg-tertiary-500` instead.')
  })

  it('reads the colors of an imported stylesheet, the entry winning', () => {
    file('colors.css', '@plugin "@nuxt/ui/colors" {\n  primary: indigo;\n  tertiary: teal;\n}')
    const entryPoint = file('imports.css', '@import "tailwindcss";\n@import "./colors.css";\n@plugin "@nuxt/ui/colors" {\n  primary: rose;\n}')
    expect(message(entryPoint, 'teal')).toContain('`tertiary` points at `teal`')
    expect(message(entryPoint, 'rose')).toContain('`primary` points at `rose`')
    expect(message(entryPoint, 'indigo')).toContain('or add one like `tertiary: indigo`')
  })

  it('takes the last import of a stylesheet imported twice', () => {
    file('shared.css', '@plugin "@nuxt/ui/colors" {\n  primary: indigo;\n}')
    file('a.css', '@import "./shared.css";\n@plugin "@nuxt/ui/colors" {\n  primary: rose;\n}')
    const entryPoint = file('twice.css', '@import "tailwindcss";\n@import "./a.css";\n@import "./shared.css";')
    expect(message(entryPoint, 'indigo')).toContain('`primary` points at `indigo`')
    expect(message(entryPoint, 'rose')).toContain('or add one like `tertiary: rose`')
  })

  it('reads the palette like the plugin does', () => {
    const entryPoint = file('palettes.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  primary: black white;\n  tertiary: "indigo-brand" 600 400;\n}')
    expect(message(entryPoint, 'sky')).toContain('`primary` points at `sky`')
    expect(message(entryPoint, 'indigo')).toContain('or add one like `tertiary: indigo`')
  })

  it('suggests the color itself for the shades it uses', () => {
    const entryPoint = file('shades.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  tertiary: indigo;\n  secondary: violet 600 300;\n}')
    expect(message(entryPoint, 'indigo', 'hover:bg-indigo-500/50')).toBe('"hover:bg-indigo-500/50" uses a raw palette color. `tertiary` points at `indigo`, use `hover:bg-tertiary/50` instead, it\'s `indigo-500` in light mode and `indigo-400` in dark mode.')
    expect(message(entryPoint, 'indigo', 'dark:text-indigo-400')).toBe('"dark:text-indigo-400" uses a raw palette color. In dark mode it\'s `dark:text-tertiary`. When its light mode class is `text-indigo-500`, use `text-tertiary` for both, it follows the color mode.')
    expect(message(entryPoint, 'indigo', 'bg-indigo-600')).toContain('use `bg-tertiary-600` instead.')
    expect(message(entryPoint, 'violet', 'bg-violet-600')).toContain('use `bg-secondary` instead, it\'s `violet-600` in light mode and `violet-300` in dark mode.')
  })
})
