<script setup lang="ts">
/**
 * The header's slim theme popover: the settings reached for constantly —
 * preset, colors, font, icons, radius — for fast theming from any page,
 * with reset and export beside them and the full studio one click away.
 */
import { iconSetSamples } from '../../utils/theme'

const route = useRoute()
const { track } = useAnalytics()
const studioIcons = useStudioIcons()
const { fonts, font, icon, icons, radius, hasCSSChanges, hasConfigChanges, resetTheme } = useTheme()

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

// the font rows render in their own faces — load them when the popover
// first opens rather than on every page load
const fontsLoaded = ref(false)
watch(open, (isOpen) => {
  if (isOpen && !fontsLoaded.value) {
    fontsLoaded.value = true
    loadFontPreviews(fonts)
  }
})

const aliases = [
  { alias: 'primary', label: 'Primary' },
  { alias: 'neutral', label: 'Neutral' }
] as const

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

      <!-- Every row leads with a w-13 label — the same column the studio's
           slider rows use, so Radius lines up with the pickers above it. -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted w-13 shrink-0 select-none">Preset</span>

          <ThemeStudioPresetMenu size="sm" :random="false" class="flex-1 min-w-0" />
        </div>

        <div v-for="{ alias, label } in aliases" :key="alias" class="flex items-center gap-2">
          <span class="text-xs text-muted w-13 shrink-0 select-none">{{ label }}</span>

          <ThemeStudioColorMenu :alias="alias" class="flex-1 min-w-0" />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted w-13 shrink-0 select-none">Font</span>

          <ThemeStudioFontPicker
            v-model="font"
            :curated="fonts"
            default-value="Public Sans"
            icon="i-lucide-type"
            aria-label="Font"
            class="flex-1 min-w-0"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted w-13 shrink-0 select-none">Icons</span>

          <ThemeStudioListPicker
            v-model="icon"
            :items="icons"
            :icon="icons.find(entry => entry.value === icon)?.icon"
            aria-label="Icon set"
            class="flex-1 min-w-0"
          >
            <!-- every set previews a strip of its own glyphs -->
            <template #item-description="{ item }">
              <span class="flex items-center gap-1.5 pt-0.5">
                <UIcon
                  v-for="name in iconSetSamples(item.value)"
                  :key="name"
                  :name="name"
                  class="size-3.5 text-muted"
                />
              </span>
            </template>
          </ThemeStudioListPicker>
        </div>

        <ThemeStudioSliderRow
          v-model="radius"
          label="Radius"
          :min="0"
          :max="0.5"
          :step="0.125"
        />
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
