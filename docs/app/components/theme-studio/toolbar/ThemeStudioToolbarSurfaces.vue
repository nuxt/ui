<script setup lang="ts">
import { SURFACE_GROUPS } from '../../../utils/theme/engine'
import { keepPanels, toolbarPanelClass } from '../../../utils/theme/studio'

/**
 * The background, text and border shades the page takes from the neutral
 * ramp, one section per group with its own reset.
 */
const props = defineProps<{
  /** Stacked in the mobile menu: the panel takes the trigger's width, like a select. */
  vertical?: boolean
}>()

const { rampChip } = useThemeStudio()
const { sections } = useTokenShades('neutral')
const { groupDirtyFlags } = useThemeStudioToolbar()
const studioIcons = useStudioIcons()

const groups = SURFACE_GROUPS.map((group) => {
  const groupSections = sections.filter(section => section.group === group.key)
  const sliders = groupSections.flatMap(section => Object.values(section.sliders))
  return {
    ...group,
    sections: groupSections,
    dirty: computed(() => sliders.some(slider => slider.dirty.value)),
    reset: () => sliders.forEach(slider => slider.reset())
  }
})

const open = ref(false)
const dirty = groupDirtyFlags.surfaces

const content = computed(() => [...toolbarPanelClass(props.vertical), 'divide-y divide-default *:p-3'])
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'center', onInteractOutside: keepPanels }" :ui="{ content }">
    <ThemeStudioToolbarTrigger
      label="Surfaces"
      :icon="studioIcons.layers"
      :dirty="dirty"
      :open="open"
      :class="vertical ? 'w-full' : 'w-38'"
      aria-label="Surfaces"
    />

    <template #content>
      <ThemeStudioSection
        v-for="group in groups"
        :key="group.key"
        :label="group.label"
        resettable
        :reset-dirty="group.dirty.value"
        @reset="group.reset"
      >
        <div class="flex flex-col gap-2">
          <ThemeStudioColorShadeGroup
            v-for="section in group.sections"
            :key="section.token"
            :label="section.label"
            :sliders="section.sliders"
            :chip="rampChip(section.ramp)"
          />
        </div>
      </ThemeStudioSection>
    </template>
  </UPopover>
</template>
