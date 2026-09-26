import { describe, it, expect } from 'vitest'
import { tv, engineFor, ComponentOverrides } from '../../src/runtime/utils/tv'

const tvt = tv as unknown as (theme: any, overrides?: any) => (props?: any) => Record<string, (props?: any) => string>

// What `useComponentOverrides` builds for a component in an app with `theme.prefix: 'tw'`
const withPrefix = (entry?: Record<string, any>, unstyled = false) => new ComponentOverrides(entry, unstyled, engineFor({ mergeConfig: { prefix: 'tw' } }, 'tw'))

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
    const ui = tvt(theme, withPrefix())({ size: 'lg' })

    expect(ui.base!()).toBe('tw:inline-flex tw:px-2 tw:text-base')
    expect(ui.label!()).toBe('tw:truncate tw:font-bold')
  })

  it('leaves the overrides and the call-site classes as written', () => {
    const ui = tvt(theme, withPrefix({ slots: { base: 'tw:px-4' } }))()

    expect(ui.base!({ class: 'tw:rounded-full' })).toBe('tw:inline-flex tw:text-sm tw:px-4 tw:rounded-full')
  })

  it('drops the theme classes when unstyled', () => {
    const ui = tvt(theme, withPrefix({ slots: { base: 'tw:px-4' } }, true))()

    expect(ui.base!()).toBe('tw:px-4')
  })

  it('shares one engine per merge config content and prefix', () => {
    expect(engineFor({ mergeConfig: { prefix: 'tw' } }, 'tw')).toBe(engineFor({ mergeConfig: { prefix: 'tw' } }, 'tw'))
    expect(engineFor({ mergeConfig: { prefix: 'tw' } }, 'tw')).not.toBe(engineFor({ mergeConfig: { prefix: 'tw' } }, 'ui'))
  })

  it('shares the engine of a merge config with deep class groups', () => {
    const config = () => ({ mergeConfig: { extend: { classGroups: { 'bg-img': [{ bg: ['none', { linear: [{ to: ['x'] }] }] }] } } } })

    expect(engineFor(config())).toBe(engineFor(config()))
  })

  it('leaves plain overrides unprefixed', () => {
    expect(tvt(theme)().base!()).toBe('inline-flex px-2 text-sm')
  })
})
