import { upperFirst } from 'scule'
import { DEFAULT_PRESET_ID, GROUP_STOCK_VARIANT } from '../utils/theme/engine/types'
import { paletteLabel, rampCssName } from '../utils/theme/studio'

/**
 * What the toolbar reports and what its reset does. The persisted theme is
 * client-only, so everything derived from it is gated on mount, hydration
 * adopts SSR attributes without patching, and a disabled= adopted at hydration
 * would never lift.
 */
export function useThemeStudioToolbar() {
  const { resetTheme, primary, neutral, blackAsPrimary } = useTheme()
  const { groupDirty, sectionDirty, dirty, presets, activePreset, applyPreset, primaryChip, neutralChip, isCustomPalette, style } = useThemeStudio()

  const mounted = useMounted()

  // A custom ramp has no name worth reading, the picker calls it Custom too.
  function paletteName(alias: 'primary' | 'neutral', value: string) {
    return isCustomPalette(alias) ? 'Custom' : upperFirst(paletteLabel(value))
  }

  /**
   * The two colours the panel owns, so the bar reports them unopened. Gated
   * on mount like the flags below: the label ends up in an aria-label, and
   * hydration adopts attributes from the server markup without patching.
   */
  const colorChips = computed(() => (mounted.value
    ? [{
        dot: blackAsPrimary.value ? undefined : `var(--color-${rampCssName(primaryChip.value)}-500)`,
        label: blackAsPrimary.value ? 'Black' : paletteName('primary', primary.value)
      }, {
        dot: `var(--color-${neutralChip.value}-500)`,
        label: paletteName('neutral', neutral.value)
      }]
    : [{ dot: 'var(--color-green-500)', label: 'Green' }, { dot: 'var(--color-slate-500)', label: 'Slate' }]))

  const colorLabel = computed(() => colorChips.value.map(chip => chip.label).join(', '))

  /**
   * The two the defaults panel leads with, so its trigger reports a value
   * like every other control in the bar. Both fall back to what the library
   * itself ships, which is what the panel shows tagged as Default.
   */
  const defaultsLabel = computed(() => {
    // same mount gate as colorChips, for the same aria-label reason
    const defaults = mounted.value ? style.value.defaults : undefined
    // the pickers store the stock choice as 'default', which is no choice
    const chosen = (value?: string) => (value && value !== 'default' ? value : undefined)
    const size = chosen(defaults?.size) ?? 'md'
    const variant = chosen(defaults?.variants?.buttons) ?? chosen(defaults?.variant) ?? GROUP_STOCK_VARIANT.buttons
    return `${size.toUpperCase()}, ${upperFirst(variant)}`
  })

  /**
   * "Changed from preset" per toolbar control, the cue each trigger carries.
   * Type, icons and radius sit in the bar on their own, so they are listed
   * here rather than rolled into a group.
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
    font: afterMount(sectionDirty(['font', 'type', 'weights'])),
    icons: afterMount(sectionDirty('icons')),
    radius: afterMount(sectionDirty('radius'))
  }

  // Two-stage reset: edits reset back to the preset, a second press clears
  // the preset back to stock. The studio's own measure, gated like the flags.
  const anyDirty = computed(() => mounted.value && dirty.value)
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

  return { colorChips, colorLabel, defaultsLabel, groupDirtyFlags, canReset, resetLabel, resetToBaseline }
}
