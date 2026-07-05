import type { ThemeDoc } from './types'
import { CUSTOM_PALETTES } from './custom-palettes'

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
  description: 'Hard black shadows, inked frames, zero radius, alarm red.',
  icon: 'i-lucide-zap',
  doc: {
    version: 1,
    meta: { name: 'Neo-brutalist', base: 'neo-brutalist' },
    // Reference palette (tweakcn/shadcn studio): #FF3333 primary light,
    // #FF6666 dark, yellow secondary, pure white/black surfaces.
    palettes: {
      brut: {
        shades: {
          50: '#FFECEC',
          100: '#FFD6D6',
          200: '#FFB3B3',
          300: '#FF8F8F',
          400: '#FF6666',
          500: '#FF3333',
          600: '#E61A1A',
          700: '#C21212',
          800: '#9E0E0E',
          900: '#800C0C',
          950: '#450505'
        }
      }
    },
    colors: {
      primary: 'brut',
      secondary: 'yellow',
      neutral: 'neutral'
    },
    radius: 0,
    font: { sans: 'Outfit' },
    tokens: {
      light: {
        '--ui-bg': 'white'
      },
      dark: {
        '--ui-bg': 'black'
      }
    },
    // The rest is plain configuration: outlined everything in inverted ink,
    // hard offset shadows.
    style: {
      shadow: 'hard',
      border: 'frame',
      borderColor: 'inverted'
    }
  }
}, {
  id: 'art-deco',
  name: 'Art Deco',
  description: 'Gilded amber lines on warm cream and charcoal.',
  icon: 'i-lucide-landmark',
  doc: {
    version: 1,
    meta: { name: 'Art Deco', base: 'art-deco' },
    colors: {
      primary: 'amber',
      secondary: 'yellow',
      neutral: 'stone'
    },
    radius: 0.5,
    font: { sans: 'Raleway' },
    tokens: {
      light: {
        '--ui-bg': 'var(--ui-color-primary-50)',
        '--ui-border': 'var(--ui-color-primary-200)',
        '--ui-border-accented': 'var(--ui-color-primary-300)'
      },
      dark: {
        '--ui-border': 'var(--ui-color-primary-900)',
        '--ui-border-accented': 'var(--ui-color-primary-800)'
      }
    },
    style: {
      border: 'bold',
      borderColor: 'primary'
    }
  }
}, {
  id: 'marshmallow',
  name: 'Marshmallow',
  description: 'Pastel pink softness with mauve-tinted grays.',
  icon: 'i-lucide-candy',
  doc: {
    version: 1,
    meta: { name: 'Marshmallow', base: 'marshmallow' },
    colors: {
      primary: 'pink',
      secondary: 'violet',
      neutral: 'mauve'
    },
    radius: 0.5,
    font: { sans: 'Poppins' },
    style: {
      shadow: 'soft'
    }
  }
}, {
  id: 'ghibli',
  name: 'Ghibli',
  description: 'Moss green and sun-warmed paper, gentle corners.',
  icon: 'i-lucide-leaf',
  doc: {
    version: 1,
    meta: { name: 'Ghibli', base: 'ghibli' },
    palettes: {
      moss: {
        shades: {
          50: '#F7F9EC',
          100: '#EDF2D8',
          200: '#DCE5B5',
          300: '#C6D48E',
          400: '#ADBE71',
          500: '#96A65C',
          600: '#7A894A',
          700: '#62703C',
          800: '#4C5730',
          900: '#3D4628',
          950: '#212614'
        }
      }
    },
    colors: {
      primary: 'moss',
      secondary: 'amber',
      neutral: 'stone'
    },
    radius: 0.5,
    font: { sans: 'Poppins' },
    tokens: {
      light: {
        '--ui-bg': 'var(--ui-color-secondary-100)',
        '--ui-bg-muted': 'var(--ui-color-secondary-50)',
        '--ui-border': 'var(--ui-color-secondary-300)'
      }
    },
    style: {
      shadow: 'soft'
    }
  }
}, {
  id: 'marvel',
  name: 'Marvel',
  description: 'Comic-book red and blue with inked panel outlines.',
  icon: 'i-lucide-book-open',
  doc: {
    version: 1,
    meta: { name: 'Marvel', base: 'marvel' },
    colors: {
      primary: 'red',
      secondary: 'blue',
      neutral: 'zinc'
    },
    radius: 0.125,
    font: { sans: 'Outfit' },
    style: {
      shadow: 'hard',
      shadowColor: 'black',
      border: 'frame',
      borderColor: 'black'
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
}, {
  id: 'cabin',
  name: 'Cabin',
  description: 'Cocoa and sand — a warm, woody lodge with soft buttons.',
  icon: 'i-lucide-trees',
  doc: {
    version: 1,
    meta: { name: 'Cabin', base: 'cabin' },
    // the studio's own ramps, inlined so exports are self-contained
    palettes: {
      cocoa: { shades: CUSTOM_PALETTES.cocoa! },
      sand: { shades: CUSTOM_PALETTES.sand! }
    },
    colors: {
      primary: 'cocoa',
      neutral: 'sand'
    },
    radius: 0.375,
    font: { sans: 'Raleway' },
    tokens: {
      light: {
        '--ui-bg': 'var(--ui-color-neutral-50)'
      }
    },
    style: {
      shadow: 'soft',
      defaults: { variants: { buttons: 'soft' } }
    }
  }
}, {
  id: 'harbor',
  name: 'Harbor',
  description: 'Marine blue on cool ash, bold borders, navy-tinted shadows.',
  icon: 'i-lucide-anchor',
  doc: {
    version: 1,
    meta: { name: 'Harbor', base: 'harbor' },
    palettes: {
      marine: { shades: CUSTOM_PALETTES.marine! },
      ash: { shades: CUSTOM_PALETTES.ash! }
    },
    colors: {
      primary: 'marine',
      neutral: 'ash'
    },
    radius: 0.125,
    font: { sans: 'Inter' },
    style: {
      shadow: 'soft',
      shadowColor: 'primary-shade',
      border: 'bold',
      tokenShades: { '--ui-primary': { dark: 300 } }
    }
  }
}]
