<script setup lang="ts">
/**
 * The header's theme popover: a grid of preset swatches with the full studio
 * one click away. Picking only, everything else (export, reset, the rest of
 * the axes) lives in the studio. The header drops this on /theme, where the
 * studio's own toolbar covers it.
 */
import { themeSwatchStyle } from '../../utils/theme-section'

const { track } = useAnalytics()
const studioIcons = useStudioIcons()

const open = ref(false)

// The persisted theme is client-only, gate the selection on mount so
// hydration doesn't adopt a checked row the server never rendered.
const mounted = ref(false)
onMounted(() => (mounted.value = true))

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Picker Opened')
  }
})

const { presets, selectedPreset, applyPreset } = useThemeStudio()

const presetTiles = computed(() => presets.map(preset => ({
  id: preset.id,
  label: preset.name,
  icon: preset.icon,
  swatch: themeSwatchStyle(preset.doc)
})))

const selected = computed({
  get: () => (mounted.value ? selectedPreset.value : undefined),
  set: (id: string | undefined) => {
    const preset = presets.find(entry => entry.id === id)
    if (preset) applyPreset(preset)
  }
})
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ onInteractOutside: keepPanels }"
    :ui="{ content: 'divide-y divide-default w-56' }"
  >
    <UTooltip text="Theme">
      <UButton
        :icon="studioIcons.themes"
        color="neutral"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Theme"
      />
    </UTooltip>

    <template #content>
      <UListbox
        v-model="selected"
        :items="presetTiles"
        value-key="id"
        :ui="{
          root: () => 'p-1.5',
          content: 'max-h-none',
          group: 'p-0 grid grid-cols-3',
          item: 'flex-col items-center gap-1.5 data-[state=checked]:before:bg-elevated hover:data-[state=checked]:before:bg-elevated',
          itemWrapper: 'min-w-0 w-full text-center',
          itemLabel: 'w-full truncate text-[11px]',
          itemTrailing: 'hidden'
        }"
      >
        <template #item-leading="{ item }">
          <span
            class="flex items-center justify-center size-8 rounded-full bg-(image:--swatch-light) dark:bg-(image:--swatch-dark)"
            :style="item.swatch"
          >
            <UIcon :name="item.icon" class="size-5 text-(--swatch-ink-light) dark:text-(--swatch-ink-dark)" />
          </span>
        </template>
      </UListbox>

      <div class="p-3">
        <UButton
          block
          label="Edit theme"
          :icon="studioIcons.themes"
          color="neutral"
          variant="outline"
          to="/theme"
          @click="open = false"
        />
      </div>
    </template>
  </UPopover>
</template>
