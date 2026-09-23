import { describe, it, expect, expectTypeOf, vi } from 'vitest'
import { tv } from '../../src/runtime/utils/tv'
import type { VariantProps } from '../../src/runtime/types/tv'

// Cast to a permissive local signature: the strongly-typed `tv` is what
// components rely on, whereas these tests exercise the engine at runtime with
// inline themes and the `(defaults) => classes` replacer form.
const tvt = tv as unknown as (theme: any, overrides?: any) => (props?: any) => {
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

  const build = () => tvt(theme)({ color: 'primary', size: 'md' })
  // Mirrors a component with `app.config.ui` slot overrides.
  const buildWith = (slots: any) => tvt(theme, { slots })({ color: 'primary', size: 'md' })

  it('keeps merging plain string classes (no regression)', () => {
    const ui = build()
    expect(ui.label({ class: 'font-bold' })).toBe('truncate font-bold')
    // A conflicting utility is still resolved by tailwind-merge.
    const base = ui.base({ class: 'text-lg' })
    expect(base).toContain('text-lg')
    expect(base).not.toContain('text-sm')
  })

  it('resolves the full chain', () => {
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
    const ui = tvt({ slots: { base: '', label: 'truncate' } })()
    expect(ui.base({ class: (defaults: string) => `${defaults}text-xl` })).toBe('text-xl')
  })

  it('keeps a construction-time replacer merging classes passed at call time', () => {
    expect(buildWith({ label: () => 'text-xl' }).label({ class: 'font-bold' })).toBe('text-xl font-bold')
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

describe('tv class replace (single-slot component)', () => {
  // A component with one element still declares it as a slot (e.g. the
  // Container theme), and forwards `class: [props.ui?.base, props.class]`.
  const build = () => tvt({ slots: { base: 'inline-flex rounded-md px-4' } })()

  it('still merges plain classes', () => {
    const result = build().base({ class: 'font-bold' })
    expect(result).toContain('inline-flex')
    expect(result).toContain('font-bold')
  })

  it('replaces the slot through a function in `:ui` / `class`', () => {
    expect(build().base({ class: () => 'block w-full' })).toBe('block w-full')
    expect(build().base({ class: [() => 'block w-full', undefined] })).toBe('block w-full')
  })

  it('passes the resolved default classes to the replacer', () => {
    let received: string | undefined
    build().base({ class: (defaults: string) => {
      received = defaults
      return 'whatever'
    } })
    expect(received).toContain('inline-flex')
  })

  it('applies a construction-time replacer from `app.config.ui`', () => {
    const ui = tvt({ slots: { base: 'inline-flex px-4' } }, { slots: { base: () => 'block' } })()
    expect(ui.base()).toBe('block')
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

  const build = () => tvt(theme)()

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
    const ui = tvt({ slots: { base: '' }, variants: { active: { true: { base: 'font-bold' }, false: {} } } })()
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
    const ui = tvt(theme, { defaultVariants: { active: true } })()
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
    const shared = { slots: { base: 'inline-flex' }, variants: { size: { sm: { base: 'text-sm' }, lg: { base: 'text-lg' } } } }
    expect(tvt(shared)({ size: 'sm' }).base({ size: null })).toContain('text-sm')
    expect(tvt(shared)({ size: 'lg' }).base({ size: null })).toContain('text-lg')
    // The other direction: `null` at the invocation with the key absent from
    // the slot call resolves to nothing, not to the entry above.
    expect(tvt(shared)({ size: null }).base({})).not.toContain('text-')
  })

  it('does not confuse a `null` slot prop with an absent one for compound matching', () => {
    const shared = {
      slots: { base: 'inline-flex' },
      variants: { size: { sm: { base: 'text-sm' } } },
      compoundVariants: [{ size: 'sm', class: { base: 'gap-1' } }]
    }
    // Present as `null`: the variant falls through to `sm`, the compound sees `null`.
    expect(tvt(shared)({ size: 'sm' }).base({ size: null })).toBe('inline-flex text-sm')
    expect(tvt(shared)({ size: 'sm' }).base({})).toBe('inline-flex text-sm gap-1')
  })

  it('does not confuse a `null` slot prop with an `undefined` one for an array expectation', () => {
    // Both fall through to the invocation prop for the variant, but a compound
    // listing `null` among its values matches one and not the other.
    const shared = {
      slots: { base: 'inline-flex' },
      variants: { size: { sm: { base: 'text-sm' } } },
      compoundVariants: [{ size: [null], class: { base: 'gap-1' } }]
    }
    expect(tvt(shared)().base({ size: null })).toBe('inline-flex gap-1')
    expect(tvt(shared)().base({ size: undefined })).toBe('inline-flex')
    expect(tvt(shared)().base({ size: null })).toBe('inline-flex gap-1')
  })

  it('keys values that contain the separators', () => {
    // Tailwind arbitrary values carry `,`, `"` and `;`, so the key can't rely on
    // them as delimiters.
    const ui = build()
    expect(ui.base({ class: ['a', 'b'] })).toContain('a b')
    expect(ui.base({ class: ['a,"b'] })).toContain('a,"b')
    expect(ui.base({ class: ['a,"b'] })).not.toContain('a b')

    const shared = { slots: { base: 'x' }, variants: { a: { 'p-1': { base: 'A1' } }, b: { 'p-2': { base: 'B2' }, 'p-2;"p-3': { base: 'BX' } } } }
    expect(tvt(shared)({ a: 'p-1', b: 'p-2;"p-3' }).base()).toBe('x A1 BX')
    expect(tvt(shared)({ a: 'p-1;"p-2', b: 'p-3' }).base()).toBe('x')
  })

  it('does not confuse a value ending in `!` with an undefined slot prop', () => {
    const shared = { slots: { base: 'x' }, variants: { size: { 'md': { base: 'text-md' }, 'md!': { base: 'BANG' } } } }
    expect(tvt(shared)({ size: 'md' }).base({ size: undefined })).toBe('x text-md')
    expect(tvt(shared)({ size: 'md!' }).base({})).toBe('x BANG')
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
    expect(tvt(shared)().base(Object.create({ active: true }))).toBe('x font-bold ring')
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

  it('ignores a class given outside a slot object', () => {
    // Classes are always per slot: a bare string or array targets nothing, and
    // must not leak the per-slot object it overrides as `"[object Object]"`.
    expect(tvt(theme, { variants: { size: { md: 'text-lg' } } })().base()).toBe('inline-flex text-base')
    expect(tvt(theme, { variants: { size: { md: ['text-lg'] } } })().base()).toBe('inline-flex text-base')
    expect(tvt(theme, { compoundVariants: [{ size: 'md', class: 'text-lg' }] })().base()).toBe('inline-flex text-base')
  })

  it('warns once in development about a class given outside a slot object', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const overrides = { variants: { tone: { loud: 'uppercase', quiet: '', off: false, flat: {} } } }
    tvt(theme, overrides)()
    // A second spec for the same content, as when overrides can't be keyed.
    tvt(theme, { ...overrides, slots: { label: 'italic' } })()
    const calls = warn.mock.calls.map(call => call[0])
    warn.mockRestore()
    // `import.meta.dev` is off in the Nuxt test build, where nothing is logged.
    expect(calls.length).toBeLessThanOrEqual(1)
    for (const message of calls) {
      expect(message).toContain('`variants.tone.loud`')
      expect(message).toContain('{ base: \'...\' }')
    }
  })

  it('warns once in development about a key or slot the theme does not have', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    tvt(theme, { base: 'p-4', slots: { root: 'p-4' }, variants: { size: { md: { root: 'p-4' } } } })().base()
    tvt(theme)({ class: 'p-4' })
    const calls = warn.mock.calls.map(call => call[0])
    warn.mockRestore()
    // `import.meta.dev` is off in the Nuxt test build, where nothing is logged.
    if (calls.length) {
      expect(calls).toEqual([
        expect.stringContaining('`base` is not a theme key'),
        expect.stringContaining('`slots.root` is not a slot of this component, which has `base`, `label`'),
        expect.stringContaining('`variants.size.md.root` is not a slot'),
        expect.stringContaining('`class` is ignored when invoking')
      ])
    }
  })

  it('merges two per-slot values slot by slot', () => {
    const ui = tvt(theme, { variants: { size: { md: { label: 'font-medium' } } } })()
    expect(ui.base()).toBe('inline-flex text-base')
    expect(ui.label()).toBe('truncate leading-5 font-medium')
  })

  it('accepts an array of classes inside a slot object', () => {
    const ui = tvt({ slots: { base: 'x', label: 'y' }, variants: { size: { sm: { base: ['text-sm', 'p-1'] } } } })({ size: 'sm' })
    expect(ui.base()).toBe('x text-sm p-1')
    expect(ui.label()).toBe('y')
  })

  it('still matches compound variants on a theme without variants', () => {
    const ui = tvt({ slots: { base: 'x' }, compoundVariants: [{ class: { base: 'always' } }] })()
    expect(ui.base()).toBe('x always')
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
    const ui = tv(button)()

    expectTypeOf(ui.base()).toEqualTypeOf<string>()
    expectTypeOf(ui.label()).toEqualTypeOf<string>()
    // @ts-expect-error a slot the theme doesn't declare
    expectTypeOf(ui.trailing).toBeNever()
  })

  it('returns a function per slot for a single-slot theme', () => {
    const ui = tv({ slots: { base: 'w-full mx-auto' } })()

    expectTypeOf(ui.base).returns.toEqualTypeOf<string>()
  })

  it('keeps the slots when app config overrides are passed', () => {
    const appConfig = { slots: { base: 'shadow-sm' } }
    const ui = tv(button, appConfig)()

    expectTypeOf(ui.base()).toEqualTypeOf<string>()
    expectTypeOf(ui.label()).toEqualTypeOf<string>()
  })

  it('types invocation props from the declared variants', () => {
    const component = tv(button)

    component({ size: 'sm' })
    // a variant keyed `true` reads as a boolean
    component({ block: true })
    // @ts-expect-error `lg` is not a declared size
    component({ size: 'lg' })
    // @ts-expect-error a prop no variant declares
    component({ sizee: 'sm' })
    // @ts-expect-error classes go to the slot functions
    component({ class: 'p-2' })
    // classes, and a replacer, at any depth
    component().base({ class: ['p-2', () => 'block'] })
  })

  it('keeps slot functions for a theme typed with optional slots', () => {
    const loose: { slots?: Record<string, string>, variants?: Record<string, Record<string, { base?: string }>> } = button
    const ui = tv(loose)()

    expectTypeOf(ui).not.toEqualTypeOf<string>()
  })

  it('derives the variant props of a built component', () => {
    const component = tv(button)

    expectTypeOf(component).parameter(0).exclude<undefined>().toEqualTypeOf<VariantProps<typeof component>>()
    expectTypeOf<VariantProps<typeof component>>().toEqualTypeOf<{ size?: 'sm' | 'md', block?: boolean }>()
  })

  it('checks defaultVariants against the declared variants', () => {
    tv(button, { defaultVariants: { size: 'sm', block: false } })
    // @ts-expect-error `lg` is not a declared size
    tv(button, { defaultVariants: { size: 'lg' } })
    // The theme's own defaults too, which inference alone would let through.
    tv({ slots: { base: '' }, variants: { size: { sm: { base: 'text-sm' } } }, defaultVariants: { size: 'sm' } })
    // @ts-expect-error `lg` is not a declared size
    tv({ slots: { base: '' }, variants: { size: { sm: { base: 'text-sm' } } }, defaultVariants: { size: 'lg' } })
  })

  it('accepts one value or several in compoundVariants', () => {
    tv(button, {
      compoundVariants: [
        { size: 'sm', class: { base: 'gap-1' } },
        { size: ['sm', 'md'], block: true, class: { label: 'sr-only' } }
      ]
    })
    tv({
      slots: { base: '' },
      variants: { size: { sm: { base: 'text-sm' }, md: { base: 'text-base' } } },
      compoundVariants: [{ size: ['sm', 'md'], class: { base: 'font-medium' } }]
    })
  })

  it('lets overrides add variant values and groups, but not slots', () => {
    tv(button, {
      variants: {
        size: { lg: { base: 'text-lg' } },
        rounded: { true: { base: 'rounded-full' } }
      }
    })
    // @ts-expect-error a slot the theme doesn't declare
    tv(button, { variants: { size: { sm: { icon: 'size-4' } } } })
    // @ts-expect-error a slot the theme doesn't declare
    tv(button, { slots: { icon: 'size-4' } })
  })
})

describe('tv theme joins', () => {
  // The override classes come last so they win conflicts, and a slot the theme
  // doesn't declare is added alongside.
  it('joins override slots onto a single-slot theme', () => {
    const ui = tvt({ slots: { base: 'p-4 text-sm' } }, { slots: { base: 'p-2', label: 'truncate' } })()
    expect(ui.base()).toBe('text-sm p-2')
    expect(ui.label()).toBe('truncate')
  })

  it('hands the theme classes to a slot replacer', () => {
    let received: string | undefined
    tvt({ slots: { base: 'p-4' } }, { slots: { base: (defaults: string) => {
      received = defaults
      return 'block'
    }, label: '' } })()
    expect(received).toBe('p-4')
  })
})

describe('tv override layers', () => {
  // Shapes taken from the template app configs the order was measured against.
  const theme = {
    slots: { base: 'inline-flex px-2.5', label: 'text-muted' },
    variants: {
      size: { md: { base: 'px-2.5 text-sm' } },
      square: { true: '' },
      tone: { quiet: { label: 'text-dimmed' } }
    },
    compoundVariants: [{ size: 'md', square: true, class: { base: 'p-1.5' } }],
    defaultVariants: { size: 'md', tone: 'quiet' }
  }

  it('lets an override slot class win over the theme variants and compounds', () => {
    // `label` loses to the `tone` variant when it rides beneath it.
    expect(tvt(theme, { slots: { label: 'text-inherit' } })().label()).toBe('text-inherit')
    expect(tvt(theme, { slots: { base: 'p-4' } })({ square: true }).base()).toBe('inline-flex text-sm p-4')
  })

  it('lets an override variant win over every theme variant', () => {
    // Overriding one group used to move it ahead of the theme's others, so a
    // theme group declared after it won the conflict, here `tone` over `size`.
    const ordered = {
      slots: { base: 'inline-flex', label: 'truncate' },
      variants: { size: { md: { label: 'text-sm' } }, tone: { quiet: { label: 'text-xs' } } },
      defaultVariants: { size: 'md', tone: 'quiet' }
    }
    expect(tvt(ordered)().label()).toBe('truncate text-xs')
    expect(tvt(ordered, { variants: { size: { md: { label: 'text-lg' } } } })().label()).toBe('truncate text-lg')
  })

  it('keeps the theme variant order when an override touches another slot', () => {
    // The calendar template's Sidebar: overriding `variant.floating.inner` must
    // not change which of `side` and `variant` wins on `container`.
    const sidebar = {
      slots: { container: 'fixed', inner: 'flex' },
      variants: { side: { left: { container: 'border-default' } }, variant: { floating: { container: 'border-transparent' } } },
      defaultVariants: { side: 'left', variant: 'floating' }
    }
    const ui = tvt(sidebar, { variants: { variant: { floating: { inner: 'divide-none' } } } })() as any
    expect(ui.container()).toBe((tvt(sidebar)() as any).container())
    expect(ui.container()).toBe('fixed border-transparent')
    expect(ui.inner()).toBe('flex divide-none')
  })

  it('keeps an override variant beneath the theme compounds', () => {
    // Tuning a size from `app.config.ui` doesn't cancel the `square` exception.
    const ui = tvt(theme, { variants: { size: { md: { base: 'px-4' } } } })
    expect(ui().base()).toBe('inline-flex text-sm px-4')
    expect(ui({ square: true }).base()).toBe('inline-flex text-sm p-1.5')
  })

  it('lets an override compound win over an override slot class', () => {
    const ui = tvt(theme, {
      slots: { label: 'text-default' },
      compoundVariants: [{ tone: 'quiet', class: { label: 'text-toned' } }]
    })
    expect(ui().label()).toBe('text-toned')
    expect(ui({ tone: null }).label()).toBe('text-default')
  })

  it('still lets `:ui` and `class` win over every layer', () => {
    const ui = tvt(theme, { slots: { label: 'text-default' }, compoundVariants: [{ tone: 'quiet', class: { label: 'text-toned' } }] })
    expect(ui().label({ class: 'text-highlighted' })).toBe('text-highlighted')
  })

  it('keeps the theme variants on top of an override slot replacer', () => {
    expect(tvt(theme, { slots: { label: () => 'font-bold text-default' } })().label()).toBe('font-bold text-dimmed')
  })
})

describe('tv spec sharing', () => {
  const theme = { slots: { base: 'inline-flex', label: 'truncate' }, variants: { active: { true: { base: 'font-bold' } } } }

  // A slot call served from the memo reads its props strictly fewer times than
  // one that runs the slot, so a hit shows that two builds share one entry.
  function countingProps() {
    const counter = { reads: 0 }
    const props = {
      get active() {
        counter.reads++
        return true
      }
    }
    return [props, counter] as const
  }

  it('shares one compiled entry between overrides with the same content', () => {
    const [props, counter] = countingProps()
    expect(tvt(theme, { slots: { base: 'p-1' } })().base(props)).toBe('inline-flex font-bold p-1')
    const miss = counter.reads

    // Nuxt clones the app config per server request, so identity is never shared.
    counter.reads = 0
    expect(tvt(theme, { slots: { base: 'p-1' } })().base(props)).toBe('inline-flex font-bold p-1')
    expect(counter.reads).toBeLessThan(miss)
  })

  it('resolves a fresh entry when the overrides change in place', () => {
    // `updateAppConfig` and app config HMR mutate the same object.
    const overrides = { slots: { base: 'p-1' } }
    expect(tvt(theme, overrides)().base()).toBe('inline-flex p-1')
    overrides.slots.base = 'p-2'
    expect(tvt(theme, overrides)().base()).toBe('inline-flex p-2')
  })

  it('compiles a slot from the overrides it was keyed on', () => {
    // Slots compile lazily, after the overrides may have changed in place.
    const overrides = { variants: { tone: { quiet: { label: 'font-bold' } } } }
    const ui = tvt(theme, overrides)({ tone: 'quiet' })
    overrides.variants.tone.quiet.label = 'font-light'
    expect(ui.label()).toBe('truncate font-bold')
    overrides.variants.tone.quiet.label = 'font-bold'
    expect(tvt(theme, overrides)({ tone: 'quiet' }).label()).toBe('truncate font-bold')
  })

  it('keys a replacer in the overrides by identity', () => {
    // Two replacers with the same source and different captured scope.
    const replacer = (padding: string) => () => padding
    expect(tvt(theme, { slots: { base: replacer('p-1') } })().base()).toBe('p-1')
    expect(tvt(theme, { slots: { base: replacer('p-2') } })().base()).toBe('p-2')
  })

  it('treats empty overrides like none', () => {
    const [props, counter] = countingProps()
    tvt(theme)().base(props)
    counter.reads = 0
    tvt(theme)().base(props)
    const hit = counter.reads

    // Both are served from the theme's own entry.
    counter.reads = 0
    expect(tvt(theme, {})().base(props)).toBe('inline-flex font-bold')
    expect(tvt(theme, null)().base(props)).toBe('inline-flex font-bold')
    expect(counter.reads).toBe(hit * 2)
  })
})
