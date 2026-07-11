<script setup lang="ts">
import { resolveAlias, resolveShade } from '../../utils/theme-engine'
import type { ThemeDoc, Shade } from '../../utils/theme-engine'
import { themeIcons } from '../../utils/theme'

/** The presets listbox (theme chips, fonts and ramps) plus the shuffle die. */
const props = defineProps<{
  /** Button size — the toolbar uses the default, the header picker slims down. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * The studio toolbar opts out of dismissing on its own chrome so the
   * color-mode switch stays usable while the list is open; other hosts
   * keep the stock dismiss behavior.
   */
  keepPanels?: boolean
}>()

const { presets, activePreset, applyPreset, shuffle } = useThemeStudio()

/** Exposed so hosts (the fullscreen toolbar) can pin themselves while open. */
const open = defineModel<boolean>('open', { default: false })
const { hasCSSChanges, hasConfigChanges } = useTheme()

// The persisted preset (and any persisted edits) are client-only — resolve
// the label after mount so hydration matches the server's fallback.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

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
onMounted(() => loadFontPreviews(fonts))

const selected = computed({
  get: () => activePreset.value,
  set: (id: string | undefined) => {
    const preset = presets.find(entry => entry.id === id)
    if (preset) applyPreset(preset)
    open.value = false
  }
})

// the boolean prop shadows the util in template scope — alias the handler
const onKeepPanels = keepPanels

/** The applied preset's name; 'Custom' once edits diverge from it. */
const presetLabel = computed(() => {
  if (!mounted.value) return 'Presets'
  const active = presets.find(preset => preset.id === activePreset.value)
  if (active) return active.name
  return (hasCSSChanges.value || hasConfigChanges.value) ? 'Custom' : 'Presets'
})
</script>

<template>
  <div class="flex gap-2">
    <UPopover
      v-model:open="open"
      :content="props.keepPanels ? { align: 'start', onInteractOutside: onKeepPanels } : { align: 'start' }"
      class="flex-1 min-w-0"
    >
      <UButton
        :label="presetLabel"
        icon="i-lucide-swatch-book"
        trailing-icon="i-lucide-chevron-down"
        color="neutral"
        variant="subtle"
        :size="size"
        block
      />

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

    <UTooltip text="Random theme">
      <UButton
        icon="i-lucide-dices"
        color="neutral"
        variant="subtle"
        :size="size"
        aria-label="Random theme"
        @click="shuffle"
      />
    </UTooltip>
  </div>
</template>
