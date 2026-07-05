import type { ThemeDoc } from './types'

export interface ThemePreset {
  id: string
  name: string
  description: string
  icon: string
  doc: ThemeDoc
}

/**
 * Presets are plain ThemeDocs: applying one replaces the current document.
 * Each deliberately exercises a different engine capability, so they double
 * as living tests of the schema.
 */
export const presets: ThemePreset[] = [{
  id: 'nuxt-ui',
  name: 'Nuxt UI',
  description: 'The stock theme — everything inherited.',
  icon: 'i-simple-icons-nuxt',
  doc: {
    version: 1,
    meta: { name: 'Nuxt UI' }
  }
}, {
  id: 'shadcn',
  name: 'Shadcn',
  description: 'Black on zinc, generous radius, quiet surfaces.',
  icon: 'i-simple-icons-shadcnui',
  doc: {
    version: 1,
    meta: { name: 'Shadcn', base: 'shadcn' },
    blackAsPrimary: true,
    colors: {
      neutral: 'zinc'
    },
    radius: 0.5,
    font: { sans: 'Geist' },
    tokens: {
      dark: {
        '--ui-bg': 'var(--ui-color-neutral-950)',
        '--ui-bg-muted': 'var(--ui-color-neutral-900)',
        '--ui-bg-elevated': 'var(--ui-color-neutral-900)'
      }
    }
  }
}, {
  id: 'neo-brutalist',
  name: 'Neo-brutalist',
  description: 'Hard offset shadows, bold borders, zero radius, loud yellow.',
  icon: 'i-lucide-zap',
  doc: {
    version: 1,
    meta: { name: 'Neo-brutalist', base: 'neo-brutalist' },
    colors: {
      primary: 'yellow',
      neutral: 'neutral'
    },
    radius: 0,
    font: { sans: 'Outfit' },
    style: {
      shadow: 'hard',
      border: 'bold'
    },
    tokens: {
      light: {
        '--ui-border': 'var(--ui-color-neutral-900)',
        '--ui-border-accented': 'var(--ui-color-neutral-900)'
      },
      dark: {
        '--ui-border': 'var(--ui-color-neutral-100)',
        '--ui-border-accented': 'var(--ui-color-neutral-100)'
      }
    },
    // The uniform outlined look is this preset's identity, not the generic
    // bold control's: solid/outline/subtle buttons and badges get the frame
    // (ghost and link stay borderless, as in the reference neobrutalism kits).
    components: {
      button: {
        compoundVariants: [
          { variant: 'solid', class: 'ring-2 ring-inset ring-(--ui-border-accented)' },
          { variant: 'outline', class: 'ring-2 ring-inset ring-(--ui-border-accented)' },
          { variant: 'subtle', class: 'ring-2 ring-inset ring-(--ui-border-accented)' },
          { variant: 'soft', class: 'ring-2 ring-inset ring-(--ui-border-accented)' }
        ]
      },
      badge: {
        compoundVariants: [
          { variant: 'solid', class: 'ring-2 ring-inset ring-(--ui-border-accented)' },
          { variant: 'outline', class: 'ring-2 ring-inset ring-(--ui-border-accented)' },
          { variant: 'subtle', class: 'ring-2 ring-inset ring-(--ui-border-accented)' },
          { variant: 'soft', class: 'ring-2 ring-inset ring-(--ui-border-accented)' }
        ]
      },
      alert: {
        compoundVariants: [
          { variant: 'solid', class: { root: 'ring-2 ring-inset ring-(--ui-border-accented)' } },
          { variant: 'outline', class: { root: 'ring-2 ring-inset ring-(--ui-border-accented)' } },
          { variant: 'subtle', class: { root: 'ring-2 ring-inset ring-(--ui-border-accented)' } },
          { variant: 'soft', class: { root: 'ring-2 ring-inset ring-(--ui-border-accented)' } }
        ]
      },
      card: {
        slots: { root: 'ring-2 ring-(--ui-border-accented)' }
      },
      input: {
        slots: { base: 'ring-2 ring-inset ring-(--ui-border-accented)' }
      },
      select: {
        slots: { base: 'ring-2 ring-inset ring-(--ui-border-accented)' }
      },
      textarea: {
        slots: { base: 'ring-2 ring-inset ring-(--ui-border-accented)' }
      }
    }
  }
}, {
  id: 'anthropic',
  name: 'Anthropic',
  description: 'Warm parchment neutrals with a book-cloth clay primary.',
  icon: 'i-simple-icons-anthropic',
  doc: {
    version: 1,
    meta: { name: 'Anthropic', base: 'anthropic' },
    palettes: {
      clay: {
        shades: {
          50: '#FBF5F2',
          100: '#F5E9E2',
          200: '#EBD4C7',
          300: '#E0BCA8',
          400: '#D69C7F',
          500: '#CC785C',
          600: '#B86146',
          700: '#9A4F38',
          800: '#7D402E',
          900: '#663527',
          950: '#371B12'
        }
      },
      parchment: {
        shades: {
          50: '#FAF9F5',
          100: '#F0EEE5',
          200: '#E4E0D3',
          300: '#D1CBB8',
          400: '#AFA893',
          500: '#8E8672',
          600: '#726B59',
          700: '#5C5648',
          800: '#454034',
          900: '#33302A',
          950: '#1B1A15'
        }
      }
    },
    colors: {
      primary: 'clay',
      neutral: 'parchment'
    },
    radius: 0.375,
    font: { sans: 'DM Sans' },
    tokens: {
      light: {
        '--ui-bg': 'var(--ui-color-neutral-50)'
      },
      dark: {
        '--ui-bg': 'var(--ui-color-neutral-950)'
      }
    }
  }
}, {
  id: 'spotify',
  name: 'Spotify',
  description: 'Dark-first ink surfaces, signal green, pill buttons.',
  icon: 'i-simple-icons-spotify',
  doc: {
    version: 1,
    meta: { name: 'Spotify', base: 'spotify' },
    palettes: {
      signal: {
        shades: {
          50: '#EAFBF0',
          100: '#CFF5DD',
          200: '#A2EBBE',
          300: '#6EDD9B',
          400: '#3ECC76',
          500: '#1DB954',
          600: '#169C46',
          700: '#12813B',
          800: '#106631',
          900: '#0D5229',
          950: '#062B15'
        }
      },
      ink: {
        shades: {
          50: '#F8F8F8',
          100: '#EFEFEF',
          200: '#DEDEDE',
          300: '#B3B3B3',
          400: '#8F8F8F',
          500: '#6E6E6E',
          600: '#535353',
          700: '#404040',
          800: '#2A2A2A',
          900: '#181818',
          950: '#121212'
        }
      }
    },
    colors: {
      primary: 'signal',
      neutral: 'ink'
    },
    radius: 0.5,
    font: { sans: 'DM Sans' },
    tokens: {
      dark: {
        '--ui-bg': 'var(--ui-color-neutral-950)',
        '--ui-bg-muted': 'var(--ui-color-neutral-900)',
        '--ui-bg-elevated': 'var(--ui-color-neutral-800)',
        '--ui-border': 'var(--ui-color-neutral-800)'
      }
    },
    components: {
      button: {
        slots: {
          base: 'rounded-full'
        }
      }
    }
  }
}]
