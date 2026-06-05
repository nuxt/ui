import { describe, it, expect } from 'vitest'
import { tv } from '../../src/runtime/utils/tv'

// Cast to a permissive local signature: the strongly-typed `tv` is what
// components rely on, whereas these tests exercise the runtime wrapper with
// inline themes and the `(defaults) => classes` replacer form.
const tvt = tv as unknown as (config?: any) => (variants?: any) => {
  base: (props?: any) => string
  label: (props?: any) => string
}

describe('tv class replace', () => {
  const theme = {
    slots: { base: 'inline-flex rounded-md text-sm', label: 'truncate' },
    variants: {
      color: { primary: { base: 'bg-primary text-inverted' } },
      size: { md: { base: 'px-2.5 text-sm' } }
    },
    compoundVariants: [{ color: 'primary', size: 'md', class: { base: 'gap-1.5' } }],
    defaultVariants: { color: 'primary', size: 'md' }
  }

  const build = () => tvt({ extend: tvt(theme) })({ color: 'primary', size: 'md' })

  it('keeps merging plain string classes (no regression)', () => {
    const ui = build()
    expect(ui.label({ class: 'font-bold' })).toBe('truncate font-bold')
    // A conflicting utility is still resolved by tailwind-merge.
    const base = ui.base({ class: 'text-lg' })
    expect(base).toContain('text-lg')
    expect(base).not.toContain('text-sm')
  })

  it('keeps `extend` working through the wrapper (full chain resolves)', () => {
    const base = build().base()
    expect(base).toContain('inline-flex')
    expect(base).toContain('bg-primary')
    expect(base).toContain('px-2.5')
    expect(base).toContain('gap-1.5')
  })

  it('replaces a slot via a function in `:ui` and drops the defaults', () => {
    expect(build().label({ class: () => 'text-3xl font-bold' })).toBe('text-3xl font-bold')
  })

  it('passes the resolved default classes to the replacer', () => {
    let received: string | undefined
    build().label({ class: (defaults: string) => {
      received = defaults
      return 'whatever'
    } })
    expect(received).toBe('truncate')
  })

  it('keeps plain classes passed alongside the replacer', () => {
    expect(build().label({ class: [() => 'text-3xl', 'opacity-50'] })).toBe('text-3xl opacity-50')
  })

  it('detects a replacer as a scalar value (the `transformUI` path)', () => {
    expect(build().base({ class: () => 'block w-full' })).toBe('block w-full')
  })

  it('detects a replacer in the `className` alias', () => {
    expect(build().label({ className: () => 'text-3xl' })).toBe('text-3xl')
  })

  it('applies a construction-time replacer from `app.config.ui` slots', () => {
    const ui = tvt({ extend: tvt(theme), slots: { label: () => 'text-xl' } })({ color: 'primary', size: 'md' })
    expect(ui.label()).toBe('text-xl')
    // A sibling slot keeps its defaults.
    expect(ui.base()).toContain('inline-flex')
  })

  it('lets a call-time `:ui` replacer win over an `app.config.ui` one', () => {
    const ui = tvt({ extend: tvt(theme), slots: { label: () => 'from-config' } })({ color: 'primary', size: 'md' })
    expect(ui.label({ class: () => 'from-ui' })).toBe('from-ui')
  })
})
