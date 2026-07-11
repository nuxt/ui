<script setup lang="ts">
import { SHADES, SHADOW_SHADE_DEFAULTS, BORDER_SHADE_DEFAULTS, BORDER_WIDTH_DEFAULT, SHADOW_GEOMETRY_DEFAULTS, INNER_SHADOW_GEOMETRY_DEFAULTS } from '../../utils/theme-engine'
import { themeIcons, FONT_WEIGHT_DEFAULTS } from '../../utils/theme'
import type { VariantGroup, ColorAlias } from '../../utils/theme-engine'

/** Which settings group this instance renders — one popover per group. */
defineProps<{
  group: 'colors' | 'general' | 'style'
}>()

const {
  radius,
  fontSize,
  spacing,
  fonts,
  font,
  fontPrefs,
  setFontPrefs,
  icon,
  icons
} = useTheme()

const { style, setStyle, primaryChip, neutralChip } = useThemeStudio()

/* ------------------------------------------------------------ typography -- */

onMounted(() => loadFontPreviews(fonts))

// One writable model per tailwind weight step — the knobs components
// actually dereference at runtime.
function weightStepModel(step: keyof typeof FONT_WEIGHT_DEFAULTS) {
  return computed({
    get: () => fontPrefs.value.weights?.[step] ?? FONT_WEIGHT_DEFAULTS[step],
    set: (value: number) => setFontPrefs({ ...fontPrefs.value, weights: { ...fontPrefs.value.weights, [step]: value } })
  })
}

const WEIGHT_STEPS = ['normal', 'medium', 'semibold', 'bold'] as const
const weightSteps = Object.fromEntries(WEIGHT_STEPS.map(step => [step, weightStepModel(step)])) as Record<typeof WEIGHT_STEPS[number], ReturnType<typeof weightStepModel>>
const weightsDirty = computed(() => !!fontPrefs.value.weights)

const INHERIT_FONT = { label: 'Inherit base', value: 'inherit' }
const headingFontItems = computed(() => [INHERIT_FONT, ...fonts.map(name => ({ label: name, value: name }))])

function setHeading(patch: Record<string, unknown>) {
  setFontPrefs({ ...fontPrefs.value, heading: { ...fontPrefs.value.heading, ...patch } })
}

const headingFont = computed({
  get: () => fontPrefs.value.heading?.font ?? 'inherit',
  set: (value: string) => setHeading({ font: value === 'inherit' ? undefined : value })
})

const headingWeight = computed({
  get: () => fontPrefs.value.heading?.weight ?? 700,
  set: (value: number) => setHeading({ weight: value })
})

const headingUppercase = computed({
  get: () => !!fontPrefs.value.heading?.uppercase,
  set: (value: boolean) => setHeading({ uppercase: value })
})

const baseUppercase = computed({
  get: () => !!fontPrefs.value.uppercase,
  set: (value: boolean) => setFontPrefs({ ...fontPrefs.value, uppercase: value })
})

const baseLetterSpacing = computed({
  get: () => fontPrefs.value.letterSpacing ?? 0,
  set: (value: number) => setFontPrefs({ ...fontPrefs.value, letterSpacing: value })
})

const baseLineHeight = computed({
  get: () => fontPrefs.value.lineHeight ?? 1.5,
  set: (value: number) => setFontPrefs({ ...fontPrefs.value, lineHeight: value })
})

const headingLetterSpacing = computed({
  get: () => fontPrefs.value.heading?.letterSpacing ?? 0,
  set: (value: number) => setHeading({ letterSpacing: value })
})

// Headings natively lead at ~1.25 (the specimen agrees) — 1.5 here would
// show a value the page isn't actually rendering.
const headingLineHeight = computed({
  get: () => fontPrefs.value.heading?.lineHeight ?? 1.25,
  set: (value: number) => setHeading({ lineHeight: value })
})

// The Base and Headings rows are the same toolbar over different models —
// one config each, one template. Base tunes the four tailwind weight steps;
// headings have a single weight.
const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
const fontRows = [{
  key: 'base',
  label: 'Base',
  defaultValue: 'Public Sans',
  selectIcon: 'i-lucide-type',
  items: computed(() => fonts.map(name => ({ label: name, value: name }))),
  font,
  weights: WEIGHT_STEPS.map(step => ({ label: capitalize(step), model: weightSteps[step]!, min: 100, max: 900 })),
  weightsActive: weightsDirty,
  uppercase: baseUppercase,
  letterSpacing: baseLetterSpacing,
  lineHeight: baseLineHeight,
  lineHeightDefault: 1.5,
  aria: { weights: 'Font weights', uppercase: 'Uppercase text', spacing: 'Letter spacing', height: 'Line height' }
}, {
  key: 'heading',
  label: 'Headings (Prose)',
  defaultValue: 'inherit',
  selectIcon: 'i-lucide-heading',
  items: headingFontItems,
  font: headingFont,
  weights: [{ label: 'Weight', model: headingWeight, min: 100, max: 900 }],
  weightsActive: computed(() => fontPrefs.value.heading?.weight !== undefined),
  uppercase: headingUppercase,
  letterSpacing: headingLetterSpacing,
  lineHeight: headingLineHeight,
  lineHeightDefault: 1.25,
  aria: { weights: 'Heading weight', uppercase: 'Uppercase headings', spacing: 'Heading letter spacing', height: 'Heading line height' }
}]

/** Font listbox popovers close on pick — one open flag per row. */
const fontListOpen = reactive<Record<string, boolean>>({ base: false, heading: false })

/** Live specimen: a heading line in the heading treatment over a body line. */
const headingSampleStyle = computed(() => ({
  fontFamily: `'${fontPrefs.value.heading?.font ?? font.value}', sans-serif`,
  fontWeight: fontPrefs.value.heading?.weight ?? 700,
  textTransform: (fontPrefs.value.heading?.uppercase || fontPrefs.value.uppercase) ? 'uppercase' as const : undefined,
  fontStyle: (fontPrefs.value.heading?.italic || fontPrefs.value.italic) ? 'italic' as const : undefined,
  textDecoration: fontPrefs.value.heading?.underline ? 'underline' as const : undefined,
  letterSpacing: `${fontPrefs.value.heading?.letterSpacing ?? fontPrefs.value.letterSpacing ?? 0}em`,
  lineHeight: fontPrefs.value.heading?.lineHeight ?? 1.25
}))
const bodySampleStyle = computed(() => ({
  fontFamily: `'${font.value}', sans-serif`,
  fontWeight: fontPrefs.value.weights?.normal ?? 400,
  textTransform: fontPrefs.value.uppercase ? 'uppercase' as const : undefined,
  fontStyle: fontPrefs.value.italic ? 'italic' as const : undefined,
  letterSpacing: `${fontPrefs.value.letterSpacing ?? 0}em`,
  lineHeight: fontPrefs.value.lineHeight ?? 1.5
}))

/* ---------------------------------------------------------------- icons -- */

/** A representative spread from the selected set for the preview grid. */
const SAMPLE_ICON_KEYS = ['search', 'check', 'close', 'warning', 'error', 'info', 'tip', 'light', 'dark', 'external', 'plus', 'minus', 'loading', 'copy', 'file', 'folder', 'eye', 'star', 'upload', 'menu', 'ellipsis', 'reload', 'arrowRight', 'chevronDown']
const iconPreviews = computed(() => {
  const set = (themeIcons as Record<string, Record<string, string>>)[icon.value] || {}
  return SAMPLE_ICON_KEYS.map(key => set[key]).filter((name): name is string => !!name).slice(0, 20)
})

/** A short strip of a set's own glyphs for its listbox row. */
function iconSetSamples(setName: string): string[] {
  const set = (themeIcons as Record<string, Record<string, string>>)[setName] || {}
  return ['search', 'check', 'warning', 'light', 'dark', 'star', 'folder', 'upload'].map(key => set[key]).filter((name): name is string => !!name)
}

const iconListOpen = ref(false)

const semanticAliases: ColorAlias[] = ['secondary', 'success', 'info', 'warning', 'error']

// Inherit leaves the library's own shadows alone, None strips them, Custom
// is the studio treatment. The engine still understands 'soft' (presets,
// imports) — it simply reads as Custom here.
const SHADOW_STYLE_OPTIONS = [
  { label: 'Inherit', value: 'inherit' },
  { label: 'None', value: 'none' },
  { label: 'Custom', value: 'custom' }
]

const shadowStyle = computed({
  get: () => {
    const shadow = style.value.shadow
    if (!shadow || shadow === 'none') return 'inherit'
    return shadow === 'flat' ? 'none' : 'custom'
  },
  // Custom starts where the library already is: geometry approximating the
  // stock shadow-lg, so entering Custom isn't a jump (20% ≈ shadow-lg's two
  // stacked 10% layers flattened into one). Leaving Custom clears the knobs
  // — Inherit means a clean slate, and the next Custom reseeds fresh.
  set: (value: any) => setStyle(value === 'custom'
    ? {
        shadow: 'hard',
        ...(style.value.shadowGeometry === undefined ? { shadowGeometry: { x: 0, y: 6, blur: 12, spread: 0 } } : {}),
        ...(style.value.shadowOpacity === undefined ? { shadowOpacity: 20 } : {})
      }
    : { shadow: value === 'none' ? 'flat' : 'none', shadowGeometry: undefined, shadowOpacity: undefined, shadowColor: undefined, shadowShade: undefined })
})

// Nothing in the library casts an inner shadow, so None and Inherit are
// the same thing — two options suffice.
const INNER_SHADOW_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Custom', value: 'custom' }
]

const innerShadowStyle = computed({
  get: () => (!style.value.innerShadow || style.value.innerShadow === 'none') ? 'none' : 'custom',
  set: (value: any) => setStyle({ innerShadow: value === 'custom' ? 'hard' : 'none' })
})

const shadowOpacity = computed({
  get: () => style.value.shadowOpacity ?? (style.value.shadow === 'hard' ? 100 : 25),
  set: (value: number) => setStyle({ shadowOpacity: value })
})

const innerShadowOpacity = computed({
  get: () => style.value.innerShadowOpacity ?? 15,
  set: (value: number) => setStyle({ innerShadowOpacity: value })
})

const innerShadowColor = computed({
  get: () => style.value.innerShadowColor || 'default',
  set: (value: any) => setStyle({ innerShadowColor: value })
})

const borderOptions = [
  { label: 'Inherit', value: 'default' },
  { label: 'None', value: 'none' },
  { label: 'Custom', value: 'custom' }
]

// Legacy saved prefs may still hold bold/frame — both read as custom.
const borderStyle = computed({
  get: () => {
    const value = style.value.border || 'default'
    return value === 'bold' || value === 'frame' ? 'custom' : value
  },
  set: (value: any) => setStyle({ border: value })
})

const borderWidth = computed({
  get: () => style.value.borderWidth ?? BORDER_WIDTH_DEFAULT,
  set: (value: number) => setStyle({ borderWidth: value })
})

// Outline solid/soft surfaces too — the neobrutalist frame look.
const frameSolids = computed({
  get: () => !!style.value.frame || style.value.border === 'frame',
  // Migrate the legacy border: 'frame' encoding on write — otherwise the
  // getter keeps reading true and the switch can never turn off.
  set: (value: boolean) => setStyle({
    frame: value,
    border: style.value.border === 'frame' ? 'custom' : style.value.border
  })
})

const borderColorItems = [
  { label: 'Default', value: 'default' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
  { label: 'Primary', value: 'primary' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Neutral shade', value: 'shade' },
  { label: 'Primary shade', value: 'primary-shade' }
]

const shadowColorItems = [
  { label: 'Default', value: 'default' },
  { label: 'Black', value: 'black' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Primary', value: 'primary' },
  { label: 'Neutral shade', value: 'shade' },
  { label: 'Primary shade', value: 'primary-shade' }
]

// Slider position ↔ SHADES index, per mode. shadow/border shades write both
// modes on first touch (explicit 'shade' mode choice); token shades write
// ONLY the touched mode so an untouched mode never becomes an override.
function shadeSlider(field: 'shadowShade' | 'innerShadowShade' | 'borderShade', defaults: { light: number, dark: number }, target: 'light' | 'dark') {
  return computed({
    // Per-key fallback: an imported doc can carry a single-mode shade
    // object ({ light: 400 }) — indexOf(undefined) would park the slider
    // at -1 and the chip at var(--color-…-undefined).
    get: () => SHADES.indexOf((style.value[field]?.[target] ?? defaults[target]) as typeof SHADES[number]),
    set: (index: number) => {
      const current = { ...defaults, ...style.value[field] }
      setStyle({ [field]: { ...current, [target]: SHADES[index]! } })
    }
  })
}

const shadowShades = {
  light: shadeSlider('shadowShade', SHADOW_SHADE_DEFAULTS, 'light'),
  dark: shadeSlider('shadowShade', SHADOW_SHADE_DEFAULTS, 'dark')
}

const innerShadowShades = {
  light: shadeSlider('innerShadowShade', SHADOW_SHADE_DEFAULTS, 'light'),
  dark: shadeSlider('innerShadowShade', SHADOW_SHADE_DEFAULTS, 'dark')
}

const borderShades = {
  light: shadeSlider('borderShade', BORDER_SHADE_DEFAULTS, 'light'),
  dark: shadeSlider('borderShade', BORDER_SHADE_DEFAULTS, 'dark')
}

// MD is the stock default — one deduped entry storing 'default'
const defaultSizeItems = [
  { label: 'XS', value: 'xs', defaultTag: false },
  { label: 'SM', value: 'sm', defaultTag: false },
  { label: 'MD', value: 'default', defaultTag: true },
  { label: 'LG', value: 'lg', defaultTag: false },
  { label: 'XL', value: 'xl', defaultTag: false }
]

// Per-group default variants, each offering only what its components
// actually support (buttons add ghost, form fields run outline → none);
// the app-wide `variant` (presets, shuffle) shows through as the fallback
// until a group makes its own choice.
const variantItems = (values: string[]) => values.map(value => ({ label: value.charAt(0).toUpperCase() + value.slice(1), value }))

/** Variant names UButton can render itself — the rest (none) fall back. */
const RENDERABLE_VARIANTS = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']

/** Variant grid popovers close on pick — one open flag per group. */
const variantGridOpen = reactive<Record<string, boolean>>({ buttons: false, panels: false, inputs: false })

// `stock` is the library's own default variant — its cell wears the
// "(Default)" tag and picking it clears the override instead of pinning.
const variantGroupFields = [
  { key: 'buttons' as const, label: 'Button Defaults', hasColor: true, stock: 'solid', items: variantItems(['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']) },
  { key: 'panels' as const, label: 'Card Defaults', hasColor: false, stock: 'outline', items: variantItems(['solid', 'outline', 'soft', 'subtle']) },
  { key: 'inputs' as const, label: 'Input Defaults', hasColor: true, stock: 'outline', items: variantItems(['outline', 'soft', 'subtle', 'ghost', 'none']) }
]

function groupVariantModel(group: VariantGroup) {
  const supported = variantGroupFields.find(field => field.key === group)!.items.map(item => item.value)
  return computed({
    get: () => {
      const own = style.value.defaults?.variants?.[group]
      if (own && own !== 'default') return own
      // An app-wide value this group can't express (e.g. solid inputs)
      // truthfully reads as Default — the engine skips it there too.
      const appWide = style.value.defaults?.variant
      return appWide && supported.includes(appWide) ? appWide : 'default'
    },
    set: (value: any) => {
      const defaults = style.value.defaults || {}

      // Picking Default under an app-wide variant must actually win: the
      // engine skips 'default' entries, so the app-wide value explodes
      // into the OTHER groups (where they support it) and disappears.
      if (value === 'default' && defaults.variant) {
        const variants: Record<string, any> = {}
        for (const field of variantGroupFields) {
          if (field.key === group) continue
          const existing = defaults.variants?.[field.key]
          if (existing && existing !== 'default') {
            variants[field.key] = existing
          } else if (field.items.some(item => item.value === defaults.variant)) {
            variants[field.key] = defaults.variant
          }
        }
        const next = { ...defaults, variants }
        delete next.variant
        setStyle({ defaults: next })
        return
      }

      setStyle({ defaults: { ...defaults, variants: { ...defaults.variants, [group]: value } } })
    }
  })
}

const groupVariants = Object.fromEntries(variantGroupFields.map(field => [field.key, groupVariantModel(field.key)])) as Record<VariantGroup, ReturnType<typeof groupVariantModel>>

// Primary IS the stock default — one entry, tagged, storing 'default'
// (an explicit 'primary' would export a no-op override).
const defaultColorItems = [
  { label: 'Primary', value: 'default', chip: { color: 'primary' as any }, defaultTag: true },
  ...['secondary', 'success', 'info', 'warning', 'error', 'neutral'].map(value => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value,
    chip: { color: value as any },
    defaultTag: false
  }))
]

function groupColorModel(group: VariantGroup) {
  return computed({
    get: () => style.value.defaults?.colors?.[group] || 'default',
    set: (value: any) => setStyle({ defaults: { ...style.value.defaults, colors: { ...style.value.defaults?.colors, [group]: value } } })
  })
}

const groupColors = Object.fromEntries(variantGroupFields.map(field => [field.key, groupColorModel(field.key)])) as Record<VariantGroup, ReturnType<typeof groupColorModel>>

const defaultSize = computed({
  // legacy saved prefs may still pin 'md' explicitly — it IS the default
  get: () => {
    const size = style.value.defaults?.size || 'default'
    return size === 'md' ? 'default' : size
  },
  set: (value: any) => setStyle({ defaults: { ...style.value.defaults, size: value } })
})

// Hard-shadow geometry sliders (px)
const geometryFields = [
  { key: 'x', label: 'Offset X', min: -12, max: 12 },
  { key: 'y', label: 'Offset Y', min: -12, max: 12 },
  { key: 'blur', label: 'Blur', min: 0, max: 24 },
  { key: 'spread', label: 'Spread', min: 0, max: 8 }
] as const

function geometrySliders(field: 'shadowGeometry' | 'innerShadowGeometry', defaults: typeof SHADOW_GEOMETRY_DEFAULTS) {
  const slider = (key: 'x' | 'y' | 'blur' | 'spread') => computed({
    get: () => ({ ...defaults, ...style.value[field] })[key],
    set: (value: number) => setStyle({ [field]: { ...defaults, ...style.value[field], [key]: value } })
  })
  return Object.fromEntries(geometryFields.map(({ key }) => [key, slider(key)])) as Record<'x' | 'y' | 'blur' | 'spread', ReturnType<typeof slider>>
}

const borderColor = computed({
  get: () => style.value.borderColor || 'default',
  set: (value: any) => setStyle({ borderColor: value })
})

const shadowColor = computed({
  get: () => style.value.shadowColor || 'default',
  set: (value: any) => setStyle({ shadowColor: value })
})

// The two shadow sections are the same panel pointed at different style
// fields — one config each, one template.
const shadowSections = [{
  label: 'Shadow',
  model: shadowStyle,
  options: SHADOW_STYLE_OPTIONS,
  color: shadowColor,
  shades: shadowShades,
  opacity: shadowOpacity,
  geometry: geometrySliders('shadowGeometry', SHADOW_GEOMETRY_DEFAULTS),
  hard: computed(() => (style.value.shadow || 'none') === 'hard')
}, {
  label: 'Inner shadow',
  model: innerShadowStyle,
  options: INNER_SHADOW_OPTIONS,
  color: innerShadowColor,
  shades: innerShadowShades,
  opacity: innerShadowOpacity,
  geometry: geometrySliders('innerShadowGeometry', INNER_SHADOW_GEOMETRY_DEFAULTS),
  hard: computed(() => style.value.innerShadow === 'hard')
}]
</script>

<template>
  <div>
    <template v-if="group === 'colors'">
      <!-- Sections own their padding so the separators run edge to edge. -->
      <div class="flex flex-col">
        <ThemeStudioColorSection alias="primary" help-to="/docs/getting-started/theme/css-variables#colors" class="p-4" />

        <USeparator />

        <ThemeStudioColorSection alias="neutral" help-to="/docs/getting-started/theme/css-variables#text" class="p-4" />

        <USeparator />

        <ThemeStudioSection label="Semantic" help-to="/docs/getting-started/theme/design-system" :default-open="false" class="p-4">
          <div class="flex flex-col gap-3 pt-1">
            <ThemeStudioColorSection v-for="alias in semanticAliases" :key="alias" :alias="alias" />
          </div>
        </ThemeStudioSection>
      </div>
    </template>

    <template v-else-if="group === 'style'">
      <div class="flex flex-col">
        <template v-for="section in shadowSections" :key="section.label">
          <ThemeStudioSection :label="section.label" class="p-4">
            <div>
              <UTabs
                v-model="section.model.value"
                :items="section.options"
                :content="false"
                size="xs"
                color="primary"
                class="w-full"
              />

              <div v-if="section.model.value === 'custom'" class="mt-1.5 flex flex-col gap-2">
                <USelect
                  v-model="section.color.value"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-paint-bucket"
                  :items="shadowColorItems"
                  class="w-full"
                />

                <template v-if="section.color.value === 'shade' || section.color.value === 'primary-shade'">
                  <ThemeStudioSliderRow
                    v-for="(slider, modeName) in section.shades"
                    :key="modeName"
                    v-model="slider.value"
                    :mode="modeName"
                    :chip="section.color.value === 'primary-shade' ? primaryChip : neutralChip"
                    :default-value="SHADES.indexOf(SHADOW_SHADE_DEFAULTS[modeName] as typeof SHADES[number])"
                  />
                </template>

                <ThemeStudioSliderRow
                  v-model="section.opacity.value"
                  label="Opacity"
                  :min="5"
                  :max="100"
                  :step="5"
                  unit="%"
                />

                <template v-if="section.hard.value">
                  <ThemeStudioSliderRow
                    v-for="field in geometryFields"
                    :key="field.key"
                    v-model="section.geometry[field.key].value"
                    :label="field.label"
                    :min="field.min"
                    :max="field.max"
                    :step="1"
                    unit="px"
                  />
                </template>
              </div>
            </div>
          </ThemeStudioSection>

          <USeparator />
        </template>

        <ThemeStudioSection label="Borders" class="p-4">
          <div>
            <UTabs
              v-model="borderStyle"
              :items="borderOptions"
              :content="false"
              size="xs"
              color="primary"
              class="w-full"
            />

            <div v-if="borderStyle === 'custom'" class="mt-1.5 flex flex-col gap-2">
              <ThemeStudioSliderRow
                v-model="borderWidth"
                label="Width"
                :min="1"
                :max="4"
                :step="1"
                unit="px"
              />

              <div class="flex items-center gap-2">
                <span class="text-xs text-muted w-13 shrink-0 select-none">Frame</span>

                <UTooltip text="Outline solid surfaces too — the neobrutalist look">
                  <USwitch v-model="frameSolids" size="sm" aria-label="Frame solid surfaces" />
                </UTooltip>
              </div>

              <USelect
                v-model="borderColor"
                size="sm"
                color="neutral"
                variant="subtle"
                icon="i-lucide-paint-bucket"
                :items="borderColorItems"
                class="w-full"
              />

              <template v-if="borderColor === 'shade' || borderColor === 'primary-shade'">
                <ThemeStudioSliderRow
                  v-for="(slider, modeName) in borderShades"
                  :key="modeName"
                  v-model="slider.value"
                  :mode="modeName"
                  :chip="borderColor === 'primary-shade' ? primaryChip : neutralChip"
                  :default-value="SHADES.indexOf(BORDER_SHADE_DEFAULTS[modeName] as typeof SHADES[number])"
                />
              </template>
            </div>
          </div>
        </ThemeStudioSection>
      </div>
    </template>

    <template v-else-if="group === 'general'">
      <div class="flex flex-col">
        <ThemeStudioSection label="Font" help-to="/docs/getting-started/integrations/fonts" class="p-4">
          <div class="flex flex-col gap-2">
            <!-- live specimen: the heading treatment over the base body -->
            <div class="rounded-md ring ring-default bg-elevated/50 px-3 py-2 select-none">
              <p class="text-sm text-highlighted truncate" :style="headingSampleStyle">
                Grumpy wizards make toxic brew
              </p>
              <p class="text-xs text-muted truncate" :style="bodySampleStyle">
                The quick brown fox jumps over the lazy dog 0123456789
              </p>
            </div>

            <template v-for="row in fontRows" :key="row.key">
              <span class="text-xs font-medium text-muted select-none" :class="row.key === 'heading' && 'pt-1'">{{ row.label }}</span>

              <div class="flex items-center gap-1.5">
                <UPopover v-model:open="fontListOpen[row.key]" :content="{ align: 'start' }" class="flex-1 min-w-0">
                  <UButton
                    color="neutral"
                    variant="subtle"
                    size="sm"
                    block
                    :icon="row.selectIcon"
                    trailing-icon="i-lucide-chevron-down"
                    :ui="{ label: 'flex-1 text-left truncate' }"
                    :aria-label="`${row.label} font`"
                  >
                    <span
                      class="truncate"
                      :style="row.font.value === 'inherit' ? undefined : { fontFamily: `'${row.font.value}', sans-serif` }"
                    >{{ row.items.value.find(item => item.value === row.font.value)?.label ?? row.font.value }}<span v-if="row.font.value === row.defaultValue" class="text-dimmed font-normal">&nbsp;(Default)</span></span>
                  </UButton>

                  <template #content>
                    <!-- each family renders itself over a live specimen line -->
                    <UListbox
                      v-model="row.font.value"
                      :items="row.items.value"
                      value-key="value"
                      class="w-72"
                      :ui="{ root: 'ring-0 rounded-md', content: 'max-h-80' }"
                      @update:model-value="fontListOpen[row.key] = false"
                    >
                      <template #item-label="{ item }">
                        <span :style="item.value === 'inherit' ? undefined : { fontFamily: `'${item.value}', sans-serif` }">{{ item.label }}</span><span v-if="item.value === row.defaultValue" class="text-dimmed">&nbsp;(Default)</span>
                      </template>

                      <template #item-description="{ item }">
                        <span
                          v-if="item.value !== 'inherit'"
                          class="text-xs text-muted truncate"
                          :style="{ fontFamily: `'${item.value}', sans-serif` }"
                        >Grumpy wizards make toxic brew</span>
                      </template>
                    </UListbox>
                  </template>
                </UPopover>

                <UFieldGroup size="sm">
                  <UPopover :content="{ align: 'start' }">
                    <UTooltip :text="row.weights.length > 1 ? 'Weights' : 'Weight'">
                      <UButton
                        icon="i-lucide-bold"
                        color="neutral"
                        variant="subtle"
                        :active="row.weightsActive.value"
                        active-color="primary"
                        active-variant="subtle"
                        :aria-label="row.aria.weights"
                      />
                    </UTooltip>

                    <template #content>
                      <div class="w-64 p-3 flex flex-col gap-1.5">
                        <ThemeStudioSliderRow
                          v-for="weight in row.weights"
                          :key="weight.label"
                          v-model="weight.model.value"
                          :label="weight.label"
                          :min="weight.min"
                          :max="weight.max"
                          :step="25"
                        />
                      </div>
                    </template>
                  </UPopover>

                  <UTooltip text="Uppercase">
                    <UButton
                      icon="i-lucide-case-upper"
                      color="neutral"
                      variant="subtle"
                      :active="row.uppercase.value"
                      active-color="primary"
                      active-variant="subtle"
                      :aria-label="row.aria.uppercase"
                      @click="row.uppercase.value = !row.uppercase.value"
                    />
                  </UTooltip>

                  <UPopover :content="{ align: 'start' }">
                    <UTooltip text="Letter spacing">
                      <UButton
                        icon="i-lucide-move-horizontal"
                        color="neutral"
                        variant="subtle"
                        :active="row.letterSpacing.value !== 0"
                        active-color="primary"
                        active-variant="subtle"
                        :aria-label="row.aria.spacing"
                      />
                    </UTooltip>

                    <template #content>
                      <ThemeStudioSliderRow
                        v-model="row.letterSpacing.value"
                        label="Spacing"
                        :min="-0.05"
                        :max="0.25"
                        :step="0.005"
                        unit="em"
                        class="w-64 p-3"
                      />
                    </template>
                  </UPopover>

                  <UPopover :content="{ align: 'start' }">
                    <UTooltip text="Line height">
                      <UButton
                        icon="i-lucide-move-vertical"
                        color="neutral"
                        variant="subtle"
                        :active="row.lineHeight.value !== row.lineHeightDefault"
                        active-color="primary"
                        active-variant="subtle"
                        :aria-label="row.aria.height"
                      />
                    </UTooltip>

                    <template #content>
                      <ThemeStudioSliderRow
                        v-model="row.lineHeight.value"
                        label="Height"
                        :min="1"
                        :max="2"
                        :step="0.05"
                        class="w-64 p-3"
                      />
                    </template>
                  </UPopover>
                </UFieldGroup>
              </div>
            </template>
          </div>
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Icons" help-to="/docs/getting-started/integrations/icons" class="p-4">
          <div class="flex flex-col gap-2">
            <!-- a spread of the selected set -->
            <div class="rounded-md ring ring-default bg-elevated/50 px-3 py-2 flex flex-wrap justify-center gap-2.5">
              <UIcon v-for="name in iconPreviews" :key="name" :name="name" class="size-4 text-muted" />
            </div>

            <UPopover v-model:open="iconListOpen" :content="{ align: 'start' }">
              <UButton
                color="neutral"
                variant="subtle"
                size="sm"
                block
                :icon="icons.find(i => i.value === icon)?.icon"
                trailing-icon="i-lucide-chevron-down"
                :label="icons.find(i => i.value === icon)?.label"
                :ui="{ label: 'flex-1 text-left' }"
                aria-label="Icon set"
              />

              <template #content>
                <!-- every set previews a strip of its own glyphs -->
                <UListbox
                  v-model="icon"
                  :items="icons"
                  value-key="value"
                  class="w-72"
                  :ui="{ root: 'ring-0 rounded-md', content: 'max-h-80' }"
                  @update:model-value="iconListOpen = false"
                >
                  <template #item-description="{ item }">
                    <span class="flex items-center gap-1.5 pt-0.5">
                      <UIcon
                        v-for="name in iconSetSamples(item.value)"
                        :key="name"
                        :name="name"
                        class="size-3.5 text-muted"
                      />
                    </span>
                  </template>
                </UListbox>
              </template>
            </UPopover>
          </div>
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Scale" class="p-4">
          <div class="flex flex-col gap-2">
            <ThemeStudioSliderRow
              v-model="radius"
              label="Radius"
              :min="0"
              :max="0.5"
              :step="0.125"
              unit="rem"
            />

            <ThemeStudioSliderRow
              v-model="fontSize"
              label="Text"
              :min="14"
              :max="18"
              :step="0.5"
              unit="px"
            />

            <ThemeStudioSliderRow v-model="spacing" label="Spacing" :min="0.15" :max="0.35" :step="0.025" />

            <div class="flex items-center gap-2">
              <span class="text-xs text-muted w-13 shrink-0 select-none">Size</span>

              <USelect
                v-model="defaultSize"
                size="sm"
                color="neutral"
                variant="subtle"
                icon="i-lucide-proportions"
                :items="defaultSizeItems"
                class="flex-1"
              >
                <template #default>
                  {{ defaultSizeItems.find(item => item.value === defaultSize)?.label }}<span v-if="defaultSize === 'default'" class="text-dimmed">&nbsp;(Default)</span>
                </template>

                <template #item-label="{ item }">
                  {{ item.label }}<span v-if="item.defaultTag" class="text-dimmed">&nbsp;(Default)</span>
                </template>
              </USelect>
            </div>
          </div>
        </ThemeStudioSection>

        <USeparator />

        <template v-for="field in variantGroupFields" :key="field.key">
          <ThemeStudioSection :label="field.label" :default-open="false" class="p-4">
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted w-13 shrink-0 select-none">Variant</span>

                <UPopover v-model:open="variantGridOpen[field.key]" :content="{ side: 'bottom', align: 'start' }" class="flex-1">
                  <UButton
                    size="sm"
                    color="neutral"
                    variant="subtle"
                    block
                    icon="i-lucide-layers"
                    trailing-icon="i-lucide-chevron-down"
                    :ui="{ label: 'flex-1 text-left' }"
                    :aria-label="`${field.label} variant`"
                  >
                    {{ field.items.find(item => item.value === (groupVariants[field.key].value === 'default' ? field.stock : groupVariants[field.key].value))?.label }}<span v-if="groupVariants[field.key].value === 'default'" class="text-dimmed font-normal">&nbsp;(Default)</span>
                  </UButton>

                  <template #content>
                    <!-- each cell renders IN the variant it picks -->
                    <div class="w-64 p-2 grid grid-cols-2 gap-1">
                      <UButton
                        v-for="item in field.items"
                        :key="item.value"
                        size="sm"
                        block
                        :color="(groupVariants[field.key].value === item.value || (groupVariants[field.key].value === 'default' && item.value === field.stock)) ? 'primary' : 'neutral'"
                        :variant="RENDERABLE_VARIANTS.includes(item.value) ? (item.value as any) : 'subtle'"
                        :class="[item.value === 'none' && 'opacity-60', 'min-w-0']"
                        @click="groupVariants[field.key].value = (item.value === field.stock ? 'default' : item.value); variantGridOpen[field.key] = false"
                      >
                        <!-- opacity, not a color: text-dimmed would fight the variant's own text color -->
                        <span class="truncate">{{ item.label }}<span v-if="item.value === field.stock" class="opacity-70 font-normal">&nbsp;(Default)</span></span>
                      </UButton>
                    </div>
                  </template>
                </UPopover>
              </div>

              <div v-if="field.hasColor" class="flex items-center gap-2">
                <span class="text-xs text-muted w-13 shrink-0 select-none">Color</span>

                <USelect
                  v-model="groupColors[field.key].value"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                  :items="defaultColorItems"
                  class="flex-1"
                >
                  <template #leading>
                    <UChip
                      :color="(groupColors[field.key].value === 'default' ? 'primary' : groupColors[field.key].value) as any"
                      inset
                      standalone
                    />
                  </template>

                  <template #default>
                    {{ defaultColorItems.find(item => item.value === groupColors[field.key].value)?.label }}<span v-if="groupColors[field.key].value === 'default'" class="text-dimmed">&nbsp;(Default)</span>
                  </template>

                  <template #item-label="{ item }">
                    {{ item.label }}<span v-if="item.defaultTag" class="text-dimmed">&nbsp;(Default)</span>
                  </template>
                </USelect>
              </div>
            </div>
          </ThemeStudioSection>

          <USeparator v-if="field.key !== 'inputs'" />
        </template>
      </div>
    </template>
  </div>
</template>
