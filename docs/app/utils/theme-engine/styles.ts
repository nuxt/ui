/**
 * Shadow and border treatments as per-component class bundles, plus two CSS
 * variables (`--ui-shadow-color`, `--ui-border-color`) so recoloring is a
 * variable swap, not a new bundle. Nuxt UI has no semantic shadow/border
 * tokens yet, so structure rides `app.config ui.<component>` with STATIC
 * class literals.
 *
 * Placement rule: every ring in the library's themes lives at variant or
 * compoundVariant level, which renders after slot classes — so ring
 * overrides MUST be extension compoundVariants (appended last, they win the
 * tailwind-merge). Only shadows, which no theme variant sets, ride slots.
 */
import type { ShadeStop } from './types'
import { SHADES } from './types'

/** Absent = inherit the library shadows; 'flat' strips them; 'custom' is the config-driven shadow. */
export type ShadowStyle = 'flat' | 'custom'

export type BorderStyle = 'default' | 'none' | 'custom'
export type BorderColor = 'default' | 'inverted' | 'black' | 'white' | 'primary' | 'neutral' | 'shade' | 'primary-shade'
export type ShadowColor = 'default' | 'black' | 'inverted' | 'primary' | 'shade' | 'primary-shade'
export type DefaultVariant = 'default' | 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link' | 'none'
export type DefaultSize = 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type DefaultColor = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type VariantGroup = 'buttons' | 'panels' | 'inputs'

export interface StyleOptions {
  shadow?: ShadowStyle
  border?: BorderStyle
  borderColor?: BorderColor
  shadowColor?: ShadowColor
  /** Ramp shade per mode — neutral for 'shade', primary for 'primary-shade' */
  shadowShade?: { light?: ShadeStop, dark?: ShadeStop }
  /** Ramp shade per mode — neutral for 'shade', primary for 'primary-shade' */
  borderShade?: { light?: ShadeStop, dark?: ShadeStop }
  /** Ring width in px (1–4) while `border` is 'custom'; 2 when unset. */
  borderWidth?: number
  /** Frame solid/soft surfaces too — the neobrutalist outline-everything look. */
  frame?: boolean
  /**
   * Default variant/size/color, expanded into per-component `defaultVariants`
   * only where the component supports the value. `variant` is app-wide;
   * `variants`/`colors` refine per group and win where set.
   */
  defaults?: { variant?: DefaultVariant, size?: DefaultSize, variants?: Partial<Record<VariantGroup, DefaultVariant>>, colors?: Partial<Record<VariantGroup, DefaultColor>> }
  /** Shadow geometry in px, driving --ui-shadow-offset-x/y/blur/spread. */
  shadowGeometry?: { x?: number, y?: number, blur?: number, spread?: number }
  /** Shadow opacity in percent; unset rides the color-mix fallbacks. */
  shadowOpacity?: number
  /**
   * Buttons sink onto their shadow on hover/active. On by default; off keeps
   * the resting shadow static (a blurred config has nothing crisp to sink onto).
   */
  shadowPress?: boolean
  /** Inset shadow treatment, independent of the drop shadow. */
  innerShadow?: ShadowStyle
  /** Inner-shadow geometry in px, driving --ui-inner-shadow-offset-x/y/… */
  innerShadowGeometry?: { x?: number, y?: number, blur?: number, spread?: number }
  /** Inner-shadow opacity in percent; unset falls back to 15%. */
  innerShadowOpacity?: number
  /** Inner-shadow color; unset inherits the drop shadow's color. */
  innerShadowColor?: ShadowColor
  /** Ramp shade per mode — neutral for 'shade', primary for 'primary-shade' */
  innerShadowShade?: { light?: ShadeStop, dark?: ShadeStop }
  /**
   * Semantic token → ramp shade, keys whitelisted in TOKEN_SHADE_TARGETS.
   * An absent mode stays inherited — presets hydrating one mode must not
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
  // fields have no solid variant — an unsupported value would silently unstyle them
  ...Object.fromEntries(FIELD_COMPONENTS.map(component => [component, FIELD_VARIANTS]))
}

/**
 * Components the app-wide Size default scales — exactly the xs–xl axis.
 * Components on other scales (avatar's 3xs–3xl, kbd's sm–lg) stay out.
 */
export const SIZE_SUPPORT = [
  'button', 'badge', ...FIELD_COMPONENTS, 'inputRating',
  'tabs', 'checkbox', 'checkboxGroup', 'radioGroup', 'switch', 'slider', 'stepper',
  'calendar', 'colorPicker', 'fileUpload', 'formField', 'fieldGroup',
  'dropdownMenu', 'contextMenu', 'commandPalette', 'listbox'
]

/** Components with a color prop — the panels group has no color axis. */
export const COLOR_SUPPORT = ['button', 'badge', ...FIELD_COMPONENTS]

/** Component groups behind the per-group default-variant selects. */
export const VARIANT_GROUPS: Record<VariantGroup, string[]> = {
  buttons: ['button', 'badge'],
  panels: ['card', 'alert', 'empty'],
  inputs: FIELD_COMPONENTS
}

export const SHADOW_GEOMETRY_DEFAULTS = { x: 3, y: 3, blur: 0, spread: 0 }
export const INNER_SHADOW_GEOMETRY_DEFAULTS = { x: 0, y: 2, blur: 4, spread: 0 }

/** Borders default opposite to the surface: dark ink on light, pale on dark. */
export const BORDER_SHADE_DEFAULTS: { light: ShadeStop, dark: ShadeStop } = { light: 900, dark: 200 }

/** Color scale a token slider walks — neutral, or any semantic alias's ramp. */
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
 * LIBRARY's real resting values — some are the literal ladder ends (light
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
// mirrors main.css: light neutral-950, dark literal black
export const SHADOW_SHADE_DEFAULTS: { light: ShadeStop, dark: ShadeStop } = { light: 950, dark: 'black' }

interface ComponentFragment {
  slots?: Record<string, string>
  compoundVariants?: Array<Record<string, unknown>>
  defaultVariants?: Record<string, string>
}

type Fragments = Record<string, ComponentFragment>

// surfaceless field variants stay flat under every shadow treatment
const FLAT_FIELD_VARIANTS = [
  { variant: 'ghost', class: 'shadow-none' },
  { variant: 'none', class: 'shadow-none' }
]

/**
 * A ramp shade reference, or the literal for white/black. In-between stops
 * (finer than 100) have no `--ui-color-*` indirection — the runtime colors
 * plugin only generates the 11 standard stops — so they hit the custom
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

// The tabs' pre-hydration active-trigger shadow ships with this exact modifier
// chain; a bare `before:shadow-none` won't tailwind-merge against it.
const TABS_SSR_SHADOW_NONE = 'in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:shadow-none'

const SHADOW_FRAGMENTS: Record<'flat' | 'custom', Fragments> = {
  // None: strip the library's stock overlay shadows (Inherit touches nothing);
  // the ramp itself is blanked via the .shadow-none root flag.
  flat: {
    popover: { slots: { content: 'shadow-none' } },
    dropdownMenu: { slots: { content: 'shadow-none' } },
    contextMenu: { slots: { content: 'shadow-none' } },
    select: { slots: { content: 'shadow-none' } },
    selectMenu: { slots: { content: 'shadow-none' } },
    inputMenu: { slots: { content: 'shadow-none' } },
    tooltip: { slots: { content: 'shadow-none' } },
    toast: { slots: { root: 'shadow-none' } },
    drawer: { slots: { content: 'shadow-none' } },
    modal: { compoundVariants: [{ fullscreen: false, class: { content: 'shadow-none' } }] },
    slideover: { slots: { content: 'sm:shadow-none' } },
    tabs: { compoundVariants: [{ variant: 'pill', class: { list: 'shadow-none', indicator: 'shadow-none', trigger: TABS_SSR_SHADOW_NONE } }] }
  },
  // Custom: the ramp (active under .shadow-custom) carries color/opacity/
  // geometry, so plain size classes suffice — overlays keep their stock
  // shadow-lg untouched; flat surfaces get a size added.
  custom: {
    button: {
      slots: {
        // press effect: translate by the shadow offset, collapse the shadow on active
        base: 'shadow-(--ui-shadow-press) hover:translate-x-[calc(var(--ui-shadow-offset-x)/2)] hover:translate-y-[calc(var(--ui-shadow-offset-y)/2)] hover:shadow-(--ui-shadow-press-half) active:translate-x-(--ui-shadow-offset-x) active:translate-y-(--ui-shadow-offset-y) active:shadow-none transition-[box-shadow,translate,background-color]'
      },
      // a floating shadow under an invisible box reads as a glitch
      compoundVariants: [
        { variant: 'ghost', class: 'shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0' },
        { variant: 'link', class: 'shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0' }
      ]
    },
    card: { slots: { root: 'shadow-lg' } },
    empty: { slots: { root: 'shadow-lg' } },
    input: { slots: { base: 'shadow-xs' }, compoundVariants: FLAT_FIELD_VARIANTS },
    select: { slots: { base: 'shadow-xs' }, compoundVariants: FLAT_FIELD_VARIANTS },
    selectMenu: { slots: { base: 'shadow-xs' }, compoundVariants: FLAT_FIELD_VARIANTS },
    inputMenu: { slots: { base: 'shadow-xs' }, compoundVariants: FLAT_FIELD_VARIANTS },
    textarea: { slots: { base: 'shadow-xs' }, compoundVariants: FLAT_FIELD_VARIANTS },
    alert: { slots: { root: 'shadow-lg' } },
    badge: { slots: { base: 'shadow-xs' } },
    // edge-to-edge on mobile; only the sm+ panel casts a shadow
    slideover: { slots: { content: 'shadow-none sm:shadow-lg' } },
    // the pill list is the raised surface (full size, matching toolbar
    // buttons); the stock indicator/trigger shadows drop so it doesn't double up
    tabs: { compoundVariants: [{ variant: 'pill', class: { list: 'shadow-(--ui-shadow-press)', indicator: 'shadow-none', trigger: TABS_SSR_SHADOW_NONE } }] },
    // riding the ramp would cast a full-size shadow inside the track
    switch: { slots: { thumb: 'shadow-none' } }
  }
}

/** shadowPress: false — the resting shadow without the press choreography. */
const PRESSLESS_BUTTON: Fragments[string] = {
  slots: { base: 'shadow-(--ui-shadow-press)' },
  compoundVariants: [
    { variant: 'ghost', class: 'shadow-none' },
    { variant: 'link', class: 'shadow-none' }
  ]
}

// tailwind's separate inset-shadow group merges independently of the drop treatment
const INNER_HARD = 'inset-shadow-(--ui-inner-shadow)'

const INNER_FLAT_FIELD_VARIANTS = [
  { variant: 'ghost', class: 'inset-shadow-none' },
  { variant: 'none', class: 'inset-shadow-none' }
]

/** The same surfaces the drop treatment covers, all at one scale. */
function innerShadowFragments(classes: string): Fragments {
  return {
    button: {
      slots: { base: classes },
      compoundVariants: [
        { variant: 'ghost', class: 'inset-shadow-none' },
        { variant: 'link', class: 'inset-shadow-none' }
      ]
    },
    card: { slots: { root: classes } },
    empty: { slots: { root: classes } },
    input: { slots: { base: classes }, compoundVariants: INNER_FLAT_FIELD_VARIANTS },
    select: { slots: { base: classes, content: classes }, compoundVariants: INNER_FLAT_FIELD_VARIANTS },
    selectMenu: { slots: { base: classes, content: classes }, compoundVariants: INNER_FLAT_FIELD_VARIANTS },
    inputMenu: { slots: { base: classes, content: classes }, compoundVariants: INNER_FLAT_FIELD_VARIANTS },
    textarea: { slots: { base: classes }, compoundVariants: INNER_FLAT_FIELD_VARIANTS },
    alert: { slots: { root: classes } },
    badge: { slots: { base: classes } },
    popover: { slots: { content: classes } },
    dropdownMenu: { slots: { content: classes } },
    contextMenu: { slots: { content: classes } },
    tooltip: { slots: { content: classes } },
    toast: { slots: { root: classes } },
    drawer: { slots: { content: classes } },
    modal: { compoundVariants: [{ fullscreen: false, class: { content: classes } }] },
    slideover: { slots: { content: classes } },
    // the pill track reads as a recessed well; the indicator stays clean
    tabs: { compoundVariants: [{ variant: 'pill', class: { list: classes } }] }
  }
}

export const BORDER_WIDTH_DEFAULT = 2

// default-width rings — the width itself flows through --default-ring-width
const FRAME_INSET = 'ring ring-inset ring-(--ui-border-accented)'
const FRAME_OUTSET = 'ring ring-(--ui-border-accented)'

/** The frame toggle: outline solid/soft surfaces too. */
const FRAME_FRAGMENTS: Fragments = (() => {
  const inset = FRAME_INSET
  const outset = FRAME_OUTSET
  const frame = (cls: string, slot?: string) =>
    ['solid', 'soft'].map(variant => ({ variant, class: slot ? { [slot]: cls } : cls }))

  return {
    // card's own ring is non-inset; everything else frames inside its edge
    card: { compoundVariants: frame(outset, 'root') },
    empty: { compoundVariants: frame(outset, 'root') },
    alert: { compoundVariants: frame(inset, 'root') },
    button: { compoundVariants: frame(inset) },
    badge: { compoundVariants: frame(inset) },
    chatMessage: { compoundVariants: frame(inset, 'content') },
    pageCard: { compoundVariants: frame(outset, 'root') },
    pageCTA: { compoundVariants: frame(outset, 'root') },
    blogPost: { compoundVariants: frame(outset, 'root') },
    // fields have no solid variant — soft is their surface look
    ...Object.fromEntries(FIELD_COMPONENTS.map(component => [component, { compoundVariants: [{ variant: 'soft', class: inset }] }])),
    chatPrompt: { compoundVariants: [{ variant: 'soft', class: { root: outset } }] },
    // list ring only — ringing the indicator inside it reads as a double outline
    tabs: { compoundVariants: [{ variant: 'pill', class: { list: inset } }] },
    switch: { slots: { base: inset } }
  }
})()

/**
 * The pill tabs list has no stock ring, so any active border treatment
 * outlines it, frame toggle or not — else it sits bare next to outlined fields.
 */
const TABS_BORDER_FRAGMENTS: Fragments = {
  tabs: { compoundVariants: [{ variant: 'pill', class: { list: FRAME_INSET } }] }
}

/**
 * Widths flow through --default-border-width/--default-ring-width, so borders
 * need no class fragments — only the frame toggle adds outlines on surfaces
 * that have none.
 */
function borderFragments(style: StyleOptions): Fragments {
  if (style.border !== 'custom') return {}
  return style.frame ? FRAME_FRAGMENTS : TABS_BORDER_FRAGMENTS
}

/**
 * compound entries recoloring rings via the variable. With `colors` given,
 * only those variants repaint — on outline/subtle the ring IS the semantic
 * signal (an error badge's ring stays error-colored); frames around
 * solid/soft are outlines by design and recolor for every color.
 */
function recolor(variants: string[], slot?: string, colors?: string[]): Array<Record<string, unknown>> {
  return variants.map(variant => ({
    ...(colors ? { color: colors } : {}),
    variant,
    class: slot ? { [slot]: 'ring-(--ui-border-color)' } : 'ring-(--ui-border-color)'
  }))
}

// only neutral rings carry no meaning — a primary ring is as deliberate as an error one
const UNSIGNALED_COLORS = ['neutral']

const BORDER_COLOR_FRAGMENTS: Fragments = {
  // cards have no color variants; field rings are neutral for every color
  card: { compoundVariants: recolor(['outline', 'subtle', 'solid', 'soft'], 'root') },
  empty: { compoundVariants: recolor(['outline', 'subtle', 'solid', 'soft'], 'root') },
  ...Object.fromEntries(FIELD_COMPONENTS.map(component => [component, { compoundVariants: recolor(['outline', 'subtle']) }])),
  select: { slots: { content: 'ring-(--ui-border-color)' }, compoundVariants: recolor(['outline', 'subtle']) },
  selectMenu: { slots: { content: 'ring-(--ui-border-color)' }, compoundVariants: recolor(['outline', 'subtle']) },
  inputMenu: { slots: { content: 'ring-(--ui-border-color)' }, compoundVariants: recolor(['outline', 'subtle']) },
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
  },
  // ring color utilities are inert without a ring width, so no sm: prefixes needed
  popover: { slots: { content: 'ring-(--ui-border-color)' } },
  dropdownMenu: { slots: { content: 'ring-(--ui-border-color)' } },
  contextMenu: { slots: { content: 'ring-(--ui-border-color)' } },
  tooltip: { slots: { content: 'ring-(--ui-border-color)' } },
  toast: { slots: { root: 'ring-(--ui-border-color)' } },
  drawer: { slots: { content: 'ring-(--ui-border-color)' } },
  modal: { compoundVariants: [{ fullscreen: false, class: { content: 'ring-(--ui-border-color)' } }] },
  slideover: { slots: { content: 'ring-(--ui-border-color)' } },
  checkbox: { slots: { base: 'ring-(--ui-border-color)' } },
  radioGroup: { slots: { base: 'ring-(--ui-border-color)' } },
  // inert until a border treatment gives the list its ring
  tabs: { compoundVariants: [{ variant: 'pill', class: { list: 'ring-(--ui-border-color)' } }] }
}

/** Per-mode values behind the two color variables, per palette choice. */
export const BORDER_COLOR_VALUES: Record<Exclude<BorderColor, 'default' | 'shade' | 'primary-shade'>, { light: string, dark: string }> = {
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
    light['--ui-border-color'] = shadeRef(ramp, shade.light)
    dark['--ui-border-color'] = shadeRef(ramp, shade.dark)
  } else if (style.borderColor && style.borderColor !== 'default') {
    const value = BORDER_COLOR_VALUES[style.borderColor]
    light['--ui-border-color'] = value.light
    dark['--ui-border-color'] = value.dark
  }
  for (const [token, shade] of Object.entries(style.tokenShades || {})) {
    const target = TOKEN_SHADE_TARGETS.find(target => target.token === token)
    if (target) {
      if (shade.light !== undefined) light[token] = shadeRef(target.ramp, shade.light)
      if (shade.dark !== undefined) dark[token] = shadeRef(target.ramp, shade.dark)
    }
  }

  if (style.shadow === 'custom' && style.shadowOpacity !== undefined) {
    light['--ui-shadow-opacity'] = `${style.shadowOpacity}%`
    dark['--ui-shadow-opacity'] = `${style.shadowOpacity}%`
  }

  if (style.shadow === 'custom') {
    const geometry = { ...SHADOW_GEOMETRY_DEFAULTS, ...style.shadowGeometry }
    for (const [axis, token] of [['x', '--ui-shadow-offset-x'], ['y', '--ui-shadow-offset-y'], ['blur', '--ui-shadow-blur'], ['spread', '--ui-shadow-spread']] as const) {
      light[token] = `${geometry[axis]}px`
      dark[token] = `${geometry[axis]}px`
    }
  }

  if (style.innerShadow === 'custom' && style.innerShadowOpacity !== undefined) {
    light['--ui-inner-shadow-opacity'] = `${style.innerShadowOpacity}%`
    dark['--ui-inner-shadow-opacity'] = `${style.innerShadowOpacity}%`
  }

  if (style.innerShadow === 'custom') {
    const geometry = { ...INNER_SHADOW_GEOMETRY_DEFAULTS, ...style.innerShadowGeometry }
    for (const [axis, token] of [['x', '--ui-inner-shadow-offset-x'], ['y', '--ui-inner-shadow-offset-y'], ['blur', '--ui-inner-shadow-blur'], ['spread', '--ui-inner-shadow-spread']] as const) {
      light[token] = `${geometry[axis]}px`
      dark[token] = `${geometry[axis]}px`
    }
  }

  // unset shadowColor defaults to 'shade' — but only under a custom shadow,
  // so a pristine theme emits nothing
  const shadowColorMode = (!style.shadowColor || style.shadowColor === 'default')
    ? (style.shadow === 'custom' ? 'shade' : undefined)
    : style.shadowColor
  if (shadowColorMode === 'shade' || shadowColorMode === 'primary-shade') {
    const ramp = shadowColorMode === 'primary-shade' ? 'primary' : 'neutral'
    const shade = { ...SHADOW_SHADE_DEFAULTS, ...style.shadowShade }
    light['--ui-shadow-color'] = shadeRef(ramp, shade.light)
    dark['--ui-shadow-color'] = shadeRef(ramp, shade.dark)
  } else if (shadowColorMode) {
    const value = SHADOW_COLOR_VALUES[shadowColorMode]
    light['--ui-shadow-color'] = value.light
    dark['--ui-shadow-color'] = value.dark
  }

  if (style.innerShadowColor === 'shade' || style.innerShadowColor === 'primary-shade') {
    const ramp = style.innerShadowColor === 'primary-shade' ? 'primary' : 'neutral'
    const shade = { ...SHADOW_SHADE_DEFAULTS, ...style.innerShadowShade }
    light['--ui-inner-shadow-color'] = shadeRef(ramp, shade.light)
    dark['--ui-inner-shadow-color'] = shadeRef(ramp, shade.dark)
  } else if (style.innerShadowColor && style.innerShadowColor !== 'default') {
    const value = SHADOW_COLOR_VALUES[style.innerShadowColor]
    light['--ui-inner-shadow-color'] = value.light
    dark['--ui-inner-shadow-color'] = value.dark
  }

  // Studio-only: every default-width border/ring/divide compiles onto this
  // var live. Stripped from exports, which carry a static @theme value.
  if (style.border && style.border !== 'default') {
    const width = style.border === 'none' ? 0 : style.borderWidth ?? BORDER_WIDTH_DEFAULT
    light['--studio-border-width'] = `${width}px`
    dark['--studio-border-width'] = `${width}px`
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

  const sources = [
    defaults,
    style.shadow === 'custom'
      ? (style.shadowPress === false ? { ...SHADOW_FRAGMENTS.custom, button: PRESSLESS_BUTTON } : SHADOW_FRAGMENTS.custom)
      : style.shadow === 'flat' ? SHADOW_FRAGMENTS.flat : {},
    style.innerShadow === 'custom'
      ? innerShadowFragments(INNER_HARD)
      : {},
    borderFragments(style),
    style.borderColor && style.borderColor !== 'default' ? BORDER_COLOR_FRAGMENTS : {}
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

/**
 * Nothing set that changes rendering. Border 'none' is a REAL choice (strip
 * every ring), so the generic value-check can't cover it.
 */
export function isDefaultStyle(style: StyleOptions = {}): boolean {
  const { shadow, innerShadow, border, ...rest } = style
  return !shadow
    && !innerShadow
    && (!border || border === 'default')
    && !Object.values(rest).some(value => value && value !== 'default')
}
