import { createTV, cnMerge } from 'tailwind-variants'
import type { ClassValue, TVVariants, TVCompoundVariants, TVDefaultVariants, TVReturnType, defaultConfig } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import type { SlotClassReplacer } from '../types/tv'
import appConfig from '#build/app.config'

// Internal `tailwind-variants` helpers that are not re-exported.
type TVSlots = Record<string, ClassValue> | undefined

/**
 * Widen the slot functions of a `tailwind-variants` return type so `class` /
 * `className` also accept the `(defaults) => classes` replacer — `:ui` and the
 * `class` prop flow straight into them. The concrete slot keys (and the
 * extend-readable `slots` / `variants` / … properties) are preserved, so
 * components keep type-checking under `noUncheckedIndexedAccess`.
 */
type WideSlotFn = (slotProps?: Record<string, any>) => string
type Widen<R> = R extends (props?: infer P) => infer Slots
  ? { (props?: P): Slots extends string ? string : { [K in keyof Slots]: WideSlotFn } } & Omit<R, never>
  : R

/**
 * Mirrors `tailwind-variants`' `TV` call signature (so config inference is
 * unchanged) but returns the {@link Widen}-ed result. Component prop types are
 * derived from `typeof theme` via `ComponentConfig`, not from this type, so the
 * widening only affects the internal `ui.slot(...)` calls.
 */
type WideTV = {
  <
    V extends TVVariants<S, B, EV>,
    CV extends TVCompoundVariants<V, S, B, EV, ES>,
    DV extends TVDefaultVariants<V, S, EV, ES>,
    B extends ClassValue = undefined,
    S extends TVSlots = undefined,
    // @ts-expect-error mirror of tailwind-variants' own circular default
    E extends TVReturnType = TVReturnType<V, S, B, EV extends undefined ? {} : EV, ES extends undefined ? {} : ES>,
    EV extends TVVariants<ES, B, E['variants'], ES> = E['variants'],
    ES extends TVSlots = E['slots'] extends TVSlots ? E['slots'] : undefined
  >(
    options: {
      extend?: E
      base?: B
      slots?: S
      variants?: V
      compoundVariants?: CV
      compoundSlots?: any
      defaultVariants?: DV
    },
    config?: typeof defaultConfig
  ): Widen<TVReturnType<V, S, B, EV, ES, E>>
}

const appConfigTv = appConfig as AppConfig & { ui: { tv: typeof defaultConfig } }

const config = appConfigTv.ui?.tv

const baseTv = /* @__PURE__ */ createTV(config)

/**
 * Find a **call-time** class replacer — a function `(defaults) => classes` that
 * replaces a slot's resolved classes instead of merging onto them. It may sit
 * directly in a slot's `class` value (the `transformUI` scalar path) or inside the array a
 * component forwards (e.g. `[props.ui?.base, props.class]`). Arrays are scanned
 * deeply and the **last** replacer wins, mirroring `twMerge`'s last-in-wins
 * semantics so e.g. `props.class` overrides `props.ui?.base`.
 */
function findReplacer(value: unknown): SlotClassReplacer | undefined {
  if (typeof value === 'function') {
    return value as SlotClassReplacer
  }
  if (Array.isArray(value)) {
    for (let i = value.length - 1; i >= 0; i--) {
      const replacer = findReplacer(value[i])
      if (replacer) {
        return replacer
      }
    }
  }
  return undefined
}

/**
 * Keep the plain (non-function) classes passed alongside a replacer so they
 * still apply on top of the replacement. Nested arrays are flattened so plain
 * classes are never dropped.
 */
function plainClasses(value: unknown): ClassValue[] {
  if (Array.isArray(value)) {
    return value.flatMap(item => plainClasses(item))
  }
  if (typeof value === 'function') {
    return []
  }
  return [value as ClassValue]
}

/**
 * Apply a call-time replacer: drop the resolved class chain (base + variants +
 * compound variants) and return only the replacement, plus any plain classes
 * passed alongside it. `resolveDefaults` computes that chain without any user
 * class so the replacer can reuse part of it.
 */
function applyReplacer(replacer: SlotClassReplacer, slotProps: Record<string, any>, resolveDefaults: () => string): string {
  return cnMerge(replacer(resolveDefaults()), ...plainClasses(slotProps.class), ...plainClasses(slotProps.className))(config) ?? ''
}

/**
 * A slot invocation is memoizable only when its output is fully determined by a
 * serializable key: primitives and arrays of primitives. Objects (clsx-style
 * class maps) and functions (replacers) bail to the uncached path.
 */
function isMemoizable(value: unknown, depth = 0): boolean {
  if (value === undefined || value === null) {
    return true
  }
  const type = typeof value
  if (type === 'string' || type === 'boolean') {
    return true
  }
  // `JSON.stringify` turns NaN/Infinity into `null`, colliding with real `null`
  // keys that tv resolves differently (default variant vs `key || "false"` lookup).
  if (type === 'number') {
    return Number.isFinite(value)
  }
  if (Array.isArray(value)) {
    // Stop a few levels down rather than recurse without bound: a cyclic array
    // reaching a variant would blow the stack, where tv itself resolves it. The
    // arrays components pass (`[props.ui?.td, ...]`) are one or two deep.
    if (depth >= 4) {
      return false
    }
    for (const item of value) {
      if (!isMemoizable(item, depth + 1)) {
        return false
      }
    }
    return true
  }
  return false
}

function memoKey(slotProps: Record<string, any>): string | undefined {
  // Only plain objects: an exotic prototype could carry inherited enumerable
  // props that tv would read but `JSON.stringify` would drop from the key,
  // making two different inputs share one cache entry.
  const proto = Object.getPrototypeOf(slotProps)
  if (proto !== Object.prototype && proto !== null) {
    return undefined
  }

  // `Object.keys` matches exactly what `JSON.stringify` serializes (own
  // enumerable keys), so everything the key omits is also never inspected here.
  for (const key of Object.keys(slotProps)) {
    if (!isMemoizable(slotProps[key])) {
      return undefined
    }
  }
  // `JSON.stringify` drops `undefined`-valued keys, matching tv's semantics
  // (an undefined variant is the same as an absent one).
  return JSON.stringify(slotProps)
}

/**
 * Wrap the slot functions returned by `tv()` so a replacer passed at call time
 * (`:ui` / `class`, which includes what `<UTheme>` injects) drops the slot's
 * resolved class chain and returns only its replacement. Without a replacer the
 * original slot function runs untouched, so the common merge path is unaffected.
 *
 * Repeated invocations with identical simple args (re-renders, table cells) are
 * memoized per slot: variant resolution + twMerge only run once per distinct
 * input. The cache lives on the invocation result, so a factory rebuild (e.g.
 * `app.config.ui` change) or variant-prop recompute starts fresh.
 */
function wrapSlots(slots: Record<string, any>) {
  // `undefined` is a real slot result: `tv` returns it (not `''`) for a slot
  // whose chain resolves to no classes, so it can't double as a miss sentinel.
  const memo = new Map<string, Map<string, string | undefined>>()

  return new Proxy(slots, {
    get(target, key: string) {
      const slot = target[key]
      if (typeof slot !== 'function') {
        return slot
      }

      return (slotProps: Record<string, any> = {}) => {
        const replacer = findReplacer(slotProps.class) ?? findReplacer(slotProps.className)
        if (!replacer) {
          const cacheKey = memoKey(slotProps)
          if (cacheKey === undefined) {
            return slot(slotProps)
          }

          let cache = memo.get(key)
          if (!cache) {
            cache = new Map()
            memo.set(key, cache)
          }

          let result = cache.get(cacheKey)
          // The extra `has` only runs for the rare slot that resolves to no
          // classes, so the hot path stays a single lookup.
          if (result === undefined && !cache.has(cacheKey)) {
            if (cache.size >= 500) {
              // Pathological dynamic inputs (e.g. per-row generated classes):
              // reset rather than grow unbounded.
              cache.clear()
            }
            result = slot(slotProps) as string
            cache.set(cacheKey, result)
          }
          return result
        }
        return applyReplacer(replacer, slotProps, () => slot({ ...slotProps, class: undefined, className: undefined }))
      }
    }
  })
}

/**
 * Flatten a raw theme class value (string, array, nested array with falsy holes)
 * into the string a replacer receives as its `defaults` argument.
 */
function defaultClasses(value: unknown): string {
  return cnMerge(value as ClassValue)(config) ?? ''
}

/**
 * Resolve construction-time replacers authored in `app.config.ui.<component>`
 * (under `slots` or the top-level `base`) so `createTV` only ever receives valid
 * class strings. The replacer takes the place of the slot's **own** classes from
 * the extended theme, which means `variants` and `compoundVariants` still merge
 * on top of the result — the same as when a plain string is used.
 *
 * Blanking the entry on the `extend` side is what makes it a replacement: `tv`
 * only ever concatenates the extended theme into the component's own classes, it
 * has no way to remove them. Call-time replacers (`:ui` / `class`) run after
 * variant resolution instead and are handled in {@link wrapSlots}. The incoming
 * config is never mutated.
 */
function resolveReplacers(componentConfig: any): any {
  if (!componentConfig || typeof componentConfig !== 'object') {
    return componentConfig
  }

  const slots = componentConfig.slots
  const replacers = slots && typeof slots === 'object'
    ? Object.entries(slots).filter((entry): entry is [string, SlotClassReplacer] => typeof entry[1] === 'function')
    : []
  const baseReplacer = typeof componentConfig.base === 'function' ? componentConfig.base as SlotClassReplacer : undefined

  if (!replacers.length && !baseReplacer) {
    return componentConfig
  }

  const extend = componentConfig.extend
  const resolved = { ...componentConfig }
  // Only rebuilt when there is something to blank, so an `extend`-less config
  // (or one whose replaced slots aren't in the extended theme) is left alone.
  let extendSlots: Record<string, any> | undefined
  let blankExtendBase = false

  if (baseReplacer) {
    // A slotted component keeps its base under `slots.base`, a slotless one under
    // the top-level `base`, so read whichever the extended theme actually has.
    resolved.base = baseReplacer(defaultClasses(extend?.slots?.base ?? extend?.base))
    if (extend?.slots?.base) {
      extendSlots ??= { ...extend.slots } as Record<string, any>
      extendSlots.base = ''
    }
    if (extend?.base) {
      blankExtendBase = true
    }
  }

  if (replacers.length) {
    const cleaned = { ...slots }
    for (const [slot, replacer] of replacers) {
      cleaned[slot] = replacer(defaultClasses(extend?.slots?.[slot]))
      if (extend?.slots?.[slot]) {
        extendSlots ??= { ...extend.slots } as Record<string, any>
        extendSlots[slot] = ''
      }
    }
    resolved.slots = cleaned
  }

  if (extendSlots || blankExtendBase) {
    const cleanedExtend = { ...extend }
    if (extendSlots) {
      cleanedExtend.slots = extendSlots
    }
    if (blankExtendBase) {
      cleanedExtend.base = ''
    }
    resolved.extend = cleanedExtend
  }

  return resolved
}

/**
 * Wraps `tailwind-variants`' `tv` so slot classes can be **replaced** (not just
 * merged) through a function form — `(defaults) => classes` — in `:ui`, the
 * `class` prop and `app.config.ui`. The wrapper is transparent for every other
 * usage: it preserves the `TVReturnType` (so `extend: tv(theme)` keeps working
 * via property reads) and only intercepts the slot functions on invocation.
 */
export const tv = ((componentConfig?: any) => {
  const component = baseTv(resolveReplacers(componentConfig))

  return new Proxy(component, {
    apply(target, thisArg, args) {
      const result = Reflect.apply(target, thisArg, args)
      if (result && typeof result === 'object') {
        return wrapSlots(result)
      }

      // Slotless components (only a `base`, no `slots`) return a string. Honor a
      // replacer passed through `class` / `className`, otherwise return the
      // merged string untouched.
      if (typeof result === 'string') {
        const slotProps = args[0] ?? {}
        const replacer = findReplacer(slotProps.class) ?? findReplacer(slotProps.className)
        if (replacer) {
          return applyReplacer(replacer, slotProps, () => Reflect.apply(target, thisArg, [{ ...slotProps, class: undefined, className: undefined }]))
        }
      }

      return result
    }
  })
}) as unknown as WideTV
