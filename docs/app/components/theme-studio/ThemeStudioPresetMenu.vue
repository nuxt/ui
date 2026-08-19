<script setup lang="ts">
import type { ThemeDoc } from '../../utils/theme/engine'
import { themeIcons } from '../../utils/theme/icons'
import { themeChipStyle, keepPanels, loadFontPreviews } from '../../utils/theme/studio'

/** The presets trigger and its listbox: the label names the applied preset. */
defineProps<{
  /** Set where the trigger carries no visible label of its own. */
  tooltip?: string
}>()

const { presets, selectedPreset, applyPreset } = useThemeStudio()
const { fonts } = useTheme()
const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

/** Exposed so the toolbar can pin itself while the menu is open. */
const open = defineModel<boolean>('open', { default: false })

// The persisted preset (and any persisted edits) are client-only, resolve
// the label after mount so hydration matches the server's fallback.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
  // the rows render their own font names, load the faces once
  loadFontPreviews(fonts.map(entry => entry.name))
})

// the toolbar stays open when a click lands on its own chrome
const onKeepPanels = keepPanels

// Edits deliberately don't clear the preset name (the controls that changed
// go primary to carry divergence); 'Custom' only when preset-less but
// diverged from stock.
const activeEntry = computed(() => (mounted.value
  ? presets.find(preset => preset.id === selectedPreset.value)
  : undefined))

const presetLabel = computed(() => {
  if (!mounted.value) return 'Presets'
  return activeEntry.value ? activeEntry.value.name : 'Custom'
})

/** Its row's own glyph; the swatch book stands in when no preset is behind it. */
const presetIcon = computed(() => activeEntry.value?.icon ?? studioIcons.themes)

/** A taste of the doc's icon set (its own, or the default lucide). */
function iconSamples(doc: ThemeDoc): string[] {
  const sets = themeIcons as Record<string, Record<string, string>>
  const set = sets[doc.icons ?? 'lucide'] ?? sets.lucide!
  // upload, search and folder vary the most between the sets
  return ['upload', 'search', 'folder'].map(key => set[key]!)
}

const presetItems = computed(() => presets.map(preset => ({
  id: preset.id,
  label: preset.name,
  chipIcon: preset.icon,
  themeChip: themeChipStyle(preset.doc),
  font: preset.doc.font?.sans ?? 'Public Sans',
  iconSamples: iconSamples(preset.doc)
})))

const selected = computed({
  get: () => mounted.value ? selectedPreset.value : undefined,
  set: (id: string | undefined) => {
    const preset = presets.find(entry => entry.id === id)
    if (preset) {
      applyPreset(preset)
      open.value = false
    }
  }
})
</script>

<template>
  <div class="flex gap-2">
    <UPopover
      v-model:open="open"
      :content="{ align: 'start', onInteractOutside: onKeepPanels }"
      class="flex-1 min-w-0"
    >
      <UTooltip :text="tooltip" :disabled="!tooltip">
        <UButton
          :label="presetLabel"
          :icon="presetIcon"
          :trailing-icon="appConfig.ui.icons.chevronDown"
          color="neutral"
          variant="outline"
          block
          :ui="{ leadingIcon: 'text-primary' }"
        />
      </UTooltip>

      <template #content>
        <UListbox
          v-model="selected"
          :items="presetItems"
          value-key="id"
          class="w-80"
          :ui="{
            root: 'ring-0 rounded-md',
            content: 'max-h-96',
            item: 'gap-3'
          }"
        >
          <template #item-leading="{ item }">
            <span
              class="flex items-center justify-center size-10 rounded-md ring ring-default shrink-0 bg-[image:var(--chip-bg-light)] dark:bg-[image:var(--chip-bg-dark)]"
              :style="item.themeChip"
            >
              <UIcon :name="item.chipIcon" class="size-4 text-(--chip-icon-light) dark:text-(--chip-icon-dark)" />
            </span>
          </template>

          <!-- the doc's font in its own face and a taste of its icon set -->
          <template #item-description="{ item }">
            <span class="flex items-center gap-2 pt-0.5">
              <span class="shrink-0 text-xs text-muted truncate" :style="{ fontFamily: `'${item.font}', sans-serif` }">{{ item.font }}</span>

              <span class="text-dimmed select-none">·</span>

              <span class="flex items-center gap-1 shrink-0">
                <UIcon v-for="name in item.iconSamples" :key="name" :name="name" class="size-3 text-dimmed" />
              </span>
            </span>
          </template>
        </UListbox>
      </template>
    </UPopover>
  </div>
</template>
