<script setup lang="ts">
import { ThemeStudioControlsColors, ThemeStudioControlsGeneral, ThemeStudioControlsStyle } from '#components'

/** Which settings group this instance renders — one popover per group. */
defineProps<{
  group: 'colors' | 'general' | 'style'
}>()

const groups = {
  colors: ThemeStudioControlsColors,
  general: ThemeStudioControlsGeneral,
  style: ThemeStudioControlsStyle
}
</script>

<template>
  <component :is="groups[group]" />
</template>
