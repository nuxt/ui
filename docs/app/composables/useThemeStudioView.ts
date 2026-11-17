import { THEME_STUDIO_VIEWS } from '../utils/theme/studio'
import type { ThemeStudioView } from '../utils/theme/studio'

/**
 * Which preview the studio shows, and the table of them. Its own composable
 * so the switcher (and the landing, which mounts one) can read the view
 * without pulling `useThemeStudio` and the palette math behind it into the
 * chunk. `useThemeStudio` re-exports both, the studio reads them from there.
 */
export function useThemeStudioView() {
  const view = useState<ThemeStudioView>('theme-studio-view', () => 'grid')

  return {
    view,
    views: THEME_STUDIO_VIEWS
  }
}
