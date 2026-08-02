<script setup lang="ts">
/** Which settings group this instance renders, one popover per group. */
defineProps<{
  group: 'colors' | 'style'
}>()
</script>

<template>
  <!-- One root either way: the panels render as fragments, so a class on the
       component would fall through to nothing. Sections stay siblings here,
       which is what lets each draw its own rule, the panel drops the leading
       one, since there's nothing above it to separate from. -->
  <div class="flex flex-col [&>*:first-child]:border-t-0">
    <ThemeStudioControlsColors v-if="group === 'colors'" />

    <template v-else>
      <ThemeStudioControlsStyle />

      <ThemeStudioControlsDefaults />
    </template>
  </div>
</template>
