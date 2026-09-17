import { twMerge, extendTailwindMerge } from 'tailwind-merge'
import type { AppConfig } from '@nuxt/schema'
import type { ClassValue, SlotClassReplacer, TVMergeConfig, TV } from '../types/tv'
import appConfig from '#build/app.config'

/**
 * The variants engine. It covers exactly the surface our themes use — `extend`,
 * `base`, `slots`, `variants`, `compoundVariants`, `defaultVariants` — and
 * deliberately leaves out `compoundSlots`, responsive variants and the per-call
 * config argument, none of which appear in any theme or call site.
 *
 * Class values may be a `(defaults) => classes` **replacer**, which takes the
 * place of what it receives instead of appending to it. In `app.config.ui` that
 * is the slot's classes from the extended theme, resolved at construction time,
 * and `variants` / `compoundVariants` still apply on top. In `:ui` and the
 * `class` prop it is the slot's whole resolved chain.
 *
 * The performance model follows how components call it — `tv({ extend: theme,
 * ...appConfig })(props)`, rebuilt inside a computed:
 * - build defers all merging, and the no-override case (`{ extend: theme }`) is a
 *   WeakMap hit sharing one compiled entry across every rebuild and instance
 * - invoking allocates slot closures only, with no class resolution
 * - a slot call lazily compiles a per-slot lookup table (variant value → class for
 *   that slot, compounds pre-filtered per slot), then memoizes the resolved string
 *   by a fingerprint of the few props that can affect that slot
 *
 * The caches live on the compiled entry rather than on the invocation, so the
 * fast path survives factory rebuilds.
 */

type Props = Record<string, any> | undefined

/* ------------------------------------------------------------------ *
 * class joining (clsx-style, `undefined` when there are none)
 * ------------------------------------------------------------------ */

const SPACE_REGEX = /\s+/g

function push(list: string[], input: any): void {
  if (!input && input !== 0) {
    return
  }
  if (Array.isArray(input)) {
    for (const item of input) {
      push(list, item)
    }
    return
  }
  const type = typeof input
  if (type === 'string' || type === 'number' || type === 'bigint') {
    if (type === 'number' && input !== input) {
      return
    }
    list.push(String(input))
  } else if (type === 'object') {
    for (const key of Object.keys(input)) {
      if (input[key]) {
        list.push(key)
      }
    }
  }
}

function cx(...classes: any[]): string | undefined {
  const list: string[] = []
  for (const value of classes) {
    if (value !== null && value !== undefined) {
      push(list, value)
    }
  }
  return list.length ? list.join(' ').replace(SPACE_REGEX, ' ').trim() : undefined
}

/* ------------------------------------------------------------------ *
 * merger (config → `tailwind-merge` instance, created once per config)
 * ------------------------------------------------------------------ */

type Merger = (classes: string) => string

const mergerCache = new WeakMap<TVMergeConfig, Merger | null>()

function hasDefinedKey(obj: Record<string, any> | undefined): boolean {
  for (const key in obj) {
    if (obj[key] !== undefined) {
      return true
    }
  }
  return false
}

/**
 * The single seam every class string passes through. Returns `null` when merging
 * is turned off (`twMerge: false`).
 */
function getMerger(config: TVMergeConfig | undefined): Merger | null {
  if (!config) {
    return twMerge
  }
  let merger = mergerCache.get(config)
  if (merger === undefined) {
    const mergeConfig = config.twMergeConfig as Record<string, any> | undefined
    merger = config.twMerge === false
      ? null
      : !hasDefinedKey(mergeConfig)
          ? twMerge
          : extendTailwindMerge({
              ...mergeConfig,
              extend: {
                theme: mergeConfig!.theme,
                classGroups: mergeConfig!.classGroups,
                conflictingClassGroupModifiers: mergeConfig!.conflictingClassGroupModifiers,
                conflictingClassGroups: mergeConfig!.conflictingClassGroups,
                ...mergeConfig!.extend
              }
            } as Parameters<typeof extendTailwindMerge>[0])
    mergerCache.set(config, merger)
  }
  return merger
}

function mergeClasses(config: TVMergeConfig | undefined, ...classes: any[]): string | undefined {
  const joined = cx(...classes)
  if (!joined) {
    return joined
  }
  const merger = getMerger(config)
  return merger ? merger(joined) || undefined : joined
}

/* ------------------------------------------------------------------ *
 * replacers
 * ------------------------------------------------------------------ */

/**
 * Find a replacer in a class value. It may sit directly there or inside the array
 * a component forwards (e.g. `[props.ui?.base, props.class]`). Arrays are scanned
 * deeply and the **last** replacer wins, mirroring the merger's last-in-wins
 * semantics so `props.class` overrides `props.ui?.base`.
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
 * The plain classes passed alongside a replacer, which still apply on top of the
 * replacement. Nested arrays are flattened so none are dropped.
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

/* ------------------------------------------------------------------ *
 * spec resolution
 * ------------------------------------------------------------------ */

function isEmptyObject(obj: any): boolean {
  if (!obj || typeof obj !== 'object') {
    return true
  }
  for (const _key in obj) {
    return false
  }
  return true
}

const falsyToString = (value: any) => value === false ? 'false' : value === true ? 'true' : value === 0 ? '0' : value

function flatFilter(target: any[], value: any): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      flatFilter(target, item)
    }
  } else if (value) {
    target.push(value)
  }
}

/**
 * Merge an extended theme's variants into the extending ones: the extended value
 * comes first, and two strings are joined with a space.
 */
function mergeVariants(own: any, extended: any): any {
  const result: Record<string, any> = {}
  for (const key in own) {
    const value = own[key]
    if (key in extended) {
      const extendedValue = extended[key]
      if (Array.isArray(value) || Array.isArray(extendedValue)) {
        const flat: any[] = []
        flatFilter(flat, extendedValue)
        flatFilter(flat, value)
        result[key] = flat
      } else if (typeof value === 'object' && typeof extendedValue === 'object' && value && extendedValue) {
        result[key] = mergeVariants(value, extendedValue)
      } else {
        result[key] = extendedValue + ' ' + value
      }
    } else {
      result[key] = value
    }
  }
  for (const key in extended) {
    if (!(key in own)) {
      result[key] = extended[key]
    }
  }
  return result
}

interface Spec {
  config: TVMergeConfig | undefined
  base: ClassValue
  slots: Record<string, ClassValue>
  hasSlots: boolean
  variants: Record<string, Record<string, any> | undefined>
  variantKeys: string[]
  compoundVariants: Record<string, any>[]
  defaultVariants: Record<string, any>
  extend: any
  /** Lazily compiled per-slot resolvers, shared across factory rebuilds. */
  compiled: Record<string, CompiledSlot | undefined>
}

function resolveSpec(options: Record<string, any>, config: TVMergeConfig | undefined): Spec {
  const extend = options.extend ?? null
  const extendSlots = extend?.slots
  const ownVariants = options.variants ?? {}
  const ownCompound = options.compoundVariants ?? []
  const ownDefaults = options.defaultVariants ?? {}

  const variants = extend?.variants && !isEmptyObject(extend.variants) ? mergeVariants(ownVariants, extend.variants) : ownVariants
  const defaultVariants = extend?.defaultVariants && !isEmptyObject(extend.defaultVariants) ? { ...extend.defaultVariants, ...ownDefaults } : ownDefaults

  let compoundVariants = ownCompound
  if (extend?.compoundVariants && !isEmptyObject(extend.compoundVariants)) {
    const flat: any[] = []
    flatFilter(flat, extend.compoundVariants)
    flatFilter(flat, ownCompound)
    compoundVariants = flat
  }

  // A construction-time replacer receives what the extended theme contributes and
  // stands in for it, so those keys skip the join below rather than being blanked
  // on the way in.
  const replaced = new Set<string>()

  let ownBase = options.base
  if (typeof ownBase === 'function') {
    // A slotted theme keeps its base under `slots.base` and a slotless one at the
    // top level, so read whichever the extended theme actually has.
    ownBase = (ownBase as SlotClassReplacer)(mergeClasses(config, extendSlots?.base ?? extend?.base) ?? '')
    replaced.add('base')
  }

  const rawSlots = options.slots ?? {}
  let ownSlots: Record<string, any> = rawSlots
  for (const key in rawSlots) {
    if (typeof rawSlots[key] !== 'function') {
      continue
    }
    if (ownSlots === rawSlots) {
      ownSlots = { ...rawSlots }
    }
    ownSlots[key] = (rawSlots[key] as SlotClassReplacer)(mergeClasses(config, extendSlots?.[key]) ?? '')
    replaced.add(key)
  }

  const base = replaced.has('base') || !extend?.base ? ownBase : cx(extend.base, ownBase)

  const isExtendedSlotsEmpty = isEmptyObject(extendSlots)
  const componentSlots: Record<string, any> = !isEmptyObject(ownSlots)
    ? { base: replaced.has('base') ? ownBase : cx(ownBase, isExtendedSlotsEmpty && extend?.base), ...ownSlots }
    : {}

  let slots: Record<string, any>
  if (isExtendedSlotsEmpty) {
    slots = componentSlots
  } else {
    // Own slot classes are appended to the extended ones, slot by slot.
    slots = { ...extendSlots }
    const own = isEmptyObject(componentSlots) ? { base: ownBase } : componentSlots
    for (const key in own) {
      slots[key] = replaced.has(key) || !(key in slots) ? own[key] : cx(slots[key], own[key])
    }
  }

  return {
    config,
    base,
    slots,
    hasSlots: !isEmptyObject(ownSlots) || !isExtendedSlotsEmpty,
    variants,
    variantKeys: Object.keys(variants),
    compoundVariants,
    defaultVariants,
    extend,
    compiled: Object.create(null)
  }
}

/* ------------------------------------------------------------------ *
 * per-slot compilation
 * ------------------------------------------------------------------ */

interface CompiledVariant {
  key: string
  /** Variant value key → pre-joined class string for this slot. */
  table: Record<string, string | undefined>
  defaultValue: any
}

interface CompiledCompound {
  keys: string[]
  values: any[]
  cls: string
}

interface CompiledSlot {
  static: ClassValue
  variants: CompiledVariant[]
  compounds: CompiledCompound[]
  /** Every prop key that can change this slot's output — the memo key domain. */
  relevantKeys: string[]
  cache: Map<string, string | undefined>
}

/**
 * The class a variant value or compound contributes to one slot: plain strings
 * and arrays apply to `base` only, objects are indexed by slot.
 */
function classForSlot(value: any, slotKey: string): any {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value[slotKey]
  }
  return slotKey === 'base' ? value : undefined
}

function compileSlot(spec: Spec, slotKey: string): CompiledSlot {
  const relevant = new Set<string>()
  const variants: CompiledVariant[] = []

  for (const key of spec.variantKeys) {
    const group = spec.variants[key]
    if (!group || isEmptyObject(group)) {
      continue
    }
    const table: Record<string, string | undefined> = Object.create(null)
    let hasAny = false
    for (const valueKey in group) {
      const cls = cx(classForSlot(group[valueKey], slotKey))
      if (cls) {
        table[valueKey] = cls
        hasAny = true
      }
    }
    // A variant with nothing to contribute to this slot stays in the resolve path
    // (it still reads the prop) but out of the cache key, since it can never
    // change the output.
    if (hasAny) {
      relevant.add(key)
    }
    variants.push({ key, table, defaultValue: spec.defaultVariants[key] })
  }

  const compounds: CompiledCompound[] = []
  for (const compound of spec.compoundVariants) {
    const cls = cx(classForSlot(compound.class, slotKey), classForSlot(compound.className, slotKey))
    if (!cls) {
      continue
    }
    const keys: string[] = []
    const values: any[] = []
    for (const key in compound) {
      if (key !== 'class' && key !== 'className') {
        keys.push(key)
        values.push(compound[key])
        relevant.add(key)
      }
    }
    compounds.push({ keys, values, cls })
  }

  return {
    static: spec.slots[slotKey],
    variants,
    compounds,
    relevantKeys: [...relevant],
    cache: new Map()
  }
}

/* ------------------------------------------------------------------ *
 * slot resolution
 * ------------------------------------------------------------------ */

const isNullishOrFalse = (value: any) => value === null || value === undefined || value === false

function matchesCompound(compound: CompiledCompound, defaults: Record<string, any>, props: Props, slotProps: Props): boolean {
  for (let i = 0; i < compound.keys.length; i++) {
    const key = compound.keys[i]!
    const expected = compound.values[i]
    // Raw spread order: defaults < props (`undefined` dropped) < slotProps
    // (`undefined` kept).
    let actual
    if (slotProps && key in slotProps) {
      actual = slotProps[key]
    } else if (props && props[key] !== undefined) {
      actual = props[key]
    } else {
      actual = defaults[key]
    }
    if (Array.isArray(expected)) {
      if (!expected.includes(actual)) {
        return false
      }
    } else {
      // `null`, `undefined` and `false` are equivalent on both sides.
      if (isNullishOrFalse(expected) && isNullishOrFalse(actual)) {
        continue
      }
      if (actual !== expected) {
        return false
      }
    }
  }
  return true
}

function variantClass(variant: CompiledVariant, props: Props, slotProps: Props): string | undefined {
  const prop = slotProps?.[variant.key] ?? props?.[variant.key]
  if (prop === null) {
    return undefined
  }
  const propKey = falsyToString(prop)
  if (typeof propKey === 'object') {
    return undefined
  }
  const key = propKey ?? falsyToString(variant.defaultValue)
  return variant.table[(key || 'false') as string]
}

/**
 * Resolve one slot: its own classes, the variants that match, the compounds that
 * match, then whatever the caller passed. A replacer in the caller's classes
 * takes the place of everything below it, keeping the plain classes passed
 * alongside.
 */
function resolveSlot(spec: Spec, compiled: CompiledSlot, props: Props, slotProps: Props): string | undefined {
  const parts: any[] = [compiled.static]
  for (const variant of compiled.variants) {
    const cls = variantClass(variant, props, slotProps)
    if (cls) {
      parts.push(cls)
    }
  }
  for (const compound of compiled.compounds) {
    if (matchesCompound(compound, spec.defaultVariants, props, slotProps)) {
      parts.push(compound.cls)
    }
  }
  if (!slotProps) {
    return mergeClasses(spec.config, ...parts)
  }

  const replacer = findReplacer(slotProps.class) ?? findReplacer(slotProps.className)
  if (!replacer) {
    parts.push(slotProps.class, slotProps.className)
    return mergeClasses(spec.config, ...parts)
  }
  return mergeClasses(
    spec.config,
    replacer(mergeClasses(spec.config, ...parts) ?? ''),
    plainClasses(slotProps.class),
    plainClasses(slotProps.className)
  ) ?? ''
}

/* ------------------------------------------------------------------ *
 * memoization (fingerprint over the slot's relevant keys + class overrides)
 * ------------------------------------------------------------------ */

const BAIL = Symbol('bail')

function serialize(value: any): string | typeof BAIL {
  if (value === undefined) {
    return 'u'
  }
  if (value === null) {
    return 'n'
  }
  switch (typeof value) {
    case 'string': return '"' + value
    case 'boolean': return value ? 't' : 'f'
    case 'number': return Number.isFinite(value) ? '#' + value : BAIL
    default: return BAIL
  }
}

/**
 * `class` / `className` values, where flat-ish arrays of primitives are allowed.
 * A replacer is a function, so it bails here and never reaches the cache.
 */
function serializeClass(value: any, depth = 0): string | typeof BAIL {
  if (Array.isArray(value)) {
    if (depth >= 4) {
      return BAIL
    }
    let out = '['
    for (const item of value) {
      const part = serializeClass(item, depth + 1)
      if (part === BAIL) {
        return BAIL
      }
      out += part + ','
    }
    return out
  }
  return serialize(value)
}

function fingerprint(compiled: CompiledSlot, props: Props, slotProps: Props): string | typeof BAIL {
  let out = ''
  for (const key of compiled.relevantKeys) {
    // Variant lookup (`??`) and compound matching (spread) treat an `undefined`
    // slot prop differently, so the key captures both views.
    const inSlot = slotProps !== undefined && key in slotProps
    const slotValue = inSlot ? slotProps![key] : undefined
    const value = inSlot && slotValue !== undefined ? slotValue : props?.[key]
    const part = serialize(value)
    if (part === BAIL) {
      return BAIL
    }
    out += part + (inSlot && slotValue === undefined ? '!' : '') + ';'
  }
  if (slotProps) {
    const cls = serializeClass(slotProps.class)
    const clsName = serializeClass(slotProps.className)
    if (cls === BAIL || clsName === BAIL) {
      return BAIL
    }
    out += '|' + cls + '|' + clsName
  }
  return out
}

const CACHE_LIMIT = 1000

function resolveSlotCached(spec: Spec, slotKey: string, props: Props, slotProps: Props): string | undefined {
  const compiled = (spec.compiled[slotKey] ??= compileSlot(spec, slotKey))
  const key = fingerprint(compiled, props, slotProps)
  if (key === BAIL) {
    return resolveSlot(spec, compiled, props, slotProps)
  }
  const cache = compiled.cache
  let result = cache.get(key)
  // `undefined` is a real result (a slot whose chain resolves to no classes), so
  // the extra `has` runs only for those and the hot path stays one lookup.
  if (result === undefined && !cache.has(key)) {
    if (cache.size >= CACHE_LIMIT) {
      // Pathological dynamic inputs (per-row generated classes, say): reset
      // rather than grow unbounded.
      cache.clear()
    }
    result = resolveSlot(spec, compiled, props, slotProps)
    cache.set(key, result)
  }
  return result
}

/* ------------------------------------------------------------------ *
 * factory
 * ------------------------------------------------------------------ */

interface TVComponent {
  (props?: Record<string, any>): any
  extend: any
  base: ClassValue
  slots: Record<string, ClassValue>
  variants: Record<string, Record<string, any> | undefined>
  defaultVariants: Record<string, any>
  compoundVariants: Record<string, any>[]
  variantKeys: string[]
}

/**
 * Compiled entries for the dominant `tv({ extend: theme })` call shape, keyed by
 * theme identity so every rebuild and every instance reuses one spec.
 */
const themeSpecs = new WeakMap<object, Spec>()

function onlyExtend(options: Record<string, any>): boolean {
  for (const key in options) {
    if (key !== 'extend') {
      return false
    }
  }
  return typeof options.extend === 'object' && options.extend !== null
}

function createTV(config?: TVMergeConfig) {
  return function tv(options: Record<string, any> = {}, callConfig?: TVMergeConfig): TVComponent {
    const usedConfig = callConfig ? { ...config, ...callConfig } : config

    let spec: Spec | undefined
    if (!callConfig && onlyExtend(options)) {
      spec = themeSpecs.get(options.extend)
      if (spec && spec.config !== config) {
        spec = undefined
      }
      if (!spec) {
        spec = resolveSpec(options, config)
        themeSpecs.set(options.extend, spec)
      }
    } else {
      spec = resolveSpec(options, usedConfig)
    }
    const resolved = spec

    const component = ((props?: Record<string, any>) => {
      if (!resolved.hasSlots) {
        if (resolved.variantKeys.length === 0) {
          const replacer = findReplacer(props?.class) ?? findReplacer(props?.className)
          if (!replacer) {
            return mergeClasses(resolved.config, resolved.base, props?.class, props?.className)
          }
          return mergeClasses(
            resolved.config,
            replacer(mergeClasses(resolved.config, resolved.base) ?? ''),
            plainClasses(props?.class),
            plainClasses(props?.className)
          ) ?? ''
        }
        // Slotless with variants: resolve as an implicit `base` slot fed by the
        // top-level `base` classes. `class` / `className` travel as slot props so
        // the other invocation props keep props-only resolution.
        resolved.compiled.base ??= compileSlot({ ...resolved, slots: { base: resolved.base } }, 'base')
        const overrides = props && (props.class !== undefined || props.className !== undefined)
          ? { class: props.class, className: props.className }
          : undefined
        return resolveSlotCached(resolved, 'base', props, overrides)
      }

      const fns: Record<string, (slotProps?: Record<string, any>) => string | undefined> = {}
      for (const slotKey in resolved.slots) {
        fns[slotKey] = slotProps => resolveSlotCached(resolved, slotKey, props, slotProps)
      }
      return fns
    }) as TVComponent

    // Metadata reads, which is what `extend: tv(theme)` resolves against.
    component.extend = resolved.extend
    component.base = resolved.base
    component.slots = resolved.slots
    component.variants = resolved.variants
    component.defaultVariants = resolved.defaultVariants
    component.compoundVariants = resolved.compoundVariants
    component.variantKeys = resolved.variantKeys

    return component
  }
}

const appConfigTv = appConfig as AppConfig & { ui: { tv: TVMergeConfig } }

/**
 * Build a component's classes from its theme, the `app.config.ui` overrides
 * merged on top, and the props it is invoked with.
 */
export const tv = /* @__PURE__ */ createTV(appConfigTv.ui?.tv) as TV
