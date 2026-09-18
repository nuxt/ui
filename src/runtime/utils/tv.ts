import { twMerge, extendTailwindMerge } from 'tailwind-merge'
import type { AppConfig } from '@nuxt/schema'
import { isEmpty } from './index'
import type { ClassValue, SlotClassReplacer, TVMergeConfig, TV } from '../types/tv'
import appConfig from '#build/app.config'

/**
 * The variants engine. It covers exactly the surface our themes use, which is
 * `base`, `slots`, `variants`, `compoundVariants` and `defaultVariants`, a theme
 * and one overrides object on top of it, and leaves out `compoundSlots` and the
 * per-call config argument, neither of which appears in any theme or call site.
 *
 * Class values may be a `(defaults) => classes` **replacer**, which takes the
 * place of what it receives instead of appending to it. In `app.config.ui` that
 * is the slot's classes from the theme, resolved at construction time, and
 * `variants` / `compoundVariants` still apply on top. In `:ui` and the `class`
 * prop it is the slot's whole resolved chain.
 *
 * The performance model follows how components call it, `tv(theme,
 * appConfig.ui.<c>)(props)` rebuilt inside a computed:
 * - build defers all merging and resolves to a shared compiled entry: the theme
 *   is a WeakMap hit, and overrides are keyed by content, so every rebuild,
 *   instance and server request with the same `app.config.ui.<c>` shares one.
 *   Content rather than identity because Nuxt clones the app config per request
 *   on the server and mutates it in place on the client (`updateAppConfig`, HMR).
 * - invoking allocates slot closures only, with no class resolution
 * - a slot call lazily compiles a per-slot lookup table (variant value to class
 *   for that slot, compounds pre-filtered per slot), then memoizes the resolved
 *   string by a fingerprint of the few props that can affect that slot
 *
 * The caches live on the compiled entry rather than on the invocation, so they
 * survive factory rebuilds and every instance of a component hits the same ones.
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
 * The `tailwind-merge` instance for a config. `app.config.ui.tv` is build
 * configuration: it is read once per config object, since the slot caches hold
 * merged results and would serve the previous setting anyway. Returns `null`
 * when merging is turned off (`twMerge: false`).
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

/**
 * The single seam every class string passes through.
 */
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
  const replacer = findReplacer(overrides.class)
  if (!replacer) {
    parts.push(overrides.class)
    return mergeClasses(config, ...parts)
  }
  return mergeClasses(config, replacer(mergeClasses(config, ...parts) ?? ''), overrides.class) ?? ''
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
 * Merge the theme's variants into the overriding ones, value by value. Two
 * per-slot objects merge slot by slot, two class values are joined, and a class
 * value meeting a per-slot object is read as its `base`, which is where a plain
 * value lands in a slotted theme anyway. That last case is where
 * `app.config.ui.<c>.variants.size.md = 'text-lg'` over a theme's
 * `{ base, label }` used to resolve to `"[object Object] text-lg"`.
 */
function mergeVariants(own: any, theme: any): any {
  const result: Record<string, any> = {}
  for (const key in own) {
    result[key] = key in theme ? mergeVariantValue(own[key], theme[key]) : own[key]
  }
  for (const key in theme) {
    if (!(key in own)) {
      result[key] = theme[key]
    }
  }
  return result
}

function mergeVariantValue(own: any, theme: any): any {
  const ownIsObject = isPlainObject(own)
  const themeIsObject = isPlainObject(theme)
  if (ownIsObject || themeIsObject) {
    return mergeVariants(ownIsObject ? own : { base: own }, themeIsObject ? theme : { base: theme })
  }
  const flat: any[] = []
  flatFilter(flat, theme)
  flatFilter(flat, own)
  return flat
}

/**
 * One layer of a spec, resolved in full (slot classes, variants, compound
 * variants) before the next one, last class winning:
 * - the theme: its slot classes, the variants, its compound variants. The
 *   overrides' variants merge into the theme's here, value by value, so they
 *   stay beneath the theme's compounds. A compound is often the exception to a
 *   variant (`square` and `size` to `p-1.5`), and tuning the variant from
 *   `app.config.ui` doesn't mean to cancel it.
 * - the overrides: their slot classes, then their compound variants, so
 *   `app.config.ui.<c>.slots.<x>` wins over what the theme resolved the way
 *   `:ui` does, and the more specific compound still wins over it.
 */
interface Layer {
  /** Per slot, or under `base` for a slotless theme. */
  statics: Record<string, ClassValue>
  variants: Record<string, Record<string, any> | undefined>
  compoundVariants: Record<string, any>[]
}

interface Spec {
  config: TVMergeConfig | undefined
  layers: Layer[]
  slotKeys: string[]
  hasSlots: boolean
  defaultVariants: Record<string, any>
  /** Lazily compiled per-slot resolvers, shared across factory rebuilds. */
  compiled: Record<string, CompiledSlot | undefined>
}

/**
 * Resolve a construction-time replacer against what the theme contributes, so
 * it stands in for those classes instead of appending to them.
 */
function replaceClasses(config: TVMergeConfig | undefined, replacer: SlotClassReplacer, inherited: ClassValue): ClassValue {
  return replacer(mergeClasses(config, inherited) ?? '')
}

const EMPTY: Record<string, any> = {}

function flatten(value: any): any[] {
  const flat: any[] = []
  flatFilter(flat, value)
  return flat
}

/**
 * Stack the overrides (`app.config.ui.<c>`) on the theme. A replacer among them
 * resolves against the theme's slot classes and takes their place in the theme
 * layer, so the variants and compound variants still apply on top of it.
 */
function resolveSpec(theme: Record<string, any>, overrides: Record<string, any> | undefined, config: TVMergeConfig | undefined): Spec {
  const own = overrides ?? EMPTY

  const themeSlots: Record<string, any> = theme.slots ?? {}
  const isThemeSlotsEmpty = isEmpty(themeSlots)

  // What the theme contributes to a slot. A slotless theme contributes its
  // top-level `base` to the `base` slot, which is how a user adds slots on top
  // of a theme that only has a `base`.
  const inherited = (key: string) => isThemeSlotsEmpty ? (key === 'base' ? theme.base : undefined) : themeSlots[key]

  const baseReplaced = typeof own.base === 'function'
  const ownBase = baseReplaced ? replaceClasses(config, own.base, inherited('base')) : own.base

  const rawSlots: Record<string, any> = own.slots ?? {}
  let ownSlots = rawSlots
  for (const key in rawSlots) {
    if (typeof rawSlots[key] !== 'function') {
      continue
    }
    if (ownSlots === rawSlots) {
      ownSlots = { ...rawSlots }
    }
    ownSlots[key] = replaceClasses(config, rawSlots[key], inherited(key))
  }

  // Slot keys come from both sides, `base` included as soon as there are slots
  // at all; a theme with nothing but a `base` stays slotless and resolves
  // through an implicit `base` slot.
  const hasSlots = !isThemeSlotsEmpty || !isEmpty(ownSlots)
  const slotKeys = hasSlots ? [...new Set(['base', ...Object.keys(themeSlots), ...Object.keys(ownSlots)])] : []

  const themeStatics: Record<string, ClassValue> = {}
  const ownStatics: Record<string, ClassValue> = {}
  for (const key of hasSlots ? slotKeys : ['base']) {
    const ownClasses = key === 'base' ? cx(ownBase, hasSlots ? ownSlots.base : undefined) : ownSlots[key]
    const replaced = typeof rawSlots[key] === 'function' || (key === 'base' && baseReplaced)
    if (replaced) {
      themeStatics[key] = ownClasses
    } else {
      themeStatics[key] = inherited(key)
      ownStatics[key] = ownClasses
    }
  }

  const ownVariants = own.variants ?? {}
  const layers: Layer[] = [{
    statics: themeStatics,
    variants: isEmpty(theme.variants) ? ownVariants : mergeVariants(ownVariants, theme.variants),
    compoundVariants: flatten(theme.compoundVariants)
  }]
  if (overrides) {
    layers.push({ statics: ownStatics, variants: {}, compoundVariants: flatten(own.compoundVariants) })
  }

  return {
    config,
    layers,
    slotKeys,
    hasSlots,
    defaultVariants: isEmpty(theme.defaultVariants) ? own.defaultVariants ?? {} : { ...theme.defaultVariants, ...own.defaultVariants },
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

interface CompiledLayer {
  static: ClassValue
  variants: CompiledVariant[]
  compounds: CompiledCompound[]
}

interface CompiledSlot {
  layers: CompiledLayer[]
  /** Every prop key that can change this slot's output, the memo key domain. */
  relevantKeys: string[]
  cache: Generations<string | undefined>
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

function compileLayer(layer: Layer, defaultVariants: Record<string, any>, slotKey: string, relevant: Set<string>): CompiledLayer {
  const variants: CompiledVariant[] = []
  for (const key in layer.variants) {
    const group = layer.variants[key]
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
      variants.push({ key, table, defaultValue: defaultVariants[key] })
    }
  }

  const compounds: CompiledCompound[] = []
  for (const compound of layer.compoundVariants) {
    const cls = cx(classForSlot(compound.class, slotKey))
    if (!cls) {
      continue
    }
    const keys: string[] = []
    const values: any[] = []
    for (const key in compound) {
      if (key !== 'class') {
        keys.push(key)
        values.push(compound[key])
        relevant.add(key)
      }
    }
    compounds.push({ keys, values, cls })
  }

  return { static: layer.statics[slotKey], variants, compounds }
}

function compileSlot(spec: Spec, slotKey: string): CompiledSlot {
  const relevant = new Set<string>()
  const layers = spec.layers.map(layer => compileLayer(layer, spec.defaultVariants, slotKey, relevant))
  return {
    layers,
    relevantKeys: [...relevant],
    cache: new Generations(SLOT_CACHE_LIMIT)
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
  const parts: any[] = []
  for (const layer of compiled.layers) {
    parts.push(layer.static)
    for (const variant of layer.variants) {
      const cls = variantClass(variant, props, slotProps)
      if (cls) {
        parts.push(cls)
      }
    }
    for (const compound of layer.compounds) {
      if (matchesCompound(compound, spec.defaultVariants, props, slotProps)) {
        parts.push(compound.cls)
      }
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
 * `class` values, where flat-ish arrays of primitives are allowed.
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
    // key records the value the lookup will see plus a marker for the other
    // view, which one since an array expectation tells `null` from `undefined`.
    const inSlot = slotProps != null && key in slotProps
    const slotValue = inSlot ? slotProps![key] : undefined
    const fallsThrough = slotValue == null
    const part = serialize(fallsThrough ? props?.[key] : slotValue)
    if (part === BAIL) {
      return BAIL
    }
    out += part + (inSlot && fallsThrough ? (slotValue === null ? '!n' : '!u') : '') + ';'
  }
  if (slotProps) {
    const cls = serializeClass(slotProps.class)
    if (cls === BAIL) {
      return BAIL
    }
    out += '|' + cls
  }
  return out
}

const SLOT_CACHE_LIMIT = 256

/**
 * Two generations: when the current one fills up it becomes the previous one
 * instead of being cleared, and a hit there is promoted. Entries used within the
 * last generation survive, so a Table with per-row classes degrades its own hit
 * rate without wiping the static entries every other instance of that component
 * is hitting. The caches are shared for the process, so that containment matters.
 */
class Generations<V> {
  private current = new Map<string, V>()
  private previous: Map<string, V> | undefined

  constructor(private limit: number) {}

  /** Returns `BAIL` on a miss, since `undefined` is a real cached result. */
  get(key: string): V | typeof BAIL {
    const current = this.current
    const hit = current.get(key)
    if (hit !== undefined || current.has(key)) {
      return hit as V
    }
    const previous = this.previous
    if (previous) {
      const old = previous.get(key)
      if (old !== undefined || previous.has(key)) {
        previous.delete(key)
        this.set(key, old as V)
        return old as V
      }
    }
    return BAIL
  }

  set(key: string, value: V): void {
    if (this.current.size >= this.limit) {
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

/** Compiled entries for a theme on its own, keyed by identity. */
const themeSpecs = new WeakMap<object, Spec>()

/** Compiled entries per theme for the overrides it was called with, keyed by content. */
const overrideSpecs = new WeakMap<object, Generations<Spec>>()

const OVERRIDES_LIMIT = 32

const functionIds = new WeakMap<(...args: any[]) => any, number>()
let nextFunctionId = 0

/**
 * The content key of an overrides object, in the `serialize` encoding, so every
 * object that says the same thing shares one compiled entry. A replacer keys by
 * identity, which is what its captured scope makes it.
 */
function keyOfOverrides(value: any, depth = 0): string | typeof BAIL {
  if (typeof value === 'function') {
    let id = functionIds.get(value)
    if (id === undefined) {
      functionIds.set(value, id = ++nextFunctionId)
    }
    return 'F' + id
  }
  if (typeof value !== 'object' || value === null) {
    return serialize(value)
  }
  if (depth >= 8) {
    return BAIL
  }
  if (Array.isArray(value)) {
    let out = '['
    for (const item of value) {
      const part = keyOfOverrides(item, depth + 1)
      if (part === BAIL) {
        return BAIL
      }
      out += part + ','
    }
    return out + ']'
  }
  let out = '{'
  for (const key of Object.keys(value)) {
    const part = keyOfOverrides(value[key], depth + 1)
    if (part === BAIL) {
      return BAIL
    }
    out += '$' + key.length + ':' + key + '=' + part + ','
  }
  return out + '}'
}

function specFor(theme: Record<string, any>, overrides: Record<string, any> | null | undefined, config: TVMergeConfig | undefined): Spec {
  if (overrides == null || isEmpty(overrides)) {
    let spec = themeSpecs.get(theme)
    if (!spec) {
      spec = resolveSpec(theme, undefined, config)
      themeSpecs.set(theme, spec)
    }
    return spec
  }
  const key = keyOfOverrides(overrides)
  if (key === BAIL) {
    return resolveSpec(theme, overrides, config)
  }
  let specs = overrideSpecs.get(theme)
  if (!specs) {
    specs = new Generations<Spec>(OVERRIDES_LIMIT)
    overrideSpecs.set(theme, specs)
  }
  let spec = specs.get(key)
  if (spec === BAIL) {
    spec = resolveSpec(theme, overrides, config)
    specs.set(key, spec)
  }
  return spec
}

function createTV(config?: TVMergeConfig) {
  return function tv(theme: Record<string, any>, overrides?: Record<string, any> | null) {
    const spec = specFor(theme, overrides, config)

    return (props?: Record<string, any>) => {
      if (!spec.hasSlots) {
        // A slotless theme resolves as one implicit `base` slot. `class` travels
        // as a slot prop so the other invocation props keep props-only resolution.
        const slotProps = props && props.class !== undefined ? { class: props.class } : undefined
        return resolveSlotCached(spec, 'base', props, slotProps)
      }

      const fns: Record<string, (slotProps?: Record<string, any>) => string | undefined> = {}
      for (const slotKey of spec.slotKeys) {
        fns[slotKey] = slotProps => resolveSlotCached(spec, slotKey, props, slotProps)
      }
      return fns
    }
  }
}

const appConfigTv = appConfig as AppConfig & { ui: { tv: TVMergeConfig } }

/**
 * Build a component's classes from its theme, the `app.config.ui.<c>` overrides
 * merged on top, and the props it is invoked with.
 */
export const tv = /* @__PURE__ */ createTV(appConfigTv.ui?.tv) as TV
