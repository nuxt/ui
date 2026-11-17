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

// The bar scrolls when the footer runs out of width, and the shadow reads
// the scroll position of the element it masks, so the bar itself is the
// scroller rather than the footer's container. The padding pulled back by
// the margin keeps focus rings inside the overflow box; the scrollbar stays
// hidden, the fade is the cue. The mobile menu stacks the controls, so it
// never overflows sideways and the mask stays off.
const toolbarRef = ref<HTMLElement | null>(null)
const { style } = useScrollShadow(toolbarRef, { orientation: 'horizontal' })
</script>

<template>
  <div
    ref="toolbarRef"
    class="relative"
    :class="vertical ? 'flex flex-col gap-3' : 'flex items-center gap-x-1.5 min-w-0 overflow-x-auto p-1 -m-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'"
    :style="style"
  >
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
