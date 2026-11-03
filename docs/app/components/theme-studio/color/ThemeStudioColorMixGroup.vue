<script setup lang="ts">
import type { MIX_TARGETS } from '../../../utils/theme/engine/extras'

/**
 * The recipe roles a section owns as opacity sliders, resetting as one group
 * like the shade groups beside them.
 */
const props = defineProps<{
  section: typeof MIX_TARGETS[number]['section']
  label?: string
}>()

const { rows, dirty, reset } = useTokenMixes(props.section)
</script>

<template>
  <ThemeStudioSection
    v-if="rows.length"
    :label="label"
    resettable
    :reset-dirty="dirty"
    @reset="reset"
  >
    <ThemeStudioRow
      v-for="row in rows"
      :key="row.token"
      v-model="row.model.value"
      control="slider"
      :label="row.label"
      :aria-label="`${label ?? ''} ${row.label}`.trim()"
      :min="0"
      :max="100"
      :step="5"
      unit="%"
    />
  </ThemeStudioSection>
</template>
