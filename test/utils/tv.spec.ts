import { describe, it, expect, expectTypeOf } from 'vitest'
import { tv } from '../../src/runtime/utils/tv'
import type { VariantProps } from '../../src/runtime/types/tv'

// Cast to a permissive local signature: the strongly-typed `tv` is what
// components rely on, whereas these tests exercise the engine at runtime with
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
  // Mirrors a component config with `app.config.ui` slot overrides spread in.
  const buildWith = (slots: any) => tvt({ extend: theme, slots })({ color: 'primary', size: 'md' })

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

  it('applies a construction-time replacer from `app.config.ui` slots', () => {
    const ui = buildWith({ label: () => 'text-xl' })
    expect(ui.label()).toBe('text-xl')
    // A sibling slot keeps its defaults.
    expect(ui.base()).toContain('inline-flex')
  })

  it('keeps the variants merging on top of a construction-time replacer', () => {
    const base = buildWith({ base: () => 'block w-full' }).base()
    // The slot's own theme classes are gone…
    expect(base).not.toContain('inline-flex')
    expect(base).not.toContain('rounded-md')
    expect(base).toContain('block')
    expect(base).toContain('w-full')
    // …but variants and compound variants still apply (#6800).
    expect(base).toContain('bg-primary')
    expect(base).toContain('px-2.5')
    expect(base).toContain('gap-1.5')
  })

  it('passes only the slot own classes to a construction-time replacer', () => {
    let received: string | undefined
    buildWith({ base: (defaults: string) => {
      received = defaults
      return 'whatever'
    } }).base()
    expect(received).toBe('inline-flex rounded-md text-sm')
  })

  it('hands an empty chain to a call-time replacer as an empty string', () => {
    const ui = tvt({ extend: { slots: { base: '', label: 'truncate' } } })()
    expect(ui.base({ class: (defaults: string) => `${defaults}text-xl` })).toBe('text-xl')
  })

  it('keeps a construction-time replacer merging classes passed at call time', () => {
    expect(buildWith({ label: () => 'text-xl' }).label({ class: 'font-bold' })).toBe('text-xl font-bold')
  })

  it('resolves a construction-time replacer when `extend` is a tv result', () => {
    // Components pass the generated theme object, but `extend` also accepts a
    // `tv()` return, which exposes the same `slots` / `base` properties.
    const ui = tvt({ extend: tvt(theme), slots: { base: () => 'block' } })({ color: 'primary', size: 'md' })
    const base = ui.base()
    expect(base).not.toContain('inline-flex')
    expect(base).toContain('block')
    expect(base).toContain('bg-primary')
  })

  it('lets a call-time `:ui` replacer win over an `app.config.ui` one', () => {
    expect(buildWith({ label: () => 'from-config' }).label({ class: () => 'from-ui' })).toBe('from-ui')
  })

  it('replaces the base slot through a function forwarded in the class array', () => {
    // Mirrors how components forward `class: [props.ui?.base, props.class]`.
    expect(build().base({ class: [undefined, () => 'block w-full'] })).toBe('block w-full')
  })

  it('lets the last replacer win when several are forwarded in the class array', () => {
    // Mirrors `[props.ui?.base, props.class]` with both set: `class` wins, like twMerge.
    expect(build().base({ class: [() => 'block', () => 'w-full'] })).toBe('w-full')
  })
})

describe('tv class replace (slotless component)', () => {
  // A slotless theme has only a `base` and no `slots`, so `tv()(props)` returns
  // a string rather than an object of slot functions (e.g. the Container theme).
  const tvBase = tv as unknown as (config?: any) => (props?: any) => string
  const build = () => tvBase({ extend: tvBase({ base: 'inline-flex rounded-md px-4' }) })

  it('still merges plain classes', () => {
    const result = build()({ class: 'font-bold' })
    expect(result).toContain('inline-flex')
    expect(result).toContain('font-bold')
  })

  it('replaces the base through a function in `:ui` / `class`', () => {
    expect(build()({ class: () => 'block w-full' })).toBe('block w-full')
  })

  it('replaces the base through a `:ui` function forwarded in the class array', () => {
    // Mirrors how a slotless component forwards `class: [props.ui?.base, props.class]`.
    expect(build()({ class: [() => 'block w-full', undefined] })).toBe('block w-full')
  })

  it('passes the resolved default classes to the replacer', () => {
    let received: string | undefined
    build()({ class: (defaults: string) => {
      received = defaults
      return 'whatever'
    } })
    expect(received).toContain('inline-flex')
  })

  it('applies a construction-time `base` replacer from `app.config.ui`', () => {
    const ui = tvBase({ extend: tvBase({ base: 'inline-flex px-4' }), base: () => 'block' })
    expect(ui()).toBe('block')
  })
})

describe('tv slot memoization', () => {
  const theme = {
    slots: { base: 'inline-flex text-sm', label: 'truncate' },
    variants: {
      active: {
        true: { base: 'font-bold' },
        false: { base: 'font-light' }
      }
    }
  }

  const build = () => tvt({ extend: tvt(theme) })()

  // Counts how often the `active` variant is read. Building the cache key reads
  // it a fixed number of times per call, so a call served from the cache reads
  // it strictly fewer times than one that runs the slot, without either test
  // having to pin the exact counts.
  function countingProps(active: boolean) {
    const counter = { reads: 0 }
    const props = {
      get active() {
        counter.reads++
        return active
      }
    }
    return [props, counter] as const
  }

  it('runs the slot once for repeated identical args', () => {
    const ui = build()
    const [props, counter] = countingProps(true)

    expect(ui.base(props)).toContain('font-bold')
    const miss = counter.reads

    counter.reads = 0
    expect(ui.base(props)).toContain('font-bold')
    expect(counter.reads).toBeLessThan(miss)
  })

  it('caches a slot whose chain resolves to no classes', () => {
    // `tv` returns `undefined` for such a slot rather than `''`, so it can't
    // double as the "not cached yet" sentinel (`navigation-menu` has two).
    const ui = tvt({ extend: tvt({ slots: { base: '' }, variants: { active: { true: { base: 'font-bold' }, false: {} } } }) })()
    const [props, counter] = countingProps(false)

    expect(ui.base(props)).toBeUndefined()
    const miss = counter.reads

    counter.reads = 0
    expect(ui.base(props)).toBeUndefined()
    expect(counter.reads).toBeLessThan(miss)
  })

  it('returns correct output for repeated identical args', () => {
    const ui = build()
    const first = ui.base({ active: true, class: 'p-2' })
    expect(ui.base({ active: true, class: 'p-2' })).toBe(first)
    expect(first).toContain('font-bold')
    expect(first).toContain('p-2')
  })

  it('never shares entries across distinct args', () => {
    const ui = build()
    expect(ui.base({ active: true })).toContain('font-bold')
    expect(ui.base({ active: false })).toContain('font-light')
    expect(ui.base({ active: true, class: 'p-2' })).toContain('p-2')
    expect(ui.base({ active: true })).not.toContain('p-2')
    // String and array class forms resolve to the same output independently.
    expect(ui.base({ class: ['p-2', undefined] })).toContain('p-2')
  })

  it('treats an `undefined`-valued key the same as an absent one', () => {
    const ui = build()
    expect(ui.base({ active: undefined, class: 'p-2' })).toBe(ui.base({ class: 'p-2' }))
  })

  it('returns identical output for reordered keys (a cache miss, not a shared entry)', () => {
    const ui = build()
    expect(ui.base({ active: true, class: 'p-2' })).toBe(ui.base({ class: 'p-2', active: true }))
  })

  it('does not share entries between NaN and null variant values', () => {
    const ui = tvt({ extend: tvt(theme), defaultVariants: { active: true } })()
    // Both serialize to `"null"`, but tv resolves `null` to the default variant
    // while NaN falls through the `key || "false"` lookup.
    expect(ui.base({ active: Number.NaN })).toContain('font-light')
    expect(ui.base({ active: null })).toContain('font-bold')
  })

  it('does not poison the cache through clsx object classes', () => {
    const ui = build()
    // Object classes bail out of the memo but still resolve...
    expect(ui.label({ class: { 'font-bold': true, 'opacity-50': false } })).toBe('truncate font-bold')
    // ...and cached plain calls before/after stay independent.
    expect(ui.label({})).toBe('truncate')
    expect(ui.label({ class: { 'font-bold': false } })).toBe('truncate')
  })

  it('does not poison the cache through replacers', () => {
    const ui = build()
    expect(ui.label({ class: 'p-2' })).toBe('truncate p-2')
    expect(ui.label({ class: () => 'block' })).toBe('block')
    expect(ui.label({ class: 'p-2' })).toBe('truncate p-2')
  })

  it('falls back to the uncached path for a cyclic array', () => {
    const ui = build()
    const cyclic: any[] = ['p-2']
    cyclic.push(cyclic)
    // tv resolves this to the default variant (`String(cyclic)` matches no key),
    // so keying it must stop recursing rather than blow the stack.
    expect(() => ui.base({ active: cyclic })).not.toThrow()
  })

  it('keeps each slot cache bounded without dropping the previous generation', () => {
    const ui = build()
    const counter = { reads: 0 }
    const props = (i: number) => ({
      class: `w-[${i}px]`,
      get active() {
        counter.reads++
        return true
      }
    })

    // 256 entries per generation: 600 distinct keys rotate twice, so 0..255 are
    // gone, 256..511 sit in the previous generation and 512..599 in the current.
    for (let i = 0; i < 600; i++) {
      ui.base(props(i))
    }

    counter.reads = 0
    expect(ui.base(props(599))).toContain('w-[599px]')
    const hit = counter.reads

    // A previous-generation entry is still a hit (and promoted).
    counter.reads = 0
    expect(ui.base(props(300))).toContain('w-[300px]')
    expect(counter.reads).toBe(hit)

    // Entry 0 went with the second rotation and has to be resolved again.
    counter.reads = 0
    expect(ui.base(props(0))).toContain('w-[0px]')
    expect(counter.reads).toBeGreaterThan(hit)
  })

  it('does not share an entry between a `null` slot prop and different invocation props', () => {
    // A `null` slot prop falls through to the invocation prop, and the cache is
    // shared by every invocation of the same theme, so the key has to carry it.
    // Only a plain object `extend` takes the shared path components use.
    const shared = { slots: { base: 'inline-flex' }, variants: { size: { sm: { base: 'text-sm' }, lg: { base: 'text-lg' } } } }
    expect(tvt({ extend: shared })({ size: 'sm' }).base({ size: null })).toContain('text-sm')
    expect(tvt({ extend: shared })({ size: 'lg' }).base({ size: null })).toContain('text-lg')
    // The other direction: `null` at the invocation with the key absent from
    // the slot call resolves to nothing, not to the entry above.
    expect(tvt({ extend: shared })({ size: null }).base({})).not.toContain('text-')
  })

  it('does not confuse a `null` slot prop with an absent one for compound matching', () => {
    const shared = {
      slots: { base: 'inline-flex' },
      variants: { size: { sm: { base: 'text-sm' } } },
      compoundVariants: [{ size: 'sm', class: { base: 'gap-1' } }]
    }
    // Present as `null`: the variant falls through to `sm`, the compound sees `null`.
    expect(tvt({ extend: shared })({ size: 'sm' }).base({ size: null })).toBe('inline-flex text-sm')
    expect(tvt({ extend: shared })({ size: 'sm' }).base({})).toBe('inline-flex text-sm gap-1')
  })

  it('keys values that contain the separators', () => {
    // Tailwind arbitrary values carry `,`, `"` and `;`, so the key can't rely on
    // them as delimiters.
    const ui = build()
    expect(ui.base({ class: ['a', 'b'] })).toContain('a b')
    expect(ui.base({ class: ['a,"b'] })).toContain('a,"b')
    expect(ui.base({ class: ['a,"b'] })).not.toContain('a b')

    const shared = { slots: { base: 'x' }, variants: { a: { 'p-1': { base: 'A1' } }, b: { 'p-2': { base: 'B2' }, 'p-2;"p-3': { base: 'BX' } } } }
    expect(tvt({ extend: shared })({ a: 'p-1', b: 'p-2;"p-3' }).base()).toBe('x A1 BX')
    expect(tvt({ extend: shared })({ a: 'p-1;"p-2', b: 'p-3' }).base()).toBe('x')
  })

  it('does not confuse a value ending in `!` with an undefined slot prop', () => {
    const shared = { slots: { base: 'x' }, variants: { size: { 'md': { base: 'text-md' }, 'md!': { base: 'BANG' } } } }
    expect(tvt({ extend: shared })({ size: 'md' }).base({ size: undefined })).toBe('x text-md')
    expect(tvt({ extend: shared })({ size: 'md!' }).base({})).toBe('x BANG')
  })

  it('accepts `null` as the slot argument', () => {
    const ui = build()
    expect(ui.base(null)).toBe(ui.base())
  })

  it('reads inherited enumerable slot props like own ones', () => {
    const ui = build()
    // An inherited `class` resolves like an own one, so the key has to see it
    // too, or this would cache a `font-bold` result under the same key as `{}`.
    expect(ui.label(Object.create({ class: 'font-bold' }))).toBe('truncate font-bold')
    expect(ui.label({})).toBe('truncate')
    // The same holds for a variant key, on both the variant and compound side.
    const shared = {
      slots: { base: 'x' },
      variants: { active: { true: { base: 'font-bold' } } },
      compoundVariants: [{ active: true, class: { base: 'ring' } }]
    }
    expect(tvt({ extend: shared })().base(Object.create({ active: true }))).toBe('x font-bold ring')
  })
})

describe('tv variant merging', () => {
  const theme = {
    slots: { base: 'inline-flex', label: 'truncate' },
    variants: {
      size: {
        md: { base: 'text-base', label: 'leading-5' }
      }
    },
    defaultVariants: { size: 'md' }
  }

  it('reads a plain override over a per-slot value as its `base`', () => {
    // `app.config.ui.<c>.variants.size.md = 'text-lg'` over a theme's
    // `{ base, label }` used to resolve to `"[object Object] text-lg"`.
    const ui = tvt({ extend: theme, variants: { size: { md: 'text-lg' } } })()
    expect(ui.base()).toBe('inline-flex text-lg')
    expect(ui.label()).toBe('truncate leading-5')
  })

  it('reads an array override over a per-slot value as its `base`', () => {
    // The array form used to leak the per-slot object's keys as classes.
    const ui = tvt({ extend: theme, variants: { size: { md: ['text-lg'] } } })()
    expect(ui.base()).toBe('inline-flex text-lg')
    expect(ui.base()).not.toContain('label')
  })

  it('merges two per-slot values slot by slot', () => {
    const ui = tvt({ extend: theme, variants: { size: { md: { label: 'font-medium' } } } })()
    expect(ui.base()).toBe('inline-flex text-base')
    expect(ui.label()).toBe('truncate leading-5 font-medium')
  })

  it('applies an array variant value to `base` in a slotted theme', () => {
    const ui = tvt({ extend: { slots: { base: 'x', label: 'y' }, variants: { size: { sm: ['text-sm', 'p-1'] } } } })({ size: 'sm' })
    expect(ui.base()).toBe('x text-sm p-1')
    expect(ui.label()).toBe('y')
  })

  it('resolves a per-slot value in a slotless theme through `base`', () => {
    const tvBase = tv as unknown as (config?: any) => (props?: any) => string | undefined
    const ui = tvBase({ extend: { base: 'x', variants: { size: { md: { base: 'text-md' } } }, defaultVariants: { size: 'md' } } })
    expect(ui()).toBe('x text-md')
    // A value that names no `base` contributes nothing rather than its key.
    expect(tvBase({ extend: { base: 'x', variants: { size: { md: { label: 'text-md' } } }, defaultVariants: { size: 'md' } } })()).toBe('x')
  })

  it('still matches compound variants on a slotless theme without variants', () => {
    const tvBase = tv as unknown as (config?: any) => (props?: any) => string | undefined
    const ui = tvBase({ extend: { base: 'x', compoundVariants: [{ class: 'always' }] } })
    expect(ui()).toBe('x always')
  })
})

// Inference is the half the snapshot suite can't prove: it breaks in user-land
// (`app.config.ui` autocomplete, `ComponentConfig`-derived props) rather than in
// CI. These assertions are checked by `vue-tsc`, not at runtime, so they use the
// strongly-typed `tv` rather than `tvt`.
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
    // @ts-expect-error a prop no variant declares
    component({ sizee: 'sm' })
    // classes, and a replacer, at any depth
    component({ class: ['p-2', () => 'block'] })
  })

  it('keeps slot functions for a theme typed with optional slots', () => {
    const loose: { slots?: Record<string, string>, variants?: Record<string, Record<string, { base?: string }>> } = button
    const ui = tv({ extend: loose })()

    expectTypeOf(ui).not.toEqualTypeOf<string>()
  })

  it('derives the variant props of a built component', () => {
    const component = tv(button)

    expectTypeOf(component).parameter(0).exclude<undefined>().omit<'class'>().toEqualTypeOf<VariantProps<typeof component>>()
    expectTypeOf<VariantProps<typeof component>>().toEqualTypeOf<{ size?: 'sm' | 'md', block?: boolean }>()
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

describe('tv extend joins', () => {
  // A slotted theme on top of a slotless one: the extended `base` lands in the
  // `base` slot, and the own classes come last so they win conflicts, like
  // every other join. 3.2.2 dropped the extended base in this shape.
  it('joins a slotless extended base into the `base` slot', () => {
    const ui = tvt({ extend: { base: 'p-4 text-sm' }, slots: { base: 'p-2', label: 'truncate' } })()
    expect(ui.base()).toBe('text-sm p-2')
    expect(ui.label()).toBe('truncate')
  })

  it('joins a slotless extended base under a top-level own base too', () => {
    const ui = tvt({ extend: { base: 'p-4 text-sm' }, base: 'p-2', slots: { label: 'truncate' } })()
    expect(ui.base()).toBe('text-sm p-2')
  })

  it('hands a slotless extended base to a `slots.base` replacer', () => {
    let received: string | undefined
    tvt({ extend: { base: 'p-4' }, slots: { base: (defaults: string) => {
      received = defaults
      return 'block'
    }, label: '' } })()
    expect(received).toBe('p-4')
  })

  it('keeps a theme with only a base slotless when extending a slotless one', () => {
    const tvBase = tv as unknown as (config?: any) => (props?: any) => string | undefined
    expect(tvBase({ extend: { base: 'p-4' }, base: 'p-2' })()).toBe('p-2')
  })
})
