<script setup lang="ts">
import { resolveAlias, resolveShade } from '../../utils/theme-engine'
import type { ThemeDoc } from '../../utils/theme-engine'

/** The presets dropdown (with per-preset color swatches) plus the shuffle die. */
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

/** The preset's primary + neutral at 500, straight from its own document. */
function presetSwatches(doc: ThemeDoc): string[] {
  const primaryColor = doc.blackAsPrimary ? 'black' : resolveShade(doc, resolveAlias(doc, 'primary'), 500)
  const neutralColor = resolveShade(doc, resolveAlias(doc, 'neutral'), 500)
  return [primaryColor, neutralColor].filter((color): color is string => !!color)
}

const presetItems = computed(() => presets.map(preset => ({
  label: preset.name,
  icon: preset.icon,
  type: 'checkbox' as const,
  checked: activePreset.value === preset.id,
  swatches: presetSwatches(preset.doc),
  onSelect: () => applyPreset(preset)
})))

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
    <UDropdownMenu
      v-model:open="open"
      :items="presetItems"
      :content="{ align: 'start' }"
      class="flex-1 min-w-0"
      :ui="{ itemTrailing: 'self-center', content: 'w-(--reka-dropdown-menu-trigger-width)' }"
    >
      <UButton
        :label="presetLabel"
        icon="i-lucide-swatch-book"
        trailing-icon="i-lucide-chevron-down"
        color="neutral"
        variant="subtle"
        size="sm"
        block
      />

      <template #item-trailing="{ item }">
        <span class="inline-flex items-center gap-1 h-full">
          <span
            v-for="(swatch, index) in item.swatches"
            :key="index"
            class="size-2 rounded-full ring ring-default"
            :style="{ backgroundColor: swatch }"
          />
        </span>
      </template>
    </UDropdownMenu>

    <UTooltip text="Random theme">
      <UButton
        icon="i-lucide-dices"
        color="neutral"
        variant="subtle"
        size="sm"
        aria-label="Random theme"
        @click="shuffle"
      />
    </UTooltip>
  </div>
</template>
