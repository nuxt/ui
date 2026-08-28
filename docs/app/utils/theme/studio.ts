import type { InjectionKey } from 'vue'
import colors from 'tailwindcss/colors'
import { resolveAlias, resolveShade, contrastRatio } from './engine'
import type { ThemeDoc, Shade } from './engine'

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

/* ------------------------------------------------------------- sections -- */

/** How deep a ThemeStudioSection sits, which decides how it behaves. */
export const SECTION_DEPTH: InjectionKey<number> = Symbol('theme-studio-section-depth')

/**
 * A preset's primary ramp as a round swatch carrying its brand mark. The chip
 * below paints the page (neutral) and inks the icon in primary; a circle small
 * enough to read at a glance has to do the opposite, so the ramp fills it and
 * the mark sits on top.
 */
export function themeSwatchStyle(doc: ThemeDoc) {
  const shade = (alias: 'primary' | 'neutral', step: Shade) => resolveShade(doc, resolveAlias(doc, alias), step)
  // black-as-primary has no ramp to gradient across, take the neutral ends
  if (doc.blackAsPrimary) {
    return {
      '--swatch-light': `linear-gradient(135deg, ${shade('neutral', 700)}, ${shade('neutral', 950)})`,
      '--swatch-dark': `linear-gradient(135deg, ${shade('neutral', 100)}, ${shade('neutral', 400)})`,
      '--swatch-ink-light': 'white',
      '--swatch-ink-dark': 'black'
    }
  }
  // 300 → 600 rather than a tighter band: two neighbouring stops of one hue
  // read as a flat fill, the range is what makes it a gradient.
  const gradient = `linear-gradient(135deg, ${shade('primary', 300)}, ${shade('primary', 600)})`
  // The mark sits over the gradient's midpoint. Every shipped preset's mid is
  // light enough to take black, but a genuinely dark primary (navy, deep
  // plum) would swallow it, so measure rather than hardcode.
  // 500 as the reference: it always exists (tailwind ramps have no in-between
  // stops) and sits at the darker end of the range, so it errs safe.
  const base = shade('primary', 500)
  const ink = !base || (contrastRatio(base, 'black') ?? 0) >= (contrastRatio(base, 'white') ?? 0) ? 'black' : 'white'
  // A brand colour is the same colour in both modes, only the near-black
  // ramp above has to flip to stay visible against the surface.
  return {
    '--swatch-light': gradient,
    '--swatch-dark': gradient,
    '--swatch-ink-light': ink,
    '--swatch-ink-dark': ink
  }
}

/** A preset's own ramp as a chip: its neutral as the page, its icon in its primary. */
export function themeChipStyle(doc: ThemeDoc) {
  const shade = (alias: 'primary' | 'neutral', step: Shade) => resolveShade(doc, resolveAlias(doc, alias), step)
  return {
    '--chip-bg-light': `linear-gradient(135deg, ${shade('neutral', 50)}, ${shade('neutral', 200)})`,
    '--chip-bg-dark': `linear-gradient(135deg, ${shade('neutral', 900)}, ${shade('neutral', 800)})`,
    '--chip-icon-light': doc.blackAsPrimary ? 'black' : shade('primary', 500),
    '--chip-icon-dark': doc.blackAsPrimary ? 'white' : shade('primary', 400)
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
