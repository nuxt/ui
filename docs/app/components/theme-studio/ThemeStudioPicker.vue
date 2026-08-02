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
  themeChip: themeChipStyle(preset.doc)
})))

// the applied preset is client-only — no selection until mount, or hydration
// would adopt a checked row the server never rendered
const selected = computed({
  get: () => (mounted.value ? selectedPreset.value : undefined),
  set: (id: string | undefined) => {
    const preset = presets.find(entry => entry.id === id)
    if (preset) applyPreset(preset)
  }
})

function openExport() {
  open.value = false
  shareOpen.value = true
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ onInteractOutside: keepPanels }"
    :ui="{ content: 'w-72' }"
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
      <!-- the card brings the rules and the padding; the popover already has
           the surface, so its root drops its own ring and background -->
      <UCard :ui="{ root: 'ring-0 bg-transparent', header: 'p-3 sm:px-3', body: 'p-2 sm:p-2', footer: 'p-3 sm:px-3' }">
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-semibold text-highlighted">Theme</span>

            <UTooltip :text="dirty ? 'Reset theme' : 'Nothing to reset'">
              <UButton
                :icon="studioIcons.reset"
                size="xs"
                color="neutral"
                variant="ghost"
                :active="dirty"
                active-variant="outline"
                :disabled="!dirty"
                aria-label="Reset theme"
                @click="resetTheme()"
              />
            </UTooltip>
          </div>
        </template>

        <!-- Each tile paints itself in the preset it applies; the same
             listbox the view switcher uses, three across. -->
        <UListbox
          v-model="selected"
          :items="presetTiles"
          value-key="id"
          :ui="{
            root: 'ring-0',
            content: 'max-h-none',
            group: 'p-0 grid grid-cols-3',
            item: 'flex-col rounded-lg data-[state=checked]:bg-elevated/50',
            itemWrapper: 'min-w-0 w-full text-center',
            itemLabel: 'w-full truncate text-xs',
            itemTrailing: 'hidden'
          }"
        >
          <template #item-leading="{ item }">
            <span
              class="flex items-center justify-center h-12 w-full rounded-md ring ring-default bg-[image:var(--chip-bg-light)] dark:bg-[image:var(--chip-bg-dark)]"
              :style="item.themeChip"
            >
              <UIcon :name="item.icon" class="size-5 text-(--chip-icon-light) dark:text-(--chip-icon-dark)" />
            </span>
          </template>
        </UListbox>

        <!-- v-if on the template itself: an empty footer would still draw its
             rule and padding -->
        <template v-if="dirty || route.path !== '/theme'" #footer>
          <div class="flex items-center gap-2">
            <!-- Export only once there's something to export. -->
            <UButton
              v-if="dirty"
              label="Export"
              :icon="studioIcons.export"
              color="neutral"
              variant="outline"
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
              variant="outline"
              size="sm"
              :block="!dirty"
              :class="dirty && 'flex-1 min-w-0'"
              to="/theme"
              @click="open = false"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UPopover>

  <!-- outside the popover: opening the modal dismisses it, which would
       unmount a modal nested inside -->
  <ThemeStudioShareModal v-model:open="shareOpen" mode="export" />
</template>
