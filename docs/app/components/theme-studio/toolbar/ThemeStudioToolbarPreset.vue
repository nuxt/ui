<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'
import type { ThemeDoc } from '../../../utils/theme/engine'
import { themeIcons } from '../../../utils/theme/icons'
import { themeChipStyle, loadFontPreviews } from '../../../utils/theme/studio'

/** The preset select: the value names the applied preset, each row previews its doc. */
defineProps<{
  /** Stacked in the mobile menu: the list takes the trigger's width. */
  vertical?: boolean
}>()

const { presets, selectedPreset, applyPreset } = useThemeStudio()
const { fonts } = useTheme()
const studioIcons = useStudioIcons()

// The persisted preset (and any persisted edits) are client-only, resolve
// the label after mount so hydration matches the server's fallback.
const mounted = useMounted()
// the rows render their own font names, load the faces once
onMounted(() => loadFontPreviews(fonts.map(entry => entry.name)))

// Edits deliberately don't clear the preset name (the controls that changed
// go primary to carry divergence); 'Custom' only when preset-less but
// diverged from stock, via the placeholder.
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
  label: preset.name,
  value: preset.id,
  // the item's own avatar carries the doc's ramp as its chip
  avatar: {
    icon: preset.icon,
    size: 'md',
    class: 'bg-(image:--chip-bg-light) dark:bg-(image:--chip-bg-dark)',
    style: themeChipStyle(preset.doc),
    ui: { icon: 'text-(--chip-icon-light) dark:text-(--chip-icon-dark)' }
  } as AvatarProps,
  font: preset.doc.font?.sans ?? 'Public Sans',
  iconSamples: iconSamples(preset.doc),
  ui: {
    itemLeadingAvatar: 'self-center'
  }
})))

/** The slot scope rides the base's loose item type, cast it back. */
function asPreset(item: unknown) {
  return item as typeof presetItems.value[number]
}

const selected = computed({
  get: () => (mounted.value ? selectedPreset.value : undefined),
  set: (id: string | number | undefined) => {
    const preset = presets.find(entry => entry.id === id)
    if (preset) applyPreset(preset)
  }
})
</script>

<template>
  <ThemeStudioToolbarSelect
    v-model="selected"
    :items="presetItems"
    :icon="presetIcon"
    leading-icon-class="text-primary"
    :placeholder="mounted ? 'Custom' : 'Presets'"
    :aria-label="`Preset: ${presetLabel}`"
    :vertical="vertical"
    :class="vertical ? 'w-full' : 'w-38'"
  >
    <template #item-description="{ item }">
      <span class="flex items-center gap-1">
        <span class="shrink-0 text-xs text-muted truncate" :style="{ fontFamily: `'${asPreset(item).font}', sans-serif` }">{{ asPreset(item).font }}</span>

        <span class="text-dimmed select-none">·</span>

        <span class="flex items-center gap-1 shrink-0">
          <UIcon v-for="name in asPreset(item).iconSamples" :key="name" :name="name" class="size-3 text-dimmed" />
        </span>
      </span>
    </template>
  </ThemeStudioToolbarSelect>
</template>
