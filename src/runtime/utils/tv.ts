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
 * Find a class **replacer** — a function `(defaults) => classes` that replaces a
 * slot's default classes instead of merging onto them. It may sit directly in a
 * slot's `class` value (the `transformUI` scalar path) or inside the array a
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
 * Apply a replacer: drop the baked-in default chain and return only the
 * replacement, plus any plain classes passed alongside it. `resolveDefaults`
 * computes the slot's default classes (without any user class) so the replacer
 * can reuse part of them.
 */
function applyReplacer(replacer: SlotClassReplacer, slotProps: Record<string, any>, resolveDefaults: () => string): string {
  return cnMerge(replacer(resolveDefaults()), ...plainClasses(slotProps.class), ...plainClasses(slotProps.className))(config) ?? ''
}

/**
 * Wrap the slot functions returned by `tv()` so a replacer (from `:ui` / `class`
 * at call time, or from `app.config.ui` at construction time) drops the slot's
 * baked-in default chain and returns only its replacement. Without a replacer the
 * original slot function runs untouched, so the common merge path is unaffected.
 */
function wrapSlots(slots: Record<string, any>, directives?: Record<string, SlotClassReplacer>) {
  return new Proxy(slots, {
    get(target, key: string) {
      const slot = target[key]
      if (typeof slot !== 'function') {
        return slot
      }

      return (slotProps: Record<string, any> = {}) => {
        const replacer = findReplacer(slotProps.class) ?? findReplacer(slotProps.className) ?? directives?.[key]
        if (!replacer) {
          return slot(slotProps)
        }
        return applyReplacer(replacer, slotProps, () => slot({ ...slotProps, class: undefined, className: undefined }))
      }
    }
  })
}

/**
 * Pull construction-time replacers authored in `app.config.ui.<component>` (under
 * `slots` or the top-level `base`) out of the config so `createTV` only ever
 * receives valid class strings. They are applied at call time in `wrapSlots`,
 * alongside the `:ui` / `class` ones. The incoming config is never mutated.
 */
function extractDirectives(componentConfig: any): { config: any, directives?: Record<string, SlotClassReplacer> } {
  if (!componentConfig || typeof componentConfig !== 'object') {
    return { config: componentConfig }
  }

  let config = componentConfig
  let directives: Record<string, SlotClassReplacer> | undefined

  if (typeof componentConfig.base === 'function') {
    directives = { base: componentConfig.base }
    config = { ...config, base: '' }
  }

  const slots = componentConfig.slots
  if (slots && typeof slots === 'object') {
    const replacers = Object.entries(slots).filter(([, value]) => typeof value === 'function')
    if (replacers.length) {
      directives ??= {}
      const cleaned = { ...slots }
      for (const [slot, replacer] of replacers) {
        directives[slot] = replacer as SlotClassReplacer
        cleaned[slot] = ''
      }
      config = { ...config, slots: cleaned }
    }
  }

  return { config, directives }
}

/**
 * Wraps `tailwind-variants`' `tv` so slot classes can be **replaced** (not just
 * merged) through a function form — `(defaults) => classes` — in `:ui`, the
 * `class` prop and `app.config.ui`. The wrapper is transparent for every other
 * usage: it preserves the `TVReturnType` (so `extend: tv(theme)` keeps working
 * via property reads) and only intercepts the slot functions on invocation.
 */
export const tv = ((componentConfig?: any) => {
  const { config: cleanConfig, directives } = extractDirectives(componentConfig)
  const component = baseTv(cleanConfig)

  return new Proxy(component, {
    apply(target, thisArg, args) {
      const result = Reflect.apply(target, thisArg, args)
      if (result && typeof result === 'object') {
        return wrapSlots(result, directives)
      }

      // Slotless components (only a `base`, no `slots`) return a string. Honor a
      // replacer passed through `class` / `className` or a `base` directive from
      // `app.config.ui`, otherwise return the merged string untouched.
      if (typeof result === 'string') {
        const slotProps = args[0] ?? {}
        const replacer = findReplacer(slotProps.class) ?? findReplacer(slotProps.className) ?? directives?.base
        if (replacer) {
          return applyReplacer(replacer, slotProps, () => Reflect.apply(target, thisArg, [{ ...slotProps, class: undefined, className: undefined }]))
        }
      }

      return result
    }
  })
}) as unknown as WideTV
