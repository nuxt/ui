<script setup lang="ts">
/**
 * The six theme controls, one component each. They ride the footer on
 * desktop; below `lg` the footer copy hides and the header's mobile menu
 * renders the same set with `vertical`, stacked one per row with each
 * label shown.
 */
const props = defineProps<{ vertical?: boolean }>()

// The bar is a fixed strip under the preview, so a visible label per control
// would cost a row of height the preview wants; the mobile menu has the room
// and shows it. Each trigger's `aria-label` carries the name in the bar.
// `text-xs` rides the root class rather than `size="xs"`: the size prop is
// injected into every form component inside, so the selects rendered here
// would shrink to xs while the plain buttons beside them stayed md.
const fieldUi = computed(() => (props.vertical
  ? { root: 'text-xs', container: 'mt-1' }
  : { root: 'shrink-0 text-xs', label: 'hidden', container: 'mt-0' }))
</script>

<template>
  <div class="relative" :class="vertical ? 'flex flex-col gap-3' : 'flex items-center gap-x-1.5'">
    <UFormField label="Preset" :ui="fieldUi">
      <ThemeStudioToolbarPreset :vertical="vertical" />
    </UFormField>

    <UFormField label="Colors" :ui="fieldUi">
      <ThemeStudioToolbarColors :vertical="vertical" />
    </UFormField>

    <UFormField label="Text" :ui="fieldUi">
      <ThemeStudioToolbarFont :vertical="vertical" />
    </UFormField>

    <UFormField label="Icons" :ui="fieldUi">
      <ThemeStudioToolbarIcons :vertical="vertical" />
    </UFormField>

    <UFormField label="Radius" :ui="fieldUi">
      <ThemeStudioToolbarRadius :vertical="vertical" />
    </UFormField>

    <UFormField label="Defaults" :ui="fieldUi">
      <ThemeStudioToolbarDefaults :vertical="vertical" />
    </UFormField>
  </div>
</template>
