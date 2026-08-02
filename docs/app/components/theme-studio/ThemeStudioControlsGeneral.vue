<script setup lang="ts">
const { radius, fontSize, spacing } = useTheme()

const { style, setStyle } = useThemeStudio()

/* ------------------------------------------------------------- defaults -- */

// MD is the stock default — one deduped entry storing 'default'
const defaultSizeItems = [
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'default', defaultTag: true },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' }
]

const defaultSize = computed({
  // legacy saved prefs may still pin 'md' explicitly — it IS the default
  get: () => {
    const size = style.value.defaults?.size || 'default'
    return size === 'md' ? 'default' : size
  },
  set: (value: any) => setStyle({ defaults: { ...style.value.defaults, size: value } })
})
</script>

<template>
  <ThemeStudioSection label="Scale" section-key="scale">
    <div class="flex flex-col gap-2">
      <ThemeStudioRow
        v-model="radius"
        control="slider"
        label="Radius"
        :min="0"
        :max="0.5"
        :step="0.125"
      />

      <ThemeStudioRow
        v-model="fontSize"
        control="slider"
        label="Text"
        :min="14"
        :max="18"
        :step="0.5"
        unit="px"
      />

      <ThemeStudioRow
        v-model="spacing"
        control="slider"
        label="Spacing"
        :min="0.15"
        :max="0.35"
        :step="0.025"
      />

      <ThemeStudioRow
        v-model="defaultSize"
        control="select"
        label="Size"
        control-icon="i-lucide-proportions"
        :items="defaultSizeItems"
        aria-label="Default size"
      />
    </div>
  </ThemeStudioSection>
</template>
