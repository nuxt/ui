import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { describe, it, expect, afterAll } from 'vitest'
import { findAddedColors, findTailwindPrefix, getAddedColors, getColorsDeclaration, getTailwindLayer, getTailwindPrefix } from '../../src/utils/tailwind'

describe('getTailwindPrefix', () => {
  it.each([
    ['@import "tailwindcss" prefix(tw);', 'tw'],
    ['@import \'tailwindcss\' source(none) prefix( ui );', 'ui'],
    ['@import "tailwindcss/theme.css" layer(theme) prefix(tw);\n@import "tailwindcss/utilities.css" layer(utilities);', 'tw'],
    ['@import "tailwindcss/utilities.css" layer(utilities);\n@import "tailwindcss/theme.css" layer(theme) prefix(tw);', 'tw'],
    ['@import "tailwindcss/theme.css" layer(theme);\n@import "tailwindcss/utilities.css" layer(utilities) prefix(tw);', null],
    ['@import "tailwindcss";\n@import "@nuxt/ui";', null],
    ['@import "tailwindcss";\n/* @import "tailwindcss" prefix(tw); */', null],
    ['@import url("tailwindcss") prefix(tw);', 'tw'],
    ['@import "@nuxt/ui";', undefined],
    ['@import "tailwindcss/preflight.css" layer(base);', undefined],
    ['@import "tailwindcss-animate" prefix(tw);', undefined]
  ])('reads %j', (css, prefix) => {
    expect(getTailwindPrefix(css)).toBe(prefix)
  })
})

describe('getTailwindLayer', () => {
  it.each([
    ['@import "tailwindcss" layer(framework);', 'framework'],
    ['@import "tailwindcss/index.css" layer(app.framework) prefix(tw);', 'app.framework'],
    ['@import "tailwindcss/theme.css" layer(theme);\n@import "tailwindcss/utilities.css" layer(utilities);', undefined],
    ['@import "tailwindcss";', undefined]
  ])('reads %j', (css, layer) => {
    expect(getTailwindLayer(css)).toBe(layer)
  })
})

describe('findTailwindPrefix', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nuxt-ui-tailwind-'))
  afterAll(() => rmSync(dir, { recursive: true, force: true }))

  const file = (name: string, css: string) => {
    writeFileSync(join(dir, name), css)
    return join(dir, name)
  }

  it('skips a stylesheet that only imports Tailwind CSS\'s preflight', async () => {
    const preflight = file('preflight.css', '@import "tailwindcss/preflight.css" layer(base);')
    const main = file('main-tw.css', '@import "tailwindcss" prefix(tw);')

    expect(await findTailwindPrefix([preflight, main])).toMatchObject({ path: main, prefix: 'tw' })
  })

  it('reads the first stylesheet that imports Tailwind CSS', async () => {
    const fonts = file('fonts.css', '@font-face { font-family: Inter; }')
    const main = file('main.css', '@import "tailwindcss" prefix(tw);')
    const other = file('other.css', '@import "tailwindcss";')

    expect(await findTailwindPrefix([fonts, join(dir, 'missing.css'), main, other])).toEqual({ path: main, prefix: 'tw' })
  })

  it('follows relative imports', async () => {
    mkdirSync(join(dir, 'nested'), { recursive: true })
    const tailwind = file('nested/tailwind.css', '@import "tailwindcss" prefix(tw);')
    file('nested/index.css', '@import "../loop.css";\n@import "./tailwind.css";')
    const loop = file('loop.css', '@import "~/assets/alias.css";\n@import "./nested/index.css";')

    expect(await findTailwindPrefix([loop])).toEqual({ path: tailwind, prefix: 'tw' })
  })

  it('is undefined when no stylesheet imports Tailwind CSS', async () => {
    expect(await findTailwindPrefix([file('fonts.css', '@font-face { font-family: Inter; }')])).toBeUndefined()
  })
})

describe('getAddedColors', () => {
  it.each([
    ['@plugin "@nuxt/ui/colors" {\n  primary: indigo;\n  tertiary: indigo 600 400;\n  brand-dark: brand;\n}', ['tertiary', 'brand-dark']],
    ['@plugin \'@nuxt/ui/colors\' { tertiary: indigo; quaternary: teal }', ['tertiary', 'quaternary']],
    ['@plugin "@nuxt/ui/colors" {\n  /* tertiary: indigo; */\n  secondary: violet;\n}', []],
    ['@plugin "@nuxt/ui/colors" { Tertiary: indigo; }', []],
    ['@plugin "@nuxt/ui/colors";', []],
    ['@plugin "./my-plugin" { tertiary: indigo; }', []]
  ])('reads %j', (css, names) => {
    expect(getAddedColors(css)).toEqual(names)
  })
})

describe('findAddedColors', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nuxt-ui-colors-'))
  afterAll(() => rmSync(dir, { recursive: true, force: true }))

  it('reads every stylesheet and the ones they import', async () => {
    mkdirSync(join(dir, 'theme'), { recursive: true })
    writeFileSync(join(dir, 'theme/colors.css'), '@plugin "@nuxt/ui/colors" { tertiary: indigo; }')
    writeFileSync(join(dir, 'main.css'), '@import "tailwindcss";\n@import "./theme/colors.css";\n@import "./main.css";')
    writeFileSync(join(dir, 'other.css'), '@plugin "@nuxt/ui/colors" { tertiary: teal; brand: blue; }')

    expect(await findAddedColors([join(dir, 'main.css'), join(dir, 'missing.css'), join(dir, 'other.css')])).toEqual(['tertiary', 'brand'])
  })
})

describe('getColorsDeclaration', () => {
  it('augments `UIColors` with the added colors', () => {
    expect(getColorsDeclaration(['tertiary', 'brand-dark'])).toBe(`declare module '@nuxt/ui' {
  interface UIColors {
    "tertiary": true
    "brand-dark": true
  }
}
`)
  })

  it('is empty without one', () => {
    expect(getColorsDeclaration([])).toBe('')
  })
})
