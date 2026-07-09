export type ThemeStudioView = 'grid' | 'dashboard' | 'chat' | 'saas' | 'landing' | 'a11y'

export interface ThemeStudioViewTab {
  label: string
  icon: string
  value: ThemeStudioView
}

export const THEME_STUDIO_VIEWS: ThemeStudioViewTab[] = [
  { label: 'Grid', icon: 'i-lucide-layout-grid', value: 'grid' },
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', value: 'dashboard' },
  { label: 'Chat', icon: 'i-lucide-message-circle', value: 'chat' },
  { label: 'SaaS', icon: 'i-lucide-rocket', value: 'saas' },
  { label: 'Landing', icon: 'i-lucide-panels-top-left', value: 'landing' },
  { label: 'A11y', icon: 'i-lucide-accessibility', value: 'a11y' }
]

/**
 * The studio's preview state lives at app level: while on /theme the site
 * header hosts the view switcher and fullscreen gates the chrome, so both
 * the page and the header read the same state.
 */
export function useThemeStudioView() {
  const view = useState<ThemeStudioView>('theme-studio-view', () => 'grid')
  const fullscreen = useState('theme-studio-fullscreen', () => false)

  return { view, fullscreen, views: THEME_STUDIO_VIEWS }
}
