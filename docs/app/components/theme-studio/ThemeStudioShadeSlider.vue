<script setup lang="ts">
import { SHADES } from '../../utils/theme-engine'

defineProps<{
  mode: 'light' | 'dark'
  /** Palette name whose ramp colors the preview swatch */
  chip: string
}>()

/** Slider position: index into SHADES (0 = 50 … 10 = 950) */
const index = defineModel<number>({ required: true })
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="w-13 shrink-0 flex items-center gap-1.5">
      <UIcon :name="mode === 'light' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-3.5 text-muted shrink-0" />
      <span
        class="h-3 grow shrink-0 rounded-sm ring ring-default"
        :style="{ backgroundColor: `var(--color-${chip}-${SHADES[index]})` }"
      />
    </span>

    <!-- The fill wears the ramp color at the selected shade. Hairline inset
         rings keep the fill and thumb visible when that color melts into
         the panel background (light shades in light mode and vice versa). -->
    <USlider
      v-model="index"
      :min="0"
      :max="SHADES.length - 1"
      :step="1"
      size="sm"
      :style="{ '--slider-color': `var(--color-${chip}-${SHADES[index]})` }"
      :ui="{
        range: 'bg-(--slider-color) inset-ring inset-ring-accented',
        thumb: 'ring-(--slider-color) inset-ring inset-ring-accented shadow-sm'
      }"
    />

    <span class="text-[11px] text-dimmed font-mono w-7 text-right shrink-0">{{ SHADES[index] }}</span>
  </div>
</template>
