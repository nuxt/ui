<script setup lang="ts">
/**
 * The header's theme popover: the color mode up top, a grid of preset
 * swatches, and the full studio one click away. Picking only, everything
 * else (export, reset, the rest of the axes) lives in the studio. The
 * header drops this on /theme, where the studio's own toolbar covers it.
 */
import { themeSwatchStyle, keepPanels } from '../../utils/theme/studio'

const appConfig = useAppConfig()
const colorMode = useColorMode()
const { track } = useAnalytics()
const studioIcons = useStudioIcons()

const open = ref(false)

// The persisted theme and the color mode are client-only, gate on mount so
// hydration doesn't adopt a selection the server never rendered.
const mounted = useMounted()

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Picker Opened')
  }
})

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

const presetTiles = computed(() => presets.map(preset => ({
  preset,
  label: preset.name,
  icon: preset.icon,
  swatch: themeSwatchStyle(preset.doc),
  active: mounted.value && preset.id === selectedPreset.value
})))
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
      <div class="flex items-center justify-between gap-2 p-2 ps-3">
        <span class="text-sm font-semibold text-highlighted">Theme</span>

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

      <div class="grid grid-cols-3 p-1.5">
        <button
          v-for="tile in presetTiles"
          :key="tile.preset.id"
          type="button"
          class="flex flex-col items-center gap-1.5 p-2 rounded-md transition-colors hover:bg-elevated/50"
          :class="tile.active && 'bg-elevated hover:bg-elevated'"
          :aria-pressed="tile.active"
          @click="applyPreset(tile.preset)"
        >
          <span
            class="flex items-center justify-center size-8 rounded-full bg-(image:--swatch-light) dark:bg-(image:--swatch-dark)"
            :style="tile.swatch"
          >
            <UIcon :name="tile.icon" class="size-5 text-(--swatch-ink-light) dark:text-(--swatch-ink-dark)" />
          </span>

          <span class="w-full truncate text-[11px]" :class="tile.active ? 'text-highlighted font-medium' : 'text-muted'">{{ tile.label }}</span>
        </button>
      </div>

      <div class="p-1.5">
        <UButton
          block
          label="Edit theme"
          :icon="studioIcons.options"
          color="neutral"
          variant="ghost"
          to="/theme"
          @click="open = false"
        />
      </div>
    </template>
  </UPopover>
</template>
