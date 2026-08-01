<script setup lang="ts">
import { resolveAlias, resolveShade } from '../../utils/theme-engine'
import type { ThemeDoc, Shade } from '../../utils/theme-engine'
import { themeIcons } from '../../utils/theme'

/**
 * The presets listbox on its own — theme chips, fonts and icon tastes — so it
 * can be dropped anywhere the picker is wanted without the toolbar trigger
 * around it. Selection applies the preset directly.
 */
const emit = defineEmits<{ select: [id: string] }>()

const { presets, selectedPreset, applyPreset } = useThemeStudio()

// The persisted preset (and any persisted edits) are client-only — resolve
// the selection after mount so hydration matches the server's fallback.
const mounted = ref(false)

/**
 * Mini theme chip: the doc's neutral ramp as the page, its icon in its
 * primary, per colour mode.
 */
function themeChip(doc: ThemeDoc) {
  const shade = (alias: 'primary' | 'neutral', step: Shade) => resolveShade(doc, resolveAlias(doc, alias), step)
  return {
    '--chip-bg-light': `linear-gradient(135deg, ${shade('neutral', 50)}, ${shade('neutral', 200)})`,
    '--chip-bg-dark': `linear-gradient(135deg, ${shade('neutral', 900)}, ${shade('neutral', 800)})`,
    '--chip-icon-light': doc.blackAsPrimary ? 'black' : shade('primary', 500),
    '--chip-icon-dark': doc.blackAsPrimary ? 'white' : shade('primary', 400)
  }
}

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
  themeChip: themeChip(preset.doc),
  font: preset.doc.font?.sans ?? 'Public Sans',
  iconSamples: iconSamples(preset.doc)
})))

// the rows render their own font names — load the faces once
const { fonts } = useTheme()
onMounted(() => {
  mounted.value = true
  loadFontPreviews(fonts)
})

const selected = computed({
  get: () => mounted.value ? selectedPreset.value : undefined,
  set: (id: string | undefined) => {
    const preset = presets.find(entry => entry.id === id)
    if (preset) {
      applyPreset(preset)
      emit('select', preset.id)
    }
  }
})
</script>

<template>
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
