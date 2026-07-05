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
export type BorderColor = 'default' | 'inverted' | 'black' | 'white' | 'primary' | 'neutral' | 'shade' | 'primary-shade'
export type ShadowColor = 'default' | 'black' | 'inverted' | 'primary' | 'shade' | 'primary-shade'
export type DefaultVariant = 'default' | 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link' | 'none'
export type DefaultSize = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type VariantGroup = 'buttons' | 'panels' | 'inputs'

export interface StyleOptions {
  shadow?: ShadowStyle
  border?: BorderStyle
  borderColor?: BorderColor
  shadowColor?: ShadowColor
  /** Ramp shade per mode — neutral for 'shade', primary for 'primary-shade' */
  shadowShade?: { light: number, dark: number }
  /** Ramp shade per mode — neutral for 'shade', primary for 'primary-shade' */
  borderShade?: { light: number, dark: number }
  /**
   * Default variant/size, expanded into per-component `defaultVariants` —
   * the runtime override channel Nuxt UI already honors — only for
   * components that actually support the chosen value. `variant` applies
   * app-wide; `variants` refines it per component group and wins where set.
   */
  defaults?: { variant?: DefaultVariant, size?: DefaultSize, variants?: Partial<Record<VariantGroup, DefaultVariant>> }
  /**
   * Hard-shadow geometry in px, driving --ui-shadow-offset-x/y/blur/spread.
   * Only meaningful while `shadow` is 'hard'.
   */
  shadowGeometry?: { x?: number, y?: number, blur?: number, spread?: number }
  /**
   * Shadow opacity in percent, driving --ui-shadow-opacity. Applies to both
   * treatments; unset falls back to 100% (hard) / 25% (soft) via the
   * per-treatment color-mix fallbacks.
   */
  shadowOpacity?: number
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

/** Which components support which default variant values. */
export const VARIANT_SUPPORT: Record<string, string[]> = {
  button: ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'],
  badge: ['solid', 'outline', 'soft', 'subtle'],
  alert: ['solid', 'outline', 'soft', 'subtle'],
  card: ['solid', 'outline', 'soft', 'subtle'],
  // form fields have no solid variant (theirs run outline → none) — an
  // unsupported value would silently unstyle them, so they keep their
  // default instead
  input: ['outline', 'soft', 'subtle', 'ghost', 'none'],
  select: ['outline', 'soft', 'subtle', 'ghost', 'none'],
  textarea: ['outline', 'soft', 'subtle', 'ghost', 'none']
}

export const SIZE_SUPPORT = ['button', 'badge', 'input', 'select', 'textarea']

/** Component groups behind the per-group default-variant selects. */
export const VARIANT_GROUPS: Record<VariantGroup, string[]> = {
  buttons: ['button', 'badge'],
  panels: ['card', 'alert'],
  inputs: ['input', 'select', 'textarea']
}

export const SHADOW_GEOMETRY_DEFAULTS = { x: 3, y: 3, blur: 0, spread: 0 }

/** Borders default opposite to the surface: dark ink on light, pale on dark. */
export const BORDER_SHADE_DEFAULTS = { light: 900, dark: 200 }

/** Color scale a token slider walks — neutral, or any semantic alias's ramp. */
export type TokenRamp = 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'

export type TokenGroup = 'colors' | 'background' | 'text' | 'border'

export const TOKEN_GROUPS: Array<{ key: TokenGroup, label: string }> = [
  { key: 'colors', label: 'Colors' },
  { key: 'background', label: 'Background' },
  { key: 'text', label: 'Text' },
  { key: 'border', label: 'Borders' }
]

/**
 * Semantic tokens the studio exposes as per-mode shade sliders, with the
 * library/docs default shades. 'white' library values map to shade 50.
 * `ramp` names the color scale the slider walks (and the token references);
 * the semantic aliases ride their own ramps (--ui-secondary follows the
 * secondary palette, etc. — all generated by the runtime colors plugin).
 */
export const TOKEN_SHADE_TARGETS: Array<{ token: string, label: string, ramp: TokenRamp, group: TokenGroup, defaults: { light: number, dark: number } }> = [
  { token: '--ui-primary', label: 'Primary', ramp: 'primary', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-secondary', label: 'Secondary', ramp: 'secondary', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-success', label: 'Success', ramp: 'success', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-info', label: 'Info', ramp: 'info', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-warning', label: 'Warning', ramp: 'warning', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-error', label: 'Error', ramp: 'error', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-bg', label: 'Default', ramp: 'neutral', group: 'background', defaults: { light: 50, dark: 900 } },
  { token: '--ui-bg-muted', label: 'Muted', ramp: 'neutral', group: 'background', defaults: { light: 50, dark: 800 } },
  { token: '--ui-bg-elevated', label: 'Elevated', ramp: 'neutral', group: 'background', defaults: { light: 100, dark: 800 } },
  { token: '--ui-bg-accented', label: 'Accented', ramp: 'neutral', group: 'background', defaults: { light: 200, dark: 700 } },
  { token: '--ui-bg-inverted', label: 'Inverted', ramp: 'neutral', group: 'background', defaults: { light: 900, dark: 50 } },
  { token: '--ui-text-dimmed', label: 'Dimmed', ramp: 'neutral', group: 'text', defaults: { light: 400, dark: 500 } },
  { token: '--ui-text-muted', label: 'Muted', ramp: 'neutral', group: 'text', defaults: { light: 500, dark: 400 } },
  { token: '--ui-text-toned', label: 'Toned', ramp: 'neutral', group: 'text', defaults: { light: 600, dark: 300 } },
  { token: '--ui-text', label: 'Default', ramp: 'neutral', group: 'text', defaults: { light: 700, dark: 200 } },
  { token: '--ui-text-highlighted', label: 'Highlighted', ramp: 'neutral', group: 'text', defaults: { light: 900, dark: 50 } },
  { token: '--ui-text-inverted', label: 'Inverted', ramp: 'neutral', group: 'text', defaults: { light: 50, dark: 900 } },
  { token: '--ui-border', label: 'Default', ramp: 'neutral', group: 'border', defaults: { light: 200, dark: 800 } },
  { token: '--ui-border-muted', label: 'Muted', ramp: 'neutral', group: 'border', defaults: { light: 200, dark: 700 } },
  { token: '--ui-border-accented', label: 'Accented', ramp: 'neutral', group: 'border', defaults: { light: 300, dark: 700 } },
  { token: '--ui-border-inverted', label: 'Inverted', ramp: 'neutral', group: 'border', defaults: { light: 900, dark: 50 } }
]
export const SHADOW_SHADE_DEFAULTS = { light: 950, dark: 800 }

interface ComponentFragment {
  slots?: Record<string, string>
  compoundVariants?: Array<Record<string, unknown>>
  defaultVariants?: Record<string, string>
}

type Fragments = Record<string, ComponentFragment>

// Form fields also come in surfaceless variants (ghost/none) — those stay
// flat under both shadow treatments.
const FLAT_FIELD_VARIANTS = [
  { variant: 'ghost', class: 'shadow-none' },
  { variant: 'none', class: 'shadow-none' }
]

const SHADOW_FRAGMENTS: Record<ShadowStyle, Fragments> = {
  none: {},
  soft: {
    // shadow-(color:--ui-shadow-final-soft) recolors the preset shadows through the
    // same variable the hard treatment uses, so the color/shade options
    // apply to soft shadows too (tailwind stock shadows are hardcoded black).
    button: {
      slots: { base: 'shadow-sm shadow-(color:--ui-shadow-final-soft)' },
      // A shadow under an invisible surface reads as a glitch — ghost only
      // casts one once hover paints its background; link stays flat (it's text).
      compoundVariants: [
        { variant: 'ghost', class: 'shadow-none hover:shadow-sm transition-shadow' },
        { variant: 'link', class: 'shadow-none' }
      ]
    },
    card: { slots: { root: 'shadow-md shadow-(color:--ui-shadow-final-soft)' } },
    input: { slots: { base: 'shadow-xs shadow-(color:--ui-shadow-final-soft)' }, compoundVariants: FLAT_FIELD_VARIANTS },
    select: { slots: { base: 'shadow-xs shadow-(color:--ui-shadow-final-soft)' }, compoundVariants: FLAT_FIELD_VARIANTS },
    textarea: { slots: { base: 'shadow-xs shadow-(color:--ui-shadow-final-soft)' }, compoundVariants: FLAT_FIELD_VARIANTS },
    alert: { slots: { root: 'shadow-md shadow-(color:--ui-shadow-final-soft)' } },
    badge: { slots: { base: 'shadow-xs shadow-(color:--ui-shadow-final-soft)' } }
  },
  hard: {
    button: {
      slots: {
        // Geometry rides CSS variables so the sliders are a variable swap;
        // hover sinks halfway into the shadow via calc, active collapses it.
        base: 'shadow-[var(--ui-shadow-offset-x)_var(--ui-shadow-offset-y)_var(--ui-shadow-blur)_var(--ui-shadow-spread)_var(--ui-shadow-final-hard)] hover:translate-x-[calc(var(--ui-shadow-offset-x)/2)] hover:translate-y-[calc(var(--ui-shadow-offset-y)/2)] hover:shadow-[calc(var(--ui-shadow-offset-x)/2)_calc(var(--ui-shadow-offset-y)/2)_var(--ui-shadow-blur)_var(--ui-shadow-spread)_var(--ui-shadow-final-hard)] active:translate-x-(--ui-shadow-offset-x) active:translate-y-(--ui-shadow-offset-y) active:shadow-none transition-[box-shadow,translate,background-color]'
      },
      // A floating shadow under an invisible box reads as a glitch — ghost
      // and link buttons stay flat, as in the reference neobrutalism kits.
      compoundVariants: [
        { variant: 'ghost', class: 'shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0' },
        { variant: 'link', class: 'shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0' }
      ]
    },
    card: { slots: { root: 'shadow-[calc(var(--ui-shadow-offset-x)*1.5)_calc(var(--ui-shadow-offset-y)*1.5)_var(--ui-shadow-blur)_var(--ui-shadow-spread)_var(--ui-shadow-final-hard)]' } },
    input: { slots: { base: 'shadow-[var(--ui-shadow-offset-x)_var(--ui-shadow-offset-y)_var(--ui-shadow-blur)_var(--ui-shadow-spread)_var(--ui-shadow-final-hard)]' }, compoundVariants: FLAT_FIELD_VARIANTS },
    select: { slots: { base: 'shadow-[var(--ui-shadow-offset-x)_var(--ui-shadow-offset-y)_var(--ui-shadow-blur)_var(--ui-shadow-spread)_var(--ui-shadow-final-hard)]' }, compoundVariants: FLAT_FIELD_VARIANTS },
    textarea: { slots: { base: 'shadow-[var(--ui-shadow-offset-x)_var(--ui-shadow-offset-y)_var(--ui-shadow-blur)_var(--ui-shadow-spread)_var(--ui-shadow-final-hard)]' }, compoundVariants: FLAT_FIELD_VARIANTS },
    alert: { slots: { root: 'shadow-[calc(var(--ui-shadow-offset-x)*1.5)_calc(var(--ui-shadow-offset-y)*1.5)_var(--ui-shadow-blur)_var(--ui-shadow-spread)_var(--ui-shadow-final-hard)]' } },
    badge: { slots: { base: 'shadow-[calc(var(--ui-shadow-offset-x)*0.66)_calc(var(--ui-shadow-offset-y)*0.66)_var(--ui-shadow-blur)_var(--ui-shadow-spread)_var(--ui-shadow-final-hard)]' } }
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

/**
 * compound entries recoloring rings via the variable. With `colors` given,
 * only those color variants are touched — on outline/subtle the ring IS the
 * semantic signal (an error badge's ring must stay error-colored), so those
 * only recolor for primary/neutral. Frames added around solid/soft surfaces
 * are outlines by design and recolor for every color (comic-book black
 * outlines a solid error button too).
 */
function recolor(variants: string[], slot?: string, colors?: string[]): Array<Record<string, unknown>> {
  return variants.map(variant => ({
    ...(colors ? { color: colors } : {}),
    variant,
    class: slot ? { [slot]: 'ring-(--ui-frame-color)' } : 'ring-(--ui-frame-color)'
  }))
}

/** Colors whose rings carry no semantic meaning — safe to repaint. */
const UNSIGNALED_COLORS = ['primary', 'neutral']

const FRAME_COLOR_FRAGMENTS: Fragments = {
  // cards have no color variants; field rings are neutral for every color
  card: { compoundVariants: recolor(['outline', 'subtle', 'solid', 'soft'], 'root') },
  input: { compoundVariants: recolor(['outline', 'subtle']) },
  select: { compoundVariants: recolor(['outline', 'subtle']) },
  textarea: { compoundVariants: recolor(['outline', 'subtle']) },
  alert: {
    compoundVariants: [
      ...recolor(['outline', 'subtle'], 'root', UNSIGNALED_COLORS),
      ...recolor(['solid', 'soft'], 'root')
    ]
  },
  button: {
    compoundVariants: [
      ...recolor(['outline', 'subtle'], undefined, UNSIGNALED_COLORS),
      ...recolor(['solid', 'soft'])
    ]
  },
  badge: {
    compoundVariants: [
      ...recolor(['outline', 'subtle'], undefined, UNSIGNALED_COLORS),
      ...recolor(['solid', 'soft'])
    ]
  }
}

/** Per-mode values behind the two color variables, per palette choice. */
export const FRAME_COLOR_VALUES: Record<Exclude<BorderColor, 'default' | 'shade' | 'primary-shade'>, { light: string, dark: string }> = {
  inverted: { light: 'var(--ui-color-neutral-950)', dark: 'white' },
  black: { light: 'black', dark: 'black' },
  white: { light: 'white', dark: 'white' },
  primary: { light: 'var(--ui-color-primary-500)', dark: 'var(--ui-color-primary-400)' },
  neutral: { light: 'var(--ui-color-neutral-900)', dark: 'var(--ui-color-neutral-100)' }
}

export const SHADOW_COLOR_VALUES: Record<Exclude<ShadowColor, 'default' | 'shade' | 'primary-shade'>, { light: string, dark: string }> = {
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

  if (style.borderColor === 'shade' || style.borderColor === 'primary-shade') {
    const ramp = style.borderColor === 'primary-shade' ? 'primary' : 'neutral'
    const shade = { ...BORDER_SHADE_DEFAULTS, ...style.borderShade }
    light['--ui-frame-color'] = `var(--ui-color-${ramp}-${shade.light})`
    dark['--ui-frame-color'] = `var(--ui-color-${ramp}-${shade.dark})`
  } else if (style.borderColor && style.borderColor !== 'default') {
    const value = FRAME_COLOR_VALUES[style.borderColor]
    light['--ui-frame-color'] = value.light
    dark['--ui-frame-color'] = value.dark
  }
  for (const [token, shade] of Object.entries(style.tokenShades || {})) {
    const target = TOKEN_SHADE_TARGETS.find(target => target.token === token)
    if (target) {
      if (shade.light !== undefined) light[token] = `var(--ui-color-${target.ramp}-${shade.light})`
      if (shade.dark !== undefined) dark[token] = `var(--ui-color-${target.ramp}-${shade.dark})`
    }
  }

  if (style.shadow && style.shadow !== 'none' && style.shadowOpacity !== undefined) {
    light['--ui-shadow-opacity'] = `${style.shadowOpacity}%`
    dark['--ui-shadow-opacity'] = `${style.shadowOpacity}%`
  }

  if (style.shadow === 'hard' && style.shadowGeometry) {
    const geometry = { ...SHADOW_GEOMETRY_DEFAULTS, ...style.shadowGeometry }
    for (const [axis, token] of [['x', '--ui-shadow-offset-x'], ['y', '--ui-shadow-offset-y'], ['blur', '--ui-shadow-blur'], ['spread', '--ui-shadow-spread']] as const) {
      light[token] = `${geometry[axis]}px`
      dark[token] = `${geometry[axis]}px`
    }
  }

  if (style.shadowColor === 'shade' || style.shadowColor === 'primary-shade') {
    // Per-mode ramp shade — a graded shadow that darkens or lightens
    // independently of the scheme it sits on; the primary ramp tints it.
    const ramp = style.shadowColor === 'primary-shade' ? 'primary' : 'neutral'
    const shade = { ...SHADOW_SHADE_DEFAULTS, ...style.shadowShade }
    light['--ui-shadow-color'] = `var(--ui-color-${ramp}-${shade.light})`
    dark['--ui-shadow-color'] = `var(--ui-color-${ramp}-${shade.dark})`
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
  // App-wide defaults, only where the component supports the chosen value.
  const defaults: Fragments = {}
  const variant = style.defaults?.variant
  if (variant && variant !== 'default') {
    for (const [component, supported] of Object.entries(VARIANT_SUPPORT)) {
      if (supported.includes(variant)) {
        defaults[component] = { defaultVariants: { variant } }
      }
    }
  }
  // Group refinements land after the app-wide value, replacing it for the
  // components they cover — unsupported values still fall through silently.
  for (const [group, components] of Object.entries(VARIANT_GROUPS)) {
    const groupVariant = style.defaults?.variants?.[group as VariantGroup]
    if (groupVariant && groupVariant !== 'default') {
      for (const component of components) {
        if (VARIANT_SUPPORT[component]?.includes(groupVariant)) {
          defaults[component] = {
            ...defaults[component],
            defaultVariants: { ...defaults[component]?.defaultVariants, variant: groupVariant }
          }
        }
      }
    }
  }

  const size = style.defaults?.size
  if (size && size !== 'default') {
    for (const component of SIZE_SUPPORT) {
      defaults[component] = {
        ...defaults[component],
        defaultVariants: { ...(defaults[component] as any)?.defaultVariants, size }
      }
    }
  }

  const sources = [
    defaults,
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
      if (fragment.defaultVariants) {
        target.defaultVariants = { ...target.defaultVariants, ...fragment.defaultVariants }
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
    } else if (key === 'defaultVariants') {
      // variant NAMES, not class strings — later value replaces per key
      result[key] = { ...a, ...b }
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
