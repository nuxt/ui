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
          50: 'oklch(95.8% 0.021 17.519)',
          100: 'oklch(91.1% 0.046 18.029)',
          200: 'oklch(83.9% 0.089 19.107)',
          300: 'oklch(77% 0.136 20.678)',
          400: 'oklch(70.4% 0.187 23.186)',
          500: 'oklch(64.9% 0.237 26.973)',
          600: 'oklch(58.9% 0.23 28.239)',
          700: 'oklch(51.7% 0.204 28.37)',
          800: 'oklch(44.5% 0.174 28.254)',
          900: 'oklch(38.3% 0.148 27.965)',
          950: 'oklch(25.2% 0.094 27.421)'
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
          50: 'oklch(97.7% 0.017 113.81)',
          100: 'oklch(95% 0.035 115.901)',
          200: 'oklch(90.3% 0.064 116.322)',
          300: 'oklch(84.3% 0.093 117.644)',
          400: 'oklch(77.1% 0.103 119.054)',
          500: 'oklch(69.5% 0.1 119.088)',
          600: 'oklch(60.3% 0.089 120.118)',
          700: 'oklch(52% 0.077 121.459)',
          800: 'oklch(43.7% 0.061 121.818)',
          900: 'oklch(37.8% 0.049 122.375)',
          950: 'oklch(25.8% 0.032 121.343)'
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
          50: 'oklch(97.4% 0.008 48.655)',
          100: 'oklch(94.2% 0.016 52.554)',
          200: 'oklch(88.5% 0.031 51.489)',
          300: 'oklch(82.1% 0.05 50.739)',
          400: 'oklch(74.1% 0.081 47.602)',
          500: 'oklch(65.8% 0.113 39.145)',
          600: 'oklch(58.9% 0.119 37.977)',
          700: 'oklch(51.4% 0.106 37.797)',
          800: 'oklch(44.4% 0.089 37.263)',
          900: 'oklch(38.8% 0.074 36.807)',
          950: 'oklch(25.9% 0.047 38.544)'
        }
      },
      parchment: {
        shades: {
          50: 'oklch(98.2% 0.005 95.099)',
          100: 'oklch(94.8% 0.012 96.426)',
          200: 'oklch(90.6% 0.018 92.694)',
          300: 'oklch(84.2% 0.027 92.429)',
          400: 'oklch(73.2% 0.03 91.711)',
          500: 'oklch(62.1% 0.031 88.804)',
          600: 'oklch(52.9% 0.028 89.296)',
          700: 'oklch(45.5% 0.023 87.57)',
          800: 'oklch(37.3% 0.021 88.083)',
          900: 'oklch(31% 0.011 84.589)',
          950: 'oklch(21.7% 0.01 97.797)'
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
          50: 'oklch(97.3% 0.023 157.606)',
          100: 'oklch(93.7% 0.051 157.559)',
          200: 'oklch(88% 0.096 156.74)',
          300: 'oklch(81.5% 0.14 155.469)',
          400: 'oklch(75% 0.172 152.412)',
          500: 'oklch(68.9% 0.187 148.921)',
          600: 'oklch(60.7% 0.165 149.023)',
          700: 'oklch(52.9% 0.141 149.561)',
          800: 'oklch(44.9% 0.115 150.596)',
          900: 'oklch(38.7% 0.095 151.748)',
          950: 'oklch(25.6% 0.058 153.065)'
        }
      },
      ink: {
        shades: {
          50: 'oklch(97.9% 0 0)',
          100: 'oklch(95.2% 0 0)',
          200: 'oklch(90.1% 0 0)',
          300: 'oklch(76.7% 0 0)',
          400: 'oklch(65% 0 0)',
          500: 'oklch(53.8% 0 0)',
          600: 'oklch(44.2% 0 0)',
          700: 'oklch(37.1% 0 0)',
          800: 'oklch(28.5% 0 0)',
          900: 'oklch(20.9% 0 0)',
          950: 'oklch(18.2% 0 0)'
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
