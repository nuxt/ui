<script setup lang="ts">
import type { ListboxItem } from '@nuxt/ui'

/**
 * The theme popover's panel: color mode up top, a grid of preset swatches,
 * the full studio one click away. Split from the trigger so the engine it
 * drags in (presets, palette math) stays out of the header's chunk and only
 * loads when the popover first opens.
 */
import { themeChipStyle } from '../../utils/theme/studio'

const emit = defineEmits<{ close: [] }>()

const appConfig = useAppConfig()
const colorMode = useColorMode()
const studioIcons = useStudioIcons()

// The persisted theme and the color mode are client-only, gate on mount so
// hydration doesn't adopt a selection the server never rendered.
const mounted = useMounted()

const { presets, selectedPreset, applyPreset } = useThemeStudio()

// labels for AT only, the ui below hides them so the control stays icon-wide
const modeTabs = computed(() => [
  { label: 'Light', value: 'light', icon: appConfig.ui.icons.light },
  { label: 'Dark', value: 'dark', icon: appConfig.ui.icons.dark },
  { label: 'System', value: 'system', icon: appConfig.ui.icons.system }
])

const mode = computed({
  get: () => (mounted.value ? colorMode.preference : 'system'),
  set: (value: string) => (colorMode.preference = value)
})

const presetTiles = computed<ListboxItem[]>(() => presets.map(preset => ({
  id: preset.id,
  label: preset.name,
  icon: preset.icon,
  themeChip: themeChipStyle(preset.doc)
})))

/** The slot scope rides the listbox's loose item type, cast it back. */
function asTile(item: unknown) {
  return item as { icon: string, themeChip: Record<string, string> }
}

const selected = computed({
  get: () => (mounted.value ? selectedPreset.value : undefined),
  set: (id: string | undefined) => {
    // undefined is Reka toggling the selected tile off: nothing to apply,
    // and re-applying would wipe the edits made on top of it
    const preset = presets.find(entry => entry.id === id)
    if (preset) applyPreset(preset)
  }
})
</script>

<template>
  <div class="divide-y divide-default">
    <div class="flex items-center justify-between gap-2 p-1">
      <span class="font-semibold text-highlighted text-xs gap-1.5 px-1.5">Theme</span>

      <UTabs
        v-model="mode"
        :items="modeTabs"
        :content="false"
        color="neutral"
        size="xs"
        :ui="{ label: 'sr-only' }"
        aria-label="Color mode"
      />
    </div>

    <UListbox
      v-model="selected"
      :items="presetTiles"
      value-key="id"
      aria-label="Preset"
      :ui="{
        root: () => 'p-1',
        content: 'max-h-none',
        group: 'p-0 grid grid-cols-3',
        item: 'flex-col items-center gap-1 p-1.5 min-w-0 text-muted data-[state=checked]:text-highlighted data-[state=checked]:font-medium data-[state=checked]:before:bg-elevated hover:data-[state=checked]:before:bg-elevated',
        itemWrapper: 'min-w-0 w-full text-center',
        itemLabel: 'w-full truncate text-[11px]',
        itemTrailing: 'hidden'
      }"
    >
      <template #item-leading="{ item }">
        <span
          class="flex items-center justify-center size-8 rounded-full bg-(image:--chip-bg-light) dark:bg-(image:--chip-bg-dark)"
          :style="asTile(item).themeChip"
        >
          <UIcon :name="asTile(item).icon" class="size-4 text-(--chip-icon-light) dark:text-(--chip-icon-dark)" />
        </span>
      </template>
    </UListbox>

    <div class="p-2">
      <UButton
        block
        label="Edit theme"
        :icon="studioIcons.options"
        color="neutral"
        variant="outline"
        size="sm"
        to="/theme"
        @click="emit('close')"
      />
    </div>
  </div>
</template>
