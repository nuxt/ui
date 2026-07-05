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
    <UIcon :name="mode === 'light' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-3.5 text-muted shrink-0" />

    <USlider v-model="index" :min="0" :max="SHADES.length - 1" :step="1" size="sm" />

    <span
      class="size-4 shrink-0 rounded-sm ring ring-default"
      :style="{ backgroundColor: `var(--color-${chip}-${SHADES[index]})` }"
    />
    <span class="text-[11px] text-dimmed font-mono w-7 text-right shrink-0">{{ SHADES[index] }}</span>
  </div>
</template>
