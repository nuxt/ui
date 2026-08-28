<script setup lang="ts">
import { iconSetSamples } from '../../utils/theme/icons'

/**
 * The six theme controls. They ride the footer on desktop; below `lg` the
 * footer copy hides and the header's mobile menu renders the same set with
 * `vertical`, stacked one per row with each label shown.
 */
const props = defineProps<{ vertical?: boolean }>()

const { font, icon, icons, radius, radiuses } = useTheme()

// `--ui-radius` is a rem length, so the stop IS the label.
const radiusItems = radiuses.map(value => ({ label: `${value}rem`, value }))
const studioIcons = useStudioIcons()
const { colorChips, colorLabel, defaultsLabel, groupDirtyFlags } = useThemeStudioToolbar()

const open = reactive({ presets: false, colors: false, font: false, icons: false, radius: false, defaults: false })

/** One width for every control, so the bar reads as a single row of selects. */
const width = computed(() => (props.vertical ? 'w-full' : 'w-38'))
</script>

<template>
  <div class="relative" :class="vertical ? 'flex flex-col gap-3' : 'flex items-center gap-x-1.5'">
    <ThemeStudioToolbarField label="Preset" :vertical="vertical">
      <ThemeStudioPresetMenu v-model:open="open.presets" :vertical="vertical" :class="width" />
    </ThemeStudioToolbarField>

    <ThemeStudioToolbarPopover
      v-model:open="open.colors"
      label="Colors"
      :value="colorLabel"
      :dirty="groupDirtyFlags.colors.value"
      :vertical="vertical"
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

      <ThemeStudioControlsColors />
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

    <!-- these two are already selects, so they sit in the bar directly
         rather than inside a popover -->
    <ThemeStudioToolbarField label="Icons" :vertical="vertical">
      <ThemeStudioToolbarSelect
        v-model="icon"
        v-model:open="open.icons"
        :items="icons"
        :icon="icons.find(entry => entry.value === icon)?.icon"
        :dirty="groupDirtyFlags.icons.value"
        aria-label="Icon set"
        :content-class="vertical ? undefined : 'w-72'"
        :class="width"
      >
        <!-- every set previews a strip of its own glyphs -->
        <template #item-description="{ item }">
          <span class="flex items-center gap-1.5 pt-0.5">
            <UIcon
              v-for="name in iconSetSamples(String(item.value))"
              :key="name"
              :name="name"
              class="size-3.5 text-muted"
            />
          </span>
        </template>
      </ThemeStudioToolbarSelect>
    </ThemeStudioToolbarField>

    <ThemeStudioToolbarField label="Radius" :vertical="vertical">
      <ThemeStudioToolbarSelect
        v-model="radius"
        v-model:open="open.radius"
        :items="radiusItems"
        :icon="studioIcons.radius"
        :dirty="groupDirtyFlags.radius.value"
        aria-label="Radius"
        :class="width"
      />
    </ThemeStudioToolbarField>

    <ThemeStudioToolbarPopover
      v-model:open="open.defaults"
      label="Defaults"
      :icon="studioIcons.options"
      :value="defaultsLabel"
      :dirty="groupDirtyFlags.defaults.value"
      :vertical="vertical"
    >
      <ThemeStudioControlsDefaults />
    </ThemeStudioToolbarPopover>
  </div>
</template>
