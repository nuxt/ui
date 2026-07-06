<script setup lang="ts">
import { useThrottleFn, watchIgnorable } from '@vueuse/core'
import { SHADES, CURVE_DEFAULTS, NEUTRAL_CURVE_DEFAULTS, generatePalette, fitPalette, contrastRatio } from '../../utils/theme-engine'
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

// White text on shade 500 is what solid buttons render — the pair worth watching.
const contrast = computed(() => contrastRatio(shades.value[500]!, '#FFFFFF'))

/**
 * Every axis is a fixed 1:1 window — the full physical range fits the
 * canvas, so dragging never pans or rescales under the pointer. Hue params
 * are normalized into 0–360 on seed instead (cyclic, so shifting by full
 * turns is color-identical; fitPalette unwraps across the seam).
 */
const windows = {
  lightness: { min: 0, max: 1 },
  chroma: { min: 0, max: 0.35 },
  hue: { min: 0, max: 360 }
}

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

// Set while OUR throttled apply writes paletteParams, so the echo watcher
// below can tell self-originated updates from external ones (swatch clicks).
let applying = false

// Throttled (not debounced) so the theme streams live while dragging a
// curve — the trailing call catches the release position.
const throttledApply = useThrottleFn(() => {
  applying = true
  setPaletteFromCurve(props.alias, structuredClone(toRaw(params)))
  applying = false
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

// Swatch clicks while active refit via the studio — reflect them here.
// Self-originated writes (our own throttled applies) are skipped outright.
watch(() => paletteParams.value[props.alias], (value) => {
  if (!applying && value && 'lightness' in value && JSON.stringify(value) !== JSON.stringify(toRaw(params))) {
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
  <div v-if="open" class="mt-1.5 flex flex-col gap-2.5 pb-1">
    <UTabs
      v-model="tab"
      :items="tabs"
      :content="false"
      size="xs"
      color="neutral"
      :ui="{ trigger: 'text-[11px]' }"
    />

    <ThemeStudioCurveEditor
      v-model="params[tab]"
      :y-min="windows[tab].min"
      :y-max="windows[tab].max"
      :stop-colors="stopColors"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
    />

    <div class="flex items-center gap-2">
      <div class="flex flex-1 rounded-sm overflow-hidden ring ring-default">
        <UTooltip v-for="shade in SHADES" :key="shade" :text="`${shade} · ${shades[shade]}`">
          <div class="h-5 flex-1" :style="{ backgroundColor: shades[shade] }" />
        </UTooltip>
      </div>

      <UTooltip :text="`White on 500: ${contrast.toFixed(1)}:1`">
        <UBadge
          :label="contrast >= 4.5 ? 'AA' : contrast >= 3 ? 'AA18' : 'Low'"
          :color="contrast >= 4.5 ? 'success' : contrast >= 3 ? 'warning' : 'error'"
          variant="subtle"
          size="sm"
        />
      </UTooltip>
    </div>

    <div class="flex items-center gap-1.5">
      <USelect
        v-model="styleOffset"
        size="sm"
        color="neutral"
        icon="i-lucide-sparkles"
        :items="styleOffsetItems"
        class="flex-1 ring-default rounded-sm hover:bg-elevated/50 text-xs data-[state=open]:bg-elevated/50"
        :ui="{ item: 'text-xs', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
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
