import type { ThemeDoc, ShadeStop, StyleOptions } from './types'
import { DEFAULT_COLORS, THEME_DEFAULTS, SEMANTIC_ALIASES, VARIANT_GROUPS, VARIANT_SUPPORT, styleTokens, TOKEN_SHADE_TARGETS, parseUiColorRef } from './types'
import { FONT_WEIGHT_DEFAULTS } from '../studio'

/**
 * The studio's setting sections, each owning a slice of the ThemeDoc.
 * `pickSection` extracts a section's normalized state ("absent" and
 * "explicitly stock" compare equal); `mergeSection` splices one doc's slice
 * into another, which is all a per-section reset is. The baseline is the
 * ACTIVE PRESET's doc: dirty means "touched after applying the preset", not
 * "differs from stock".
 */
/** Every colour alias owns its own slice, so one changed alias stays one. */
export type ColorSection = 'primary' | 'neutral' | typeof SEMANTIC_ALIASES[number]

export type SectionKey
  = | ColorSection
    | 'font' | 'type' | 'weights'
    | 'icons' | 'radius' | 'size' | 'buttons' | 'panels' | 'inputs'

/** Which font fields the `font` and `type` sections each own. */
const FONT_STACKS = ['sans', 'serif', 'mono'] as const
const TYPE_FIELDS = ['uppercase', 'italic', 'letterSpacing', 'lineHeight'] as const

/**
 * Only the sections that back a multi-section panel. Every other section owns
 * a toolbar control and carries its own `sectionDirty`.
 */
export const SECTION_GROUPS: Record<'colors' | 'defaults', SectionKey[]> = {
  colors: ['primary', 'neutral', ...SEMANTIC_ALIASES],
  defaults: ['size', 'buttons', 'panels', 'inputs']
}

/** Every section, for whole-document comparisons against the baseline. */
export const ALL_SECTION_KEYS: SectionKey[] = [...SECTION_GROUPS.colors, ...SECTION_GROUPS.defaults, 'font', 'type', 'weights', 'icons', 'radius']

/** Which color section a semantic token (or token shade) belongs to. */
function tokenSection(token: string): ColorSection {
  if (token === '--ui-primary' || token.startsWith('--ui-color-primary')) return 'primary'
  const semantic = SEMANTIC_ALIASES.find(alias => token === `--ui-${alias}`)
  if (semantic) return semantic
  return 'neutral'
}

/**
 * applyDoc promotes ramp-shaped token overrides into style.tokenShades, so a
 * live doc and its preset express the SAME choice in different slots, both
 * sides compare canonicalized: promotable tokens count as shades.
 */
export function promotedShades(doc: ThemeDoc): Record<string, { light?: ShadeStop, dark?: ShadeStop }> {
  const promoted: Record<string, { light?: ShadeStop, dark?: ShadeStop }> = {}
  const parse = (value: string | undefined, ramp: string) => {
    const ref = parseUiColorRef(value)
    return ref?.alias === ramp ? ref.shade as ShadeStop : undefined
  }
  for (const target of TOKEN_SHADE_TARGETS) {
    if (doc.style?.tokenShades?.[target.token]) continue
    const light = parse(doc.tokens?.light?.[target.token], target.ramp)
    const dark = parse(doc.tokens?.dark?.[target.token], target.ramp)
    if (light !== undefined || dark !== undefined) {
      promoted[target.token] = { ...(light !== undefined ? { light } : {}), ...(dark !== undefined ? { dark } : {}) }
    }
  }
  return promoted
}

function ownedTokens(doc: ThemeDoc, section: ColorSection) {
  // tokens the doc's own style treatment emits are DERIVED, a live doc
  // carries them merged into tokens, a preset doc never does
  const derived = styleTokens(doc.style ?? {})
  const promoted = promotedShades(doc)
  const pickMode = (mode: 'light' | 'dark') =>
    Object.fromEntries(Object.entries(doc.tokens?.[mode] ?? {})
      .filter(([token]) => !(token in derived[mode])
        && promoted[token]?.[mode] === undefined
        && tokenSection(token) === section))
  return { light: pickMode('light'), dark: pickMode('dark') }
}

function ownedTokenShades(doc: ThemeDoc, section: ColorSection) {
  return Object.fromEntries(Object.entries(canonicalTokenShades(doc)).filter(([token]) => tokenSection(token) === section))
}

function alias(doc: ThemeDoc, name: keyof typeof DEFAULT_COLORS): string {
  return doc.colors?.[name] ?? DEFAULT_COLORS[name]
}

/** The custom ramp an alias references, if the doc carries one. */
function aliasPalette(doc: ThemeDoc, name: keyof typeof DEFAULT_COLORS) {
  return doc.palettes?.[alias(doc, name)]
}

type VariantGroupKey = 'buttons' | 'panels' | 'inputs'

/** The pickers store the stock choice as `'default'`; for a fingerprint that is the same as nothing chosen. */
const chosen = (value?: string | null) => (value && value !== 'default' ? value : null)

function groupPick(doc: ThemeDoc, group: VariantGroupKey) {
  const defaults = doc.style?.defaults
  return {
    // effective variant: the group's own choice, else the app-wide fallback
    variant: chosen(defaults?.variants?.[group]) ?? chosen(defaults?.variant),
    color: chosen(defaults?.colors?.[group])
  }
}

export function pickSection(doc: ThemeDoc, key: SectionKey): unknown {
  const style: StyleOptions = doc.style ?? {}
  switch (key) {
    case 'primary':
      return {
        // both: black only overrides --ui-primary, the ramp still colours
        // every primary-* utility, so a ramp change under black is a change
        color: alias(doc, 'primary'),
        black: !!doc.blackAsPrimary,
        palette: aliasPalette(doc, 'primary') ?? null,
        tokens: ownedTokens(doc, 'primary'),
        shades: ownedTokenShades(doc, 'primary')
      }
    case 'neutral':
      return {
        color: alias(doc, 'neutral'),
        palette: aliasPalette(doc, 'neutral') ?? null,
        tokens: ownedTokens(doc, 'neutral'),
        shades: ownedTokenShades(doc, 'neutral')
      }
    case 'secondary':
    case 'success':
    case 'info':
    case 'warning':
    case 'error':
      return {
        color: alias(doc, key),
        palette: aliasPalette(doc, key) ?? null,
        tokens: ownedTokens(doc, key),
        shades: ownedTokenShades(doc, key)
      }
    // Explicit stock values count as absent throughout: setFontPrefs strips
    // them on apply while a preset doc may spell them out, and a raw
    // comparison would read dirty forever, jamming the toolbar reset.
    case 'font': {
      const font = doc.font ?? {}
      return {
        sans: font.sans && font.sans !== THEME_DEFAULTS.font ? font.sans : null,
        serif: font.serif ?? null,
        mono: font.mono ?? null
      }
    }
    case 'weights':
      return Object.fromEntries(Object.entries(doc.font?.weights ?? {})
        .filter(([step, weight]) => weight !== FONT_WEIGHT_DEFAULTS[step as keyof typeof FONT_WEIGHT_DEFAULTS]))
    case 'type': {
      const font = doc.font ?? {}
      return {
        // size lives in the Treatment section, so the type slice owns it
        size: doc.fontSize ?? THEME_DEFAULTS.fontSize,
        uppercase: !!font.uppercase,
        italic: !!font.italic,
        letterSpacing: font.letterSpacing ?? 0,
        lineHeight: font.lineHeight ?? 1.5
      }
    }
    case 'icons':
      return doc.icons ?? THEME_DEFAULTS.icons
    case 'radius':
      return doc.radius ?? THEME_DEFAULTS.radius
    case 'size':
      return chosen(style.defaults?.size)
    case 'buttons':
    case 'panels':
    case 'inputs':
      return groupPick(doc, key)
  }
}

/** Stable stringify (sorted keys, undefined entries dropped) so values compare structurally. */
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => entry !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(',')}}`
  }
  return JSON.stringify(value) ?? 'null'
}

export function sectionFingerprint(doc: ThemeDoc, key: SectionKey): string {
  return stableStringify(pickSection(doc, key))
}

/**
 * A doc's effective per-token shade choices: explicit style.tokenShades plus
 * ramp-shaped token overrides. Per-row shade resets restore THESE.
 */
export function canonicalTokenShades(doc: ThemeDoc): Record<string, { light?: ShadeStop, dark?: ShadeStop }> {
  return { ...promotedShades(doc), ...doc.style?.tokenShades }
}

/* --------------------------------------------------------------- merge -- */

function setOrDelete<T extends object, K extends keyof T>(target: T, key: K, value: T[K] | undefined) {
  if (value === undefined) Reflect.deleteProperty(target, key)
  else target[key] = value
}

function pruneEmpty(doc: ThemeDoc) {
  for (const key of ['colors', 'palettes'] as const) {
    if (doc[key] && !Object.keys(doc[key]!).length) Reflect.deleteProperty(doc, key)
  }
  if (doc.tokens) {
    for (const mode of ['light', 'dark'] as const) {
      if (doc.tokens[mode] && !Object.keys(doc.tokens[mode]!).length) Reflect.deleteProperty(doc.tokens, mode)
    }
    if (!Object.keys(doc.tokens).length) delete doc.tokens
  }
  if (doc.style?.defaults) {
    for (const key of ['variants', 'colors'] as const) {
      if (doc.style.defaults[key] && !Object.keys(doc.style.defaults[key]!).length) Reflect.deleteProperty(doc.style.defaults, key)
    }
    if (!Object.keys(doc.style.defaults).length) delete doc.style.defaults
  }
  if (doc.style?.tokenShades && !Object.keys(doc.style.tokenShades).length) delete doc.style.tokenShades
  // last: the two prunes above can empty it
  if (doc.style && !Object.keys(doc.style).length) delete doc.style
}

/** Replace the listed font fields with the base doc's, dropping `font` when nothing is left. */
function mergeFontFields(doc: ThemeDoc, base: ThemeDoc, fields: readonly (keyof NonNullable<ThemeDoc['font']>)[]) {
  const font = { ...doc.font } as Record<string, unknown>
  for (const field of fields) {
    const value = base.font?.[field]
    if (value === undefined) Reflect.deleteProperty(font, field)
    else font[field] = structuredClone(value)
  }
  setOrDelete(doc, 'font', Object.keys(font).length ? font as ThemeDoc['font'] : undefined)
}

/** Replace one alias's color + referenced palette with the base doc's. */
function mergeAlias(doc: ThemeDoc, base: ThemeDoc, name: keyof typeof DEFAULT_COLORS) {
  const currentPaletteName = alias(doc, name)

  doc.colors ??= {}
  setOrDelete(doc.colors, name, base.colors?.[name])

  // The ramp this alias just left goes only if no other alias still rides it.
  const stillReferenced = (Object.keys(DEFAULT_COLORS) as Array<keyof typeof DEFAULT_COLORS>)
    .some(other => alias(doc, other) === currentPaletteName)
  if (doc.palettes && !stillReferenced) Reflect.deleteProperty(doc.palettes, currentPaletteName)

  const basePalette = aliasPalette(base, name)
  if (basePalette) {
    doc.palettes ??= {}
    doc.palettes[alias(base, name)] = structuredClone(basePalette)
  }
}

/** Swap a color section's tokens/token-shades for the base doc's. */
function mergeColorExtras(doc: ThemeDoc, base: ThemeDoc, section: ColorSection) {
  for (const mode of ['light', 'dark'] as const) {
    const kept = Object.entries(doc.tokens?.[mode] ?? {}).filter(([token]) => tokenSection(token) !== section)
    const added = Object.entries(base.tokens?.[mode] ?? {}).filter(([token]) => tokenSection(token) === section)
    const merged = Object.fromEntries([...kept, ...added])
    if (Object.keys(merged).length) {
      doc.tokens ??= {}
      doc.tokens[mode] = merged
    } else if (doc.tokens) {
      Reflect.deleteProperty(doc.tokens, mode)
    }
  }
  const keptShades = Object.entries(doc.style?.tokenShades ?? {}).filter(([token]) => tokenSection(token) !== section)
  const addedShades = Object.entries(base.style?.tokenShades ?? {}).filter(([token]) => tokenSection(token) === section)
  const mergedShades = Object.fromEntries([...keptShades, ...addedShades])
  if (Object.keys(mergedShades).length) {
    doc.style ??= {}
    doc.style.tokenShades = mergedShades as StyleOptions['tokenShades']
  } else if (doc.style) {
    delete doc.style.tokenShades
  }
}

/**
 * A new doc with `key`'s slice taken from `base` and everything else from
 * `current`, apply it and the section is reset to the baseline.
 */
export function mergeSection(current: ThemeDoc, base: ThemeDoc, key: SectionKey): ThemeDoc {
  const doc = structuredClone(current)
  doc.style = doc.style ? structuredClone(doc.style) : undefined
  const baseStyle: StyleOptions = base.style ?? {}

  switch (key) {
    case 'primary':
      setOrDelete(doc, 'blackAsPrimary', base.blackAsPrimary || undefined)
      mergeAlias(doc, base, 'primary')
      mergeColorExtras(doc, base, 'primary')
      break
    case 'neutral':
      mergeAlias(doc, base, 'neutral')
      mergeColorExtras(doc, base, 'neutral')
      break
    case 'secondary':
    case 'success':
    case 'info':
    case 'warning':
    case 'error':
      mergeAlias(doc, base, key)
      mergeColorExtras(doc, base, key)
      break
    case 'font':
      mergeFontFields(doc, base, FONT_STACKS)
      break
    case 'weights':
      mergeFontFields(doc, base, ['weights'])
      break
    case 'type':
      mergeFontFields(doc, base, TYPE_FIELDS)
      setOrDelete(doc, 'fontSize', base.fontSize)
      break
    case 'icons':
      setOrDelete(doc, 'icons', base.icons)
      break
    case 'radius':
      setOrDelete(doc, 'radius', base.radius)
      break
    case 'size':
      if (doc.style?.defaults || baseStyle.defaults?.size !== undefined) {
        doc.style ??= {}
        doc.style.defaults = { ...doc.style.defaults }
        setOrDelete(doc.style.defaults, 'size', baseStyle.defaults?.size)
      }
      break
    case 'buttons':
    case 'panels':
    case 'inputs':
      if (doc.style?.defaults || baseStyle.defaults) {
        doc.style ??= {}
        const defaults = doc.style.defaults = { ...doc.style.defaults }
        defaults.variants = { ...defaults.variants }
        defaults.colors = { ...defaults.colors }
        // An app-wide variant reaches this group through the fallback the
        // fingerprint reads, so it explodes into the other groups (where
        // they support it) before this one is set, or it would come back.
        const appWide = chosen(defaults.variant)
        if (appWide) {
          for (const group of Object.keys(VARIANT_GROUPS) as VariantGroupKey[]) {
            if (group === key || chosen(defaults.variants[group])) continue
            if (VARIANT_GROUPS[group].some(component => VARIANT_SUPPORT[component]?.includes(appWide))) {
              defaults.variants[group] = appWide as typeof defaults.variant
            }
          }
          delete defaults.variant
        }
        // chosen() answers null for the fingerprint's sake, setOrDelete wants undefined
        setOrDelete(defaults.variants, key, (chosen(baseStyle.defaults?.variants?.[key]) ?? chosen(baseStyle.defaults?.variant) ?? undefined) as typeof defaults.variant)
        setOrDelete(defaults.colors, key, baseStyle.defaults?.colors?.[key])
      }
      break
  }

  if (doc.style === undefined) delete doc.style
  pruneEmpty(doc)
  return doc
}
