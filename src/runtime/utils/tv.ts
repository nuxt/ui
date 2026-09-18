import { twMerge, extendTailwindMerge } from 'tailwind-merge'
import type { AppConfig } from '@nuxt/schema'
import { isEmpty } from './index'
import type { ClassValue, SlotClassReplacer, TVMergeConfig, TV } from '../types/tv'
import appConfig from '#build/app.config'

/**
 * The variants engine. It covers exactly the surface our themes use, which is
 * `extend`, `base`, `slots`, `variants`, `compoundVariants` and
 * `defaultVariants`, and leaves out `compoundSlots` and the per-call config
 * argument, neither of which appears in any theme or call site.
 *
 * Class values may be a `(defaults) => classes` **replacer**, which takes the
 * place of what it receives instead of appending to it. In `app.config.ui` that
 * is the slot's classes from the extended theme, resolved at construction time,
 * and `variants` / `compoundVariants` still apply on top. In `:ui` and the
 * `class` prop it is the slot's whole resolved chain.
 *
 * The performance model follows how components call it, `tv({ extend: theme,
 * ...appConfig })(props)` rebuilt inside a computed:
 * - build defers all merging, and the unconfigured case (`{ extend: theme }`) is
 *   a WeakMap hit sharing one compiled entry across every rebuild and instance.
 *   Anything spread in beside `extend` resolves a fresh spec per rebuild, which
 *   is what the two-argument call contract will fix.
 * - invoking allocates slot closures only, with no class resolution
 * - a slot call lazily compiles a per-slot lookup table (variant value to class
 *   for that slot, compounds pre-filtered per slot), then memoizes the resolved
 *   string by a fingerprint of the few props that can affect that slot
 *
 * The caches live on the compiled entry rather than on the invocation, so they
 * survive factory rebuilds and are shared by every instance of a component.
 */

type Props = Record<string, any> | undefined

/* ------------------------------------------------------------------ *
 * class joining (clsx-style, `undefined` when there are none)
 * ------------------------------------------------------------------ */

const SPACE_REGEX = /\s+/g

function push(list: string[], input: any): void {
  if (!input && input !== 0 && input !== 0n) {
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
 * merger (`twMergeConfig` to `tailwind-merge` instance, created once per config)
 * ------------------------------------------------------------------ */

type Merger = (classes: string) => string

const mergerCache = new WeakMap<object, Merger>()

function hasDefinedKey(obj: Record<string, any> | undefined): boolean {
  for (const key in obj) {
    if (obj[key] !== undefined) {
      return true
    }
  }
  return false
}

/**
 * The single seam every class string passes through. `twMerge: false` is read
 * on every call so it can be flipped at runtime; the instance built from
 * `twMergeConfig` is keyed on that object's identity, so it is rebuilt when the
 * object is replaced, not when it is mutated.
 */
function getMerger(config: TVMergeConfig | undefined): Merger | null {
  if (!config) {
    return twMerge
  }
  if (config.twMerge === false) {
    return null
  }
  const mergeConfig = config.twMergeConfig as Record<string, any> | undefined
  if (!mergeConfig) {
    return twMerge
  }
  let merger = mergerCache.get(mergeConfig)
  if (!merger) {
    merger = !hasDefinedKey(mergeConfig)
      ? twMerge
      : extendTailwindMerge({
          ...mergeConfig,
          extend: {
            theme: mergeConfig.theme,
            classGroups: mergeConfig.classGroups,
            conflictingClassGroupModifiers: mergeConfig.conflictingClassGroupModifiers,
            conflictingClassGroups: mergeConfig.conflictingClassGroups,
            ...mergeConfig.extend
          }
        } as Parameters<typeof extendTailwindMerge>[0])
    mergerCache.set(mergeConfig, merger)
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
 * Merge a resolved chain with the classes a caller passed. A replacer among them
 * takes the place of the chain; the plain classes passed alongside it still
 * apply on top, since `cx` drops the function itself when joining.
 */
function mergeWithOverrides(config: TVMergeConfig | undefined, parts: any[], overrides: Props): string | undefined {
  if (!overrides) {
    return mergeClasses(config, ...parts)
  }
  const replacer = findReplacer(overrides.class) ?? findReplacer(overrides.className)
  if (!replacer) {
    parts.push(overrides.class, overrides.className)
    return mergeClasses(config, ...parts)
  }
  return mergeClasses(config, replacer(mergeClasses(config, ...parts) ?? ''), overrides.class, overrides.className) ?? ''
}

/* ------------------------------------------------------------------ *
 * spec resolution
 * ------------------------------------------------------------------ */

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

const isPlainObject = (value: any): value is Record<string, any> => typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Merge an extended theme's variants into the extending ones, value by value.
 * Two per-slot objects merge slot by slot, two class values are joined, and a
 * class value meeting a per-slot object is read as its `base`, which is where a
 * plain value lands in a slotted theme anyway. That last case is where
 * `app.config.ui.<c>.variants.size.md = 'text-lg'` over a theme's
 * `{ base, label }` used to resolve to `"[object Object] text-lg"`.
 */
function mergeVariants(own: any, extended: any): any {
  const result: Record<string, any> = {}
  for (const key in own) {
    result[key] = key in extended ? mergeVariantValue(own[key], extended[key]) : own[key]
  }
  for (const key in extended) {
    if (!(key in own)) {
      result[key] = extended[key]
    }
  }
  return result
}

function mergeVariantValue(own: any, extended: any): any {
  const ownIsObject = isPlainObject(own)
  const extendedIsObject = isPlainObject(extended)
  if (ownIsObject || extendedIsObject) {
    return mergeVariants(ownIsObject ? own : { base: own }, extendedIsObject ? extended : { base: extended })
  }
  const flat: any[] = []
  flatFilter(flat, extended)
  flatFilter(flat, own)
  return flat
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
  /** Lazily compiled per-slot resolvers, shared across factory rebuilds. */
  compiled: Record<string, CompiledSlot | undefined>
}

/**
 * Resolve a construction-time replacer against what the extended theme
 * contributes, so it stands in for those classes instead of appending to them.
 */
function replaceClasses(config: TVMergeConfig | undefined, replacer: SlotClassReplacer, extended: ClassValue): ClassValue {
  return replacer(mergeClasses(config, extended) ?? '')
}

function resolveSpec(options: Record<string, any>, config: TVMergeConfig | undefined): Spec {
  const extend = options.extend ?? null
  const extendSlots = extend?.slots
  const ownVariants = options.variants ?? {}
  const ownCompound = options.compoundVariants ?? []
  const ownDefaults = options.defaultVariants ?? {}

  const variants = isEmpty(extend?.variants) ? ownVariants : mergeVariants(ownVariants, extend.variants)
  const defaultVariants = isEmpty(extend?.defaultVariants) ? ownDefaults : { ...extend.defaultVariants, ...ownDefaults }

  let compoundVariants = ownCompound
  if (!isEmpty(extend?.compoundVariants)) {
    const flat: any[] = []
    flatFilter(flat, extend.compoundVariants)
    flatFilter(flat, ownCompound)
    compoundVariants = flat
  }

  const baseReplaced = typeof options.base === 'function'
  // A slotted theme keeps its base under `slots.base` and a slotless one at the
  // top level, so a base replacer reads whichever the extended theme has.
  const ownBase = baseReplaced ? replaceClasses(config, options.base, extendSlots?.base ?? extend?.base) : options.base

  const rawSlots: Record<string, any> = options.slots ?? {}
  let ownSlots = rawSlots
  for (const key in rawSlots) {
    if (typeof rawSlots[key] !== 'function') {
      continue
    }
    if (ownSlots === rawSlots) {
      ownSlots = { ...rawSlots }
    }
    ownSlots[key] = replaceClasses(config, rawSlots[key], extendSlots?.[key])
  }

  const base = baseReplaced || !extend?.base ? ownBase : cx(extend.base, ownBase)

  const isExtendedSlotsEmpty = isEmpty(extendSlots)
  // A slotless extended theme contributes its top-level `base` to the `base`
  // slot of a slotted one, which is how a user adds slots on top of a theme
  // that only has a `base`.
  const componentSlots: Record<string, any> = isEmpty(ownSlots)
    ? {}
    : { base: baseReplaced ? ownBase : cx(ownBase, isExtendedSlotsEmpty && extend?.base), ...ownSlots }

  let slots: Record<string, any>
  if (isExtendedSlotsEmpty) {
    slots = componentSlots
  } else {
    // Own slot classes are appended to the extended ones, slot by slot, except
    // where a replacer already resolved them.
    slots = { ...extendSlots }
    const own = isEmpty(componentSlots) ? { base: ownBase } : componentSlots
    for (const key in own) {
      const replaced = typeof rawSlots[key] === 'function' || (key === 'base' && baseReplaced)
      slots[key] = replaced || !(key in slots) ? own[key] : cx(slots[key], own[key])
    }
  }

  return {
    config,
    base,
    slots,
    hasSlots: !isEmpty(slots),
    variants,
    variantKeys: Object.keys(variants),
    compoundVariants,
    defaultVariants,
    compiled: Object.create(null)
  }
}

/* ------------------------------------------------------------------ *
 * per-slot compilation
 * ------------------------------------------------------------------ */

interface CompiledVariant {
  key: string
  /** Variant value key to pre-joined class string for this slot. */
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
  /** Every prop key that can change this slot's output, the memo key domain. */
  relevantKeys: string[]
  cache: SlotCache
}

/**
 * The class a variant value or compound contributes to one slot: objects are
 * indexed by slot, anything else applies to `base`.
 */
function classForSlot(value: any, slotKey: string): any {
  if (isPlainObject(value)) {
    return value[slotKey]
  }
  return slotKey === 'base' ? value : undefined
}

function compileSlot(spec: Spec, slotKey: string): CompiledSlot {
  const relevant = new Set<string>()
  const variants: CompiledVariant[] = []

  for (const key of spec.variantKeys) {
    const group = spec.variants[key]
    if (!group || isEmpty(group)) {
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
    // A variant with nothing to contribute to this slot can't change its output,
    // so it stays out of both the resolve path and the cache key.
    if (hasAny) {
      relevant.add(key)
      variants.push({ key, table, defaultValue: spec.defaultVariants[key] })
    }
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
    // A slotless theme resolves through an implicit `base` slot fed by its
    // top-level `base`, which stays off `spec.slots` so `extend` still reads `{}`.
    static: spec.hasSlots ? spec.slots[slotKey] : spec.base,
    variants,
    compounds,
    relevantKeys: [...relevant],
    cache: new SlotCache()
  }
}

/* ------------------------------------------------------------------ *
 * slot resolution
 * ------------------------------------------------------------------ */

const isNullishOrFalse = (value: any) => value === null || value === undefined || value === false

/**
 * Slot props are read with `in`, so an inherited enumerable key counts, the same
 * way the variant lookup below reads it through `slotProps[key]`.
 */
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
  const key = falsyToString(prop) ?? falsyToString(variant.defaultValue)
  return variant.table[(key || 'false') as string]
}

/**
 * Resolve one slot: its own classes, the variants that match, the compounds that
 * match, then whatever the caller passed.
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
  return mergeWithOverrides(spec.config, parts, slotProps)
}

/* ------------------------------------------------------------------ *
 * memoization (fingerprint over the slot's relevant keys + class overrides)
 * ------------------------------------------------------------------ */

const BAIL = Symbol('bail')

/**
 * Every value is encoded so that no two inputs share a key: strings carry their
 * length, so a `;`, `,` or `"` inside an arbitrary value (`font-[a,"b"]`) can't
 * read as a separator.
 */
function serialize(value: any): string | typeof BAIL {
  if (value === undefined) {
    return 'u'
  }
  if (value === null) {
    return 'n'
  }
  switch (typeof value) {
    case 'string': return '$' + value.length + ':' + value
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
    return out + ']'
  }
  return serialize(value)
}

function fingerprint(compiled: CompiledSlot, props: Props, slotProps: Props): string | typeof BAIL {
  let out = ''
  for (const key of compiled.relevantKeys) {
    // A nullish slot prop falls through to the invocation prop in the variant
    // lookup (`??`) but still counts as set for compound matching (`in`), so the
    // key records the value the lookup will see plus a marker for the other view.
    const inSlot = slotProps != null && key in slotProps
    const slotValue = inSlot ? slotProps![key] : undefined
    const fallsThrough = slotValue == null
    const part = serialize(fallsThrough ? props?.[key] : slotValue)
    if (part === BAIL) {
      return BAIL
    }
    out += part + (inSlot && fallsThrough ? '!' : '') + ';'
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

const CACHE_LIMIT = 256

/**
 * Two generations: when the current one fills up it becomes the previous one
 * instead of being cleared, and a hit there is promoted. Entries used within the
 * last generation survive, so a Table with per-row classes degrades its own hit
 * rate without wiping the static entries every other instance of that component
 * is hitting. The cache is shared for the process, so that containment matters.
 */
class SlotCache {
  private current = new Map<string, string | undefined>()
  private previous: Map<string, string | undefined> | undefined

  /** Returns `BAIL` on a miss, since `undefined` is a real cached result. */
  get(key: string): string | undefined | typeof BAIL {
    const current = this.current
    const hit = current.get(key)
    if (hit !== undefined || current.has(key)) {
      return hit
    }
    const previous = this.previous
    if (previous) {
      const old = previous.get(key)
      if (old !== undefined || previous.has(key)) {
        previous.delete(key)
        this.set(key, old)
        return old
      }
    }
    return BAIL
  }

  set(key: string, value: string | undefined): void {
    if (this.current.size >= CACHE_LIMIT) {
      this.previous = this.current
      this.current = new Map()
    }
    this.current.set(key, value)
  }
}

function resolveSlotCached(spec: Spec, slotKey: string, props: Props, slotProps: Props): string | undefined {
  const compiled = (spec.compiled[slotKey] ??= compileSlot(spec, slotKey))
  const key = fingerprint(compiled, props, slotProps)
  if (key === BAIL) {
    return resolveSlot(spec, compiled, props, slotProps)
  }
  let result = compiled.cache.get(key)
  if (result === BAIL) {
    result = resolveSlot(spec, compiled, props, slotProps)
    compiled.cache.set(key, result)
  }
  return result
}

/* ------------------------------------------------------------------ *
 * factory
 * ------------------------------------------------------------------ */

interface TVComponent {
  (props?: Record<string, any>): any
  base: ClassValue
  slots: Record<string, ClassValue>
  variants: Record<string, Record<string, any> | undefined>
  defaultVariants: Record<string, any>
  compoundVariants: Record<string, any>[]
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
  return function tv(options: Record<string, any> = {}): TVComponent {
    let spec: Spec | undefined
    if (onlyExtend(options)) {
      spec = themeSpecs.get(options.extend)
      if (!spec) {
        spec = resolveSpec(options, config)
        themeSpecs.set(options.extend, spec)
      }
    } else {
      spec = resolveSpec(options, config)
    }
    const resolved = spec

    const component = ((props?: Record<string, any>) => {
      if (!resolved.hasSlots) {
        // A slotless theme resolves as one implicit `base` slot. `class` /
        // `className` travel as slot props so the other invocation props keep
        // props-only resolution.
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
    component.base = resolved.base
    component.slots = resolved.slots
    component.variants = resolved.variants
    component.defaultVariants = resolved.defaultVariants
    component.compoundVariants = resolved.compoundVariants

    return component
  }
}

const appConfigTv = appConfig as AppConfig & { ui: { tv: TVMergeConfig } }

/**
 * Build a component's classes from its theme, the `app.config.ui` overrides
 * merged on top, and the props it is invoked with.
 */
export const tv = /* @__PURE__ */ createTV(appConfigTv.ui?.tv) as TV
