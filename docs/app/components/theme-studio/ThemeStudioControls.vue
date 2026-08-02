<script setup lang="ts">
/** Which settings group this instance renders — one popover per group. */
defineProps<{
  group: 'colors' | 'style'
}>()
</script>

<template>
  <ThemeStudioControlsColors v-if="group === 'colors'" />

  <!-- Style is type, icons and scale, then the shadow/border treatments,
       with the per-component defaults trailing behind, collapsed. -->
  <div v-else class="flex flex-col">
    <ThemeStudioControlsGeneral />

    <USeparator />

    <ThemeStudioControlsStyle />

    <USeparator />

    <ThemeStudioControlsDefaults />
  </div>
</template>
