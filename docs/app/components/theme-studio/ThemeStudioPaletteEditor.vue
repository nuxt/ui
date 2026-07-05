<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core'
import { SHADES, CURVE_DEFAULTS, NEUTRAL_CURVE_DEFAULTS, generatePalette, fitPalette, contrastRatio } from '../../utils/theme-engine'
import type { PaletteCurveParams } from '../../utils/theme-engine'

const props = defineProps<{
  alias: 'primary' | 'neutral'
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

const active = computed(() => isCustomPalette(props.alias))

const shades = computed(() => generatePalette(params))
const stopColors = computed(() => SHADES.map(shade => shades.value[shade]))

// White text on shade 500 is what solid buttons render — the pair worth watching.
const contrast = computed(() => contrastRatio(shades.value[500]!, '#FFFFFF'))

/**
 * The hue axis window floats around the curve (a full 0–360 axis would make
 * drifts invisible); frozen while editing so the canvas doesn't chase the
 * pointer. Lightness and chroma have fixed, comparable windows.
 */
const hueWindow = ref({ min: 0, max: 360 })

function recenterHueWindow() {
  const values = [params.hue.y0, params.hue.y1, params.hue.p1y, params.hue.p2y]
  const center = (Math.min(...values) + Math.max(...values)) / 2
  const span = Math.max(90, (Math.max(...values) - Math.min(...values)) + 40)
  hueWindow.value = { min: center - span / 2, max: center + span / 2 }
}

const windows = computed(() => ({
  lightness: { min: 0, max: 1 },
  chroma: { min: 0, max: 0.35 },
  hue: hueWindow.value
}))

// Programmatic writes into `params` (seeding, external sync) must not
// live-apply — only user edits do.
let suppress = false
/** Fitted base the style offsets transform from, so they never compound. */
let seedBase: PaletteCurveParams = structuredClone(toRaw(params))
function seed(values: PaletteCurveParams) {
  suppress = true
  seedBase = structuredClone(toRaw(values))
  Object.assign(params, structuredClone(toRaw(values)))
  recenterHueWindow()
  nextTick(() => {
    suppress = false
  })
}

// Throttled (not debounced) so the theme streams live while dragging a
// curve — the trailing call catches the release position.
const throttledApply = useThrottleFn(() => {
  setPaletteFromCurve(props.alias, structuredClone(toRaw(params)))
}, 60, true, true)

watch(params, () => {
  if (!suppress) {
    throttledApply()
  }
})

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

const styleOffset = ref('fitted')

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

/** Apply a taste offset ON TOP of the fitted base (idempotent, not cumulative). */
function applyStyleOffset(name: string) {
  const next = structuredClone(seedBase)

  if (name === 'pastel') {
    scaleChroma(next.chroma, 0.45)
    next.lightness.y0 = Math.max(next.lightness.y0, 0.985)
    next.lightness.y1 = Math.max(next.lightness.y1, 0.32)
    next.lightness.p1y = Math.min(next.lightness.p1y * 1.08, 1.1)
  } else if (name === 'muted') {
    scaleChroma(next.chroma, 0.6)
  } else if (name === 'vivid') {
    scaleChroma(next.chroma, 1.35)
  } else if (name === 'dazzling') {
    scaleChroma(next.chroma, 1.9)
    next.lightness.p2y = next.lightness.p2y * 0.96
  }

  // Not seed(): this IS a user edit, the watcher should live-apply it.
  Object.assign(params, next)
  recenterHueWindow()
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
      @update:model-value="tab === 'hue' && recenterHueWindow()"
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
  </div>
</template>
