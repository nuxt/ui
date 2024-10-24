import { describe, expect, it } from 'vitest'
import defaultColors from 'tailwindcss/colors'
import type { Config as TWConfig } from 'tailwindcss'
import { excludeColors, generateSafelist, setGlobalColors } from '../src/runtime/utils/colors'

describe('excludeColors', () => {
  it('should exclude colors from the list', () => {
    const twColors = {
      red: defaultColors.red,
      zinc: defaultColors.zinc,
      blue: defaultColors.blue
    }
    expect(excludeColors(twColors).join(',')).toBe('red,blue')
  })
})

describe('generateSafelist', () => {
  it.each([
    /* format:
     name,
     tailwindcss config, safelistColors,
     expected safelistPatterns (add "!" before a pattern to negate it)
    */
    [
      'default safelist',
      {}, [],
      ['^bg-(primary)-50$', '^bg-(red)-500$'] // these both should be in the safelist
    ],
    [
      'safelisting single new color',
      {}, ['myColor'],
      '^bg-(myColor|primary)-50$'
    ],
    [
      'reducing amount of theme colors',
      { theme: { colors: { plainBlue: '#00F' } } }, ['plainBlue'],
      ['^bg-(plainBlue|primary)-50$', '!', /orange/] // the word "orange" should _not_ be found in any safelist pattern
    ]
  ])('%s', async (_description, tailwindConfig: Partial<TWConfig>, safelistColors, safelistPatterns) => {
    safelistColors.push('primary')
    tailwindConfig.theme = tailwindConfig.theme || {}
    tailwindConfig.theme.extend = tailwindConfig.theme.extend || {}
    tailwindConfig.theme.extend.colors = tailwindConfig.theme.extend.colors || {}

    const safelistConfig = generateSafelist(safelistColors, setGlobalColors(tailwindConfig.theme))

    expect.extend({
      toBeRegExp: (received, expected) => {
        if (typeof expected === 'string' || expected instanceof String) {
          return {
            message: () => `expected ${received} to be exact regex ${expected}`,
            pass: received.toString() === RegExp(expected as string).toString()
          }
        } else if (expected instanceof RegExp) {
          return {
            message: () => `expected ${received} to be a regex like ${expected.toString()}`,
            pass: received.toString().match(expected)
          }
        }
        return {
          message: () => `expected ${received} to be a regex`,
          pass: false
        }
      }
    })

    safelistPatterns = Array.isArray(safelistPatterns) ? safelistPatterns : [safelistPatterns]

    let negate = false
    for (const safelistPattern of safelistPatterns) {
      if (safelistPattern === '!') {
        // negate next!
        negate = true
        continue
      }
      if (negate) {
        expect(safelistConfig).not.toContainEqual({
          pattern: expect.toBeRegExp(safelistPattern)
        })
      } else {
        expect(safelistConfig).toContainEqual({
          pattern: expect.toBeRegExp(safelistPattern)
        })
      }
      negate = false
    }
  })
})
