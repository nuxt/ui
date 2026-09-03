import colors from 'tailwindcss/colors'
import { resolveAlias, resolveShade } from './engine/types'
import type { ThemeDoc, Shade } from './engine/types'

/* ------------------------------------------------------------- choices -- */

// What the pickers offer. Static, so it lives here rather than in the
// composables that hand it out.

// taupe/mauve/mist/olive ship in tailwind's theme.css but not (yet) the
// tailwindcss/colors JS export, swatches resolve them from CSS variables
export const NEUTRAL_COLORS = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'taupe', 'mauve', 'mist', 'olive']
const NOT_A_RAMP = ['inherit', 'current', 'transparent', 'black', 'white', ...NEUTRAL_COLORS]
export const PRIMARY_COLORS = Object.keys(colors).filter(name => !NOT_A_RAMP.includes(name))

export const RADIUSES = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75]

/** The three groups every font select offers. */
export type FontCategory = 'Sans' | 'Serif' | 'Mono'

/**
 * The shortlist every font select opens on, grouped by what the face is
 * rather than by which slot it is for: the three stacks are independent, so
 * nothing should stop a mono heading. Any other family is still reachable
 * through the catalog search.
 */
export const FONTS: Array<{ name: string, category: FontCategory }> = [
  { name: 'Public Sans', category: 'Sans' },
  { name: 'Inter', category: 'Sans' },
  { name: 'DM Sans', category: 'Sans' },
  { name: 'Geist', category: 'Sans' },
  { name: 'Outfit', category: 'Sans' },
  { name: 'Poppins', category: 'Sans' },
  { name: 'Raleway', category: 'Sans' },
  { name: 'Roboto', category: 'Sans' },
  { name: 'Figtree', category: 'Sans' },
  { name: 'Nunito', category: 'Sans' },
  { name: 'Manrope', category: 'Sans' },
  { name: 'Plus Jakarta Sans', category: 'Sans' },
  { name: 'Bricolage Grotesque', category: 'Sans' },
  { name: 'Comic Neue', category: 'Sans' },
  { name: 'Source Serif 4', category: 'Serif' },
  { name: 'Lora', category: 'Serif' },
  { name: 'Playfair Display', category: 'Serif' },
  { name: 'Merriweather', category: 'Serif' },
  { name: 'Instrument Serif', category: 'Serif' },
  { name: 'Geist Mono', category: 'Mono' },
  { name: 'JetBrains Mono', category: 'Mono' },
  { name: 'Fira Code', category: 'Mono' },
  { name: 'IBM Plex Mono', category: 'Mono' },
  { name: 'Space Mono', category: 'Mono' }
]

/**
 * A palette name as its `--color-*` prefix. Tailwind's own `neutral` ramp
 * ships in the docs as `old-neutral`, the module's neutral alias having
 * taken the name.
 */
export function rampCssName(name: string) {
  return name === 'neutral' ? 'old-neutral' : name
}

/* --------------------------------------------------------------- views -- */

export type ThemeStudioView = 'grid' | 'dashboard' | 'chat' | 'saas' | 'landing' | 'docs' | 'portfolio' | 'changelog' | 'editor' | 'a11y'

export interface ThemeStudioViewTab {
  label: string
  value: ThemeStudioView
  /** One-liner for the rich switcher, template blurbs from /templates. */
  description: string
  /** /templates screenshot base path (`-light.png`/`-dark.png` appended); grid and a11y are studio-only and have none. */
  image?: string
}

const templateImage = (name: string) => `/assets/templates/nuxt/${name}`

export const THEME_STUDIO_VIEWS: ThemeStudioViewTab[] = [
  { label: 'Components', value: 'grid', description: 'Every themed component at a glance, the component wall.' },
  { label: 'Dashboard', value: 'dashboard', description: 'Multi-column admin interface with multiple views.', image: templateImage('dashboard') },
  { label: 'Chat', value: 'chat', description: 'An AI chatbot with sidebar history and streaming replies.', image: templateImage('chat') },
  { label: 'SaaS', value: 'saas', description: 'A SaaS home with hero, pricing and feature sections.', image: templateImage('saas') },
  { label: 'Landing', value: 'landing', description: 'A modern marketing landing page.', image: templateImage('landing') },
  { label: 'Docs', value: 'docs', description: 'Navigation, prose, code and TOC.', image: templateImage('docs') },
  { label: 'Portfolio', value: 'portfolio', description: 'A personal portfolio with work, blog and testimonials.', image: templateImage('portfolio') },
  { label: 'Changelog', value: 'changelog', description: 'Release notes with sticky intro and version timeline.', image: templateImage('changelog') },
  { label: 'Editor', value: 'editor', description: 'A rich text editor with toolbar, slash menu and drag handles.', image: templateImage('editor') },
  { label: 'A11y', value: 'a11y', description: 'Contrast matrix for every token pair in the theme.' }
]

/* ------------------------------------------------------------- sections -- */

/**
 * Each preset's glyph, keyed by id. Kept apart from the presets table so the
 * header trigger can show the applied preset without pulling the preset docs
 * into its chunk.
 */
export const PRESET_ICONS: Record<string, string> = {
  'nuxt-ui': 'i-simple-icons-nuxt',
  'mono': 'i-lucide-contrast',
  'cobalt': 'i-lucide-gem',
  'sky': 'i-lucide-cloud-sun',
  'mint': 'i-lucide-leaf',
  'iris': 'i-lucide-flower',
  'crimson': 'i-lucide-clapperboard',
  'coral': 'i-lucide-shell',
  'sunset': 'i-lucide-sunset',
  'carbon': 'i-lucide-zap',
  'bubblegum': 'i-lucide-candy',
  'parchment': 'i-lucide-scroll-text'
}

/**
 * A preset as a chip: its icon in its primary, on that primary dimmed to a
 * tint (the `bg-primary/10` of the subtle variants), so every preset reads
 * as its color rather than as its neutral.
 */
export function themeChipStyle(doc: ThemeDoc) {
  const shade = (step: Shade) => resolveShade(doc, resolveAlias(doc, 'primary'), step)
  const light = doc.blackAsPrimary ? 'black' : shade(500)
  const dark = doc.blackAsPrimary ? 'white' : shade(400)
  const tint = (color: string | undefined, from: number, to: number) =>
    `linear-gradient(135deg, color-mix(in oklab, ${color} ${from}%, transparent), color-mix(in oklab, ${color} ${to}%, transparent))`

  return {
    '--chip-bg-light': tint(light, 10, 20),
    '--chip-bg-dark': tint(dark, 12, 24),
    '--chip-icon-light': light,
    '--chip-icon-dark': dark
  }
}

/** Palette names are ids, hyphens are word breaks, not part of the name. */
export function paletteLabel(name: string): string {
  return name.replace(/-/g, ' ')
}

/**
 * interact-outside handler: clicks on studio chrome marked data-keep-panels
 * (the color-mode switch) must not dismiss an open panel.
 */
export function keepPanels(event: Event) {
  if ((event.target as HTMLElement | null)?.closest?.('[data-keep-panels]')) {
    event.preventDefault()
  }
}

/**
 * One footprint for every toolbar popover: the header picker's w-62 on the
 * bar, the trigger's own width when stacked in the mobile menu. Scroll lives
 * on the popover content so panels and listboxes cap the same way.
 */
export function toolbarPanelClass(vertical?: boolean): string[] {
  return [vertical ? 'w-(--reka-popper-anchor-width)' : 'w-64 max-w-[calc(100vw-2rem)]', 'max-h-[70vh] overflow-y-auto']
}

/** Tailwind's stock weight ladder, set steps are absences at these values. */
export const FONT_WEIGHT_DEFAULTS = { normal: 400, medium: 500, semibold: 600, bold: 700 } as const

// Families whose preview faces are already requested, Public Sans is
// bundled. Module-level so the controls, the preset menu and every search
// batch share one ledger and no family is fetched twice.
const loadedFontPreviews = new Set<string>(['Public Sans'])

/**
 * Load the listed families (Google Fonts, 400/700 only) so pickers can
 * render themselves in the faces they offer. Incremental: each call adds
 * one stylesheet covering only the families not yet requested, the font
 * search feeds result batches through here as the user types.
 */
export function loadFontPreviews(fonts: readonly string[]) {
  if (!import.meta.client) return
  const families = fonts.filter(name => !loadedFontPreviews.has(name))
  if (!families.length) return
  families.forEach(name => loadedFontPreviews.add(name))
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${families.map(name => `family=${encodeURIComponent(name)}:wght@400;700`).join('&')}&display=swap`
  document.head.appendChild(link)
}
