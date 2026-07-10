<script setup lang="ts">
/** The studio's standard control row: tiny label, slider, monospace readout. */
const props = defineProps<{
  /** Names the slider (aria) — shown unless an icon replaces it. */
  label: string
  /** Rendered in place of the label text. */
  icon?: string
  min: number
  max: number
  step: number
  /** Readout suffix (%, px, rem, °). */
  unit?: string
}>()

const value = defineModel<number>({ required: true })

/** `0.25rem` reads as `.25rem` — the leading zero is noise at this width. */
const display = computed(() => `${String(value.value).replace(/^(-?)0\./, '$1.')}${props.unit ?? ''}`)
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-muted w-13 shrink-0 select-none flex items-center">
      <UIcon v-if="icon" :name="icon" class="size-3.5" />
      <template v-else>{{ label }}</template>
    </span>

    <USlider
      v-model="value"
      :min="min"
      :max="max"
      :step="step"
      size="xs"
      :aria-label="label"
    />

    <span class="text-xs text-dimmed font-mono w-10 text-right shrink-0 truncate" :title="display">{{ display }}</span>
  </div>
</template>
