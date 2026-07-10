<script setup lang="ts">
import { useThrottleFn, watchIgnorable } from '@vueuse/core'
import { SHADES, CURVE_DEFAULTS, NEUTRAL_CURVE_DEFAULTS, PALETTE_EFFECT_DEFAULTS, generatePalette, fitPalette, applyPaletteEffects, isDefaultEffects, sampleCurve, clampToGamut, formatOklch } from '../../utils/theme-engine'
import type { PaletteCurveParams, PaletteEffects, StoredPaletteParams, ColorAlias } from '../../utils/theme-engine'

const props = defineProps<{
  alias: ColorAlias
}>()

const appConfig = useAppConfig()
const { paletteParams, isCustomPalette, paletteShades, setPaletteFromCurve } = useThemeStudio()

const open = defineModel<boolean>('open', { default: false })
const tab = ref<'lightness' | 'chroma' | 'hue'>('lightness')

const tabs = [
  { label: 'Lightness', value: 'lightness' as const },
  { label: 'Chroma', value: 'chroma' as const },
  { label: 'Hue', value: 'hue' as const }
]

function defaults(): PaletteCurveParams {
  return structuredClone(props.alias === 'neutral' ? NEUTRAL_CURVE_DEFAULTS : CURVE_DEFAULTS)
}

/** The stored entry's base curves, without the lens. */
function pickCurves(value: StoredPaletteParams): PaletteCurveParams {
  return structuredClone({ lightness: toRaw(value.lightness), chroma: toRaw(value.chroma), hue: toRaw(value.hue) })
}

// The modifier lens, restored alongside the base so a reload lands exactly
// where the session left off instead of silently baking the sliders in.
const stored = paletteParams.value[props.alias]
const effects = reactive<PaletteEffects>({ ...PALETTE_EFFECT_DEFAULTS, ...(stored?.effects ?? {}) })
const effectAmount = ref(stored?.amount ?? 100)

/** Base curves the modifiers transform from, so they never compound. */
let seedBase: PaletteCurveParams
  = stored && 'lightness' in stored ? pickCurves(stored) : defaults()
// Stored params may predate the fixed 0–360 axis (or carry unwrapped hues).
normalizeHue(seedBase)

/** The DISPLAYED curves: base with the lens applied — what generates the ramp. */
const params = reactive<PaletteCurveParams>(applyPaletteEffects(seedBase, effects, effectAmount.value))

const active = computed(() => isCustomPalette(props.alias))

const shades = computed(() => generatePalette(params))
const stopColors = computed(() => SHADES.map(shade => shades.value[shade]))

/**
 * Every axis is a fixed 1:1 window — the full physical range fits the
 * canvas, so dragging never pans or rescales under the pointer. Hue params
 * are normalized into 0–360 on seed (cyclic, so shifting by full turns is
 * color-identical; fitPalette unwraps across the seam), but a seam-crossing
 * fit legitimately leaves individual points outside [0, 360] — the window
 * stretches once, at seed, to include them, or the drag clamp would snap a
 * merely-grabbed handle back into range and shift the color uninvited.
 */
const seedHues = [params.hue.y0, params.hue.y1, params.hue.p1y, params.hue.p2y]
const windows = {
  lightness: { min: 0, max: 1 },
  chroma: { min: 0, max: 0.35 },
  hue: {
    min: Math.min(0, Math.floor(Math.min(...seedHues) / 10) * 10),
    max: Math.max(360, Math.ceil(Math.max(...seedHues) / 10) * 10)
  }
}

/**
 * The color field behind the active tab's curve: columns follow the ramp,
 * rows sweep the edited channel across its window (top = max) while the
 * other two channels track the live curves — each point shows the color
 * that dragging the curve there would produce, gamut clamp included.
 */
const FIELD_COLUMNS = 24
const FIELD_ROWS = 12
const CHANNEL_KEYS = { lightness: 'l', chroma: 'c', hue: 'h' } as const

const field = computed(() => {
  const channel = tab.value
  const { min, max } = windows[channel]

  // Fence-post: column i is sampled AT ramp position i/(n-1) — the editor
  // draws each column centered on that plot x, endpoints under the
  // endpoint controls.
  return Array.from({ length: FIELD_COLUMNS }, (_, columnIndex) => {
    const x = columnIndex / (FIELD_COLUMNS - 1)
    const base = {
      l: sampleCurve(x, params.lightness),
      c: Math.max(0, sampleCurve(x, params.chroma)),
      h: sampleCurve(x, params.hue)
    }

    return Array.from({ length: FIELD_ROWS }, (_, rowIndex) => {
      const value = max - (rowIndex / (FIELD_ROWS - 1)) * (max - min)
      return formatOklch(clampToGamut({ ...base, [CHANNEL_KEYS[channel]]: value }))
    })
  })
})

function normalizeHue(values: PaletteCurveParams) {
  const points = [values.hue.y0, values.hue.y1, values.hue.p1y, values.hue.p2y]
  const mean = points.reduce((sum, value) => sum + value, 0) / points.length
  const shift = -360 * Math.floor(mean / 360)
  if (shift !== 0) {
    values.hue.y0 += shift
    values.hue.y1 += shift
    values.hue.p1y += shift
    values.hue.p2y += shift
  }
}

// Throttled (not debounced) so the theme streams live while dragging a
// curve — the trailing call catches the release position. With a neutral
// lens the base simply tracks the edited curves.
const throttledApply = useThrottleFn(() => {
  if (!effectsDirty.value) {
    seedBase = structuredClone(toRaw(params))
  }
  setPaletteFromCurve(props.alias, structuredClone(seedBase), { ...effects }, effectAmount.value)
}, 60, true, true)

// Programmatic writes into `params` (seeding, external sync) must not
// live-apply — only user edits do. watchIgnorable scopes the suppression
// to the seed's own writes instead of a whole tick.
const { ignoreUpdates } = watchIgnorable(params, () => {
  throttledApply()
})

function seed(values: PaletteCurveParams) {
  const next = structuredClone(toRaw(values))
  normalizeHue(next)
  seedBase = structuredClone(next)
  Object.assign(effects, PALETTE_EFFECT_DEFAULTS)
  effectAmount.value = 100
  ignoreUpdates(() => {
    Object.assign(params, next)
  })
}

// While dragging, a global class turns on short color transitions so the
// page glides between throttle ticks instead of stepping.
let dragEndTimeout: ReturnType<typeof setTimeout> | undefined

function onDragStart() {
  // Editing a curve commits the lens: the base becomes the curves on
  // screen (the look doesn't change) and the modifier sliders reset, so
  // a later modifier edit can never throw the drag away.
  if (effectsDirty.value) {
    seedBase = structuredClone(toRaw(params))
    Object.assign(effects, PALETTE_EFFECT_DEFAULTS)
    effectAmount.value = 100
  }
  clearTimeout(dragEndTimeout)
  document.documentElement.classList.add('theme-studio-dragging')
}

function onDragEnd() {
  dragEndTimeout = setTimeout(() => {
    document.documentElement.classList.remove('theme-studio-dragging')
  }, 200)
}

onUnmounted(() => {
  clearTimeout(dragEndTimeout)
  if (import.meta.client) {
    document.documentElement.classList.remove('theme-studio-dragging')
  }
})

/** Fit curves from whatever palette the alias currently shows. */
function seedFromCurrent() {
  const name = (appConfig.ui.colors as Record<string, string>)[props.alias]
  if (!name) return

  const source = paletteShades(name)
  if (source) {
    seed(fitPalette(source))
  }
}

// External writes to the stored entry — reflect them here, lens included.
// The effective-curve comparison is what breaks the echo loop for our own
// throttled applies (the callback runs queued, after any sync flag reset).
watch(() => paletteParams.value[props.alias], (value) => {
  if (!value || !('lightness' in value)) return
  const effective = applyPaletteEffects(pickCurves(value), value.effects, value.amount)
  if (JSON.stringify(effective) === JSON.stringify(toRaw(params))) return

  seedBase = pickCurves(value)
  normalizeHue(seedBase)
  Object.assign(effects, PALETTE_EFFECT_DEFAULTS, value.effects ?? {})
  effectAmount.value = value.amount ?? 100
  ignoreUpdates(() => {
    Object.assign(params, applyPaletteEffects(seedBase, effects, effectAmount.value))
  })
})

// While inactive, follow the selected palette so opening the editor starts
// from the curves of the color already on screen.
watch([() => (appConfig.ui.colors as Record<string, string>)[props.alias], open], ([, isOpen]) => {
  if (isOpen && !active.value) {
    seedFromCurrent()
  }
})

/* ---------------------------------------------------------- modifiers -- */

/** The modifiers fold — closed by default like the other advanced panels. */
const modifiersOpen = ref(false)

const effectRows = [
  { key: 'lightness', label: 'Lightness', min: -30, max: 30, step: 1, unit: '%' },
  { key: 'contrast', label: 'Contrast', min: -50, max: 50, step: 1, unit: '%' },
  { key: 'saturation', label: 'Saturation', min: -100, max: 200, step: 5, unit: '%' },
  { key: 'hueShift', label: 'Hue', min: -180, max: 180, step: 5, unit: '°' }
] as const

/** Re-derive the displayed curves from the base — a user edit, live-applied. */
function applyEffects() {
  Object.assign(params, applyPaletteEffects(seedBase, effects, effectAmount.value))
}

const effectsDirty = computed(() => !isDefaultEffects(effects, effectAmount.value))

function resetEffects() {
  Object.assign(effects, PALETTE_EFFECT_DEFAULTS)
  effectAmount.value = 100
  applyEffects()
}
</script>

<template>
  <!-- unmount-on-hide (the default) matches the old v-if: each open reseeds fresh -->
  <UCollapsible :open="open">
    <template #content>
      <div class="mt-2.5 flex flex-col gap-2.5 pb-1">
        <UTabs
          v-model="tab"
          :items="tabs"
          :content="false"
          size="xs"
          color="neutral"
        />

        <div>
          <ThemeStudioCurveEditor
            v-model="params[tab]"
            :y-min="windows[tab].min"
            :y-max="windows[tab].max"
            :stop-colors="stopColors"
            :field="field"
            @drag-start="onDragStart"
            @drag-end="onDragEnd"
          />

          <div class="flex rounded-b-sm overflow-hidden ring ring-default">
            <UTooltip v-for="shade in SHADES" :key="shade" :text="`${shade} · ${shades[shade]}`">
              <div class="aspect-square flex-1" :style="{ backgroundColor: shades[shade] }" />
            </UTooltip>
          </div>
        </div>

        <!-- Layered modifiers, each recomputed from the fitted base. The
             whole trigger group toggles the fold; the reset stops the click
             so it only resets. -->
        <UCollapsible v-model:open="modifiersOpen">
          <div class="flex items-center gap-1">
            <UButton
              label="Modifiers"
              :icon="modifiersOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
              color="neutral"
              variant="ghost"
              size="sm"
              block
              class="justify-start"
            />

            <UTooltip text="Reset modifiers">
              <UButton
                icon="i-lucide-rotate-ccw"
                color="neutral"
                variant="ghost"
                size="sm"
                :disabled="!effectsDirty"
                aria-label="Reset modifiers"
                @click.stop="resetEffects"
              />
            </UTooltip>
          </div>

          <template #content>
            <div class="flex flex-col gap-1.5 pt-2 px-1">
              <ThemeStudioSliderRow
                v-model="effectAmount"
                label="Effect"
                icon="i-lucide-eye"
                :min="0"
                :max="200"
                :step="5"
                unit="%"
                @update:model-value="applyEffects()"
              />

              <ThemeStudioSliderRow
                v-for="row in effectRows"
                :key="row.key"
                v-model="effects[row.key]"
                :label="row.label"
                :min="row.min"
                :max="row.max"
                :step="row.step"
                :unit="row.unit"
                @update:model-value="applyEffects()"
              />
            </div>
          </template>
        </UCollapsible>
      </div>
    </template>
  </UCollapsible>
</template>
