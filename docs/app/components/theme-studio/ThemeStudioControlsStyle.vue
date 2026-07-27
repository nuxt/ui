<script setup lang="ts">
import { SHADE_LADDER, SHADOW_SHADE_DEFAULTS, BORDER_SHADE_DEFAULTS, BORDER_WIDTH_DEFAULT, SHADOW_GEOMETRY_DEFAULTS, INNER_SHADOW_GEOMETRY_DEFAULTS, isCustomShadow } from '../../utils/theme-engine'
import type { ShadeStop } from '../../utils/theme-engine'

const { style, setStyle, primaryChip, neutralChip, baselineDoc } = useThemeStudio()

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
        shadow: 'custom',
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
  set: (value: any) => setStyle({ innerShadow: value === 'custom' ? 'custom' : 'none' })
})

const shadowOpacity = computed({
  get: () => style.value.shadowOpacity ?? 25,
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

// Default recolors nothing — every ring keeps its own per-element color —
// so it reads "Per element" rather than pretending to be a paint choice.
const borderColorItems = [
  { label: 'Per element', value: 'default', defaultTag: true },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
  { label: 'Primary', value: 'primary' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Neutral shade', value: 'shade' },
  { label: 'Primary shade', value: 'primary-shade' }
]

// The drop shadow's stock color IS the neutral shade at its resting stops
// (neutral-950 light / literal black dark), so Default merges into a
// tagged 'Neutral shade' — the ladder's black end made this expressible.
const shadowColorItems = [
  { label: 'Neutral shade', value: 'shade', defaultTag: true },
  { label: 'Black', value: 'black' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Primary', value: 'primary' },
  { label: 'Primary shade', value: 'primary-shade' }
]

// The inner shadow's default is a live link — inherit whatever
// --ui-shadow-color currently resolves to — not a pinnable shade.
const innerShadowColorItems = [
  { label: 'Inherit shadow', value: 'default', defaultTag: true },
  { label: 'Black', value: 'black' },
  { label: 'Inverted', value: 'inverted' },
  { label: 'Primary', value: 'primary' },
  { label: 'Neutral shade', value: 'shade' },
  { label: 'Primary shade', value: 'primary-shade' }
]

// Slider position ↔ SHADES index, per mode. shadow/border shades write both
// modes on first touch (explicit 'shade' mode choice); token shades write
// ONLY the touched mode so an untouched mode never becomes an override.
// Dirty/reset measure against the BASELINE preset's choice: reset restores
// it, or deletes the entry when the preset made none.
function shadeControl(field: 'shadowShade' | 'innerShadowShade' | 'borderShade', defaults: { light: ShadeStop, dark: ShadeStop }, target: 'light' | 'dark') {
  const model = computed({
    // Per-key fallback: an imported doc can carry a single-mode shade
    // object ({ light: 400 }) — indexOf(undefined) would park the slider
    // at -1 and the chip at var(--color-…-undefined).
    get: () => SHADE_LADDER.indexOf((style.value[field]?.[target] ?? defaults[target]) as typeof SHADE_LADDER[number]),
    set: (index: number) => {
      const current = { ...defaults, ...style.value[field] }
      setStyle({ [field]: { ...current, [target]: SHADE_LADDER[index]! } })
    }
  })
  const baseline = computed(() => baselineDoc.value.style?.[field]?.[target])
  const dirty = computed(() => style.value[field]?.[target] !== baseline.value)
  function reset() {
    const entry: { light?: ShadeStop, dark?: ShadeStop } = { ...style.value[field] }
    if (baseline.value !== undefined) entry[target] = baseline.value
    else Reflect.deleteProperty(entry, target)
    setStyle({ [field]: Object.keys(entry).length ? entry : undefined })
  }
  return { model, dirty, reset }
}

const shadowShades = {
  light: shadeControl('shadowShade', SHADOW_SHADE_DEFAULTS, 'light'),
  dark: shadeControl('shadowShade', SHADOW_SHADE_DEFAULTS, 'dark')
}

const innerShadowShades = {
  light: shadeControl('innerShadowShade', SHADOW_SHADE_DEFAULTS, 'light'),
  dark: shadeControl('innerShadowShade', SHADOW_SHADE_DEFAULTS, 'dark')
}

const borderShades = {
  light: shadeControl('borderShade', BORDER_SHADE_DEFAULTS, 'light'),
  dark: shadeControl('borderShade', BORDER_SHADE_DEFAULTS, 'dark')
}

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
  // absent (and legacy 'default') read as the resting neutral shade
  get: () => {
    const color = style.value.shadowColor
    return !color || color === 'default' ? 'shade' : color
  },
  set: (value: any) => setStyle({ shadowColor: value })
})

// The press choreography (buttons sinking onto their shadow) rides the
// shadow offset — optional, so soft blurred configs can keep buttons still.
const shadowPress = computed({
  get: () => style.value.shadowPress !== false,
  set: (value: boolean) => setStyle({ shadowPress: value ? undefined : false })
})

// The two shadow sections are the same panel pointed at different style
// fields — one config each, one template.
const shadowSections = [{
  label: 'Shadow',
  dirtyKey: 'shadow' as const,
  colorItems: shadowColorItems,
  model: shadowStyle,
  options: SHADOW_STYLE_OPTIONS,
  color: shadowColor,
  shades: shadowShades,
  opacity: shadowOpacity,
  geometry: geometrySliders('shadowGeometry', SHADOW_GEOMETRY_DEFAULTS),
  hard: computed(() => isCustomShadow(style.value.shadow)),
  press: shadowPress as typeof shadowPress | undefined
}, {
  label: 'Inner shadow',
  dirtyKey: 'innerShadow' as const,
  colorItems: innerShadowColorItems,
  model: innerShadowStyle,
  options: INNER_SHADOW_OPTIONS,
  color: innerShadowColor,
  shades: innerShadowShades,
  opacity: innerShadowOpacity,
  geometry: geometrySliders('innerShadowGeometry', INNER_SHADOW_GEOMETRY_DEFAULTS),
  hard: computed(() => isCustomShadow(style.value.innerShadow)),
  press: undefined
}]

// Per-section fold-out for the shade fine-tuning, mirroring the Colors panel's
// "Adjust shades" affordance — the per-mode shade sliders stay out of the main
// shadow flow until asked for. Keyed by dirtyKey so the two sections toggle
// independently.
const shadeEditors = reactive<Record<string, boolean>>({})
const borderShadeEditor = ref(false)
const isShadeColor = (color?: string) => color === 'shade' || color === 'primary-shade'
</script>

<template>
  <!-- Sections own their padding so the separators run edge to edge. -->
  <div class="flex flex-col">
    <template v-for="section in shadowSections" :key="section.label">
      <ThemeStudioSection :label="section.label" class="p-4" :section-key="section.dirtyKey">
        <template v-if="section.model.value === 'custom'" #actions>
          <UTooltip text="Colour & shades">
            <UButton
              icon="i-lucide-settings-2"
              color="neutral"
              variant="ghost"
              size="xs"
              :active="shadeEditors[section.dirtyKey]"
              active-color="primary"
              active-variant="subtle"
              :aria-label="`${section.label} colour and shades`"
              @click="shadeEditors[section.dirtyKey] = !shadeEditors[section.dirtyKey]"
            />
          </UTooltip>
        </template>

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

              <div v-if="section.press" class="flex items-center justify-between gap-2">
                <span class="text-xs text-muted select-none">Button press effect</span>

                <UTooltip text="Buttons sink onto their shadow on hover and press">
                  <USwitch v-model="section.press.value" size="sm" aria-label="Button press effect" />
                </UTooltip>
              </div>
            </template>

            <!-- Colour and its per-mode shade sliders fold out from the header
                 toggle and sit last, keeping the main flow to opacity/geometry. -->
            <template v-if="shadeEditors[section.dirtyKey]">
              <ThemeStudioDefaultSelect
                v-model="section.color.value"
                :items="section.colorItems"
                icon="i-lucide-paint-bucket"
                class="w-full"
                :aria-label="`${section.label} color`"
              />

              <ThemeStudioSliderRow
                v-for="(slider, modeName) in section.shades"
                v-show="isShadeColor(section.color.value)"
                :key="modeName"
                v-model="slider.model.value"
                :mode="modeName"
                :chip="section.color.value === 'primary-shade' ? primaryChip : neutralChip"
                resettable
                :dirty="slider.dirty.value"
                @reset="slider.reset()"
              />
            </template>
          </div>
        </div>
      </ThemeStudioSection>

      <USeparator />
    </template>

    <ThemeStudioSection label="Borders" class="p-4" section-key="borders">
      <template v-if="borderStyle === 'custom'" #actions>
        <UTooltip text="Colour & shades">
          <UButton
            icon="i-lucide-settings-2"
            color="neutral"
            variant="ghost"
            size="xs"
            :active="borderShadeEditor"
            active-color="primary"
            active-variant="subtle"
            aria-label="Border colour and shades"
            @click="borderShadeEditor = !borderShadeEditor"
          />
        </UTooltip>
      </template>

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

          <!-- Frame colour, its shade sliders, and the neutral border tokens
               (relocated from the Colors panel) fold out from the header toggle
               and sit last, mirroring the shadow sections. -->
          <template v-if="borderShadeEditor">
            <ThemeStudioDefaultSelect
              v-model="borderColor"
              :items="borderColorItems"
              icon="i-lucide-paint-bucket"
              class="w-full"
              aria-label="Border color"
            />

            <ThemeStudioSliderRow
              v-for="(slider, modeName) in borderShades"
              v-show="borderColor === 'shade' || borderColor === 'primary-shade'"
              :key="modeName"
              v-model="slider.model.value"
              :mode="modeName"
              :chip="borderColor === 'primary-shade' ? primaryChip : neutralChip"
              resettable
              :dirty="slider.dirty.value"
              @reset="slider.reset()"
            />

            <ThemeStudioTokenShades :alias="'neutral'" :groups="['border']" />
          </template>
        </div>
      </div>
    </ThemeStudioSection>
  </div>
</template>
