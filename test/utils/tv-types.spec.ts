import { describe, it, expectTypeOf } from 'vitest'
import { tv } from '../../src/runtime/utils/tv'

// Inference is the half the snapshot suite can't prove: it breaks in user-land
// (`app.config.ui` autocomplete, `ComponentConfig`-derived props) rather than in
// CI. These assertions are checked by `vue-tsc`, not at runtime.

const button = {
  slots: {
    base: 'inline-flex rounded-md',
    label: 'truncate'
  },
  variants: {
    size: {
      sm: { base: 'text-sm' },
      md: { base: 'text-base' }
    },
    block: {
      true: { base: 'w-full' }
    }
  },
  compoundVariants: [{ size: 'sm' as const, block: true, class: { base: 'gap-1' } }],
  defaultVariants: { size: 'md' as const }
}

describe('tv types', () => {
  it('returns one function per slot', () => {
    const ui = tv({ extend: tv(button) })()

    expectTypeOf(ui.base()).toEqualTypeOf<string>()
    expectTypeOf(ui.label()).toEqualTypeOf<string>()
    // @ts-expect-error a slot the theme doesn't declare
    expectTypeOf(ui.trailing).toBeNever()
  })

  it('returns a string for a theme with no slots', () => {
    const ui = tv({ extend: { base: 'w-full mx-auto' } })()

    expectTypeOf(ui).toEqualTypeOf<string>()
  })

  it('keeps both sides of an extend chain callable', () => {
    const ui = tv({ extend: tv(button), slots: { icon: 'size-5' } })()

    expectTypeOf(ui.base()).toEqualTypeOf<string>()
    expectTypeOf(ui.icon()).toEqualTypeOf<string>()
  })

  it('keeps the slots when app config overrides are spread in', () => {
    const appConfig = { slots: { base: 'shadow-sm' } }
    const ui = tv({ extend: tv(button), ...appConfig })()

    expectTypeOf(ui.base()).toEqualTypeOf<string>()
    expectTypeOf(ui.label()).toEqualTypeOf<string>()
  })

  it('types invocation props from the declared variants', () => {
    const component = tv({ extend: tv(button) })

    component({ size: 'sm' })
    // a variant keyed `true` reads as a boolean
    component({ block: true })
    // @ts-expect-error `lg` is not a declared size
    component({ size: 'lg' })
  })

  it('checks defaultVariants against the declared variants', () => {
    tv({ extend: tv(button), defaultVariants: { size: 'sm', block: false } })
    // @ts-expect-error `lg` is not a declared size
    tv({ extend: tv(button), defaultVariants: { size: 'lg' } })
  })

  it('accepts one value or several in compoundVariants', () => {
    tv({
      extend: tv(button),
      compoundVariants: [
        { size: 'sm', class: { base: 'gap-1' } },
        { size: ['sm', 'md'], block: true, class: { label: 'sr-only' } }
      ]
    })
  })

  it('carries the theme metadata that `extend` reads', () => {
    const component = tv(button)

    expectTypeOf(component.slots).toEqualTypeOf<typeof button.slots>()
    expectTypeOf(component.variants).toEqualTypeOf<typeof button.variants>()
  })
})
