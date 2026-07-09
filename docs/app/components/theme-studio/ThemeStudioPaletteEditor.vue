<script setup lang="ts">
import { useThrottleFn, watchIgnorable } from '@vueuse/core'
import { SHADES, CURVE_DEFAULTS, NEUTRAL_CURVE_DEFAULTS, generatePalette, fitPalette, sampleCurve, clampToGamut, formatOklch } from '../../utils/theme-engine'
import type { PaletteCurveParams, ColorAlias } from '../../utils/theme-engine'

const props = defineProps<{
  alias: ColorAlias
}>()

const appConfig = useAppConfig()
const { paletteParams, isCustomPalette, paletteShades, setPaletteFromCurve, clearCustomPalette } = useThemeStudio()

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

const stored = paletteParams.value[props.alias]
const params = reactive<PaletteCurveParams>(
  // Older stored shapes (anchor/slider based) are simply refitted on open.
  stored && 'lightness' in stored ? structuredClone(toRaw(stored)) as PaletteCurveParams : defaults()
)
// Stored params may predate the fixed 0–360 axis (or carry unwrapped hues).
normalizeHue(params)

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

const styleOffset = ref('fitted')

/**
 * Effect strength: 100% is the offset as designed, lower blends back toward
 * the fitted base, above 100% extrapolates past it for a stronger take.
 */
const offsetAmount = ref(100)

/** Fitted base the style offsets transform from, so they never compound. */
let seedBase: PaletteCurveParams = structuredClone(toRaw(params))

// Throttled (not debounced) so the theme streams live while dragging a
// curve — the trailing call catches the release position.
const throttledApply = useThrottleFn(() => {
  setPaletteFromCurve(props.alias, structuredClone(toRaw(params)))
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
  styleOffset.value = 'fitted'
  offsetAmount.value = 100
  ignoreUpdates(() => {
    Object.assign(params, next)
  })
}

// While dragging, a global class turns on short color transitions so the
// page glides between throttle ticks instead of stepping.
let dragEndTimeout: ReturnType<typeof setTimeout> | undefined

function onDragStart() {
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

// Swatch clicks while active refit via the studio — reflect them here. The
// snapshot comparison is what breaks the echo loop for our own throttled
// applies (the callback runs queued, after any sync flag would have reset).
watch(() => paletteParams.value[props.alias], (value) => {
  if (value && 'lightness' in value && JSON.stringify(value) !== JSON.stringify(toRaw(params))) {
    seed(value as PaletteCurveParams)
  }
})

// While inactive, follow the selected palette so opening the editor starts
// from the curves of the color already on screen.
watch([() => (appConfig.ui.colors as Record<string, string>)[props.alias], open], ([, isOpen]) => {
  if (isOpen && !active.value) {
    seedFromCurrent()
  }
})

const styleOffsetItems = [
  { label: 'Fitted', value: 'fitted' },
  { label: 'Pastel', value: 'pastel' },
  { label: 'Muted', value: 'muted' },
  { label: 'Vivid', value: 'vivid' },
  { label: 'Dazzling', value: 'dazzling' }
]

function scaleChroma(curve: PaletteCurveParams['chroma'], factor: number) {
  curve.y0 *= factor
  curve.y1 *= factor
  curve.p1y *= factor
  curve.p2y *= factor
}

/** Linearly remap a lightness curve onto new endpoints, preserving its shape. */
function remapLightness(curve: PaletteCurveParams['lightness'], newY0: number, newY1: number) {
  const oldY0 = curve.y0
  const oldY1 = curve.y1
  const span = oldY0 - oldY1 || 1e-6
  const map = (value: number) => newY1 + ((value - oldY1) / span) * (newY0 - newY1)
  curve.p1y = map(curve.p1y)
  curve.p2y = map(curve.p2y)
  curve.y0 = newY0
  curve.y1 = newY1
}

const CURVE_KEYS = ['y0', 'y1', 'p1x', 'p1y', 'p2x', 'p2y'] as const

function lerpParams(base: PaletteCurveParams, target: PaletteCurveParams, t: number): PaletteCurveParams {
  const result = structuredClone(target)
  for (const channel of ['lightness', 'chroma', 'hue'] as const) {
    for (const key of CURVE_KEYS) {
      const value = base[channel][key] + (target[channel][key] - base[channel][key]) * t
      // Extrapolated chroma can cross zero; keep it a real chroma.
      result[channel][key] = channel === 'chroma' ? Math.max(0, value) : value
    }
  }
  return result
}

/** Apply a taste offset ON TOP of the fitted base (idempotent, not cumulative). */
function applyStyleOffset(name: string) {
  const target = structuredClone(seedBase)

  if (name === 'pastel') {
    // Candy pastels: compress the lightness range from BOTH ends (nothing
    // near-white, nothing dark) and push chroma UP so the softness stays
    // colorful — the gamut clamp keeps the very light stops in check.
    remapLightness(target.lightness, Math.min(target.lightness.y0, 0.945), Math.max(target.lightness.y1, 0.52))
    scaleChroma(target.chroma, 1.35)
  } else if (name === 'muted') {
    scaleChroma(target.chroma, 0.55)
  } else if (name === 'vivid') {
    scaleChroma(target.chroma, 1.45)
  } else if (name === 'dazzling') {
    scaleChroma(target.chroma, 2)
  }

  const next = name === 'fitted' ? target : lerpParams(seedBase, target, offsetAmount.value / 100)

  // Not seed(): this IS a user edit, the watcher should live-apply it.
  Object.assign(params, next)
}

function remove() {
  clearCustomPalette(props.alias)
  open.value = false
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

        <div class="flex items-center gap-1.5">
          <USelect
            v-model="styleOffset"
            size="sm"
            color="neutral"
            icon="i-lucide-sparkles"
            :items="styleOffsetItems"
            class="flex-1"
            @update:model-value="applyStyleOffset($event as string)"
          />

          <UTooltip v-if="active" text="Remove custom palette">
            <UButton
              icon="i-lucide-trash-2"
              color="neutral"
              variant="soft"
              size="sm"
              aria-label="Remove custom palette"
              @click="remove"
            />
          </UTooltip>
        </div>

        <div v-if="styleOffset !== 'fitted'" class="flex items-center gap-2">
          <span class="text-[11px] text-muted shrink-0 w-10">Effect</span>
          <USlider
            v-model="offsetAmount"
            :min="0"
            :max="200"
            :step="5"
            size="sm"
            color="neutral"
            aria-label="Effect strength"
            @update:model-value="applyStyleOffset(styleOffset)"
          />
          <span class="text-[11px] text-dimmed tabular-nums shrink-0 w-8 text-right">{{ offsetAmount }}%</span>
        </div>
      </div>
    </template>
  </UCollapsible>
</template>
