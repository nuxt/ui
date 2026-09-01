<script setup lang="ts">
import type { ThemeDoc } from '../../utils/theme/engine'
import { themeIcons } from '../../utils/theme/icons'
import { themeChipStyle, keepPanels, loadFontPreviews } from '../../utils/theme/studio'

/** The presets trigger and its listbox: the label names the applied preset. */
const { presets, selectedPreset, applyPreset } = useThemeStudio()
const { fonts } = useTheme()
const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

defineProps<{
  /** Stacked in the mobile menu: the list takes the trigger's width, like a select. */
  vertical?: boolean
}>()

/** Exposed so the toolbar can pin itself while the menu is open. */
const open = defineModel<boolean>('open', { default: false })

// The persisted preset (and any persisted edits) are client-only, resolve
// the label after mount so hydration matches the server's fallback.
const mounted = useMounted()
// the rows render their own font names, load the faces once
onMounted(() => loadFontPreviews(fonts.map(entry => entry.name)))

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

// The trigger's visible text is the value, so the name names the control AND
// keeps that text (voice control matches on what's on screen).
const ariaLabel = computed(() => `Preset: ${presetLabel.value}`)

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
    // A second click (or Enter) on the selected preset toggles it off in
    // Reka's single-select listbox and emits undefined. Re-applying would
    // wipe the edits made on top of it, so it only closes.
    if (id === undefined) {
      open.value = false
      return
    }
    const preset = presets.find(entry => entry.id === id)
    if (preset) {
      applyPreset(preset)
      open.value = false
    }
  }
})
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ align: 'center', onInteractOutside: keepPanels }"
    :ui="{ content: vertical ? 'w-(--reka-popper-anchor-width)' : undefined }"
  >
    <UButton
      :label="presetLabel"
      :icon="presetIcon"
      :trailing-icon="appConfig.ui.icons.chevronDown"
      color="neutral"
      variant="outline"
      block
      class="group"
      :ui="{
        label: 'flex-1 min-w-0 text-left truncate',
        leadingIcon: 'text-primary',
        trailingIcon: ['text-dimmed transition-transform duration-200', open && 'rotate-180']
      }"
      :aria-label="ariaLabel"
    />

    <template #content>
      <UListbox
        v-model="selected"
        :items="presetItems"
        value-key="id"
        :ui="{
          root: 'ring-0 rounded-none',
          item: 'items-center',
          content: 'max-h-60'
        }"
      >
        <template #item-leading="{ item }">
          <span
            class="flex items-center justify-center size-8 rounded-full shrink-0 bg-(image:--chip-bg-light) dark:bg-(image:--chip-bg-dark)"
            :style="item.themeChip"
          >
            <UIcon :name="item.chipIcon" class="size-4 text-(--chip-icon-light) dark:text-(--chip-icon-dark)" />
          </span>
        </template>

        <!-- the doc's font in its own face and a taste of its icon set -->
        <template #item-description="{ item }">
          <span class="flex items-center gap-2">
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
</template>
