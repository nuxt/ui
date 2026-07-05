/**
 * Shadow and border treatments, expressed as per-component class bundles
 * plus two CSS variables for the colors.
 *
 * Nuxt UI has no semantic `--ui-shadow` / `--ui-border-width` tokens yet
 * (a known core gap), so structure rides the `app.config ui.<component>`
 * override path with STATIC class literals (tailwind compiles what it can
 * see in source), while the color choices are pure CSS variables:
 *
 * - `--ui-shadow-color` — referenced by every hard-shadow class
 * - `--ui-frame-color`  — referenced by every border-color override class
 *
 * so any color configuration is a variable swap, not a new class bundle.
 *
 * Placement rule: every ring in Nuxt UI themes lives at variant or
 * compoundVariant level (card/input variants, button/badge/alert compounds),
 * all of which render after slot classes — so width/color overrides MUST be
 * extension compoundVariants (appended after the theme's, they win the
 * tailwind-merge). Only shadows, which no theme variant sets, ride slots.
 *
 * Semantics:
 * - `border: bold` thickens borders that already exist, keeping ring colors.
 * - `border: frame` additionally frames solid/soft surfaces — the
 *   neobrutalist outline-everything look. Ghost/link stay flat.
 * - `borderColor`/`shadowColor` recolor via the variables; 'default' leaves
 *   each element's own ring color / the dark shadow color untouched.
 */

export type ShadowStyle = 'none' | 'soft' | 'hard'
export type BorderStyle = 'default' | 'bold' | 'frame'
export type BorderColor = 'default' | 'inverted' | 'black' | 'white' | 'primary' | 'neutral' | 'shade'
export type ShadowColor = 'default' | 'black' | 'inverted' | 'primary' | 'shade'

export interface StyleOptions {
  shadow?: ShadowStyle
  border?: BorderStyle
  borderColor?: BorderColor
  shadowColor?: ShadowColor
  /** Neutral ramp shade per mode, used when `shadowColor` is 'shade' */
  shadowShade?: { light: number, dark: number }
  /** Neutral ramp shade per mode, used when `borderColor` is 'shade' */
  borderShade?: { light: number, dark: number }
  /**
   * Semantic token → neutral ramp shade, per mode. Strictly a token
   * shorthand parked on the style axis until the studio grows a full
   * tokens editor. Keys are whitelisted in TOKEN_SHADE_TARGETS. A mode
   * is only an override when present — an absent mode stays inherited,
   * so hydrating one mode from a preset never leaks a phantom override
   * for the other into exports.
   */
  tokenShades?: Record<string, { light?: number, dark?: number }>
}

/** Borders default opposite to the surface: dark ink on light, pale on dark. */
export const BORDER_SHADE_DEFAULTS = { light: 900, dark: 200 }

/**
 * Semantic tokens the studio exposes as per-mode shade sliders, with the
 * library/docs default shades. 'white' library values map to shade 50.
 */
export const TOKEN_SHADE_TARGETS: Array<{ token: string, label: string, defaults: { light: number, dark: number } }> = [
  { token: '--ui-bg', label: 'Background', defaults: { light: 50, dark: 900 } },
  { token: '--ui-bg-inverted', label: 'Inverted', defaults: { light: 900, dark: 50 } },
  { token: '--ui-text-highlighted', label: 'Highlighted', defaults: { light: 900, dark: 50 } },
  { token: '--ui-text-muted', label: 'Muted', defaults: { light: 500, dark: 400 } },
  { token: '--ui-text-dimmed', label: 'Dimmed', defaults: { light: 400, dark: 500 } }
]
export const SHADOW_SHADE_DEFAULTS = { light: 950, dark: 800 }

interface ComponentFragment {
  slots?: Record<string, string>
  compoundVariants?: Array<Record<string, unknown>>
}

type Fragments = Record<string, ComponentFragment>

const SHADOW_FRAGMENTS: Record<ShadowStyle, Fragments> = {
  none: {},
  soft: {
    button: { slots: { base: 'shadow-sm' } },
    card: { slots: { root: 'shadow-md' } },
    input: { slots: { base: 'shadow-xs' } },
    select: { slots: { base: 'shadow-xs' } },
    textarea: { slots: { base: 'shadow-xs' } },
    alert: { slots: { root: 'shadow-md' } },
    badge: { slots: { base: 'shadow-xs' } }
  },
  hard: {
    button: {
      slots: {
        base: 'shadow-[3px_3px_0_0_var(--ui-shadow-color)] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_var(--ui-shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[box-shadow,translate,background-color]'
      },
      // A floating shadow under an invisible box reads as a glitch — ghost
      // and link buttons stay flat, as in the reference neobrutalism kits.
      compoundVariants: [
        { variant: 'ghost', class: 'shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0' },
        { variant: 'link', class: 'shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0' }
      ]
    },
    card: { slots: { root: 'shadow-[5px_5px_0_0_var(--ui-shadow-color)]' } },
    input: { slots: { base: 'shadow-[3px_3px_0_0_var(--ui-shadow-color)]' } },
    select: { slots: { base: 'shadow-[3px_3px_0_0_var(--ui-shadow-color)]' } },
    textarea: { slots: { base: 'shadow-[3px_3px_0_0_var(--ui-shadow-color)]' } },
    alert: { slots: { root: 'shadow-[5px_5px_0_0_var(--ui-shadow-color)]' } },
    badge: { slots: { base: 'shadow-[2px_2px_0_0_var(--ui-shadow-color)]' } }
  }
}

/** compound entries thickening the rings a variant already has */
function widen(variants: string[], slot?: string): Array<Record<string, unknown>> {
  return variants.map(variant => ({ variant, class: slot ? { [slot]: 'ring-2' } : 'ring-2' }))
}

const FRAME = 'ring-2 ring-inset ring-(--ui-border-accented)'

const BORDER_FRAGMENTS: Record<BorderStyle, Fragments> = {
  default: {},
  bold: {
    card: { compoundVariants: widen(['outline', 'subtle'], 'root') },
    input: { compoundVariants: widen(['outline', 'subtle']) },
    select: { compoundVariants: widen(['outline', 'subtle']) },
    textarea: { compoundVariants: widen(['outline', 'subtle']) },
    alert: { compoundVariants: widen(['outline', 'subtle'], 'root') },
    button: { compoundVariants: widen(['outline', 'subtle']) },
    badge: { compoundVariants: widen(['outline', 'subtle']) }
  },
  frame: {
    card: {
      compoundVariants: [
        ...widen(['outline', 'subtle'], 'root'),
        { variant: 'solid', class: { root: 'ring-2 ring-(--ui-border-accented)' } },
        { variant: 'soft', class: { root: 'ring-2 ring-(--ui-border-accented)' } }
      ]
    },
    input: { compoundVariants: widen(['outline', 'subtle']) },
    select: { compoundVariants: widen(['outline', 'subtle']) },
    textarea: { compoundVariants: widen(['outline', 'subtle']) },
    alert: {
      compoundVariants: [
        ...widen(['outline', 'subtle'], 'root'),
        { variant: 'solid', class: { root: 'ring-2 ring-inset ring-(--ui-border-accented)' } },
        { variant: 'soft', class: { root: 'ring-2 ring-inset ring-(--ui-border-accented)' } }
      ]
    },
    button: {
      compoundVariants: [
        ...widen(['outline', 'subtle']),
        { variant: 'solid', class: FRAME },
        { variant: 'soft', class: FRAME }
      ]
    },
    badge: {
      compoundVariants: [
        ...widen(['outline', 'subtle']),
        { variant: 'solid', class: FRAME },
        { variant: 'soft', class: FRAME }
      ]
    }
  }
}

/** compound entries recoloring whatever ring is present via the variable */
function recolor(variants: string[], slot?: string): Array<Record<string, unknown>> {
  return variants.map(variant => ({ variant, class: slot ? { [slot]: 'ring-(--ui-frame-color)' } : 'ring-(--ui-frame-color)' }))
}

const FRAME_COLOR_FRAGMENTS: Fragments = {
  card: { compoundVariants: recolor(['outline', 'subtle', 'solid', 'soft'], 'root') },
  input: { compoundVariants: recolor(['outline', 'subtle']) },
  select: { compoundVariants: recolor(['outline', 'subtle']) },
  textarea: { compoundVariants: recolor(['outline', 'subtle']) },
  alert: { compoundVariants: recolor(['outline', 'subtle', 'solid', 'soft'], 'root') },
  button: { compoundVariants: recolor(['outline', 'subtle', 'solid', 'soft']) },
  badge: { compoundVariants: recolor(['outline', 'subtle', 'solid', 'soft']) }
}

/** Per-mode values behind the two color variables, per palette choice. */
const FRAME_COLOR_VALUES: Record<Exclude<BorderColor, 'default' | 'shade'>, { light: string, dark: string }> = {
  inverted: { light: 'var(--ui-color-neutral-950)', dark: 'white' },
  black: { light: 'black', dark: 'black' },
  white: { light: 'white', dark: 'white' },
  primary: { light: 'var(--ui-color-primary-500)', dark: 'var(--ui-color-primary-400)' },
  neutral: { light: 'var(--ui-color-neutral-900)', dark: 'var(--ui-color-neutral-100)' }
}

const SHADOW_COLOR_VALUES: Record<Exclude<ShadowColor, 'default' | 'shade'>, { light: string, dark: string }> = {
  black: { light: 'black', dark: 'black' },
  inverted: { light: 'var(--ui-color-neutral-950)', dark: 'white' },
  primary: { light: 'var(--ui-color-primary-500)', dark: 'var(--ui-color-primary-400)' }
}

/**
 * The CSS-variable side of a style: per-mode values for the frame and
 * shadow color choices. 'default' contributes nothing (the docs CSS /
 * export defaults apply).
 */
export function styleTokens(style: StyleOptions): { light: Record<string, string>, dark: Record<string, string> } {
  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}

  if (style.borderColor === 'shade') {
    const shade = { ...BORDER_SHADE_DEFAULTS, ...style.borderShade }
    light['--ui-frame-color'] = `var(--ui-color-neutral-${shade.light})`
    dark['--ui-frame-color'] = `var(--ui-color-neutral-${shade.dark})`
  } else if (style.borderColor && style.borderColor !== 'default') {
    const value = FRAME_COLOR_VALUES[style.borderColor]
    light['--ui-frame-color'] = value.light
    dark['--ui-frame-color'] = value.dark
  }
  for (const [token, shade] of Object.entries(style.tokenShades || {})) {
    if (TOKEN_SHADE_TARGETS.some(target => target.token === token)) {
      if (shade.light !== undefined) light[token] = `var(--ui-color-neutral-${shade.light})`
      if (shade.dark !== undefined) dark[token] = `var(--ui-color-neutral-${shade.dark})`
    }
  }

  if (style.shadowColor === 'shade') {
    // Per-mode neutral ramp shade — a graded gray shadow that darkens or
    // lightens independently of the scheme it sits on.
    const shade = { ...SHADOW_SHADE_DEFAULTS, ...style.shadowShade }
    light['--ui-shadow-color'] = `var(--ui-color-neutral-${shade.light})`
    dark['--ui-shadow-color'] = `var(--ui-color-neutral-${shade.dark})`
  } else if (style.shadowColor && style.shadowColor !== 'default') {
    const value = SHADOW_COLOR_VALUES[style.shadowColor]
    light['--ui-shadow-color'] = value.light
    dark['--ui-shadow-color'] = value.dark
  }

  return { light, dark }
}

/**
 * Expand style options into the `ui.<component>` override shape. Sources
 * merge in shadow → width → color order, so the color compounds append last
 * and win the tailwind-merge for ring color.
 */
export function styleComponents(style: StyleOptions): Fragments {
  const sources = [
    SHADOW_FRAGMENTS[style.shadow ?? 'none'],
    BORDER_FRAGMENTS[style.border ?? 'default'],
    style.borderColor && style.borderColor !== 'default' ? FRAME_COLOR_FRAGMENTS : {}
  ]

  const result: Fragments = {}

  for (const fragments of sources) {
    for (const [component, fragment] of Object.entries(fragments)) {
      const target = result[component] ||= {}
      for (const [slot, classes] of Object.entries(fragment.slots || {})) {
        target.slots ||= {}
        target.slots[slot] = [target.slots[slot], classes].filter(Boolean).join(' ')
      }
      if (fragment.compoundVariants) {
        target.compoundVariants = [...(target.compoundVariants || []), ...fragment.compoundVariants]
      }
    }
  }

  return result
}

/**
 * Merge two `ui.<component>` override fragments so both take effect: slot
 * class strings concatenate (the explicit override last, so it wins the
 * tailwind-merge), compoundVariants arrays append in the same order. Used
 * wherever a doc's explicit `components` meet a style expansion — a spread
 * would silently drop whichever side loses.
 */
export function mergeComponentOverrides(
  base: Record<string, any> | undefined,
  extra: Record<string, any> | undefined
): Record<string, any> | undefined {
  if (!base || !Object.keys(base).length) return extra
  if (!extra || !Object.keys(extra).length) return base

  const result: Record<string, any> = {}
  for (const key of new Set([...Object.keys(base), ...Object.keys(extra)])) {
    const a = base[key]
    const b = extra[key]
    if (a === undefined) {
      result[key] = b
    } else if (b === undefined) {
      result[key] = a
    } else if (key === 'compoundVariants' && Array.isArray(a) && Array.isArray(b)) {
      result[key] = [...a, ...b]
    } else if (typeof a === 'string' && typeof b === 'string') {
      result[key] = `${a} ${b}`
    } else if (typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
      result[key] = mergeComponentOverrides(a, b)
    } else {
      result[key] = b
    }
  }
  return result
}

/** Merge two whole `ui` records component-wise. */
export function mergeUi(
  base: Record<string, any> | undefined,
  extra: Record<string, any> | undefined
): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key of new Set([...Object.keys(base || {}), ...Object.keys(extra || {})])) {
    const merged = mergeComponentOverrides(base?.[key], extra?.[key])
    if (merged && Object.keys(merged).length) result[key] = merged
  }
  return result
}

/** Every component key a style bundle may touch — cleared before re-applying. */
export const STYLE_COMPONENT_KEYS = [...new Set([
  ...Object.values(SHADOW_FRAGMENTS).flatMap(fragments => Object.keys(fragments)),
  ...Object.values(BORDER_FRAGMENTS).flatMap(fragments => Object.keys(fragments)),
  ...Object.keys(FRAME_COLOR_FRAGMENTS)
])]
