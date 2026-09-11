import { describe, it, expect } from 'vitest'
import button from '../../src/theme/button'
import { compileThemeClasses } from '../../src/engine/compile-theme'
import { extractUiFromAppConfigSource } from '../../src/engine/extract-app-config'
import { defaultOptions, resolveColors } from '../../src/utils/defaults'

describe('stylex engine', () => {
  it('compiles theme class strings to hashed classes and keeps scalar slots', async () => {
    const result = await compileThemeClasses(button({
      ...defaultOptions,
      theme: { ...defaultOptions.theme, colors: resolveColors(undefined) }
    } as any), 'ui-button')

    const base = Array.isArray(result.slots.base) ? result.slots.base.join(' ') : result.slots.base
    expect(base).not.toContain('rounded-md')
    expect(base).toMatch(/\bx[a-z0-9]+\b/)
    expect(result.variants.size.md.leadingAvatarSize).toBe('2xs')
    expect(result.defaultVariants.color).toBe('primary')
    const leading = result.compoundVariants.find((item: any) => item.loading && item.leading)?.class
    expect(typeof leading === 'object' && leading && 'leadingIcon' in leading ? leading.leadingIcon : '').toMatch(/\bx[a-z0-9]+\b/)
  }, 60_000)

  it('extracts app.config ui overrides when class strings contain braces', () => {
    const source = `
      export default defineAppConfig({
        ui: {
          button: {
            slots: {
              base: "rounded-md before:content-['}'] extra-class"
            }
          }
        }
      })
    `
    const naive = source.slice(source.indexOf('{', source.indexOf('ui:')))
    const naiveEnd = naive.indexOf('}')
    expect(naive.slice(0, naiveEnd + 1)).not.toContain('extra-class')

    const extracted = extractUiFromAppConfigSource(source)
    expect(extracted).toEqual({
      button: {
        slots: {
          base: 'rounded-md before:content-[\'}\'] extra-class'
        }
      }
    })
  })
})
