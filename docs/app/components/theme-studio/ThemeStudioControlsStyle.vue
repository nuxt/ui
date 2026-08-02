<script setup lang="ts">
import { SHADE_LADDER, SHADOW_SHADE_DEFAULTS, BORDER_SHADE_DEFAULTS, BORDER_WIDTH_DEFAULT, SHADOW_GEOMETRY_DEFAULTS, INNER_SHADOW_GEOMETRY_DEFAULTS } from '../../utils/theme-engine'
import type { ShadeStop } from '../../utils/theme-engine'

const { style, setStyle, primaryChip, neutralChip, baselineDoc } = useThemeStudio()

// Inherit leaves the library's shadows alone, None strips them ('flat' in
// the persisted vocabulary), Custom is the studio treatment.
const SHADOW_STYLE_OPTIONS = [
  { label: 'Inherit', value: 'inherit' },
  { label: 'None', value: 'none' },
  { label: 'Custom', value: 'custom' }
]

const shadowStyle = computed({
  get: () => {
    const shadow = style.value.shadow
    if (!shadow) return 'inherit'
    return shadow === 'flat' ? 'none' : 'custom'
  },
  // Custom seeds at ≈ the stock shadow-lg (20% ≈ its two stacked 10% layers)
  // so entering isn't a jump; leaving Custom clears the knobs.
  set: (value: any) => setStyle(value === 'custom'
    ? {
        shadow: 'custom',
        ...(style.value.shadowGeometry === undefined ? { shadowGeometry: { x: 0, y: 6, blur: 12, spread: 0 } } : {}),
        ...(style.value.shadowOpacity === undefined ? { shadowOpacity: 20 } : {})
      }
    : { shadow: value === 'none' ? 'flat' : undefined, shadowGeometry: undefined, shadowOpacity: undefined, shadowColor: undefined, shadowShade: undefined })
})

// Nothing in the library casts an inner shadow, so None and Inherit coincide.
const INNER_SHADOW_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Custom', value: 'custom' }
]

const innerShadowStyle = computed({
  get: () => style.value.innerShadow === 'custom' ? 'custom' : 'none',
  set: (value: any) => setStyle({ innerShadow: value === 'custom' ? 'custom' : undefined })
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

const borderStyle = computed({
  get: () => style.value.border || 'default',
  set: (value: any) => setStyle({ border: value })
})

const borderWidth = computed({
  get: () => style.value.borderWidth ?? BORDER_WIDTH_DEFAULT,
  set: (value: number) => setStyle({ borderWidth: value })
})

// Outline solid/soft surfaces too — the neobrutalist frame look.
const frameSolids = computed({
  get: () => !!style.value.frame,
  set: (value: boolean) => setStyle({ frame: value })
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

// The stock shadow colour IS the neutral shade at its resting stops, so
// Default merges into a tagged 'Neutral shade'.
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

// Slider position ↔ SHADES index, per mode. Dirty/reset measure against the
// BASELINE preset's choice: reset restores it, or deletes the entry.
function shadeControl(field: 'shadowShade' | 'innerShadowShade' | 'borderShade', defaults: { light: ShadeStop, dark: ShadeStop }, target: 'light' | 'dark') {
  const model = computed({
    // per-key fallback: an imported doc can carry a single-mode shade object —
    // indexOf(undefined) would park the slider at -1
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

// The two shadow sections are one template pointed at different style fields.
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
  hard: computed(() => style.value.shadow === 'custom'),
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
  hard: computed(() => style.value.innerShadow === 'custom'),
  press: undefined
}]

// Per-section fold-out for shade fine-tuning, mirroring the Colors panel's
// "Adjust shades"; keyed by dirtyKey so the sections toggle independently.
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

          <div v-if="section.model.value === 'custom'" class="mt-2 flex flex-col gap-2">
            <ThemeStudioRow
              v-model="section.opacity.value"
              control="slider"
              label="Opacity"
              :min="5"
              :max="100"
              :step="5"
              unit="%"
            />

            <template v-if="section.hard.value">
              <ThemeStudioRow
                v-for="field in geometryFields"
                :key="field.key"
                v-model="section.geometry[field.key].value"
                control="slider"
                :label="field.label"
                :min="field.min"
                :max="field.max"
                :step="1"
                unit="px"
              />

              <ThemeStudioRow
                v-if="section.press"
                v-model="section.press.value"
                control="switch"
                label="Buttons sink on press"
              />
            </template>

            <!-- colour + shade sliders sit last, behind the header toggle -->
            <template v-if="shadeEditors[section.dirtyKey]">
              <ThemeStudioDefaultSelect
                v-model="section.color.value"
                :items="section.colorItems"
                icon="i-lucide-paint-bucket"
                class="w-full"
                :aria-label="`${section.label} color`"
              />

              <ThemeStudioRow
                v-for="(slider, modeName) in section.shades"
                v-show="isShadeColor(section.color.value)"
                :key="modeName"
                v-model="slider.model.value"
                control="shade"
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
          <ThemeStudioRow
            v-model="borderWidth"
            control="slider"
            label="Width"
            :min="1"
            :max="4"
            :step="1"
            unit="px"
          />

          <ThemeStudioRow
            v-model="frameSolids"
            control="switch"
            label="Frame solid surfaces"
          />

          <!-- colour, shades and the neutral border tokens (relocated from the
               Colors panel), behind the header toggle -->
          <template v-if="borderShadeEditor">
            <ThemeStudioDefaultSelect
              v-model="borderColor"
              :items="borderColorItems"
              icon="i-lucide-paint-bucket"
              class="w-full"
              aria-label="Border color"
            />

            <ThemeStudioRow
              v-for="(slider, modeName) in borderShades"
              v-show="borderColor === 'shade' || borderColor === 'primary-shade'"
              :key="modeName"
              v-model="slider.model.value"
              control="shade"
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
