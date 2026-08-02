<script setup lang="ts">
import { SHADE_LADDER, SHADOW_SHADE_DEFAULTS, BORDER_WIDTH_DEFAULT, SHADOW_GEOMETRY_DEFAULTS, INNER_SHADOW_GEOMETRY_DEFAULTS } from '../../utils/theme-engine'
import type { ShadeStop } from '../../utils/theme-engine'

const { style, setStyle, baselineDoc, primaryChip, neutralChip } = useThemeStudio()

const { radius, fontSize, spacing } = useTheme()

// MD is the stock default, one deduped entry storing 'default'
const defaultSizeItems = [
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'default', defaultTag: true },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' }
]

const defaultSize = computed({
  // legacy saved prefs may still pin 'md' explicitly, it IS the default
  get: () => {
    const size = style.value.defaults?.size || 'default'
    return size === 'md' ? 'default' : size
  },
  set: (value: any) => setStyle({ defaults: { ...style.value.defaults, size: value } })
})

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
  // Absent means it tracks the outer shadow, so report whichever ramp that
  // currently resolves to rather than a choice of its own.
  get: () => {
    const color = style.value.innerShadowColor
    if (!color || color === 'default') return shadowColor.value === 'primary-shade' ? 'primary-shade' : 'shade'
    return color
  },
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

// Outline solid/soft surfaces too, the neobrutalist frame look.
const frameSolids = computed({
  get: () => !!style.value.frame,
  set: (value: boolean) => setStyle({ frame: value })
})

// Which ramp the border tokens ride. Neutral is the natural state, so it
// leaves every ring on its own token; Primary reroutes them and points the
// rings at the default one. The rows below pick the stops either way.
const borderColorItems = [
  { label: 'Neutral', value: 'default', defaultTag: true },
  { label: 'Primary', value: 'primary-shade' }
]

// The stock shadow colour IS the neutral shade at its resting stops, so
// Neutral is simply the default. Inverted was a fixed 950/white pair, which
// the stops below can say themselves.
const shadowColorItems = [
  { label: 'Neutral', value: 'shade', defaultTag: true },
  { label: 'Primary', value: 'primary-shade' }
]

// Unset, the inner shadow rides whatever --ui-shadow-color resolves to, which
// is the neutral ramp unless the shadow says otherwise.
const innerShadowColorItems = [
  { label: 'Neutral', value: 'shade', defaultTag: true },
  { label: 'Primary', value: 'primary-shade' }
]

/** Keeps a value the picker no longer offers readable, for older saved themes. */
function withCurrent(items: { label: string, value: string, defaultTag?: boolean }[], value: string) {
  if (items.some(item => item.value === value)) return items
  return [...items, { label: capitalize(value.replace(/-/g, ' ')), value }]
}

// Slider position ↔ SHADES index, per mode. Dirty/reset measure against the
// BASELINE preset's choice: reset restores it, or deletes the entry.
function shadeControl(field: 'shadowShade' | 'innerShadowShade', defaults: { light: ShadeStop, dark: ShadeStop }, target: 'light' | 'dark') {
  const model = computed({
    // per-key fallback: an imported doc can carry a single-mode shade object,
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

// The border tokens ARE the border shades: the colour select names their ramp,
// each token owns its stop, and component rings follow the default one.
const { shadeLadder: borderLadder, sections: borderTokens } = useTokenShades('neutral')
const borderShadeSections = borderTokens.filter(section => section.group === 'border')
const borderChip = computed(() => (borderColor.value === 'primary-shade' ? primaryChip.value : neutralChip.value))

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
  // Absent and legacy 'default' are the same choice as 'shade': under a custom
  // shadow an unset colour resolves to the resting neutral shade anyway, and
  // naming the ramp is what keeps its per-mode stops on screen.
  get: () => {
    const color = style.value.shadowColor
    return !color || color === 'default' ? 'shade' : color
  },
  set: (value: any) => setStyle({ shadowColor: value })
})

// The press choreography (buttons sinking onto their shadow) rides the
// shadow offset, optional, so soft blurred configs can keep buttons still.
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
</script>

<template>
  <ThemeStudioSection label="Scale" section-key="scale">
    <div class="flex flex-col gap-2">
      <ThemeStudioRow
        v-model="radius"
        control="slider"
        label="Radius"
        :min="0"
        :max="0.5"
        :step="0.125"
      />

      <ThemeStudioRow
        v-model="fontSize"
        control="slider"
        label="Text"
        :min="14"
        :max="18"
        :step="0.5"
        unit="px"
      />

      <ThemeStudioRow
        v-model="spacing"
        control="slider"
        label="Spacing"
        :min="0.15"
        :max="0.35"
        :step="0.025"
      />

      <ThemeStudioRow
        v-model="defaultSize"
        control="select"
        label="Size"
        control-icon="i-lucide-proportions"
        :items="defaultSizeItems"
        aria-label="Default size"
      />
    </div>
  </ThemeStudioSection>

  <!-- Sections own their padding so the separators run edge to edge. -->
  <ThemeStudioTreatment
    v-for="section in shadowSections"
    :key="section.label"
    v-model="section.model.value"
    v-model:color="section.color.value"
    :label="section.label"
    :section-key="section.dirtyKey"
    :options="section.options"
    :color-items="withCurrent(section.colorItems, section.color.value)"
    :shades="section.shades"
  >
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
  </ThemeStudioTreatment>

  <ThemeStudioTreatment
    v-model="borderStyle"
    v-model:color="borderColor"
    label="Borders"
    color-label="Border colour"
    section-key="borders"
    :options="borderOptions"
    :color-items="withCurrent(borderColorItems, borderColor)"
  >
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

    <!-- a stop per border type, on the ramp the select names -->
    <template #shades>
      <ThemeStudioShadeGroup
        v-for="section in borderShadeSections"
        :key="section.token"
        :label="`Border ${section.label.toLowerCase()}`"
        separator
        :sliders="section.sliders"
        :chip="borderChip"
        :ladder="borderLadder"
      />
    </template>
  </ThemeStudioTreatment>
</template>
