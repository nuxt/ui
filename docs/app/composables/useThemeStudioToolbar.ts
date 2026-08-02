import { DEFAULT_PRESET_ID } from '../utils/theme-engine'
import { paletteLabel } from '../utils/theme'

/**
 * What the toolbar reports and what its reset does. The persisted theme is
 * client-only, so everything derived from it is gated on mount — hydration
 * adopts SSR attributes without patching, and a disabled= adopted at hydration
 * would never lift.
 */
export function useThemeStudioToolbar() {
  const { resetTheme, primary, neutral, blackAsPrimary } = useTheme()
  const { groupDirty, presets, activePreset, applyPreset, primaryChip, neutralChip, isCustomPalette } = useThemeStudio()

  const mounted = ref(false)
  onMounted(() => (mounted.value = true))

  // A custom ramp has no name worth reading — the picker calls it Custom too.
  function paletteName(alias: 'primary' | 'neutral', value: string) {
    return isCustomPalette(alias) ? 'Custom' : capitalize(paletteLabel(value))
  }

  /** The two colours the panel owns, so the bar reports them unopened. */
  const colorChips = computed(() => [{
    dot: blackAsPrimary.value ? undefined : `var(--color-${primaryChip.value}-500)`,
    label: blackAsPrimary.value ? 'Black' : paletteName('primary', primary.value)
  }, {
    dot: `var(--color-${neutralChip.value}-500)`,
    label: paletteName('neutral', neutral.value)
  }])

  const colorLabel = computed(() => colorChips.value.map(chip => chip.label).join(', '))

  /** "Changed from preset" dot per settings tab. */
  const groupDirtyFlags = {
    colors: groupDirty('colors'),
    style: groupDirty('style')
  }

  // Two-stage reset: edits reset back to the preset, a second press clears
  // the preset back to stock.
  const anyDirty = computed(() => mounted.value && Object.values(groupDirtyFlags).some(flag => flag.value))
  const baselinePreset = computed(() => (mounted.value ? presets.find(preset => preset.id === activePreset.value) : undefined))
  const resetsToPreset = computed(() => Boolean(baselinePreset.value) && anyDirty.value)
  const canReset = computed(() => anyDirty.value || Boolean(baselinePreset.value))
  // named from the preset itself, so a rename can't leave this behind
  const stockPreset = computed(() => presets.find(preset => preset.id === DEFAULT_PRESET_ID))

  const resetLabel = computed(() => {
    if (resetsToPreset.value) return `Reset to ${baselinePreset.value!.name}`
    return baselinePreset.value ? `Reset to ${stockPreset.value?.name ?? 'stock'} theme` : 'Reset theme'
  })

  function resetToBaseline() {
    if (resetsToPreset.value) applyPreset(baselinePreset.value!)
    else resetTheme()
  }

  return { colorChips, colorLabel, groupDirtyFlags, canReset, resetLabel, resetToBaseline }
}
