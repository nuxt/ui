import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { describe, it, expect, afterAll } from 'vitest'
import { findTailwindPrefix, getTailwindPrefix } from '../../src/utils/tailwind'

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

describe('findTailwindPrefix', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nuxt-ui-tailwind-'))
  afterAll(() => rmSync(dir, { recursive: true, force: true }))

  const file = (name: string, css: string) => {
    writeFileSync(join(dir, name), css)
    return join(dir, name)
  }

  it('reads the first stylesheet that imports Tailwind CSS', async () => {
    const fonts = file('fonts.css', '@font-face { font-family: Inter; }')
    const main = file('main.css', '@import "tailwindcss" prefix(tw);')
    const other = file('other.css', '@import "tailwindcss";')

    expect(await findTailwindPrefix([fonts, join(dir, 'missing.css'), main, other])).toEqual({ path: main, prefix: 'tw' })
  })

  it('is undefined when no stylesheet imports Tailwind CSS', async () => {
    expect(await findTailwindPrefix([file('fonts.css', '@font-face { font-family: Inter; }')])).toBeUndefined()
  })
})
