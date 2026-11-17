<script setup lang="ts">
import { SEMANTIC_ALIASES } from '../../../utils/theme/engine'
import { keepPanels, toolbarPanelClass } from '../../../utils/theme/studio'

/** The Colors control: a chip-pair trigger opening the per-alias sections. */
const props = defineProps<{
  /** Stacked in the mobile menu: the panel takes the trigger's width, like a select. */
  vertical?: boolean
}>()

const { colorChips, colorLabel, groupDirtyFlags } = useThemeStudioToolbar()

const open = ref(false)
const dirty = groupDirtyFlags.colors

const content = computed(() => [...toolbarPanelClass(props.vertical), 'p-3 flex flex-col gap-3'])
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'center', onInteractOutside: keepPanels }" :ui="{ content }">
    <ThemeStudioToolbarTrigger
      :label="colorLabel"
      :dirty="dirty"
      :open="open"
      :class="vertical ? 'w-full' : 'w-38'"
      :aria-label="`Colors: ${colorLabel}`"
    >
      <template #leading>
        <!-- -space-x-1 makes the pair exactly 20px, the width of a leading
             icon, so every trigger's text starts on the same pixel -->
        <span class="flex items-center -space-x-1">
          <!-- primary stacks on top; black-as-primary has no ramp
               variable to point at -->
          <span
            v-for="(chip, index) in colorChips"
            :key="chip.label"
            class="relative size-3 rounded-full ring-2 ring-bg group-hover:ring-(--ui-bg-elevated) transition"
            :class="!chip.dot && 'bg-black dark:bg-white'"
            :style="{ ...(chip.dot ? { backgroundColor: chip.dot } : {}), zIndex: colorChips.length - index }"
          />
        </span>
      </template>
    </ThemeStudioToolbarTrigger>

    <template #content>
      <ThemeStudioColorSection alias="primary" section-key="primary" />
      <ThemeStudioColorSection alias="neutral" section-key="neutral" />

      <ThemeStudioColorSection
        v-for="alias in SEMANTIC_ALIASES"
        :key="alias"
        :alias="alias"
        :section-key="alias"
      />
    </template>
  </UPopover>
</template>
