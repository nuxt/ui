<script setup lang="ts">
/** A toolbar control: tooltipped, its label read out to assistive tech. */
const props = defineProps<{ label: string, vertical?: boolean }>()

// The bar is a fixed strip under the preview, so a visible label per control
// would cost a row of height the preview wants; the mobile menu has the room
// and shows it instead of the tooltip. `text-xs` rides the root class rather
// than `size="xs"`: the size prop is injected into every form component
// inside, so the selects rendered here would shrink to xs while the plain
// buttons beside them stayed md.
const ui = computed(() => (props.vertical
  ? { root: 'text-xs', container: 'mt-1' }
  : { root: 'shrink-0 text-xs', label: 'hidden', container: 'mt-0' }))
</script>

<template>
  <UFormField :label="label" :ui="ui">
    <slot :tooltip="props.vertical ? undefined : label" />
  </UFormField>
</template>
