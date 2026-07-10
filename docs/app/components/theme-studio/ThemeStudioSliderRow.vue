<script setup lang="ts">
/** The studio's standard control row: tiny label, slider, monospace readout. */
defineProps<{
  label: string
  min: number
  max: number
  step: number
  /** Readout suffix (%, px, rem, °). */
  unit?: string
}>()

const value = defineModel<number>({ required: true })
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-[11px] text-muted w-13 shrink-0 select-none">{{ label }}</span>

    <USlider
      v-model="value"
      :min="min"
      :max="max"
      :step="step"
      size="xs"
      :aria-label="label"
    />

    <span class="text-[11px] text-dimmed font-mono w-10 text-right shrink-0">{{ value }}{{ unit }}</span>
  </div>
</template>
