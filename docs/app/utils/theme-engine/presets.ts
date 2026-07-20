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
    version: 1
  }
}, {
  id: 'shadcn',
  name: 'Shadcn',
  description: 'Black on zinc, generous radius, quiet surfaces.',
  icon: 'i-simple-icons-shadcnui',
  doc: {
    version: 1,
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
    icons: 'tabler',
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
        '--ui-bg': { light: 50, dark: 800 },
        '--ui-bg-muted': { light: 300, dark: 700 },
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
    // A sculpted green-tinted neutral (studio curve editor) whose light end
    // starts far below white — the whole page sits on foliage.
    palettes: {
      grove: {
        shades: {
          50: 'oklch(91% 0.036 140.516)',
          100: 'oklch(84.9% 0.042 140.374)',
          200: 'oklch(78.6% 0.048 140.574)',
          300: 'oklch(72.3% 0.053 141.491)',
          400: 'oklch(65.8% 0.057 142.244)',
          500: 'oklch(59.1% 0.051 142.85)',
          600: 'oklch(52.2% 0.042 143.373)',
          700: 'oklch(45.2% 0.034 143.84)',
          800: 'oklch(38.1% 0.028 144.268)',
          900: 'oklch(31.1% 0.022 144.667)',
          950: 'oklch(24.2% 0.017 145.041)'
        }
      }
    },
    colors: {
      primary: 'orange',
      neutral: 'grove'
    },
    font: { sans: 'DM Sans' },
    icons: 'remix',
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
      shadowShade: { light: 200, dark: 950 },
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
    // A sculpted pink-mauve neutral (chroma peaks mid-ramp) instead of the
    // stock mauve.
    palettes: {
      'custom-neutral': {
        shades: {
          50: 'oklch(96.1% 0.021 325.68)',
          100: 'oklch(92.4% 0.039 325.829)',
          200: 'oklch(88% 0.057 325.83)',
          300: 'oklch(81.2% 0.073 325.398)',
          400: 'oklch(66.1% 0.084 323.292)',
          500: 'oklch(52.4% 0.079 322.443)',
          600: 'oklch(42.7% 0.064 322.128)',
          700: 'oklch(34.6% 0.048 322.004)',
          800: 'oklch(27.4% 0.034 321.983)',
          900: 'oklch(20.7% 0.02 322.028)',
          950: 'oklch(14.5% 0.008 322.12)'
        }
      }
    },
    colors: {
      primary: 'pink',
      secondary: 'violet',
      neutral: 'custom-neutral'
    },
    radius: 0.375,
    font: { sans: 'Poppins' },
    icons: 'phosphor',
    tokens: {
      light: {
        '--ui-bg': 'var(--ui-color-neutral-50)',
        '--ui-text-inverted': 'var(--ui-color-neutral-50)',
        '--ui-bg-muted': 'var(--ui-color-neutral-100)'
      },
      dark: {
        '--ui-bg-inverted': 'var(--ui-color-neutral-50)',
        '--ui-text-highlighted': 'var(--ui-color-neutral-50)',
        '--ui-border-inverted': 'var(--ui-color-neutral-50)'
      }
    },
    // Soft pink-cast shadows (primary 700 light / 950 dark at 15%) over a
    // top-lit blurred inset in its own lighter shade (500 light / 900 dark).
    style: {
      shadow: 'soft',
      shadowOpacity: 15,
      innerShadow: 'hard',
      innerShadowGeometry: {
        x: 0,
        y: -4,
        blur: 4,
        spread: 0
      },
      shadowColor: 'primary-shade',
      shadowShade: {
        light: 700,
        dark: 950
      },
      innerShadowColor: 'primary-shade',
      innerShadowShade: {
        light: 500,
        dark: 900
      }
    }
  }
}, {
  id: 'comicbook',
  name: 'Comicbook',
  description: 'Comic-book red and blue with inked panel outlines.',
  icon: 'i-lucide-book-open',
  doc: {
    version: 1,
    // A cool-violet sculpted neutral for the panel grays.
    palettes: {
      'custom-neutral': {
        shades: {
          50: 'oklch(97.3% 0.013 286.067)',
          100: 'oklch(91.3% 0.023 286.073)',
          200: 'oklch(84% 0.028 286.076)',
          300: 'oklch(72.5% 0.032 286.073)',
          400: 'oklch(60.1% 0.034 286.058)',
          500: 'oklch(50.6% 0.033 285.932)',
          600: 'oklch(42.3% 0.028 285.808)',
          700: 'oklch(34.8% 0.021 285.795)',
          800: 'oklch(27.6% 0.015 285.794)',
          900: 'oklch(20.8% 0.01 285.798)',
          950: 'oklch(14.1% 0.005 285.805)'
        }
      }
    },
    colors: {
      primary: 'red',
      neutral: 'custom-neutral'
    },
    radius: 0.125,
    // One flat 600 across every weight step — comic lettering has a single
    // stroke width, and Comic Neue's 400 reads too thin for the look.
    font: { sans: 'Comic Neue', weights: { normal: 600, medium: 600, semibold: 600, bold: 600 } },
    icons: 'pixelarticons',
    // Inked page: near-black default AND accented borders over muted panel
    // edges, deep red at 600 in light, flat 50s inversions in dark.
    tokens: {
      light: {
        '--ui-primary': 'var(--ui-color-primary-600)',
        '--ui-bg': 'var(--ui-color-neutral-50)',
        '--ui-bg-muted': 'var(--ui-color-neutral-100)',
        '--ui-bg-elevated': 'var(--ui-color-neutral-200)',
        '--ui-text-inverted': 'var(--ui-color-neutral-50)',
        '--ui-border': 'var(--ui-color-neutral-950)',
        '--ui-border-muted': 'var(--ui-color-neutral-300)',
        '--ui-border-accented': 'var(--ui-color-neutral-950)'
      },
      dark: {
        '--ui-primary': 'var(--ui-color-primary-500)',
        '--ui-bg-inverted': 'var(--ui-color-neutral-50)',
        '--ui-text-highlighted': 'var(--ui-color-neutral-50)',
        '--ui-border': 'var(--ui-color-neutral-950)',
        '--ui-border-accented': 'var(--ui-color-neutral-950)',
        '--ui-border-inverted': 'var(--ui-color-neutral-50)'
      }
    },
    style: {
      shadow: 'hard',
      shadowColor: 'black',
      border: 'custom',
      frame: true,
      borderColor: 'black',
      defaults: { variants: { panels: 'subtle' } }
    }
  }
}, {
  id: 'anthropic',
  name: 'Anthropic',
  description: 'Warm parchment neutrals with a book-cloth clay primary.',
  icon: 'i-simple-icons-anthropic',
  doc: {
    version: 1,
    palettes: {
      // Anchored on the real brand clay — hsl(14.8 63.1% 59.6%) — at 500,
      // with the ramp's hue and chroma re-fit around it.
      clay: {
        shades: {
          50: 'oklch(97.4% 0.009 48.308)',
          100: 'oklch(94.2% 0.019 52.207)',
          200: 'oklch(88.5% 0.036 51.142)',
          300: 'oklch(82.1% 0.058 50.392)',
          400: 'oklch(74.1% 0.094 47.255)',
          500: 'oklch(67.2% 0.131 38.798)',
          600: 'oklch(58.9% 0.138 37.63)',
          700: 'oklch(51.4% 0.123 37.45)',
          800: 'oklch(44.4% 0.103 36.916)',
          900: 'oklch(38.8% 0.086 36.46)',
          950: 'oklch(25.9% 0.054 38.197)'
        }
      },
      // The real warm-gray scale (their --_gray-* HSL stops mapped onto the
      // tailwind ladder: 20/40/70/150/300/450/600/650/750/830/900), so the
      // 50 IS the signature cream background.
      parchment: {
        shades: {
          50: 'oklch(98% 0.003 106.451)',
          100: 'oklch(96.5% 0.004 106.469)',
          200: 'oklch(93.6% 0.006 97.348)',
          300: 'oklch(85.8% 0.014 102.476)',
          400: 'oklch(72.1% 0.015 102.54)',
          500: 'oklch(57.8% 0.008 88.877)',
          600: 'oklch(43.2% 0.006 91.526)',
          700: 'oklch(38.2% 0.003 84.572)',
          800: 'oklch(29.3% 0.003 106.588)',
          900: 'oklch(21.7% 0.002 106.561)',
          950: 'oklch(14.6% 0 0)'
        }
      }
    },
    colors: {
      primary: 'clay',
      neutral: 'parchment'
    },
    radius: 0.375,
    font: { sans: 'DM Sans', heading: { font: 'Source Serif 4', weight: 400 } },
    icons: 'heroicons',
    // Deep cream page over ivory surfaces in light, with the border family
    // stepped one deeper to hold on the tinted page; one flat 800 surface
    // family in dark, with the brand clay held at 500.
    tokens: {
      light: {
        '--ui-bg': 'var(--ui-color-neutral-200)',
        '--ui-bg-elevated': 'var(--ui-color-neutral-50)',
        '--ui-bg-accented': 'var(--ui-color-neutral-300)',
        '--ui-border': 'var(--ui-color-neutral-300)',
        '--ui-border-accented': 'var(--ui-color-neutral-400)'
      },
      dark: {
        '--ui-primary': 'var(--ui-color-primary-500)',
        '--ui-bg-accented': 'var(--ui-color-neutral-800)'
      }
    },
    // Blurred warm-gray drop shadows (500 light / 950 dark at 25%) with
    // subtle panels.
    style: {
      shadow: 'hard',
      shadowGeometry: {
        x: 0,
        y: 2,
        blur: 9,
        spread: 0
      },
      shadowOpacity: 25,
      shadowColor: 'shade',
      shadowShade: {
        light: 500,
        dark: 950
      },
      defaults: { variants: { panels: 'subtle' } }
    }
  }
}, {
  id: 'spotify',
  name: 'Spotify',
  description: 'Dark-first ink surfaces, signal green, pill buttons.',
  icon: 'i-simple-icons-spotify',
  doc: {
    version: 1,
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
    icons: 'material',
    tokens: {
      dark: {
        '--ui-bg': 'var(--ui-color-neutral-950)',
        '--ui-bg-muted': 'var(--ui-color-neutral-900)'
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
  id: 'bootstrap',
  name: 'Bootstrap',
  description: 'The Bootstrap 5 look — its blue, its grays, .375rem corners, flat bordered surfaces.',
  icon: 'i-simple-icons-bootstrap',
  doc: {
    version: 1,
    // The real 5.3 scales: 100–400 are tint-color() (mix with white at
    // 80/60/40/20%), 600–900 are shade-color() (mix with black), extended
    // to 50/950 with the same math. Prefixed names: palettes named plainly
    // 'blue'/'gray' would override the tailwind ramps of the same name
    // across the whole app while the preset is active.
    palettes: {
      'bs-blue': {
        shades: {
          50: 'oklch(95.3% 0.022 260.723)',
          100: 'oklch(90.8% 0.045 258.763)',
          200: 'oklch(81.6% 0.091 257.776)',
          300: 'oklch(72.9% 0.14 258.068)',
          400: 'oklch(64.7% 0.186 258.256)',
          500: 'oklch(57.8% 0.228 260.025)',
          600: 'oklch(49.2% 0.19 259.799)',
          700: 'oklch(40.2% 0.152 259.656)',
          800: 'oklch(30.7% 0.109 258.934)',
          900: 'oklch(20.4% 0.063 257.52)',
          950: 'oklch(14.7% 0.037 249.929)'
        }
      },
      // $gray-100…$gray-900 verbatim, with 50/950 extrapolated.
      'bs-gray': {
        shades: {
          50: 'oklch(99.1% 0 0)',
          100: 'oklch(98.2% 0.002 247.839)',
          200: 'oklch(94.2% 0.005 247.879)',
          300: 'oklch(91.1% 0.007 247.901)',
          400: 'oklch(86.7% 0.011 247.949)',
          500: 'oklch(76.9% 0.015 248.017)',
          600: 'oklch(55.8% 0.016 244.893)',
          700: 'oklch(42.8% 0.015 248.172)',
          800: 'oklch(34.5% 0.013 248.212)',
          900: 'oklch(26.2% 0.009 248.19)',
          950: 'oklch(20.7% 0.008 248.192)'
        }
      },
      'bs-green': {
        shades: {
          50: 'oklch(95.5% 0.013 167.173)',
          100: 'oklch(90.9% 0.027 166.725)',
          200: 'oklch(81.7% 0.054 165.592)',
          300: 'oklch(72.6% 0.082 163.174)',
          400: 'oklch(63.7% 0.106 160.921)',
          500: 'oklch(55.2% 0.123 157.012)',
          600: 'oklch(47.1% 0.104 157.226)',
          700: 'oklch(38.6% 0.083 157.541)',
          800: 'oklch(29.7% 0.06 159.192)',
          900: 'oklch(20% 0.035 161.761)',
          950: 'oklch(14.4% 0.023 167.139)'
        }
      },
      'bs-red': {
        shades: {
          50: 'oklch(95.4% 0.019 13.379)',
          100: 'oklch(90.7% 0.037 11.626)',
          200: 'oklch(81.5% 0.079 12.026)',
          300: 'oklch(73% 0.123 14.804)',
          400: 'oklch(65.2% 0.167 17.173)',
          500: 'oklch(59.2% 0.202 21.239)',
          600: 'oklch(50.2% 0.17 20.933)',
          700: 'oklch(41% 0.134 20.765)',
          800: 'oklch(31.2% 0.097 19.17)',
          900: 'oklch(20.7% 0.055 17.828)',
          950: 'oklch(14.7% 0.033 12.672)'
        }
      },
      'bs-yellow': {
        shades: {
          50: 'oklch(98.2% 0.026 92.389)',
          100: 'oklch(96.4% 0.051 92.554)',
          200: 'oklch(92.9% 0.097 91.534)',
          300: 'oklch(89.8% 0.137 91.178)',
          400: 'oklch(86.9% 0.162 88.789)',
          500: 'oklch(84.4% 0.172 84.934)',
          600: 'oklch(71.4% 0.145 85.028)',
          700: 'oklch(58% 0.118 86.024)',
          800: 'oklch(43.5% 0.088 86.646)',
          900: 'oklch(27.9% 0.056 90.569)',
          950: 'oklch(18.9% 0.036 93.534)'
        }
      },
      'bs-cyan': {
        shades: {
          50: 'oklch(97.2% 0.021 211.758)',
          100: 'oklch(94.3% 0.04 212.228)',
          200: 'oklch(89.3% 0.077 211.321)',
          300: 'oklch(84.6% 0.107 212.793)',
          400: 'oklch(80.8% 0.129 214.292)',
          500: 'oklch(77.5% 0.138 218.055)',
          600: 'oklch(65.8% 0.116 217.451)',
          700: 'oklch(53.2% 0.094 217.564)',
          800: 'oklch(40.1% 0.07 216.209)',
          900: 'oklch(25.6% 0.043 215.657)',
          950: 'oklch(17.6% 0.029 211.647)'
        }
      }
    },
    // $primary/$secondary/$success/$info/$warning/$danger — secondary is
    // literally $gray-600, so the gray ramp serves both roles.
    colors: {
      primary: 'bs-blue',
      secondary: 'bs-gray',
      success: 'bs-green',
      info: 'bs-cyan',
      warning: 'bs-yellow',
      error: 'bs-red',
      neutral: 'bs-gray'
    },
    radius: 0.125,
    // Bootstrap ships the platform's own face (system-ui stack); Roboto is
    // the stack's named Android fallback and the closest loadable stand-in.
    font: { sans: 'Roboto', heading: { weight: 500 } },
    icons: 'bootstrap',
    // Light rides the gray ramp one step deeper than stock (page on gray-100,
    // surfaces stepped 200/300) with a single strong border family.
    tokens: {
      light: {
        '--ui-secondary': 'var(--ui-color-secondary-600)',
        '--ui-bg-muted': 'var(--ui-color-neutral-200)',
        '--ui-text': 'var(--ui-color-neutral-800)',
        '--ui-border': 'var(--ui-color-neutral-400)',
        '--ui-border-muted': 'var(--ui-color-neutral-300)',
        '--ui-bg': 'var(--ui-color-neutral-100)',
        '--ui-text-toned': 'var(--ui-color-neutral-700)',
        '--ui-text-muted': 'var(--ui-color-neutral-600)',
        '--ui-text-dimmed': 'var(--ui-color-neutral-600)',
        '--ui-bg-elevated': 'var(--ui-color-neutral-200)',
        '--ui-bg-accented': 'var(--ui-color-neutral-300)'
      },
      // Dark mode keeps the very same brand colors (--bs-primary stays
      // #0d6efd); $body-color-dark: $gray-300. The library's own dark
      // defaults already land on the right gray stops for bg and borders.
      dark: {
        '--ui-primary': 'var(--ui-color-primary-500)',
        '--ui-secondary': 'var(--ui-color-secondary-500)',
        '--ui-success': 'var(--ui-color-success-500)',
        '--ui-info': 'var(--ui-color-info-500)',
        '--ui-warning': 'var(--ui-color-warning-500)',
        '--ui-error': 'var(--ui-color-error-500)',
        '--ui-bg-muted': 'var(--ui-color-neutral-700)',
        '--ui-text': 'var(--ui-color-neutral-300)'
      }
    },
    // Bootstrap is famously flat: borders, not shadows.
    style: { shadow: 'flat', defaults: { variants: { panels: 'subtle', inputs: 'outline' } } }
  }
}]
