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

/** Every listed family, loaded once so the pickers can preview themselves. */
onMounted(() => {
  if (document.getElementById('font-previews')) return
  const families = fonts.filter(name => name !== 'Public Sans')
    .map(name => `family=${encodeURIComponent(name)}:wght@400;700`).join('&')
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.id = 'font-previews'
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`
  document.head.appendChild(link)
})

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

const headingItalic = computed({
  get: () => !!fontPrefs.value.heading?.italic,
  set: (value: boolean) => setHeading({ italic: value })
})

const baseUppercase = computed({
  get: () => !!fontPrefs.value.uppercase,
  set: (value: boolean) => setFontPrefs({ ...fontPrefs.value, uppercase: value })
})

const baseItalic = computed({
  get: () => !!fontPrefs.value.italic,
  set: (value: boolean) => setFontPrefs({ ...fontPrefs.value, italic: value })
})

const headingUnderline = computed({
  get: () => !!fontPrefs.value.heading?.underline,
  set: (value: boolean) => setHeading({ underline: value })
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

const headingLineHeight = computed({
  get: () => fontPrefs.value.heading?.lineHeight ?? 1.5,
  set: (value: number) => setHeading({ lineHeight: value })
})

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
  set: (value: any) => setStyle({ shadow: value === 'custom' ? 'hard' : value === 'none' ? 'flat' : 'none' })
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

function innerGeometrySlider(key: 'x' | 'y' | 'blur' | 'spread') {
  return computed({
    get: () => ({ ...INNER_SHADOW_GEOMETRY_DEFAULTS, ...style.value.innerShadowGeometry })[key],
    set: (value: number) => setStyle({ innerShadowGeometry: { ...INNER_SHADOW_GEOMETRY_DEFAULTS, ...style.value.innerShadowGeometry, [key]: value } })
  })
}

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

/**
 * Same hydration-adoption problem for every control: SSR renders default
 * state (no localStorage), and persisted slider positions/selections looked
 * stale until touched. One post-mount re-render — only when saved state
 * exists — puts everything on client truth.
 */
const hydrationKey = ref(0)

onMounted(() => {
  // ANY persisted theme state means the SSR markup rendered defaults —
  // fonts, icon sets and palette picks included, not just the studio axes.
  if (Object.keys(localStorage).some(key => key.startsWith('nuxt-ui-'))) {
    hydrationKey.value = 1
  }
})

const defaultSizeItems = [
  { label: 'Default', value: 'default' },
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' }
]

// Per-group default variants, each offering only what its components
// actually support (buttons add ghost, form fields run outline → none);
// the app-wide `variant` (presets, shuffle) shows through as the fallback
// until a group makes its own choice.
const variantItems = (values: string[]) => ['default', ...values].map(value => ({ label: value.charAt(0).toUpperCase() + value.slice(1), value }))

const variantGroupFields = [
  { key: 'buttons' as const, label: 'Button Defaults', hasColor: true, items: variantItems(['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']) },
  { key: 'panels' as const, label: 'Card Defaults', hasColor: false, items: variantItems(['solid', 'outline', 'soft', 'subtle']) },
  { key: 'inputs' as const, label: 'Input Defaults', hasColor: true, items: variantItems(['outline', 'soft', 'subtle', 'ghost', 'none']) }
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

const defaultColorItems = ['default', 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'].map(value => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
  chip: value === 'default' ? undefined : { color: value as any }
}))

function groupColorModel(group: VariantGroup) {
  return computed({
    get: () => style.value.defaults?.colors?.[group] || 'default',
    set: (value: any) => setStyle({ defaults: { ...style.value.defaults, colors: { ...style.value.defaults?.colors, [group]: value } } })
  })
}

const groupColors = Object.fromEntries(variantGroupFields.map(field => [field.key, groupColorModel(field.key)])) as Record<VariantGroup, ReturnType<typeof groupColorModel>>

const defaultSize = computed({
  get: () => style.value.defaults?.size || 'default',
  set: (value: any) => setStyle({ defaults: { ...style.value.defaults, size: value } })
})

// Hard-shadow geometry sliders (px)
const geometryFields = [
  { key: 'x', label: 'Offset X', min: -12, max: 12 },
  { key: 'y', label: 'Offset Y', min: -12, max: 12 },
  { key: 'blur', label: 'Blur', min: 0, max: 24 },
  { key: 'spread', label: 'Spread', min: 0, max: 8 }
] as const

function geometrySlider(key: 'x' | 'y' | 'blur' | 'spread') {
  return computed({
    get: () => ({ ...SHADOW_GEOMETRY_DEFAULTS, ...style.value.shadowGeometry })[key],
    set: (value: number) => setStyle({ shadowGeometry: { ...SHADOW_GEOMETRY_DEFAULTS, ...style.value.shadowGeometry, [key]: value } })
  })
}

const geometry = Object.fromEntries(geometryFields.map(field => [field.key, geometrySlider(field.key)])) as Record<'x' | 'y' | 'blur' | 'spread', ReturnType<typeof geometrySlider>>

const innerGeometry = Object.fromEntries(geometryFields.map(field => [field.key, innerGeometrySlider(field.key)])) as Record<'x' | 'y' | 'blur' | 'spread', ReturnType<typeof innerGeometrySlider>>

const borderColor = computed({
  get: () => style.value.borderColor || 'default',
  set: (value: any) => setStyle({ borderColor: value })
})

const shadowColor = computed({
  get: () => style.value.shadowColor || 'default',
  set: (value: any) => setStyle({ shadowColor: value })
})
</script>

<template>
  <div :key="hydrationKey">
    <template v-if="group === 'colors'">
      <div class="flex flex-col gap-4">
        <ThemeStudioColorSection alias="primary" help-to="/docs/getting-started/theme/css-variables#colors" />

        <USeparator />

        <ThemeStudioColorSection alias="neutral" help-to="/docs/getting-started/theme/css-variables#text" />

        <USeparator />

        <ThemeStudioSection label="Semantic" help-to="/docs/getting-started/theme/design-system" :default-open="false">
          <div class="flex flex-col gap-3 pt-1">
            <ThemeStudioColorSection v-for="alias in semanticAliases" :key="alias" :alias="alias" />
          </div>
        </ThemeStudioSection>
      </div>
    </template>

    <template v-else-if="group === 'style'">
      <div class="flex flex-col gap-4">
        <ThemeStudioSection label="Shadow">
          <div>
            <UTabs
              v-model="shadowStyle"
              :items="SHADOW_STYLE_OPTIONS"
              :content="false"
              size="xs"
              color="neutral"
              class="w-full"
            />

            <div v-if="shadowStyle === 'custom'" class="mt-1.5 flex flex-col gap-2">
              <USelect
                v-model="shadowColor"
                size="sm"
                color="neutral"
                variant="subtle"
                icon="i-lucide-paint-bucket"
                :items="shadowColorItems"
                class="w-full"
              />

              <template v-if="shadowColor === 'shade' || shadowColor === 'primary-shade'">
                <ThemeStudioSliderRow
                  v-for="(slider, modeName) in shadowShades"
                  :key="modeName"
                  v-model="slider.value"
                  :mode="modeName"
                  :chip="shadowColor === 'primary-shade' ? primaryChip : neutralChip"
                />
              </template>

              <ThemeStudioSliderRow
                v-model="shadowOpacity"
                label="Opacity"
                :min="5"
                :max="100"
                :step="5"
                unit="%"
              />

              <template v-if="(style.shadow || 'none') === 'hard'">
                <ThemeStudioSliderRow
                  v-for="field in geometryFields"
                  :key="field.key"
                  v-model="geometry[field.key].value"
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

        <ThemeStudioSection label="Inner shadow">
          <div>
            <UTabs
              v-model="innerShadowStyle"
              :items="INNER_SHADOW_OPTIONS"
              :content="false"
              size="xs"
              color="neutral"
              class="w-full"
            />

            <div v-if="innerShadowStyle === 'custom'" class="mt-1.5 flex flex-col gap-2">
              <USelect
                v-model="innerShadowColor"
                size="sm"
                color="neutral"
                variant="subtle"
                icon="i-lucide-paint-bucket"
                :items="shadowColorItems"
                class="w-full"
              />

              <template v-if="innerShadowColor === 'shade' || innerShadowColor === 'primary-shade'">
                <ThemeStudioSliderRow
                  v-for="(slider, modeName) in innerShadowShades"
                  :key="modeName"
                  v-model="slider.value"
                  :mode="modeName"
                  :chip="innerShadowColor === 'primary-shade' ? primaryChip : neutralChip"
                />
              </template>

              <ThemeStudioSliderRow
                v-model="innerShadowOpacity"
                label="Opacity"
                :min="5"
                :max="100"
                :step="5"
                unit="%"
              />

              <template v-if="style.innerShadow === 'hard'">
                <ThemeStudioSliderRow
                  v-for="field in geometryFields"
                  :key="field.key"
                  v-model="innerGeometry[field.key].value"
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

        <ThemeStudioSection label="Borders">
          <div>
            <UTabs
              v-model="borderStyle"
              :items="borderOptions"
              :content="false"
              size="xs"
              color="neutral"
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
                />
              </template>
            </div>
          </div>
        </ThemeStudioSection>
      </div>
    </template>

    <template v-else-if="group === 'general'">
      <div class="flex flex-col gap-4">
        <ThemeStudioSection label="Font" help-to="/docs/getting-started/integrations/fonts">
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

            <span class="text-xs font-semibold text-muted select-none">Base</span>

            <USelect
              v-model="font"
              size="sm"
              color="neutral"
              variant="subtle"
              icon="i-lucide-type"
              :items="fonts"
              class="w-full"
            >
              <template #item-label="{ item }">
                <span :style="{ fontFamily: `'${item}', sans-serif` }">{{ item }}</span>
              </template>
            </USelect>

            <div class="flex items-center gap-1.5">
              <!-- face -->
              <UFieldGroup size="sm">
                <UPopover :content="{ align: 'start' }">
                  <UTooltip text="Weights">
                    <UButton
                      icon="i-lucide-bold"
                      color="neutral"
                      variant="subtle"
                      :active="weightsDirty"
                      active-color="primary"
                      active-variant="subtle"
                      aria-label="Font weights"
                    />
                  </UTooltip>

                  <template #content>
                    <div class="w-64 p-3 flex flex-col gap-1.5">
                      <ThemeStudioSliderRow
                        v-for="step in WEIGHT_STEPS"
                        :key="step"
                        v-model="weightSteps[step].value"
                        :label="step.charAt(0).toUpperCase() + step.slice(1)"
                        :min="100"
                        :max="900"
                        :step="25"
                      />
                    </div>
                  </template>
                </UPopover>

                <UTooltip text="Italic">
                  <UButton
                    icon="i-lucide-italic"
                    color="neutral"
                    variant="subtle"
                    :active="baseItalic"
                    active-color="primary"
                    active-variant="subtle"
                    aria-label="Italic text"
                    @click="baseItalic = !baseItalic"
                  />
                </UTooltip>
              </UFieldGroup>

              <!-- glyph treatment -->
              <UFieldGroup size="sm">
                <UTooltip text="Uppercase">
                  <UButton
                    icon="i-lucide-case-upper"
                    color="neutral"
                    variant="subtle"
                    :active="baseUppercase"
                    active-color="primary"
                    active-variant="subtle"
                    aria-label="Uppercase text"
                    @click="baseUppercase = !baseUppercase"
                  />
                </UTooltip>
              </UFieldGroup>

              <!-- rhythm -->
              <UFieldGroup size="sm">
                <UPopover :content="{ align: 'start' }">
                  <UTooltip text="Letter spacing">
                    <UButton
                      icon="i-lucide-move-horizontal"
                      color="neutral"
                      variant="subtle"
                      :active="baseLetterSpacing !== 0"
                      active-color="primary"
                      active-variant="subtle"
                      aria-label="Letter spacing"
                    />
                  </UTooltip>

                  <template #content>
                    <ThemeStudioSliderRow
                      v-model="baseLetterSpacing"
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
                      :active="baseLineHeight !== 1.5"
                      active-color="primary"
                      active-variant="subtle"
                      aria-label="Line height"
                    />
                  </UTooltip>

                  <template #content>
                    <ThemeStudioSliderRow
                      v-model="baseLineHeight"
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

            <span class="text-xs font-semibold text-muted select-none pt-1">Headings (Prose)</span>

            <USelect
              v-model="headingFont"
              size="sm"
              color="neutral"
              variant="subtle"
              icon="i-lucide-heading"
              :items="headingFontItems"
              class="w-full"
            >
              <template #item-label="{ item }">
                <span :style="item.value === 'inherit' ? undefined : { fontFamily: `'${item.value}', sans-serif` }">{{ item.label }}</span>
              </template>
            </USelect>

            <div class="flex items-center gap-1.5">
              <!-- face -->
              <UFieldGroup size="sm">
                <UPopover :content="{ align: 'start' }">
                  <UTooltip text="Weight">
                    <UButton
                      icon="i-lucide-bold"
                      color="neutral"
                      variant="subtle"
                      :active="fontPrefs.heading?.weight !== undefined"
                      active-color="primary"
                      active-variant="subtle"
                      aria-label="Heading weight"
                    />
                  </UTooltip>

                  <template #content>
                    <ThemeStudioSliderRow
                      v-model="headingWeight"
                      label="Weight"
                      :min="100"
                      :max="900"
                      :step="25"
                      class="w-64 p-3"
                    />
                  </template>
                </UPopover>

                <UTooltip text="Italic">
                  <UButton
                    icon="i-lucide-italic"
                    color="neutral"
                    variant="subtle"
                    :active="headingItalic"
                    active-color="primary"
                    active-variant="subtle"
                    aria-label="Italic headings"
                    @click="headingItalic = !headingItalic"
                  />
                </UTooltip>

                <UTooltip text="Underline">
                  <UButton
                    icon="i-lucide-underline"
                    color="neutral"
                    variant="subtle"
                    :active="headingUnderline"
                    active-color="primary"
                    active-variant="subtle"
                    aria-label="Underline headings"
                    @click="headingUnderline = !headingUnderline"
                  />
                </UTooltip>
              </UFieldGroup>

              <!-- glyph treatment -->
              <UTooltip text="Uppercase">
                <UButton
                  icon="i-lucide-case-upper"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  :active="headingUppercase"
                  active-color="primary"
                  active-variant="subtle"
                  aria-label="Uppercase headings"
                  @click="headingUppercase = !headingUppercase"
                />
              </UTooltip>

              <!-- rhythm -->
              <UFieldGroup size="sm">
                <UPopover :content="{ align: 'start' }">
                  <UTooltip text="Letter spacing">
                    <UButton
                      icon="i-lucide-move-horizontal"
                      color="neutral"
                      variant="subtle"
                      :active="headingLetterSpacing !== 0"
                      active-color="primary"
                      active-variant="subtle"
                      aria-label="Heading letter spacing"
                    />
                  </UTooltip>

                  <template #content>
                    <ThemeStudioSliderRow
                      v-model="headingLetterSpacing"
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
                      :active="headingLineHeight !== 1.5"
                      active-color="primary"
                      active-variant="subtle"
                      aria-label="Heading line height"
                    />
                  </UTooltip>

                  <template #content>
                    <ThemeStudioSliderRow
                      v-model="headingLineHeight"
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
          </div>
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Icons" help-to="/docs/getting-started/integrations/icons">
          <div class="flex flex-col gap-2">
            <!-- a spread of the selected set -->
            <div class="rounded-md ring ring-default bg-elevated/50 px-3 py-2 flex flex-wrap justify-center gap-2.5">
              <UIcon v-for="name in iconPreviews" :key="name" :name="name" class="size-4 text-muted" />
            </div>

            <USelect
              v-model="icon"
              size="sm"
              color="neutral"
              variant="subtle"
              :icon="icons.find(i => i.value === icon)?.icon"
              :items="icons"
              class="w-full capitalize"
              :ui="{ item: 'capitalize' }"
            />
          </div>
        </ThemeStudioSection>

        <USeparator />

        <ThemeStudioSection label="Scale">
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
              />
            </div>
          </div>
        </ThemeStudioSection>

        <USeparator />

        <template v-for="field in variantGroupFields" :key="field.key">
          <ThemeStudioSection :label="field.label" :default-open="false">
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted w-13 shrink-0 select-none">Variant</span>

                <USelect
                  v-model="groupVariants[field.key].value"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                  icon="i-lucide-layers"
                  :items="field.items"
                  class="flex-1"
                />
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
                      v-if="groupColors[field.key].value !== 'default'"
                      :color="groupColors[field.key].value as any"
                      inset
                      standalone
                    />
                    <UIcon v-else name="i-lucide-palette" class="size-4 shrink-0 text-dimmed" />
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
