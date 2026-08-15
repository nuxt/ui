import { toReactive } from '@vueuse/core'
import { studioIcons, STUDIO_EXTRA_DEFAULTS, studioExtraOverrides } from '../utils/theme/icons'

/**
 * The studio-chrome glyphs (toolbar controls, Ask-AI, theme picker) for the
 * ACTIVE icon pack, so the studio's own UI skins to the applied theme. Falls
 * back to Lucide for any unrecognized pack name. Returned as a reactive object
 * (not a ref), like useStudioExtraIcons, so `studioIcons.undo` resolves
 * directly in both script and templates.
 */
export function useStudioIcons() {
  // `icon` already reports the stock pack until mounted (see useTheme), so the
  // chrome inherits that hydration-safety for free.
  const { icon } = useTheme()
  return toReactive(computed(() => studioIcons[icon.value as keyof typeof studioIcons] ?? studioIcons.lucide))
}

/**
 * The extended functional glyphs the preview demos use (dashboard nav, account
 * menus, etc.) resolved for the active pack, each pack's override merged over
 * the Lucide defaults, so an unset pack/key falls back to Lucide. Returned as a
 * reactive object (not a ref) so `extra.home` resolves directly in both script
 * arrays and templates, exactly like `appConfig.ui.icons.*`.
 */
export function useStudioExtraIcons() {
  const { icon } = useTheme()
  return toReactive(computed(() => ({
    ...STUDIO_EXTRA_DEFAULTS,
    ...(studioExtraOverrides[icon.value as keyof typeof studioExtraOverrides] ?? {})
  })))
}
