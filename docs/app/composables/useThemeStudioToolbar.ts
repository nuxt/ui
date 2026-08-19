import { DEFAULT_PRESET_ID } from '../utils/theme/engine'
import { paletteLabel } from '../utils/theme/studio'

/**
 * What the toolbar reports and what its reset does. The persisted theme is
 * client-only, so everything derived from it is gated on mount, hydration
 * adopts SSR attributes without patching, and a disabled= adopted at hydration
 * would never lift.
 */
export function useThemeStudioToolbar() {
  const { resetTheme, primary, neutral, blackAsPrimary } = useTheme()
  const { groupDirty, sectionDirty, presets, activePreset, applyPreset, primaryChip, neutralChip, isCustomPalette } = useThemeStudio()

  const mounted = ref(false)
  onMounted(() => (mounted.value = true))

  // A custom ramp has no name worth reading, the picker calls it Custom too.
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

  /**
   * "Changed from preset" per toolbar control. Type, icons and radius sit in
   * the bar on their own now, so they are listed here rather than rolled into
   * a group: `anyDirty` below folds over this object, and a section left out
   * of it would leave the reset button dead after a real change.
   *
   * Gated on mount like everything else here. The theme plugin restores the
   * saved doc BEFORE the root component's setup, so an ungated flag is
   * already true on the client's first render while the server rendered it
   * false; hydration adopts the server's markup without patching, and the
   * control would sit un-highlighted until something else forced a re-render.
   */
  const afterMount = (source: ComputedRef<boolean>) => computed(() => mounted.value && source.value)

  const groupDirtyFlags = {
    colors: afterMount(groupDirty('colors')),
    defaults: afterMount(groupDirty('defaults')),
    font: afterMount(sectionDirty('font')),
    icons: afterMount(sectionDirty('icons')),
    radius: afterMount(sectionDirty('radius'))
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
