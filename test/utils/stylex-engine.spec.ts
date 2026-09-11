import { describe, it, expect } from 'vitest'
import button from '../../src/theme/button'
import { compileThemeClasses } from '../../src/engine/compile-theme'
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
    expect(result.compoundVariants.find((item: any) => item.loading && item.leading)?.class.leadingIcon).toMatch(/\bx[a-z0-9]+\b/)
  }, 60_000)
})
