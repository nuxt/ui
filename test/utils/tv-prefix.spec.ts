import { describe, it, expect, vi } from 'vitest'
import { tv } from '../../src/runtime/utils/tv'

vi.mock('#build/app.config', () => ({
  default: { ui: { prefix: 'tw', tv: { mergeConfig: { prefix: 'tw' } } } }
}))

const tvt = tv as unknown as (theme: any, overrides?: any) => (props?: any) => Record<string, (props?: any) => string>

describe('tv with a Tailwind prefix', () => {
  const theme = {
    slots: { base: 'inline-flex px-2', label: 'truncate' },
    variants: {
      size: { md: { base: 'text-sm' }, lg: { base: 'text-base' } }
    },
    compoundVariants: [{ size: 'lg', class: { label: 'font-bold' } }],
    defaultVariants: { size: 'md' }
  }

  it('prefixes the theme classes', () => {
    const ui = tvt(theme)({ size: 'lg' })

    expect(ui.base!()).toBe('tw:inline-flex tw:px-2 tw:text-base')
    expect(ui.label!()).toBe('tw:truncate tw:font-bold')
  })

  it('leaves the overrides and the call-site classes as written', () => {
    const ui = tvt(theme, { slots: { base: 'tw:px-4' } })()

    expect(ui.base!({ class: 'tw:rounded-full' })).toBe('tw:inline-flex tw:text-sm tw:px-4 tw:rounded-full')
  })

  it('drops the theme classes when unstyled', () => {
    const ui = tvt(theme, { unstyled: true, slots: { base: 'tw:px-4' } })()

    expect(ui.base!()).toBe('tw:px-4')
  })
})
