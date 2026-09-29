import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { describe, it, expect, afterAll } from 'vitest'
import { findTailwindStylesheets, getTailwindPrefix } from '../../src/utils/tailwind'

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
    ['@import "tailwindcss-animate" prefix(tw);', undefined]
  ])('reads %j', (css, prefix) => {
    expect(getTailwindPrefix(css)).toBe(prefix)
  })
})

describe('findTailwindStylesheets', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nuxt-ui-tailwind-'))
  afterAll(() => rmSync(dir, { recursive: true, force: true }))

  const file = (name: string, css: string) => {
    writeFileSync(join(dir, name), css)
    return join(dir, name)
  }

  it('lists every stylesheet that imports Tailwind CSS, in order', async () => {
    const fonts = file('fonts.css', '@font-face { font-family: Inter; }')
    const main = file('main.css', '@import "tailwindcss" prefix(tw);')
    const other = file('other.css', '@import "tailwindcss";')

    expect((await findTailwindStylesheets([fonts, join(dir, 'missing.css'), main, other])).tailwind).toEqual([
      { path: main, prefix: 'tw' },
      { path: other, prefix: null }
    ])
  })

  it('follows relative and aliased imports', async () => {
    const tw = file('tw.css', '@import "tailwindcss" prefix(tw);')
    const relative = file('relative.css', '@import "./tw.css";\n@import "@nuxt/ui";')
    const aliased = file('aliased.css', '@import "~/tw.css";\n@import "@nuxt/ui";')

    expect(await findTailwindStylesheets([relative])).toEqual({ tailwind: [{ path: tw, prefix: 'tw' }], unresolved: [] })
    expect((await findTailwindStylesheets([aliased], { '~': dir })).tailwind).toEqual([{ path: tw, prefix: 'tw' }])
  })

  it('reports a stylesheet that imports Nuxt UI without a Tailwind CSS import it can find', async () => {
    const main = file('ui-only.css', '@import "#tailwind";\n@import "@nuxt/ui";')

    expect(await findTailwindStylesheets([main])).toEqual({ tailwind: [], unresolved: [main] })
    expect(await findTailwindStylesheets([file('fonts.css', '@font-face { font-family: Inter; }')])).toEqual({ tailwind: [], unresolved: [] })
  })
})
