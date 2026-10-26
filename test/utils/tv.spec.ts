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

  it('detects a replacer in the `className` alias', () => {
    expect(build().label({ className: () => 'text-3xl' })).toBe('text-3xl')
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
    const ui = tvt({ extend: tvt({ slots: { base: '' }, variants: { active: { true: {}, false: {} } } }) })()
    const [props, counter] = countingProps(true)

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

  it('keeps each slot cache bounded', () => {
    const ui = build()
    const counter = { reads: 0 }
    const props = (i: number) => ({
      class: `w-[${i}px]`,
      get active() {
        counter.reads++
        return true
      }
    })

    for (let i = 0; i < 600; i++) {
      ui.base(props(i))
    }

    // The 501st distinct key resets the cache, so it now holds 500 onwards.
    counter.reads = 0
    expect(ui.base(props(599))).toContain('w-[599px]')
    const hit = counter.reads

    // Entry 0 went with the reset and has to be resolved again.
    counter.reads = 0
    expect(ui.base(props(0))).toContain('w-[0px]')
    expect(counter.reads).toBeGreaterThan(hit)
  })

  it('does not key inputs carrying inherited enumerable props as plain ones', () => {
    const ui = build()
    // Inherited `class` is read by tv but invisible to `JSON.stringify`: without
    // the plain-object guard this would cache a `font-bold` result under `{}`.
    expect(ui.label(Object.create({ class: 'font-bold' }))).toBe('truncate font-bold')
    expect(ui.label({})).toBe('truncate')
  })
})

describe('tv invocation memoization', () => {
  const theme = {
    slots: { base: 'inline-flex text-sm', label: 'truncate' },
    variants: {
      active: {
        true: { base: 'font-bold' },
        false: { base: 'font-light' }
      }
    }
  }

  const slotless = {
    base: 'inline-flex text-sm',
    variants: {
      active: { true: 'font-bold', false: 'font-light' }
    }
  }

  it('shares the result across invocations with equal variant props', () => {
    const component = tvt(theme)
    expect(component({ active: true, class: ['p-2'] })).toBe(component({ active: true, class: ['p-2'] }))
    expect(component({ active: true }).base()).toContain('font-bold')
  })

  it('does not share results across distinct variant props', () => {
    const component = tvt(theme)
    const active = component({ active: true })
    expect(component({ active: true })).toBe(active)
    expect(component({ active: false })).not.toBe(active)
    expect(component({ active: false }).base()).toContain('font-light')
  })

  it('does not share results for variant props that cannot be keyed', () => {
    const component = tvt(theme)
    expect(component({ class: ['p-2'] })).toBe(component({ class: ['p-2'] }))
    expect(component({ class: { 'p-2': true } })).not.toBe(component({ class: { 'p-2': true } }))

    const slotlessComponent = tvt(slotless) as any
    expect(slotlessComponent({ class: () => 'block' })).toBe('block')
    expect(slotlessComponent({ active: true })).toBe('inline-flex text-sm font-bold')
  })

  it('keeps a shared result independent of the caller props once keyed', () => {
    const component = tvt(theme)
    let active = true
    const result = component({
      get active() {
        return active
      }
    })
    active = false
    expect(component({ active: true })).toBe(result)
    expect(result.base()).toContain('font-bold')
  })

  it('keeps the shared results bounded', () => {
    const component = tvt(theme)
    const first = component({ index: 0 })
    for (let i = 1; i < 600; i++) {
      component({ index: i })
    }
    expect(component({ index: 599 })).toBe(component({ index: 599 }))
    expect(component({ index: 0 })).not.toBe(first)
  })
})

describe('tv factory memoization', () => {
  const theme = {
    slots: { base: 'inline-flex text-sm', label: 'truncate' },
    variants: {
      color: {
        primary: { base: 'bg-primary' },
        secondary: { base: 'bg-secondary' }
      }
    },
    defaultVariants: { color: 'primary' }
  }

  it('reuses the component for equal configs', () => {
    expect(tvt({ extend: theme, slots: { base: 'p-2' } })).toBe(tvt({ extend: theme, slots: { base: 'p-2' } }))
  })

  it('does not share a component across configs', () => {
    expect(tvt({ extend: theme, slots: { base: 'p-2' } })().base()).toContain('p-2')
    expect(tvt({ extend: theme, slots: { base: 'p-4' } })().base()).toContain('p-4')
  })

  it('does not share a component across themes', () => {
    expect(tvt({ extend: theme })().base()).toContain('inline-flex')
    expect(tvt({ extend: { ...theme, slots: { base: 'block' } } })().base()).toContain('block')
  })

  it('keeps an undefined config value distinct from a missing one', () => {
    expect(tvt({ extend: theme, defaultVariants: {} })().base()).toContain('bg-primary')
    expect(tvt({ extend: theme, defaultVariants: { color: undefined } })().base()).not.toContain('bg-primary')
  })

  it('does not share a component between undefined and a string matching its key marker', () => {
    expect(tvt({ extend: theme, slots: { label: undefined } })().label()).toBe('truncate')
    expect(tvt({ extend: theme, slots: { label: '\0undefined' } })().label()).toBe('truncate \0undefined')
  })

  it('falls back to the uncached path for configs that cannot be serialized', () => {
    const cyclic: any = {}
    cyclic.self = cyclic
    expect(tvt({ extend: theme, slots: { label: 10n } })().label()).toBe('truncate 10')
    expect(tvt({ extend: theme, meta: cyclic })().label()).toBe('truncate')
  })

  it('does not key configs through `toJSON`', () => {
    const variants = Object.defineProperty({ color: { primary: { base: 'p-4' } } }, 'toJSON', { value: () => ({}) })
    expect(tvt({ extend: theme, variants: {} })().base()).not.toContain('p-4')
    expect(tvt({ extend: theme, variants })().base()).toContain('p-4')
  })

  it('does not share a component across configs containing functions', () => {
    expect(tvt({ extend: theme, slots: { label: () => 'text-xl' } })().label()).toBe('text-xl')
    expect(tvt({ extend: theme, slots: { label: () => 'text-2xl' } })().label()).toBe('text-2xl')
  })

  it('does not share a component between non-finite numbers and null', () => {
    expect(tvt({ extend: theme, slots: { label: null } })().label()).toBe('truncate')
    expect(tvt({ extend: theme, slots: { label: Number.POSITIVE_INFINITY } })().label()).toBe('truncate Infinity')
  })

  it('does not key configs carrying inherited enumerable props as plain ones', () => {
    expect(tvt({ extend: theme, variants: {} })().base()).not.toContain('p-4')
    expect(tvt({ extend: theme, variants: Object.create({ color: { primary: { base: 'p-4' } } }) })().base()).toContain('p-4')
  })
})
