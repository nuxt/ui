<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { SHADES, CURVE_DEFAULTS, generatePalette, contrastRatio } from '../../utils/theme-engine'
import type { PaletteCurveParams } from '../../utils/theme-engine'

const props = defineProps<{
  alias: 'primary' | 'neutral'
}>()

const { paletteParams, isCustomPalette, setPaletteFromCurve, clearCustomPalette } = useThemeStudio()

const DEFAULT_ANCHORS = {
  primary: '#00C16A',
  neutral: '#71717A'
}

const open = ref(false)

const params = reactive<Required<PaletteCurveParams>>({
  anchor: DEFAULT_ANCHORS[props.alias],
  ...CURVE_DEFAULTS,
  ...paletteParams.value[props.alias]
})

const active = computed(() => isCustomPalette(props.alias))

const shades = computed(() => generatePalette(params))

// White text on shade 500 is what solid buttons render — the pair worth watching.
const contrast = computed(() => contrastRatio(shades.value[500]!, '#FFFFFF'))

const apply = useDebounceFn(() => {
  setPaletteFromCurve(props.alias, { ...params })
}, 200)

let touched = false
watch(params, () => {
  touched = true
  apply()
})

// First expansion applies the initial ramp so the preview and page agree.
watch(open, (isOpen) => {
  if (isOpen && !active.value && !touched) {
    apply()
  }
})

function remove() {
  clearCustomPalette(props.alias)
  open.value = false
  touched = false
}

const sliders = [
  { key: 'lightest', label: 'Light end', min: 0.9, max: 1, step: 0.005 },
  { key: 'darkest', label: 'Dark end', min: 0.05, max: 0.35, step: 0.005 },
  { key: 'vibrance', label: 'Vibrance', min: 0, max: 2, step: 0.05 },
  { key: 'spread', label: 'Spread', min: 0.15, max: 0.8, step: 0.01 },
  { key: 'hueDrift', label: 'Hue drift', min: -60, max: 60, step: 1 }
] as const
</script>

<template>
  <UCollapsible v-model:open="open" class="mt-1.5">
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

    <template #content>
      <div class="flex flex-col gap-3 pt-3 pb-1">
        <div class="flex items-center gap-2">
          <UPopover>
            <button
              type="button"
              aria-label="Pick anchor color"
              class="size-7 shrink-0 rounded-sm ring ring-default cursor-pointer"
              :style="{ backgroundColor: params.anchor }"
            />

            <template #content>
              <UColorPicker v-model="params.anchor" class="p-2" />
            </template>
          </UPopover>

          <UInput
            v-model="params.anchor"
            size="sm"
            class="flex-1 font-mono"
            :ui="{ base: 'text-[11px]' }"
          />

          <UTooltip :text="`White on 500: ${contrast.toFixed(1)}:1`">
            <UBadge
              :label="contrast >= 4.5 ? 'AA' : contrast >= 3 ? 'AA18' : 'Low'"
              :color="contrast >= 4.5 ? 'success' : contrast >= 3 ? 'warning' : 'error'"
              variant="subtle"
              size="sm"
            />
          </UTooltip>
        </div>

        <div class="flex rounded-sm overflow-hidden ring ring-default">
          <UTooltip v-for="shade in SHADES" :key="shade" :text="`${shade} · ${shades[shade]}`">
            <div class="h-6 flex-1" :style="{ backgroundColor: shades[shade] }" />
          </UTooltip>
        </div>

        <div v-for="slider in sliders" :key="slider.key" class="flex items-center gap-2">
          <span class="text-[11px] text-muted w-16 shrink-0 select-none">{{ slider.label }}</span>

          <USlider
            v-model="params[slider.key]"
            :min="slider.min"
            :max="slider.max"
            :step="slider.step"
            size="xs"
          />

          <span class="text-[11px] text-dimmed font-mono w-10 text-right shrink-0">{{ params[slider.key] }}</span>
        </div>

        <UButton
          v-if="active"
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
