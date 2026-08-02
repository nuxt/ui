<script setup lang="ts">
/** The presets trigger: its label names the applied preset. */
const props = withDefaults(defineProps<{
  /** Button size — the toolbar uses the default, the header picker slims down. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Toolbar opts out of dismissing on its own chrome; other hosts keep stock dismiss. */
  keepPanels?: boolean
}>(), {})

const { presets, selectedPreset } = useThemeStudio()
const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

/** Exposed so hosts (the fullscreen toolbar) can pin themselves while open. */
const open = defineModel<boolean>('open', { default: false })

// The persisted preset (and any persisted edits) are client-only — resolve
// the label after mount so hydration matches the server's fallback.
const mounted = ref(false)
onMounted(() => (mounted.value = true))

// the boolean prop shadows the util in template scope — alias the handler
const onKeepPanels = keepPanels

// Edits deliberately don't clear the preset name (the dirty dots carry
// divergence); 'Custom' only when preset-less but diverged from stock.
const activeEntry = computed(() => (mounted.value
  ? presets.find(preset => preset.id === selectedPreset.value)
  : undefined))

const presetLabel = computed(() => {
  if (!mounted.value) return 'Presets'
  return activeEntry.value ? activeEntry.value.name : 'Custom'
})

/**
 * The same glyph its row wears in the listbox; the swatch book stands in for
 * a theme with no preset behind it (and before mount).
 */
const presetIcon = computed(() => activeEntry.value?.icon ?? studioIcons.themes)
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
        :icon="presetIcon"
        :trailing-icon="appConfig.ui.icons.chevronDown"
        color="neutral"
        variant="subtle"
        :size="size"
        block
        :ui="{ leadingIcon: 'text-primary' }"
      />

      <template #content>
        <ThemeStudioPresetList @select="open = false" />
      </template>
    </UPopover>
  </div>
</template>
