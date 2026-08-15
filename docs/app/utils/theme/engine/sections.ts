import type { ThemeDoc, ShadeStop } from './types'
import { DEFAULT_COLORS, THEME_DEFAULTS, SEMANTIC_ALIASES } from './types'
import { FONT_WEIGHT_DEFAULTS } from '../studio'
import type { StyleOptions } from './styles'
import { styleTokens, TOKEN_SHADE_TARGETS } from './styles'
import { parseUiColorRef } from './resolve'

/**
 * The studio's setting sections, each owning a slice of the ThemeDoc.
 * `pickSection` extracts a section's normalized state ("absent" and
 * "explicitly stock" compare equal); `mergeSection` splices one doc's slice
 * into another, which is all a per-section reset is. The baseline is the
 * ACTIVE PRESET's doc: dirty means "touched after applying the preset", not
 * "differs from stock".
 */
export type SectionKey
  = | 'primary' | 'neutral' | 'semantic'
    | 'font' | 'icons' | 'scale' | 'buttons' | 'panels' | 'inputs'
    | 'shadow' | 'innerShadow' | 'borders'

export const SECTION_GROUPS: Record<'colors' | 'style', SectionKey[]> = {
  colors: ['primary', 'neutral', 'semantic'],
  // Everything that isn't colour: type, icons, scale, per-component defaults
  // and the shadow/border treatments. One group, the General/Style split
  // only ever chopped a long list in half.
  style: ['font', 'icons', 'scale', 'shadow', 'innerShadow', 'borders', 'buttons', 'panels', 'inputs']
}

/** Which color section a semantic token (or token shade) belongs to. */
function tokenSection(token: string): 'primary' | 'semantic' | 'neutral' {
  if (token === '--ui-primary' || token.startsWith('--ui-color-primary')) return 'primary'
  if (SEMANTIC_ALIASES.some(alias => token === `--ui-${alias}`)) return 'semantic'
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

function ownedTokens(doc: ThemeDoc, section: 'primary' | 'semantic' | 'neutral') {
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

function ownedTokenShades(doc: ThemeDoc, section: 'primary' | 'semantic' | 'neutral') {
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

function groupPick(doc: ThemeDoc, group: VariantGroupKey) {
  const defaults = doc.style?.defaults
  return {
    // effective variant: the group's own choice, else the app-wide fallback
    variant: defaults?.variants?.[group] ?? defaults?.variant ?? null,
    color: defaults?.colors?.[group] ?? null
  }
}

export function pickSection(doc: ThemeDoc, key: SectionKey): unknown {
  const style: StyleOptions = doc.style ?? {}
  switch (key) {
    case 'primary':
      return {
        color: doc.blackAsPrimary ? 'black' : alias(doc, 'primary'),
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
    case 'semantic':
      return {
        colors: Object.fromEntries(SEMANTIC_ALIASES.map(name => [name, alias(doc, name)])),
        palettes: Object.fromEntries(SEMANTIC_ALIASES.map(name => [name, aliasPalette(doc, name) ?? null])),
        tokens: ownedTokens(doc, 'semantic'),
        shades: ownedTokenShades(doc, 'semantic')
      }
    case 'font': {
      // Explicit stock values count as absent: setFontPrefs strips them on
      // apply while a preset doc may spell them out (8-bit), raw comparison
      // would read dirty forever, jamming the toolbar reset.
      const font = { ...(doc.font ?? {}) }
      const weights = Object.fromEntries(Object.entries(font.weights ?? {})
        .filter(([step, weight]) => weight !== FONT_WEIGHT_DEFAULTS[step as keyof typeof FONT_WEIGHT_DEFAULTS]))
      if (Object.keys(weights).length) font.weights = weights as typeof font.weights
      else delete font.weights
      if (font.letterSpacing === 0) delete font.letterSpacing
      if (font.lineHeight === 1.5) delete font.lineHeight
      if (font.heading) {
        const heading = { ...font.heading }
        if (heading.weight === 700) delete heading.weight
        if (heading.letterSpacing === 0) delete heading.letterSpacing
        if (heading.lineHeight === 1.25) delete heading.lineHeight
        if (Object.keys(heading).length) font.heading = heading
        else delete font.heading
      }
      return font
    }
    case 'icons':
      return doc.icons ?? THEME_DEFAULTS.icons
    case 'scale':
      return {
        radius: doc.radius ?? THEME_DEFAULTS.radius,
        fontSize: doc.fontSize ?? THEME_DEFAULTS.fontSize,
        spacing: doc.spacing ?? THEME_DEFAULTS.spacing,
        size: style.defaults?.size ?? null
      }
    case 'buttons':
    case 'panels':
    case 'inputs':
      return groupPick(doc, key)
    case 'shadow': {
      // 'shade' with no explicit stops emits exactly the stock shadow
      // colors (neutral-950 / black), a non-choice, same as absent
      const color = style.shadowColor === 'default' ? null : style.shadowColor ?? null
      return {
        shadow: style.shadow ?? null,
        color: color === 'shade' && !style.shadowShade ? null : color,
        shade: style.shadowShade ?? null,
        opacity: style.shadowOpacity ?? null,
        geometry: style.shadowGeometry ?? null,
        // explicit true equals absent (press is the default)
        press: style.shadowPress === false ? false : null
      }
    }
    case 'innerShadow':
      return {
        shadow: style.innerShadow ?? null,
        color: style.innerShadowColor ?? null,
        shade: style.innerShadowShade ?? null,
        opacity: style.innerShadowOpacity ?? null,
        geometry: style.innerShadowGeometry ?? null
      }
    case 'borders':
      return {
        border: style.border ?? 'default',
        width: style.borderWidth ?? null,
        frame: !!style.frame,
        color: style.borderColor ?? null
      }
  }
}

/** Stable stringify (sorted keys) so pick results compare structurally. */
export function sectionFingerprint(doc: ThemeDoc, key: SectionKey): string {
  const sort = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(sort)
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.keys(value).sort().map(k => [k, sort((value as Record<string, unknown>)[k])]))
    }
    return value
  }
  return JSON.stringify(sort(pickSection(doc, key)))
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
  for (const key of ['colors', 'palettes', 'style'] as const) {
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
}

/** Replace one alias's color + referenced palette with the base doc's. */
function mergeAlias(doc: ThemeDoc, base: ThemeDoc, name: keyof typeof DEFAULT_COLORS) {
  const currentPaletteName = alias(doc, name)
  if (doc.palettes) Reflect.deleteProperty(doc.palettes, currentPaletteName)

  doc.colors ??= {}
  setOrDelete(doc.colors, name, base.colors?.[name])

  const basePalette = aliasPalette(base, name)
  if (basePalette) {
    doc.palettes ??= {}
    doc.palettes[alias(base, name)] = structuredClone(basePalette)
  }
}

/** Swap a color section's tokens/token-shades for the base doc's. */
function mergeColorExtras(doc: ThemeDoc, base: ThemeDoc, section: 'primary' | 'semantic' | 'neutral') {
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
    case 'semantic':
      for (const name of SEMANTIC_ALIASES) mergeAlias(doc, base, name)
      mergeColorExtras(doc, base, 'semantic')
      break
    case 'font':
      setOrDelete(doc, 'font', base.font ? structuredClone(base.font) : undefined)
      break
    case 'icons':
      setOrDelete(doc, 'icons', base.icons)
      break
    case 'scale':
      setOrDelete(doc, 'radius', base.radius)
      setOrDelete(doc, 'fontSize', base.fontSize)
      setOrDelete(doc, 'spacing', base.spacing)
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
        doc.style.defaults = { ...doc.style.defaults }
        doc.style.defaults.variants = { ...doc.style.defaults.variants }
        doc.style.defaults.colors = { ...doc.style.defaults.colors }
        setOrDelete(doc.style.defaults.variants, key, baseStyle.defaults?.variants?.[key])
        setOrDelete(doc.style.defaults.colors, key, baseStyle.defaults?.colors?.[key])
      }
      break
    case 'shadow':
      doc.style ??= {}
      setOrDelete(doc.style, 'shadow', baseStyle.shadow)
      setOrDelete(doc.style, 'shadowColor', baseStyle.shadowColor)
      setOrDelete(doc.style, 'shadowShade', baseStyle.shadowShade ? structuredClone(baseStyle.shadowShade) : undefined)
      setOrDelete(doc.style, 'shadowOpacity', baseStyle.shadowOpacity)
      setOrDelete(doc.style, 'shadowGeometry', baseStyle.shadowGeometry ? structuredClone(baseStyle.shadowGeometry) : undefined)
      setOrDelete(doc.style, 'shadowPress', baseStyle.shadowPress)
      break
    case 'innerShadow':
      doc.style ??= {}
      setOrDelete(doc.style, 'innerShadow', baseStyle.innerShadow)
      setOrDelete(doc.style, 'innerShadowColor', baseStyle.innerShadowColor)
      setOrDelete(doc.style, 'innerShadowShade', baseStyle.innerShadowShade ? structuredClone(baseStyle.innerShadowShade) : undefined)
      setOrDelete(doc.style, 'innerShadowOpacity', baseStyle.innerShadowOpacity)
      setOrDelete(doc.style, 'innerShadowGeometry', baseStyle.innerShadowGeometry ? structuredClone(baseStyle.innerShadowGeometry) : undefined)
      break
    case 'borders':
      doc.style ??= {}
      setOrDelete(doc.style, 'border', baseStyle.border)
      setOrDelete(doc.style, 'borderWidth', baseStyle.borderWidth)
      setOrDelete(doc.style, 'frame', baseStyle.frame)
      setOrDelete(doc.style, 'borderColor', baseStyle.borderColor)
      break
  }

  if (doc.style === undefined) delete doc.style
  pruneEmpty(doc)
  return doc
}
