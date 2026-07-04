<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { SHADES, CURVE_DEFAULTS, NEUTRAL_CURVE_DEFAULTS, generatePalette, fitPalette, contrastRatio } from '../../utils/theme-engine'
import type { PaletteCurveParams } from '../../utils/theme-engine'

const props = defineProps<{
  alias: 'primary' | 'neutral'
}>()

const appConfig = useAppConfig()
const { paletteParams, isCustomPalette, paletteShades, setPaletteFromCurve, clearCustomPalette } = useThemeStudio()

const open = ref(false)
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
function seed(values: PaletteCurveParams) {
  suppress = true
  Object.assign(params, structuredClone(toRaw(values)))
  recenterHueWindow()
  nextTick(() => {
    suppress = false
  })
}

const debouncedApply = useDebounceFn(() => {
  setPaletteFromCurve(props.alias, structuredClone(toRaw(params)))
}, 150)

watch(params, () => {
  if (!suppress) {
    debouncedApply()
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

function apply() {
  setPaletteFromCurve(props.alias, structuredClone(toRaw(params)))
}

function remove() {
  clearCustomPalette(props.alias)
  open.value = false
}
</script>

<template>
  <UCollapsible v-model:open="open" class="mt-1.5">
    <div class="flex items-center gap-1">
      <UButton
        :label="active ? 'Custom palette' : 'Create custom palette'"
        :icon="active ? 'i-lucide-paintbrush' : 'i-lucide-wand-sparkles'"
        color="neutral"
        variant="ghost"
        size="xs"
        block
        class="justify-start text-[11px]"
        :ui="{ leadingIcon: active ? 'text-primary size-3.5' : 'size-3.5' }"
        trailing-icon="i-lucide-chevron-down"
      />

      <UTooltip v-if="active" text="Remove custom palette">
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Remove custom palette"
          :ui="{ leadingIcon: 'size-3.5' }"
          @click.stop="remove"
        />
      </UTooltip>
    </div>

    <template #content>
      <div class="flex flex-col gap-2.5 pt-3 pb-1">
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

        <UButton
          v-if="!active"
          label="Use this palette"
          icon="i-lucide-check"
          color="neutral"
          variant="soft"
          size="xs"
          block
          class="text-[11px]"
          @click="apply"
        />
        <UButton
          v-else
          label="Remove custom palette"
          icon="i-lucide-trash-2"
          color="neutral"
          variant="soft"
          size="xs"
          block
          class="text-[11px]"
          @click="remove"
        />
      </div>
    </template>
  </UCollapsible>
</template>
