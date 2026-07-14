export type ThemeStudioView = 'grid' | 'dashboard' | 'chat' | 'saas' | 'landing' | 'docs' | 'portfolio' | 'changelog' | 'editor' | 'a11y'

export interface ThemeStudioViewTab {
  label: string
  icon: string
  value: ThemeStudioView
  /** One-liner for the rich switcher — template blurbs from /templates. */
  description: string
  /** /templates screenshot base path (`-light.png`/`-dark.png` appended); grid and a11y are studio-only and have none. */
  image?: string
}

const templateImage = (name: string) => `/assets/templates/nuxt/${name}`

export const THEME_STUDIO_VIEWS: ThemeStudioViewTab[] = [
  { label: 'Grid', icon: 'i-lucide-layout-grid', value: 'grid', description: 'Every themed component at a glance — the component wall.' },
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', value: 'dashboard', description: 'Multi-column admin interface with inbox, customers and settings.', image: templateImage('dashboard') },
  { label: 'Chat', icon: 'i-lucide-message-circle', value: 'chat', description: 'An AI chatbot with sidebar history and streaming replies.', image: templateImage('chat') },
  { label: 'SaaS', icon: 'i-lucide-rocket', value: 'saas', description: 'A SaaS home with hero, pricing and feature sections.', image: templateImage('saas') },
  { label: 'Landing', icon: 'i-lucide-panels-top-left', value: 'landing', description: 'A modern marketing landing page.', image: templateImage('landing') },
  { label: 'Docs', icon: 'i-lucide-book-open', value: 'docs', description: 'A documentation site: navigation, prose, code and TOC.', image: templateImage('docs') },
  { label: 'Portfolio', icon: 'i-lucide-user-round', value: 'portfolio', description: 'A personal portfolio with work, blog and testimonials.', image: templateImage('portfolio') },
  { label: 'Changelog', icon: 'i-lucide-newspaper', value: 'changelog', description: 'Release notes with sticky intro and version timeline.', image: templateImage('changelog') },
  { label: 'Editor', icon: 'i-lucide-file-pen-line', value: 'editor', description: 'A rich text editor with toolbar, slash menu and drag handles.', image: templateImage('editor') },
  { label: 'A11y', icon: 'i-lucide-accessibility', value: 'a11y', description: 'Contrast matrix for every token pair in the theme.' }
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
