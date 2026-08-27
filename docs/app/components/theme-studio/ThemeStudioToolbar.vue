<script setup lang="ts">
/**
 * The six theme controls. They ride the footer on desktop; below `lg` the
 * footer copy hides and the header's mobile menu renders the same set with
 * `vertical`, stacked one per row with each label shown.
 */
const props = defineProps<{ vertical?: boolean }>()

const { font } = useTheme()
const studioIcons = useStudioIcons()
const { colorChips, colorLabel, groupDirtyFlags } = useThemeStudioToolbar()

const open = reactive({ presets: false, colors: false, font: false, icons: false, radius: false, style: false })

/** A control fills its row on mobile, and keeps its fixed bar width otherwise. */
function width(bar: string) {
  return props.vertical ? 'w-full' : bar
}

// The panels are sized for the bar, so they need a cap to stay on a phone.
const panel = 'w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto'
</script>

<template>
  <div :class="vertical ? 'flex flex-col gap-3' : 'flex items-center gap-x-1.5'">
    <ThemeStudioToolbarField v-slot="{ tooltip }" label="Preset" :vertical="vertical">
      <ThemeStudioPresetMenu v-model:open="open.presets" keep-panels :tooltip="tooltip" :class="width('w-38')" />
    </ThemeStudioToolbarField>

    <ThemeStudioToolbarPopover
      v-model:open="open.colors"
      label="Colors"
      :value="colorLabel"
      :dirty="groupDirtyFlags.colors.value"
      :vertical="vertical"
    >
      <template #leading>
        <span class="flex items-center -space-x-0.5">
          <!-- primary stacks on top; black-as-primary has no ramp
               variable to point at -->
          <span
            v-for="(chip, index) in colorChips"
            :key="chip.label"
            class="relative size-3 rounded-full ring-2 ring-(--ui-bg-elevated)"
            :class="!chip.dot && 'bg-black dark:bg-white'"
            :style="{ ...(chip.dot ? { backgroundColor: chip.dot } : {}), zIndex: colorChips.length - index }"
          />
        </span>
      </template>

      <ThemeStudioControls group="colors" :class="panel" />
    </ThemeStudioToolbarPopover>

    <ThemeStudioToolbarPopover
      v-model:open="open.font"
      label="Text"
      :icon="studioIcons.text"
      :value="font"
      :dirty="groupDirtyFlags.font.value"
      :vertical="vertical"
    >
      <ThemeStudioFontOptions />
    </ThemeStudioToolbarPopover>

    <!-- the picker is already a popover, so it sits in the bar directly
         rather than inside a second one -->
    <ThemeStudioToolbarField v-slot="{ tooltip }" label="Icons" :vertical="vertical">
      <ThemeStudioIconOptions v-model:open="open.icons" :tooltip="tooltip" :dirty="groupDirtyFlags.icons.value" :class="width('w-38')" />
    </ThemeStudioToolbarField>

    <ThemeStudioToolbarField v-slot="{ tooltip }" label="Radius" :vertical="vertical">
      <ThemeStudioRadiusOptions v-model:open="open.radius" :tooltip="tooltip" :dirty="groupDirtyFlags.radius.value" :class="width('w-34')" />
    </ThemeStudioToolbarField>

    <ThemeStudioToolbarPopover
      v-model:open="open.style"
      label="Defaults"
      :icon="studioIcons.options"
      :dirty="groupDirtyFlags.defaults.value"
      :vertical="vertical"
    >
      <ThemeStudioControls group="style" :class="panel" />
    </ThemeStudioToolbarPopover>
  </div>
</template>
