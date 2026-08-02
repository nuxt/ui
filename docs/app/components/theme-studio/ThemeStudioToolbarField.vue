<script setup lang="ts">
/** A toolbar control: labelled above it in fullscreen, tooltipped otherwise. */
defineProps<{ label: string }>()

const { fullscreen } = useThemeStudioView()

// The labels only earn their space in fullscreen, where the bar floats free,
// and the container's gap for the label has to go with them.
const ui = computed(() => (fullscreen.value
  ? { root: 'shrink-0', label: 'text-dimmed' }
  : { root: 'shrink-0', label: 'hidden', container: 'mt-0' }))
</script>

<template>
  <UFormField :label="label" size="xs" :ui="ui">
    <slot :tooltip="fullscreen ? undefined : label" />
  </UFormField>
</template>
