import { describe, it, expect } from 'vitest'
import * as theme from '../../src/theme'
import * as themeProse from '../../src/theme/prose'
import * as themeContent from '../../src/theme/content'
import { defaultOptions, resolveColors } from '../../src/utils/defaults'

const options = { ...defaultOptions, theme: { ...defaultOptions.theme, colors: resolveColors(undefined) } }

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)

const themes = [
  ...Object.entries(theme).map(([key, value]) => [key, value] as const),
  ...Object.entries(themeProse).map(([key, value]) => [`prose.${key}`, value] as const),
  ...Object.entries(themeContent).map(([key, value]) => [`content.${key}`, value] as const)
]
  .map(([key, value]) => [key, typeof value === 'function' ? (value as (options: any) => unknown)(options) : value] as const)
  .filter((entry): entry is readonly [string, Record<string, any>] => isObject(entry[1]) && ('slots' in entry[1] || 'base' in entry[1] || 'variants' in entry[1]))

/**
 * The shape the engine resolves: classes always sit under a slot. A bare class
 * is ignored at runtime, and the theme types can't reject it (the `''` of a
 * value that contributes nothing widens to `string`), so it is caught here.
 * `v4` writes them bare, where they meant the `base` slot, which is how they
 * come back after a sync: wrap them, `class: 'ps-7'` to `class: { base: 'ps-7' }`,
 * with `root` on a theme that has no `base` slot.
 */
describe('theme slots', () => {
  it.each(themes)('%s declares its classes under slots', (_, resolved) => {
    expect(resolved.base, 'a top-level `base` is not read, declare `slots: { base }` or `slots: { root }`').toBeUndefined()
    expect(Object.keys(resolved.slots ?? {}).length).toBeGreaterThan(0)
  })

  it.each(themes)('%s gives every variant and compound class per slot', (_, resolved) => {
    const slots = Object.keys(resolved.slots ?? {})
    const problems: string[] = []
    const check = (where: string, value: unknown) => {
      if (!value) {
        return
      }
      if (!isObject(value)) {
        problems.push(`${where} is a bare class: ${JSON.stringify(value)}`)
        return
      }
      for (const key of Object.keys(value)) {
        if (!slots.includes(key)) {
          problems.push(`${where} targets \`${key}\`, which is not a slot`)
        } else if (isObject(value[key])) {
          problems.push(`${where}.${key} is an object, expected classes`)
        }
      }
    }

    for (const [group, values] of Object.entries<Record<string, unknown>>(resolved.variants ?? {})) {
      for (const [key, value] of Object.entries(values ?? {})) {
        check(`variants.${group}.${key}`, value)
      }
    }
    for (const [index, compound] of [resolved.compoundVariants ?? []].flat(Infinity).entries()) {
      check(`compoundVariants[${index}].class`, (compound as Record<string, unknown>)?.class)
    }

    expect(problems, 'give each class per slot, e.g. `{ base: \'...\' }`').toEqual([])
  })
})
