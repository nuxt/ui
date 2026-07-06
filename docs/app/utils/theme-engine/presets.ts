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
  description: 'Amber on a warm carbon neutral — everything framed in ink, dropped hard shadows.',
  icon: 'i-lucide-zap',
  doc: {
    version: 1,
    meta: { name: 'Neo-brutalist', base: 'neo-brutalist' },
    // A sculpted warm neutral running lilac-tinted paper into pure carbon.
    palettes: {
      carbon: {
        shades: {
          50: 'oklch(98.5% 0.017 447.457)',
          100: 'oklch(95.9% 0.036 438.639)',
          200: 'oklch(92.6% 0.054 428.8)',
          300: 'oklch(87% 0.053 417.734)',
          400: 'oklch(70.5% 0.032 405.184)',
          500: 'oklch(55.3% 0.014 390.836)',
          600: 'oklch(44.7% 0.001 374.343)',
          700: 'oklch(35.9% 0 0)',
          800: 'oklch(28% 0 0)',
          900: 'oklch(20.8% 0 0)',
          950: 'oklch(14.1% 0.005 285.805)'
        }
      }
    },
    colors: {
      primary: 'amber',
      secondary: 'yellow',
      neutral: 'carbon'
    },
    radius: 0.5,
    font: { sans: 'Outfit' },
    // Framed everything in near-black ink, straight-down hard shadows, soft
    // inked inputs, and both modes retuned shade-by-shade toward carbon.
    style: {
      shadow: 'hard',
      shadowGeometry: { x: 0, y: 3, blur: 0, spread: 0 },
      border: 'custom',
      frame: true,
      borderColor: 'shade',
      borderShade: { light: 900, dark: 950 },
      defaults: { variants: { buttons: 'solid', panels: 'subtle', inputs: 'subtle' } },
      tokenShades: {
        '--ui-bg': { light: 100, dark: 800 },
        '--ui-bg-muted': { light: 300 },
        '--ui-bg-elevated': { light: 300, dark: 700 },
        '--ui-bg-accented': { light: 400, dark: 600 },
        '--ui-bg-inverted': { light: 900, dark: 50 },
        '--ui-text-inverted': { light: 50 },
        '--ui-text-dimmed': { light: 500, dark: 400 },
        '--ui-text-muted': { light: 800, dark: 300 },
        '--ui-text-toned': { light: 900 },
        '--ui-text': { light: 900 },
        '--ui-text-highlighted': { light: 950, dark: 100 },
        '--ui-border': { light: 950, dark: 950 },
        '--ui-border-muted': { light: 950, dark: 950 },
        '--ui-border-accented': { light: 950, dark: 950 },
        '--ui-border-inverted': { light: 500, dark: 50 }
      }
    }
  }
}, {
  id: 'orchard',
  name: 'Orchard',
  description: 'Orange on deep sage greens — subtle surfaces, hard shadows dropped below and inset above.',
  icon: 'i-lucide-citrus',
  doc: {
    version: 1,
    meta: { name: 'Orchard', base: 'orchard' },
    // A sculpted green-tinted neutral (studio curve editor) whose light end
    // starts far below white — the whole page sits on foliage.
    palettes: {
      grove: {
        shades: {
          50: 'oklch(91% 0.044 140.516)',
          100: 'oklch(84.7% 0.045 140.375)',
          200: 'oklch(78.6% 0.046 140.572)',
          300: 'oklch(72.4% 0.046 141.493)',
          400: 'oklch(65.8% 0.045 142.245)',
          500: 'oklch(59% 0.039 142.85)',
          600: 'oklch(52.1% 0.033 143.372)',
          700: 'oklch(45.1% 0.028 143.839)',
          800: 'oklch(38.2% 0.024 144.268)',
          900: 'oklch(31.2% 0.02 144.666)',
          950: 'oklch(24.2% 0.017 145.041)'
        }
      }
    },
    colors: {
      primary: 'orange',
      neutral: 'grove'
    },
    radius: 0.5,
    font: { sans: 'DM Sans' },
    tokens: {
      light: {
        '--ui-bg': 'var(--ui-color-neutral-50)',
        '--ui-text-inverted': 'var(--ui-color-neutral-50)'
      },
      dark: {
        '--ui-text-highlighted': 'var(--ui-color-neutral-50)'
      }
    },
    // Exercises the newest axes together: straight-down hard shadow at 55%
    // paired with a bottom-lit hard INSET at 50% (drop below, light above —
    // the pressed-clay look), app-wide subtle variants, and per-mode shades
    // for the surface stack plus the success/error alias tokens.
    style: {
      shadow: 'hard',
      shadowColor: 'shade',
      shadowShade: { light: 950, dark: 950 },
      shadowOpacity: 55,
      shadowGeometry: { x: 0, y: 3, blur: 0, spread: 0 },
      innerShadow: 'hard',
      innerShadowGeometry: { x: 0, y: -3, blur: 0, spread: 0 },
      innerShadowOpacity: 50,
      innerShadowColor: 'shade',
      innerShadowShade: { light: 500, dark: 950 },
      defaults: { variant: 'subtle' },
      tokenShades: {
        '--ui-bg-muted': { light: 100 },
        '--ui-bg-elevated': { light: 200 },
        '--ui-bg-accented': { light: 300 },
        '--ui-border': { dark: 950 },
        '--ui-border-accented': { dark: 950 },
        '--ui-success': { light: 600, dark: 300 },
        '--ui-error': { light: 600, dark: 300 }
      }
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
      border: 'custom',
      frame: true,
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
  description: 'Sculpted harbor blues — subtle panels, fine borders, misty shadows.',
  icon: 'i-lucide-anchor',
  doc: {
    version: 1,
    meta: { name: 'Harbor', base: 'harbor' },
    // Deeper, moodier takes on marine/ash sculpted in the curve editor —
    // the light end starts well below white, so both modes feel overcast.
    palettes: {
      marine: {
        shades: {
          50: 'oklch(97.2% 0.014 250.593)',
          100: 'oklch(93.4% 0.033 250.984)',
          200: 'oklch(88% 0.06 251.557)',
          300: 'oklch(78.9% 0.11 252.327)',
          400: 'oklch(67% 0.151 253.303)',
          500: 'oklch(57.6% 0.143 254.468)',
          600: 'oklch(49.9% 0.123 255.734)',
          700: 'oklch(43.3% 0.1 256.821)',
          800: 'oklch(37.2% 0.078 257.093)',
          900: 'oklch(31.7% 0.057 255.71)',
          950: 'oklch(26.4% 0.036 252.434)'
        }
      },
      ash: {
        shades: {
          50: 'oklch(94% 0.029 264.505)',
          100: 'oklch(89.3% 0.044 264.423)',
          200: 'oklch(83.9% 0.042 264.302)',
          300: 'oklch(74% 0.042 264.139)',
          400: 'oklch(61.7% 0.042 263.933)',
          500: 'oklch(52.7% 0.037 263.683)',
          600: 'oklch(44.8% 0.032 263.395)',
          700: 'oklch(37.6% 0.026 263.083)',
          800: 'oklch(30.7% 0.021 262.799)',
          900: 'oklch(24.1% 0.017 262.757)',
          950: 'oklch(17.7% 0.012 270.771)'
        }
      }
    },
    colors: {
      primary: 'marine',
      neutral: 'ash'
    },
    radius: 0.125,
    font: { sans: 'Inter' },
    tokens: {
      light: {
        '--ui-bg': 'var(--ui-color-neutral-50)',
        '--ui-text-inverted': 'var(--ui-color-neutral-50)'
      },
      dark: {
        '--ui-text-highlighted': 'var(--ui-color-neutral-50)',
        '--ui-bg-inverted': 'var(--ui-color-neutral-50)',
        '--ui-border-inverted': 'var(--ui-color-neutral-50)'
      }
    },
    style: {
      shadow: 'soft',
      shadowColor: 'shade',
      shadowShade: { light: 400, dark: 950 },
      shadowOpacity: 40,
      border: 'custom',
      borderColor: 'shade',
      borderShade: { light: 200, dark: 700 },
      defaults: { variants: { panels: 'subtle' } },
      tokenShades: {
        '--ui-primary': { dark: 300 },
        '--ui-success': { light: 600, dark: 600 },
        '--ui-warning': { light: 700, dark: 700 },
        '--ui-error': { light: 700, dark: 400 }
      }
    }
  }
}]
