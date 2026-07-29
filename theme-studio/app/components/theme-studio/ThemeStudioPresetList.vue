<script setup lang="ts">
import { resolveAlias, resolveShade } from '../../utils/theme-engine'
import type { ThemeDoc, ThemePreset, Shade } from '../../utils/theme-engine'
import { themeIcons } from '../../utils/theme'

/**
 * The presets listbox on its own — theme chips, fonts and icon tastes —
 * so hosts can embed it anywhere: the studio toolbar wraps it in a
 * popover (ThemeStudioPresetMenu), the drop-in ThemeStudioButton shows
 * it as a tab. Selection applies the preset directly.
 */
const props = defineProps<{
  /** Restrict the stock presets to these ids; omit for all. */
  include?: string[]
  /** Extra presets appended after the stock list. */
  extra?: ThemePreset[]
}>()

const emit = defineEmits<{ select: [id: string] }>()

const { presets, activePreset, applyPreset } = useThemeStudio()

// The persisted preset (and any persisted edits) are client-only — resolve
// the selection after mount so hydration matches the server's fallback.
const mounted = ref(false)

const allPresets = computed(() => [
  ...presets.filter(preset => !props.include || props.include.includes(preset.id)),
  ...props.extra ?? []
])

/**
 * Each row leads with a mini theme chip: the doc's neutral ramp as the
 * page, its own icon in its primary — the theme in one glance, following
 * the current color mode (light 50→200 / dark 900→800, primary 500/400).
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

const presetItems = computed(() => allPresets.value.map(preset => ({
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
  get: () => mounted.value ? activePreset.value : undefined,
  set: (id: string | undefined) => {
    const preset = allPresets.value.find(entry => entry.id === id)
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
