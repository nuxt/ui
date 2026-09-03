/**
 * The theme document: its schema, the tables it expands into, and the
 * library defaults it is diffed against.
 *
 * A theme doc is sparse, so serializing it IS the minimal export. Two style
 * axes survive on v4, and both map onto public API: default variants/sizes/
 * colors (`defaultVariants` per component) and semantic token shades
 * (`--ui-*`). Shadow and border treatments wait on v5's `--ui-shadow-*` /
 * `--ui-border-width`, the library has no semantic tokens for them yet.
 */
import colors from 'tailwindcss/colors'

/**
 * The stock preset, what an untouched theme already is. Lives with the
 * tables rather than the presets so entry-chunk code (the header trigger)
 * can name it without pulling the preset docs in.
 */
export const DEFAULT_PRESET_ID = 'default'

/* --------------------------------------------------------------- shades -- */

export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/**
 * Every stop any density can emit, a stop stays a valid `Shade` whichever
 * density produced it.
 */
export const SHADES_ALL = [50, 60, 70, 75, 80, 90, 100, 110, 120, 125, 130, 140, 150, 160, 170, 175, 180, 190, 200, 210, 220, 225, 230, 240, 250, 260, 270, 275, 280, 290, 300, 310, 320, 325, 330, 340, 350, 360, 370, 375, 380, 390, 400, 410, 420, 425, 430, 440, 450, 460, 470, 475, 480, 490, 500, 510, 520, 525, 530, 540, 550, 560, 570, 575, 580, 590, 600, 610, 620, 625, 630, 640, 650, 660, 670, 675, 680, 690, 700, 710, 720, 725, 730, 740, 750, 760, 770, 775, 780, 790, 800, 810, 820, 825, 830, 840, 850, 860, 870, 875, 880, 890, 900, 910, 920, 925, 930, 940, 950] as const

export type Shade = typeof SHADES_ALL[number]

/** Stop density as the gap between stops, ordered coarse → fine (detectStopStep relies on the order). */
export const SHADE_STEPS = [100, 50, 25, 10] as const

export type ShadeStep = typeof SHADE_STEPS[number]

/** The stops each density emits: 11, 19, 37 and 91. */
export const SHADE_SETS: Record<ShadeStep, readonly Shade[]> = {
  // 100 is the only irregular set, 50/950 are half-steps at the ends.
  100: SHADES,
  50: SHADES_ALL.filter(shade => shade % 50 === 0),
  25: SHADES_ALL.filter(shade => shade % 25 === 0),
  10: SHADES_ALL.filter(shade => shade % 10 === 0)
}

export type ShadeStop = 'white' | Shade | 'black'

/**
 * The shade sliders' travel: a density's stops plus literal white/black ends,
 * several stock defaults are literals the ramp can't express (--ui-bg is
 * `white`).
 */
const ladder = (step: ShadeStep): readonly ShadeStop[] => ['white', ...SHADE_SETS[step], 'black']

export const SHADE_LADDERS: Record<ShadeStep, readonly ShadeStop[]> = {
  100: ladder(100),
  50: ladder(50),
  25: ladder(25),
  10: ladder(10)
}

/** The standard ladder, what stock ramps (and plain rows) travel. */
export const SHADE_LADDER = SHADE_LADDERS[100]

export type ColorAlias = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export interface ThemePalette {
  shades: Partial<Record<Shade, string>>
}

/**
 * A theme is a sparse document, only explicit overrides, everything absent
 * inherits Nuxt UI defaults, so serializing it *is* the minimal export.
 */
export interface ThemeDoc {
  version: 1
  /** L0, custom palettes, injected as `--color-{name}-{shade}` */
  palettes?: Record<string, ThemePalette>
  /** L1, alias → palette name (tailwind or a key of `palettes`) */
  colors?: Partial<Record<ColorAlias, string>>
  blackAsPrimary?: boolean
  /** L2, semantic `--ui-*` token overrides per mode */
  tokens?: {
    light?: Record<string, string>
    dark?: Record<string, string>
  }
  radius?: number
  /** Root font size in px (`html { font-size }`), scales every rem-based metric */
  fontSize?: number
  font?: {
    sans?: string
    /**
     * Tailwind's other two stacks. `serif` doubles as the heading family,
     * see generateCSS.
     */
    serif?: string
    mono?: string
    /**
     * Sparse overrides for tailwind's weight steps (`font-medium` compiles to
     * `var(--font-weight-medium)`); normal also drives classless body text.
     */
    weights?: { normal?: number, medium?: number, semibold?: number, bold?: number }
    uppercase?: boolean
    italic?: boolean
    /** Tracking in em. */
    letterSpacing?: number
    /** Unitless line height (browser/tailwind default is 1.5). */
    lineHeight?: number
  }
  icons?: string
  /** Default variants and semantic token shades. */
  style?: StyleOptions
  /** L4, per-component overrides merged into `app.config ui.<component>` */
  components?: Record<string, Record<string, unknown>>
}

export const DEFAULT_COLORS: Record<ColorAlias, string> = {
  primary: 'green',
  secondary: 'blue',
  success: 'green',
  info: 'blue',
  warning: 'yellow',
  error: 'red',
  neutral: 'slate'
}

/** Every color alias that isn't primary or neutral. */
export const SEMANTIC_ALIASES = ['secondary', 'success', 'info', 'warning', 'error'] as const

export const THEME_DEFAULTS = {
  radius: 0.25,
  fontSize: 16,
  font: 'Public Sans',
  icons: 'lucide'
} as const

/* ---------------------------------------------------------------- style -- */

export type DefaultVariant = 'default' | 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link' | 'none'
export type DefaultSize = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type DefaultColor = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type VariantGroup = 'buttons' | 'panels' | 'inputs'

export interface StyleOptions {
  /**
   * Default variant/size/color, expanded into per-component `defaultVariants`
   * only where the component supports the value. `variant` is app-wide;
   * `variants`/`colors` refine per group and win where set.
   */
  defaults?: { variant?: DefaultVariant, size?: DefaultSize, variants?: Partial<Record<VariantGroup, DefaultVariant>>, colors?: Partial<Record<VariantGroup, DefaultColor>> }
  /**
   * Semantic token → ramp shade, keys whitelisted in TOKEN_SHADE_TARGETS.
   * An absent mode stays inherited, presets hydrating one mode must not
   * leak a phantom override for the other into exports.
   */
  tokenShades?: Record<string, { light?: ShadeStop, dark?: ShadeStop }>
}

/** The whole input family shares input's variant vocabulary (they extend it via defu). */
const FIELD_VARIANTS = ['outline', 'soft', 'subtle', 'ghost', 'none']
const FIELD_COMPONENTS = ['input', 'select', 'textarea', 'selectMenu', 'inputMenu', 'inputNumber', 'inputTags', 'inputDate', 'inputTime', 'pinInput']

/** Which components support which default variant values. */
export const VARIANT_SUPPORT: Record<string, string[]> = {
  button: ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'],
  badge: ['solid', 'outline', 'soft', 'subtle'],
  alert: ['solid', 'outline', 'soft', 'subtle'],
  card: ['solid', 'outline', 'soft', 'subtle'],
  empty: ['solid', 'outline', 'soft', 'subtle'],
  // fields have no solid variant, an unsupported value would silently unstyle them
  ...Object.fromEntries(FIELD_COMPONENTS.map(component => [component, FIELD_VARIANTS]))
}

/**
 * Components the app-wide Size default scales, exactly the xs–xl axis.
 * Components on other scales (avatar's 3xs–3xl, kbd's sm–lg) stay out.
 */
export const SIZE_SUPPORT = [
  'button', 'badge', ...FIELD_COMPONENTS, 'inputRating',
  'tabs', 'checkbox', 'checkboxGroup', 'radioGroup', 'switch', 'slider', 'stepper',
  'calendar', 'colorPicker', 'fileUpload', 'formField', 'fieldGroup',
  'dropdownMenu', 'contextMenu', 'commandPalette', 'listbox'
]

/** Components with a color prop, the panels group has no color axis. */
export const COLOR_SUPPORT = ['button', 'badge', ...FIELD_COMPONENTS]

/** Component groups behind the per-group default-variant selects. */
export const VARIANT_GROUPS: Record<VariantGroup, string[]> = {
  buttons: ['button', 'badge'],
  panels: ['card', 'alert', 'empty'],
  inputs: FIELD_COMPONENTS
}

/**
 * What a group's variant select offers: its lead component's whole
 * vocabulary, so a variant added to the library reaches the picker by
 * table, not by editing the panel.
 */
export const GROUP_VARIANTS: Record<VariantGroup, DefaultVariant[]> = Object.fromEntries(
  (Object.keys(VARIANT_GROUPS) as VariantGroup[]).map(group => [group, VARIANT_SUPPORT[VARIANT_GROUPS[group][0]!] as DefaultVariant[]])
) as Record<VariantGroup, DefaultVariant[]>

/** The library's own default variant per group; picking it clears the override. */
export const GROUP_STOCK_VARIANT: Record<VariantGroup, DefaultVariant> = {
  buttons: 'solid',
  panels: 'outline',
  inputs: 'outline'
}

/** Color scale a token slider walks, neutral, or any semantic alias's ramp. */
export type TokenRamp = 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'

export type TokenGroup = 'colors' | 'background' | 'text' | 'border'

export const TOKEN_GROUPS: Array<{ key: TokenGroup, label: string }> = [
  { key: 'colors', label: 'Color shades' },
  { key: 'background', label: 'Background shades' },
  { key: 'text', label: 'Text shades' },
  { key: 'border', label: 'Border shades' }
]

/**
 * Semantic tokens exposed as per-mode shade sliders. `defaults` are the
 * LIBRARY's real resting values, some are the literal ladder ends (light
 * --ui-bg is `white`, not a ramp stop); `ramp` names the scale the slider walks.
 */
export const TOKEN_SHADE_TARGETS: Array<{ token: string, label: string, ramp: TokenRamp, group: TokenGroup, defaults: { light: ShadeStop, dark: ShadeStop } }> = [
  { token: '--ui-primary', label: 'Primary', ramp: 'primary', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-secondary', label: 'Secondary', ramp: 'secondary', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-success', label: 'Success', ramp: 'success', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-info', label: 'Info', ramp: 'info', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-warning', label: 'Warning', ramp: 'warning', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-error', label: 'Error', ramp: 'error', group: 'colors', defaults: { light: 500, dark: 400 } },
  { token: '--ui-bg', label: 'Default', ramp: 'neutral', group: 'background', defaults: { light: 'white', dark: 900 } },
  { token: '--ui-bg-muted', label: 'Muted', ramp: 'neutral', group: 'background', defaults: { light: 50, dark: 800 } },
  { token: '--ui-bg-elevated', label: 'Elevated', ramp: 'neutral', group: 'background', defaults: { light: 100, dark: 800 } },
  { token: '--ui-bg-accented', label: 'Accented', ramp: 'neutral', group: 'background', defaults: { light: 200, dark: 700 } },
  { token: '--ui-bg-inverted', label: 'Inverted', ramp: 'neutral', group: 'background', defaults: { light: 900, dark: 'white' } },
  { token: '--ui-text-dimmed', label: 'Dimmed', ramp: 'neutral', group: 'text', defaults: { light: 400, dark: 500 } },
  { token: '--ui-text-muted', label: 'Muted', ramp: 'neutral', group: 'text', defaults: { light: 500, dark: 400 } },
  { token: '--ui-text-toned', label: 'Toned', ramp: 'neutral', group: 'text', defaults: { light: 600, dark: 300 } },
  { token: '--ui-text', label: 'Default', ramp: 'neutral', group: 'text', defaults: { light: 700, dark: 200 } },
  { token: '--ui-text-highlighted', label: 'Highlighted', ramp: 'neutral', group: 'text', defaults: { light: 900, dark: 'white' } },
  { token: '--ui-text-inverted', label: 'Inverted', ramp: 'neutral', group: 'text', defaults: { light: 'white', dark: 900 } },
  { token: '--ui-border', label: 'Default', ramp: 'neutral', group: 'border', defaults: { light: 200, dark: 800 } },
  { token: '--ui-border-muted', label: 'Muted', ramp: 'neutral', group: 'border', defaults: { light: 200, dark: 700 } },
  { token: '--ui-border-accented', label: 'Accented', ramp: 'neutral', group: 'border', defaults: { light: 300, dark: 700 } },
  { token: '--ui-border-inverted', label: 'Inverted', ramp: 'neutral', group: 'border', defaults: { light: 900, dark: 'white' } }
]
/**
 * A ramp shade reference, or the literal for white/black. In-between stops
 * (finer than 100) have no `--ui-color-*` indirection, the runtime colors
 * plugin only generates the 11 standard stops, so they hit the custom
 * ramp's `--color-*` directly; such stops only exist on custom palettes,
 * whose @theme block defines those vars in both preview and export.
 */
function shadeRef(ramp: string, stop: ShadeStop | number): string {
  if (stop === 'white' || stop === 'black') return stop
  if (typeof stop === 'number' && !(SHADES as readonly number[]).includes(stop)) {
    return `var(--color-custom-${ramp}-${stop})`
  }
  return `var(--ui-color-${ramp}-${stop})`
}

/** The `ui.<component>` override shape the studio and presets both speak. */
interface ComponentFragment {
  slots?: Record<string, string>
  compoundVariants?: Array<Record<string, unknown>>
  defaultVariants?: Record<string, string>
}

type Fragments = Record<string, ComponentFragment>

/** Semantic token shades, the only CSS variables a style still emits. */
export function styleTokens(style: StyleOptions): { light: Record<string, string>, dark: Record<string, string> } {
  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}

  for (const [token, shade] of Object.entries(style.tokenShades || {})) {
    const target = TOKEN_SHADE_TARGETS.find(target => target.token === token)
    if (target) {
      if (shade.light !== undefined) light[token] = shadeRef(target.ramp, shade.light)
      if (shade.dark !== undefined) dark[token] = shadeRef(target.ramp, shade.dark)
    }
  }

  return { light, dark }
}

/** Expand default variant/size/color choices into `ui.<component>` overrides. */
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
  // group refinements replace the app-wide value for the components they cover
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

  // Per-group default colors, only on components with a color axis.
  for (const [group, components] of Object.entries(VARIANT_GROUPS)) {
    const groupColor = style.defaults?.colors?.[group as VariantGroup]
    if (groupColor && groupColor !== 'default') {
      for (const component of components) {
        if (COLOR_SUPPORT.includes(component)) {
          defaults[component] = {
            ...defaults[component],
            defaultVariants: { ...(defaults[component] as any)?.defaultVariants, color: groupColor }
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

  return defaults
}

/**
 * Merge two `ui.<component>` override fragments so both take effect: slot
 * class strings concatenate (extra last, winning the tailwind-merge),
 * compoundVariants append in the same order. A spread would silently drop
 * whichever side loses.
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
      // variant NAMES, not class strings, later value replaces per key
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

/**
 * Nothing set that changes rendering: every defaults leaf absent or the
 * stock `'default'` sentinel the pickers store, and no shade pinned. The
 * containers themselves don't count, a bag holding only sentinels is stock.
 */
export function isDefaultStyle(style: StyleOptions = {}): boolean {
  const set = (value?: string) => !!value && value !== 'default'
  const defaults = style.defaults ?? {}
  return !set(defaults.variant) && !set(defaults.size)
    && !Object.values(defaults.variants ?? {}).some(set)
    && !Object.values(defaults.colors ?? {}).some(set)
    && !Object.values(style.tokenShades ?? {}).some(modes => modes && Object.keys(modes).length)
}

/* ------------------------------------------------------ library defaults -- */

/**
 * The semantic token defaults as @nuxt/ui ships them (src/runtime/index.css).
 * Exports diff against THESE, not the docs site's diverging baseline, an
 * exported theme must reproduce the preview on a stock library install.
 */
export const LIBRARY_TOKEN_DEFAULTS = {
  light: {
    // the --ui-<alias> tokens are generated by the runtime colors plugin, not index.css
    '--ui-primary': 'var(--ui-color-primary-500)',
    '--ui-secondary': 'var(--ui-color-secondary-500)',
    '--ui-success': 'var(--ui-color-success-500)',
    '--ui-info': 'var(--ui-color-info-500)',
    '--ui-warning': 'var(--ui-color-warning-500)',
    '--ui-error': 'var(--ui-color-error-500)',
    '--ui-text-dimmed': 'var(--ui-color-neutral-400)',
    '--ui-text-muted': 'var(--ui-color-neutral-500)',
    '--ui-text-toned': 'var(--ui-color-neutral-600)',
    '--ui-text': 'var(--ui-color-neutral-700)',
    '--ui-text-highlighted': 'var(--ui-color-neutral-900)',
    '--ui-text-inverted': 'white',
    '--ui-bg': 'white',
    '--ui-bg-muted': 'var(--ui-color-neutral-50)',
    '--ui-bg-elevated': 'var(--ui-color-neutral-100)',
    '--ui-bg-accented': 'var(--ui-color-neutral-200)',
    '--ui-bg-inverted': 'var(--ui-color-neutral-900)',
    '--ui-border': 'var(--ui-color-neutral-200)',
    '--ui-border-muted': 'var(--ui-color-neutral-200)',
    '--ui-border-accented': 'var(--ui-color-neutral-300)',
    '--ui-border-inverted': 'var(--ui-color-neutral-900)'
  },
  dark: {
    '--ui-primary': 'var(--ui-color-primary-400)',
    '--ui-secondary': 'var(--ui-color-secondary-400)',
    '--ui-success': 'var(--ui-color-success-400)',
    '--ui-info': 'var(--ui-color-info-400)',
    '--ui-warning': 'var(--ui-color-warning-400)',
    '--ui-error': 'var(--ui-color-error-400)',
    '--ui-text-dimmed': 'var(--ui-color-neutral-500)',
    '--ui-text-muted': 'var(--ui-color-neutral-400)',
    '--ui-text-toned': 'var(--ui-color-neutral-300)',
    '--ui-text': 'var(--ui-color-neutral-200)',
    '--ui-text-highlighted': 'white',
    '--ui-text-inverted': 'var(--ui-color-neutral-900)',
    '--ui-bg': 'var(--ui-color-neutral-900)',
    '--ui-bg-muted': 'var(--ui-color-neutral-800)',
    '--ui-bg-elevated': 'var(--ui-color-neutral-800)',
    '--ui-bg-accented': 'var(--ui-color-neutral-700)',
    '--ui-bg-inverted': 'white',
    '--ui-border': 'var(--ui-color-neutral-800)',
    '--ui-border-muted': 'var(--ui-color-neutral-700)',
    '--ui-border-accented': 'var(--ui-color-neutral-700)',
    '--ui-border-inverted': 'white'
  }
} as const

// Standard stops ride the `--ui-color-<alias>-<shade>` indirection; midpoints
// have none (the runtime colours plugin only generates the 11 standard stops)
// so they emit against `--color-custom-<alias>-<stop>` instead. One
// alternation parses both forms with the ramp in the same capture position.
const UI_COLOR_RE = /^var\(--(?:ui-color|color-custom)-([a-z]+)-(\d{2,3})\)$/

/**
 * Parse a shade reference the studio emits (either form) to `{ alias, shade }`.
 * Callers apply their own ownership check, a foreign-ramp ref is parsed but
 * not adopted.
 */
export function parseUiColorRef(value?: string): { alias: string, shade: number } | undefined {
  const match = value?.match(UI_COLOR_RE)
  return match ? { alias: match[1]!, shade: Number(match[2]) } : undefined
}

export function resolveAlias(doc: ThemeDoc, alias: ColorAlias): string {
  return doc.colors?.[alias] || DEFAULT_COLORS[alias]
}

/** Color of a palette shade: custom palette first, then its base, then tailwind. */
export function resolveShade(doc: ThemeDoc, palette: string, shade: Shade): string | undefined {
  const custom = doc.palettes?.[palette]
  if (custom) {
    return custom.shades[shade]
  }
  const tailwind = (colors as Record<string, unknown>)[palette]
  if (tailwind && typeof tailwind === 'object') {
    return (tailwind as Record<string, string>)[shade]
  }
  return undefined
}

/* -------------------------------------------------------------- defaults -- */

/** A document with no overrides means "stock Nuxt UI". */
export function isDefaultTheme(doc: ThemeDoc): boolean {
  return !doc.palettes && !doc.colors && !doc.blackAsPrimary && !doc.tokens
    && doc.radius === undefined && doc.fontSize === undefined
    && !doc.font?.sans && !doc.font?.serif && !doc.font?.mono && !doc.font?.weights
    && !doc.font?.uppercase && !doc.font?.italic
    && doc.font?.letterSpacing === undefined && doc.font?.lineHeight === undefined
    && !doc.icons && !doc.components
    && isDefaultStyle(doc.style)
}

/**
 * A doc as `applyThemeSettings` input. Lives here rather than beside the
 * exporters: it is on the hot apply path, and serialize.ts pulls json5, which
 * only the export half needs.
 */
export function docToSettings(doc: ThemeDoc): Record<string, any> {
  const settings: Record<string, any> = {}

  for (const [alias, palette] of Object.entries(doc.colors || {})) {
    settings[alias] = palette
  }

  if (doc.blackAsPrimary) settings.blackAsPrimary = true
  if (doc.radius !== undefined) settings.radius = doc.radius
  if (doc.fontSize !== undefined) settings.fontSize = doc.fontSize
  if (doc.font?.sans) settings.fontSans = doc.font.sans
  if (doc.font?.serif) settings.fontSerif = doc.font.serif
  if (doc.font?.mono) settings.fontMono = doc.font.mono
  if (doc.font?.weights) settings.fontWeights = doc.font.weights
  if (doc.font?.uppercase || doc.font?.italic || doc.font?.letterSpacing !== undefined || doc.font?.lineHeight !== undefined) {
    settings.fontBody = { uppercase: doc.font.uppercase, italic: doc.font.italic, letterSpacing: doc.font.letterSpacing, lineHeight: doc.font.lineHeight }
  }
  if (doc.icons) settings.icons = doc.icons

  if (doc.palettes) {
    settings.customColors = Object.fromEntries(
      Object.entries(doc.palettes).map(([name, palette]) => [name, palette.shades])
    )
  }

  // Token overrides plus the style treatment's color variables.
  const style = doc.style ? styleTokens(doc.style) : { light: {}, dark: {} }
  const light = { ...style.light, ...doc.tokens?.light }
  const dark = { ...style.dark, ...doc.tokens?.dark }
  if (Object.keys(light).length || Object.keys(dark).length) {
    settings.cssVariables = {
      ...(Object.keys(light).length ? { light } : {}),
      ...(Object.keys(dark).length ? { dark } : {})
    }
  }

  // Only explicit components ride the settings channel, the style expansion
  // goes through the dedicated style-ui channel (applyDoc).
  if (doc.components && Object.keys(doc.components).length) {
    settings.ui = doc.components
  }

  return settings
}
