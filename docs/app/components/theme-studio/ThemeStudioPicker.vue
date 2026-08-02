<script setup lang="ts">
/**
 * The header's theme popover: a grid of presets, with reset and export
 * beside them and the full studio one click away.
 */
import { themeChipStyle } from '../../utils/theme-section'

const route = useRoute()
const { track } = useAnalytics()
const studioIcons = useStudioIcons()
const { hasCSSChanges, hasConfigChanges, resetTheme } = useTheme()

const open = ref(false)
const shareOpen = ref(false)

// The persisted theme is client-only — gate the dirty-driven affordances on
// mount so hydration doesn't adopt a disabled= that never lifts.
const mounted = ref(false)
onMounted(() => (mounted.value = true))

const dirty = computed(() => mounted.value && (hasCSSChanges.value || hasConfigChanges.value))

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
  chip: themeChipStyle(preset.doc)
})))

function pickPreset(id: string) {
  const preset = presets.find(entry => entry.id === id)
  if (preset) applyPreset(preset)
}

function openExport() {
  open.value = false
  shareOpen.value = true
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ onInteractOutside: keepPanels }"
    :ui="{ content: 'w-72 p-3 flex flex-col gap-3' }"
  >
    <UTooltip text="Theme">
      <UButton
        :icon="studioIcons.themes"
        color="neutral"
        active-color="primary"
        :active="route.path === '/theme'"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Theme"
      />
    </UTooltip>

    <template #content>
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-semibold text-muted">Theme</span>

        <UTooltip :text="dirty ? 'Reset theme' : 'Nothing to reset'">
          <UButton
            :icon="studioIcons.reset"
            size="xs"
            :color="dirty ? 'primary' : 'neutral'"
            variant="ghost"
            :disabled="!dirty"
            aria-label="Reset theme"
            @click="resetTheme()"
          />
        </UTooltip>
      </div>

      <!-- Each tile paints itself in the preset it applies. -->
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="tile in presetTiles"
          :key="tile.id"
          type="button"
          class="group flex flex-col gap-1 rounded-md p-1 text-left transition-colors hover:bg-elevated/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          @click="pickPreset(tile.id)"
        >
          <span
            class="flex items-center justify-center h-12 w-full rounded-md ring bg-[image:var(--chip-bg-light)] dark:bg-[image:var(--chip-bg-dark)]"
            :class="mounted && selectedPreset === tile.id ? 'ring-2 ring-primary' : 'ring-default'"
            :style="tile.chip"
          >
            <UIcon :name="tile.icon" class="size-5 text-(--chip-icon-light) dark:text-(--chip-icon-dark)" />
          </span>

          <span
            class="text-[11px] leading-tight truncate w-full"
            :class="mounted && selectedPreset === tile.id ? 'text-highlighted font-medium' : 'text-muted'"
          >{{ tile.label }}</span>
        </button>
      </div>

      <template v-if="dirty || route.path !== '/theme'">
        <USeparator />

        <div class="flex items-center gap-2">
          <!-- Export only once there's something to export. -->
          <UButton
            v-if="dirty"
            label="Export"
            :icon="studioIcons.export"
            color="neutral"
            variant="subtle"
            size="sm"
            :block="route.path === '/theme'"
            :class="route.path !== '/theme' && 'flex-1 min-w-0'"
            @click="openExport"
          />

          <UButton
            v-if="route.path !== '/theme'"
            label="Edit theme"
            :icon="studioIcons.themes"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="subtle"
            size="sm"
            :block="!dirty"
            :class="dirty && 'flex-1 min-w-0'"
            to="/theme"
            @click="open = false"
          />
        </div>
      </template>
    </template>
  </UPopover>

  <!-- outside the popover: opening the modal dismisses it, which would
       unmount a modal nested inside -->
  <ThemeStudioShareModal v-model:open="shareOpen" mode="export" />
</template>
