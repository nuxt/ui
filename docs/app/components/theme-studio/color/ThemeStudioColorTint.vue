<script setup lang="ts">
import { upperFirst } from 'scule'
import type { Tint } from '../../../utils/theme/engine/extras'
import { TINTS } from '../../../utils/theme/engine/extras'

/**
 * How strong every color's fills and borders are: the `soft`, `subtle` and
 * `outline` variants, the callouts and the highlighted items. One choice
 * writes the five roles of the six colors, like the density does the scale.
 */
const { layout, setLayout } = useTheme()
const studioIcons = useStudioIcons()

const items = TINTS.map(value => ({ label: upperFirst(value), value, defaultTag: value === 'default' }))

// the stock tint is an absence, picking it clears the field
const tint = computed({
  get: (): Tint => layout.value.tint ?? 'default',
  set: (value: Tint) => setLayout({ ...layout.value, tint: value === 'default' ? undefined : value })
})
</script>

<template>
  <ThemeStudioSection label="Tint" section-key="tint">
    <ThemeStudioRow
      v-model="tint"
      control="select"
      label="Fills"
      :control-icon="studioIcons.layers"
      :items="items"
      aria-label="Tint of the color fills and borders"
    />
  </ThemeStudioSection>
</template>
