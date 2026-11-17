import { toReactive } from '@vueuse/core'
import { studioIcons, studioIconOverrides } from '../utils/theme/icons'
import type { ThemeIcons } from '../utils/theme/icons'

/**
 * `studioIcons` resolved for the ACTIVE icon pack, as a reactive object (not
 * a ref) so `icons.undo` reads directly in script and templates, exactly like
 * `appConfig.ui.icons.*`. `icon` follows the pack applied to appConfig (see
 * useTheme), so this inherits its hydration safety.
 */
export function useStudioIcons() {
  const { icon } = useTheme()
  return toReactive(computed(() => ({ ...studioIcons, ...studioIconOverrides[icon.value as ThemeIcons] })))
}
