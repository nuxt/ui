import { toReactive } from '@vueuse/core'
import { studioIcons, STUDIO_EXTRA_DEFAULTS, studioExtraOverrides, studioViewOverrides } from '../utils/theme/icons'
import type { ThemeIcons } from '../utils/theme/icons'
import { THEME_STUDIO_VIEWS } from '../utils/theme/studio'
import type { ThemeStudioView } from '../utils/theme/studio'

/**
 * A glyph table resolved for the ACTIVE icon pack, as a reactive object (not
 * a ref) so `icons.undo` reads directly in script and templates, exactly like
 * `appConfig.ui.icons.*`. `icon` already reports the stock pack until mounted
 * (see useTheme), so everything built on it inherits that hydration safety.
 */
function forActivePack<T extends object>(resolve: (pack: ThemeIcons) => T) {
  const { icon } = useTheme()
  return toReactive(computed(() => resolve(icon.value as ThemeIcons)))
}

/** The studio-chrome glyphs (toolbar controls, Ask-AI, theme picker); Lucide for an unknown pack. */
export function useStudioIcons() {
  return forActivePack(pack => (Object.hasOwn(studioIcons, pack) ? studioIcons[pack] : studioIcons.lucide))
}

/**
 * The extended functional glyphs the preview demos use (dashboard nav,
 * account menus, etc.), each pack's overrides merged over the Lucide defaults.
 */
export function useStudioExtraIcons() {
  return forActivePack(pack => ({ ...STUDIO_EXTRA_DEFAULTS, ...(studioExtraOverrides[pack] ?? {}) }))
}

/** The view-switcher glyphs, a pack's override or the view's own Lucide default. */
export function useStudioViewIcons() {
  return forActivePack((pack) => {
    const overrides = studioViewOverrides[pack] ?? {}
    return Object.fromEntries(
      THEME_STUDIO_VIEWS.map(tab => [tab.value, overrides[tab.value] ?? tab.icon])
    ) as Record<ThemeStudioView, string>
  })
}
