import type { ThemeIcons } from '../utils/theme/icons'

export type ThemeStudioView = 'grid' | 'dashboard' | 'chat' | 'saas' | 'landing' | 'docs' | 'portfolio' | 'changelog' | 'editor' | 'a11y'

export interface ThemeStudioViewTab {
  label: string
  icon: string
  value: ThemeStudioView
  /** One-liner for the rich switcher, template blurbs from /templates. */
  description: string
  /** /templates screenshot base path (`-light.png`/`-dark.png` appended); grid and a11y are studio-only and have none. */
  image?: string
}

const templateImage = (name: string) => `/assets/templates/nuxt/${name}`

export const THEME_STUDIO_VIEWS: ThemeStudioViewTab[] = [
  { label: 'Components', icon: 'i-lucide-layout-grid', value: 'grid', description: 'Every themed component at a glance, the component wall.' },
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', value: 'dashboard', description: 'Multi-column admin interface with multiple views.', image: templateImage('dashboard') },
  { label: 'Chat', icon: 'i-lucide-message-circle', value: 'chat', description: 'An AI chatbot with sidebar history and streaming replies.', image: templateImage('chat') },
  { label: 'SaaS', icon: 'i-lucide-rocket', value: 'saas', description: 'A SaaS home with hero, pricing and feature sections.', image: templateImage('saas') },
  { label: 'Landing', icon: 'i-lucide-panels-top-left', value: 'landing', description: 'A modern marketing landing page.', image: templateImage('landing') },
  { label: 'Docs', icon: 'i-lucide-book-open', value: 'docs', description: 'Navigation, prose, code and TOC.', image: templateImage('docs') },
  { label: 'Portfolio', icon: 'i-lucide-user-round', value: 'portfolio', description: 'A personal portfolio with work, blog and testimonials.', image: templateImage('portfolio') },
  { label: 'Changelog', icon: 'i-lucide-newspaper', value: 'changelog', description: 'Release notes with sticky intro and version timeline.', image: templateImage('changelog') },
  { label: 'Editor', icon: 'i-lucide-file-pen-line', value: 'editor', description: 'A rich text editor with toolbar, slash menu and drag handles.', image: templateImage('editor') },
  { label: 'A11y', icon: 'i-lucide-accessibility', value: 'a11y', description: 'Contrast matrix for every token pair in the theme.' }
]

/**
 * Per-pack overrides for the view-switcher glyphs, so the switcher skins to
 * the applied theme like the rest of the studio chrome. A view falls back to
 * its Lucide default (THEME_STUDIO_VIEWS) wherever the active pack has no
 * entry. Only pixelarticons is curated today; other packs keep Lucide until
 * filled in. Pixel has no rocket/panels/newspaper/accessibility glyphs, so
 * SaaS→zap, Landing→layout, Changelog→article and A11y→human stand in.
 */
const studioViewIcons: Partial<Record<ThemeIcons, Partial<Record<ThemeStudioView, string>>>> = {
  pixelarticons: {
    grid: 'i-pixelarticons-dashboard',
    dashboard: 'i-pixelarticons-dashboard',
    chat: 'i-pixelarticons-message',
    saas: 'i-pixelarticons-zap',
    landing: 'i-pixelarticons-layout',
    docs: 'i-pixelarticons-book-open',
    portfolio: 'i-pixelarticons-user',
    changelog: 'i-pixelarticons-article',
    editor: 'i-pixelarticons-edit-box',
    a11y: 'i-pixelarticons-human'
  }
}

/** The studio's preview state, shared by the page and its toolbar. */
export function useThemeStudioView() {
  const view = useState<ThemeStudioView>('theme-studio-view', () => 'grid')

  return { view, views: THEME_STUDIO_VIEWS }
}

/** The view glyphs resolved for the active icon pack (override ?? Lucide). */
export function useStudioViewIcons() {
  const { icon } = useTheme()
  return computed(() => {
    const overrides = studioViewIcons[icon.value as ThemeIcons] ?? {}
    return Object.fromEntries(
      THEME_STUDIO_VIEWS.map(tab => [tab.value, overrides[tab.value] ?? tab.icon])
    ) as Record<ThemeStudioView, string>
  })
}

/**
 * Mirrors the preview into ?view=, so a reload (or a shared link) lands on the
 * same page. Read during setup rather than on mount: the server renders the
 * requested view, and hydration has nothing to correct.
 */
export function useThemeStudioViewParam() {
  const { view, views } = useThemeStudioView()
  const route = useRoute()
  const router = useRouter()

  const requested = route.query.view
  if (typeof requested === 'string' && views.some(tab => tab.value === requested)) {
    view.value = requested as ThemeStudioView
  }

  // grid is the default, so it stays out of the URL
  watch(view, value => router.replace({ query: { ...route.query, view: value === 'grid' ? undefined : value } }))
}
