import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { describe, it, expect, afterAll } from 'vitest'
import { Linter } from 'eslint'
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

  it('reads the blocks and imports in the order they\'re written', () => {
    file('late.css', '@plugin "@nuxt/ui/colors" {\n  primary: rose;\n}')
    const entryPoint = file('order.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  primary: indigo;\n}\n@import "./late.css";')
    expect(message(entryPoint, 'rose')).toContain('`primary` points at `rose`')
  })

  it('gives an added color its default shades back when a later block sets none', () => {
    const entryPoint = file('reset.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  tertiary: indigo 600 300;\n  primary: sky 600 300;\n}\n@plugin "@nuxt/ui/colors" {\n  tertiary: indigo;\n  primary: sky;\n}')
    expect(message(entryPoint, 'indigo')).toContain('use `bg-tertiary` instead, it\'s `indigo-500` in light mode')
    expect(message(entryPoint, 'sky', 'bg-sky-600')).toContain('use `bg-primary` instead, it\'s `sky-600` in light mode')
  })

  it('keeps the stylesheet\'s shades with the `colors` option', () => {
    const entryPoint = file('option.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  tertiary: indigo 600 300;\n}')
    const [, { restrict }] = nuxtUI({ entryPoint, colors: { tertiary: 'indigo' } })[0]!.rules!['better-tailwindcss/no-restricted-classes'] as [string, { restrict: { pattern: string, message: string }[] }]
    expect(restrict.find(({ pattern }) => new RegExp(pattern).test('bg-indigo-600'))!.message).toContain('it\'s `indigo-600` in light mode and `indigo-300` in dark mode')
  })

  it('leaves an `@import url(...)` alone, which Tailwind CSS doesn\'t inline', () => {
    file('url-colors.css', '@plugin "@nuxt/ui/colors" {\n  primary: rose;\n}')
    const entryPoint = file('url.css', '@import "tailwindcss";\n@import url("./url-colors.css");')
    expect(message(entryPoint, 'sky')).toContain('`primary` points at `sky`')
  })

  // Whether `no-palette-colors` flags the class at all
  const flagged = (entryPoint: string, cls: string) => {
    const [, { restrict }] = nuxtUI({ entryPoint })[0]!.rules!['better-tailwindcss/no-restricted-classes'] as [string, { restrict: { pattern: string }[] }]
    return restrict.some(({ pattern }) => new RegExp(pattern).test(cls))
  }

  it('suggests the alias of a custom palette', () => {
    const entryPoint = file('custom.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  primary: brand;\n  secondary: primary;\n}')
    expect(message(entryPoint, 'brand', 'bg-brand-600')).toContain('`primary` points at `brand`, use `bg-primary-600` instead.')
    expect(message(entryPoint, 'brand', 'hover:bg-brand-600/50')).toContain('use `hover:bg-primary-600/50` instead.')
    expect(message(entryPoint, 'brand', 'bg-brand-500')).toContain('use `bg-primary` instead, it\'s `brand-500` in light mode')
    expect(flagged(entryPoint, 'bg-primary-500')).toBe(false)
  })

  it('only flags the classes with a shade of a custom palette that names a utility', () => {
    const entryPoint = file('cover.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  primary: cover;\n}')
    expect(flagged(entryPoint, 'bg-cover')).toBe(false)
    expect(message(entryPoint, 'cover', 'bg-cover-600')).toContain('use `bg-primary-600` instead.')
  })

  it.each([
    ['linear', ['bg-linear-50', 'hover:bg-linear-50/oklab']],
    ['conic', ['bg-conic-50']],
    ['offset', ['outline-offset-50', 'md:-outline-offset-50!', 'ring-offset-50']],
    ['spacing', ['border-spacing-50']],
    ['x', ['border-x-50', 'divide-x-50']]
  ])('leaves the numeric utilities alone when a custom palette is `%s`', (palette, utilities) => {
    const entryPoint = file(`numeric-${palette}.css`, `@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  primary: ${palette};\n}`)
    for (const utility of utilities) {
      expect(flagged(entryPoint, utility)).toBe(false)
    }
    expect(message(entryPoint, palette, `text-${palette}-600`)).toContain('use `text-primary-600` instead.')
  })

  it('suggests the semantic tokens for the custom palette `neutral` points at', () => {
    const entryPoint = file('neutral.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  neutral: brand-gray;\n}')
    expect(message(entryPoint, 'brand-gray', 'bg-brand-gray-100')).toContain('Use `bg-soft` instead')
    expect(message(entryPoint, 'brand-gray', 'dark:bg-brand-gray-900')).toContain('In dark mode it\'s `bg-default`')
    expect(message(entryPoint, 'brand-gray', 'md:text-brand-gray-500/50')).toContain('Use `md:text-muted/50` instead')
    expect(message(entryPoint, 'brand-gray', 'fill-brand-gray-500')).toContain('Use a semantic token or the `neutral` color instead')
    expect(flagged(entryPoint, 'bg-brand-gray')).toBe(false)
  })

  it('leaves the numeric utilities alone when `neutral` is `offset`', () => {
    const entryPoint = file('neutral-offset.css', '@import "tailwindcss";\n@plugin "@nuxt/ui/colors" {\n  neutral: offset;\n}')
    expect(flagged(entryPoint, 'outline-offset-50')).toBe(false)
    expect(flagged(entryPoint, 'ring-offset-50')).toBe(false)
    expect(message(entryPoint, 'offset', 'bg-offset-100')).toContain('Use `bg-soft` instead')
  })

  // The classes `no-palette-colors` reports in `code`
  const lint = (code: string) => {
    const entryPoint = file('lint.css', '@import "tailwindcss";')
    const config = nuxtUI({ entryPoint, rules: { 'no-conflicting-classes': 'off' } })
    return new Linter().verify(code, config as Linter.Config[], 'columns.js').map(({ message }) => message.match(/^"([^"]+)"/)?.[1])
  }

  it('lints the `class` and `ui` of items and table columns', () => {
    expect(lint(`
      const items = [{ label: 'Delete', class: 'text-red-500', ui: { itemLabel: ['text-gray-500', ['text-sky-500']] } }]
      const button = h(UButton, { class: sorted ? 'bg-blue-500' : 'p-2' })
      const columns = [{ meta: { class: { th: 'text-amber-500' } }, columns: [{ meta: { class: { td: 'text-lime-500' } } }] }]
      const meta = { class: { tr: 'bg-green-500' } }
      const refItems = ref([{ class: 'text-pink-500' }])
      const computedItems = computed(() => [{ class: 'text-teal-500' }])
      const column = columnHelper.accessor('id', { meta: { class: { td: 'text-cyan-500' } } })
    `)).toEqual(['text-red-500', 'text-gray-500', 'text-sky-500', 'bg-blue-500', 'text-amber-500', 'text-lime-500', 'bg-green-500', 'text-pink-500', 'text-teal-500', 'text-cyan-500'])
  })

  it('lints the keys of a conditional `class`, minus the table\'s', () => {
    expect(lint(`
      const button = h(UButton, { class: { 'text-red-500': active, flex: true } })
      const items = [{ label: 'Delete', class: ['p-2', [{ 'text-gray-500': muted }]] }]
      const columns = [{ meta: { class: { th: 'p-2', td: 'p-2' } } }]
      const meta = { class: { tr: 'p-2' } }
    `)).toEqual(['text-red-500', 'text-gray-500'])
  })

  it('leaves other keys, styles, functions and the nested `ui` of options alone', () => {
    expect(lint(`
      const columns = [{ meta: { style: { th: 'color: red' }, class: { td: () => 'text-teal-500' } } }]
      const link = { label: 'text-rose-500', icon: 'i-lucide-text-red-500' }
      const options = { ui: { colors: { primary: 'text-red-500' } } }
      export default defineNuxtConfig({ ui: { prefix: 'text-red-500' } })
      const nuxtConfig = { ui: { prefix: 'text-red-500', tailwindPrefix: 'text-red-500', componentDetection: ['text-red-500'], scanPackages: ['text-red-500'] } }
    `)).toEqual([])
  })
})
