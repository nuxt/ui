import { computed, isReactive } from 'vue'
import type { ComputedRef } from 'vue'
import { twMerge, extendTailwindMerge } from 'tailwind-merge'
import { isEmpty } from './index'
import { unstyledTheme } from './unstyled'
import { applyPrefix } from './prefix'
import type { ClassValue, SlotClassReplacer, TVMergeConfig, TV } from '../types/tv'

/**
 * The variants engine. It covers exactly the surface our themes use, which is
 * `slots`, `variants`, `compoundVariants` and `defaultVariants`, a theme
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
 * overrides.value)(props)` rebuilt inside a computed, where the overrides carry
 * the component's `app.config.ui.<c>` and the engine for the app's merge config
 * and prefix (one engine per distinct config, see `engineFor`):
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
 * merger (`app.config.ui.tv` to a `tailwind-merge` instance, created once per config)
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
 * The `tailwind-merge` instance for a config. `app.config.ui.tv` is read once
 * per config object: each engine gets its own copy (see `engineFor`), since the
 * slot caches hold merged results. Returns `null` when merging is turned off
 * (`merge: false`).
 */
function getMerger(config: TVMergeConfig | undefined): Merger | null {
  if (!config) {
    return twMerge
  }
  let merger = mergerCache.get(config)
  if (merger === undefined) {
    const mergeConfig = config.mergeConfig as Record<string, any> | undefined
    merger = config.merge === false
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
 * One step of a spec. Steps resolve in order, last class winning:
 * 1. the theme's slot classes and its variants
 * 2. the overrides' variants, so tuning one from `app.config.ui` wins over
 *    every theme variant, not only the ones declared before it
 * 3. the theme's compound variants. A compound is often the exception to a
 *    variant (`square` and `size` to `p-1.5`), and tuning the variant doesn't
 *    mean to cancel it, so it stays above both.
 * 4. the overrides' slot classes, then their compound variants, so
 *    `app.config.ui.<c>.slots.<x>` wins over what the theme resolved the way
 *    `:ui` does, and the more specific compound still wins over it.
 */
interface Layer {
  /** Per slot. */
  statics?: Record<string, ClassValue>
  variants?: Record<string, Record<string, any> | undefined>
  compoundVariants?: Record<string, any>[]
}

interface Spec {
  config: TVMergeConfig | undefined
  layers: Layer[]
  slotKeys: string[]
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
 * A plain copy of class data. Slots compile lazily, and the overrides are a
 * reactive object Nuxt mutates in place, so a spec that kept references would
 * compile whatever they hold by then under the key of what they held before.
 */
function snapshot<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(snapshot) as T
  }
  if (isPlainObject(value)) {
    const copy: Record<string, any> = {}
    for (const key of Object.keys(value)) {
      copy[key] = snapshot(value[key])
    }
    return copy as T
  }
  return value
}

/**
 * Stack the overrides (`app.config.ui.<c>`) on the theme. A replacer among them
 * resolves against the theme's slot classes and takes their place in the theme
 * layer, so the variants and compound variants still apply on top of it.
 */
function resolveSpec(theme: Record<string, any>, overrides: Record<string, any> | undefined, config: TVMergeConfig | undefined): Spec {
  const own = overrides ?? EMPTY

  const themeSlots: Record<string, any> = theme.slots ?? EMPTY
  const ownSlots: Record<string, any> = own.slots ?? EMPTY

  const slotKeys = [...new Set([...Object.keys(themeSlots), ...Object.keys(ownSlots)])]

  if (import.meta.dev) {
    const slot = slotKeys[0] ?? 'base'
    warnBareClasses(theme, slot)
    warnBareClasses(own, slot)
  }

  // A replacer's result stands in for the theme's classes, beneath the
  // variants. Plain classes are overrides like any other and go on top.
  const themeStatics: Record<string, ClassValue> = {}
  const ownStatics: Record<string, ClassValue> = {}
  for (const key of slotKeys) {
    const slotClasses = ownSlots[key]
    if (typeof slotClasses === 'function') {
      themeStatics[key] = replaceClasses(config, slotClasses, themeSlots[key])
    } else {
      themeStatics[key] = themeSlots[key]
      ownStatics[key] = snapshot(slotClasses)
    }
  }

  const layers: Layer[] = [{ statics: themeStatics, variants: theme.variants }]
  if (!isEmpty(own.variants)) {
    layers.push({ variants: snapshot(own.variants) })
  }
  layers.push({ compoundVariants: flatten(theme.compoundVariants) })
  if (overrides) {
    layers.push({ statics: ownStatics, compoundVariants: snapshot(flatten(own.compoundVariants)) })
  }

  return {
    config,
    layers,
    slotKeys,
    defaultVariants: { ...theme.defaultVariants, ...own.defaultVariants },
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
 * The class a variant value or compound contributes to one slot. Classes are
 * always given per slot, so anything but an object contributes nothing.
 */
function classForSlot(value: any, slotKey: string): any {
  return isPlainObject(value) ? value[slotKey] : undefined
}

/**
 * A variant or compound class outside a slot object targets nothing. Types
 * catch it where overrides are written (`app.config.ts`), a `vite.config`, a
 * plain JS config or a theme handed straight to `tv` doesn't, so say it once in
 * development rather than dropping the classes silently.
 */
const warned = new Set<string>()

function warnBareClasses(source: Record<string, any>, slot: string): void {
  const bare = (value: any) => !!value && !isPlainObject(value)
  const warn = (where: string, value: any) => {
    const message = `[@nuxt/ui] ${where} must be an object of classes per slot, e.g. \`{ ${slot}: '...' }\`. Received ${typeof value === 'string' ? JSON.stringify(value) : String(value)}, which is ignored.`
    // Specs are rebuilt per overrides, and on every call when those can't be keyed.
    if (!warned.has(message)) {
      warned.add(message)
      console.warn(message)
    }
  }
  for (const key in source.variants ?? EMPTY) {
    const group = source.variants[key] ?? EMPTY
    for (const valueKey in group) {
      if (bare(group[valueKey])) {
        warn(`\`variants.${key}.${valueKey}\``, group[valueKey])
      }
    }
  }
  for (const compound of flatten(source.compoundVariants)) {
    if (bare(compound?.class)) {
      warn('A `compoundVariants` entry\'s `class`', compound.class)
    }
  }
}

function compileLayer(layer: Layer, defaultVariants: Record<string, any>, slotKey: string, relevant: Set<string>): CompiledLayer {
  const variants: CompiledVariant[] = []
  const groups = layer.variants ?? EMPTY
  for (const key in groups) {
    const group = groups[key]
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
  for (const compound of layer.compoundVariants ?? []) {
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

  return { static: layer.statics?.[slotKey], variants, compounds }
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
  if (value instanceof RegExp) {
    return 'R' + String(value)
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

/**
 * The content key of a reactive `app.config.ui.<c>`, recomputed only when that
 * object changes rather than on every variant prop change of every instance.
 * A plain object can't signal a mutation, so it is walked on every call.
 */
const reactiveKeys = new WeakMap<object, ComputedRef<string | typeof BAIL>>()

function contentKey(overrides: Record<string, any>): string | typeof BAIL {
  if (!isReactive(overrides)) {
    return keyOfOverrides(overrides)
  }
  let key = reactiveKeys.get(overrides)
  if (!key) {
    key = computed(() => keyOfOverrides(overrides))
    reactiveKeys.set(overrides, key)
  }
  return key.value
}

type Build = (props?: Record<string, any>) => Record<string, (slotProps?: Record<string, any>) => string | undefined>

type Engine = (theme: Record<string, any>, overrides?: Record<string, any> | null, unstyled?: boolean) => Build

/**
 * An engine for one merge config and prefix, with the compiled entries it owns:
 * a spec holds merged classes, so engines never share them.
 */
function createEngine(config?: TVMergeConfig, prefix?: string): Engine {
  /** Compiled entries for a theme on its own, keyed by identity. */
  const themeSpecs = new WeakMap<object, Spec>()

  /** Compiled entries per theme for the overrides it was called with, keyed by content. */
  const overrideSpecs = new WeakMap<object, Generations<Spec>>()

  // The themes ship unprefixed, so with Tailwind's `prefix(...)` each resolves
  // against a prefixed copy, built once per theme object
  const prefixedThemes = new WeakMap<object, Record<string, any>>()

  function specFor(theme: Record<string, any>, overrides: Record<string, any> | null | undefined): Spec {
    if (overrides == null || isEmpty(overrides)) {
      let spec = themeSpecs.get(theme)
      if (!spec) {
        spec = resolveSpec(theme, undefined, config)
        themeSpecs.set(theme, spec)
      }
      return spec
    }
    const key = contentKey(overrides)
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

  return function build(theme, overrides, unstyled) {
    // `unstyled` from the nearest `<UTheme>`: resolve against the blanked theme,
    // so only the overrides, `:ui` and `class` classes remain
    if (unstyled) {
      theme = unstyledTheme(theme)
    } else if (prefix) {
      let prefixed = prefixedThemes.get(theme)
      if (!prefixed) {
        prefixed = applyPrefix(theme, prefix) as Record<string, any>
        prefixedThemes.set(theme, prefixed)
      }
      theme = prefixed
    }
    const spec = specFor(theme, overrides)

    return (props?: Record<string, any>) => {
      const fns: Record<string, (slotProps?: Record<string, any>) => string | undefined> = {}
      const slotKeys = spec.slotKeys
      for (let i = 0; i < slotKeys.length; i++) {
        const slotKey = slotKeys[i]!
        fns[slotKey] = slotProps => resolveSlotCached(spec, slotKey, props, slotProps)
      }
      return fns
    }
  }
}

/** The engine for a `tv()` called with plain overrides: the default merger, no prefix. */
const defaultEngine = /* @__PURE__ */ createEngine()

const engines = new Map<string, Engine>()

/**
 * The engine for the merge config (`app.config.ui.tv`) and Tailwind prefix of
 * the nearest theme. Keyed by content, since Nuxt clones the app config for
 * each request on the server, and built once per key.
 */
export function engineFor(config?: TVMergeConfig, prefix?: string): Engine {
  if (!config && !prefix) {
    return defaultEngine
  }
  const configKey = config ? contentKey(config) : ''
  if (configKey === BAIL) {
    return createEngine(config, prefix)
  }
  const key = `${prefix ?? ''}|${configKey}`
  let engine = engines.get(key)
  if (!engine) {
    // A copy, so a config mutated in place (HMR) doesn't reach the merger an
    // engine built for its previous content
    engine = createEngine(config && snapshot(config), prefix)
    engines.set(key, engine)
  }
  return engine
}

/**
 * A component's overrides as `useComponentOverrides` resolves them from the
 * nearest theme: its `app.config.ui.<c>` entry, whether the subtree is
 * `unstyled`, and the engine for the app's merge config and prefix.
 */
export class ComponentOverrides<O = Record<string, any>> {
  constructor(
    readonly entry: O | undefined,
    readonly unstyled: boolean,
    readonly engine: Engine
  ) {}
}

/**
 * Build a component's classes from its theme, the overrides on top of it, and
 * the props it is invoked with. A component passes its `ComponentOverrides`;
 * plain overrides (`{ slots, variants, ... }`, plus `unstyled`) resolve with the
 * default merger and no prefix.
 */
export const tv = /* @__PURE__ */ ((theme: Record<string, any>, overrides?: Record<string, any> | ComponentOverrides | null): Build => {
  if (overrides instanceof ComponentOverrides) {
    return overrides.engine(theme, overrides.entry as Record<string, any> | undefined, overrides.unstyled)
  }
  if (overrides?.unstyled) {
    const { unstyled: _, ...rest } = overrides
    return defaultEngine(theme, rest, true)
  }
  return defaultEngine(theme, overrides)
}) as TV
