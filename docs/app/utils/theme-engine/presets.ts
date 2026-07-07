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
  id: 'forest',
  name: 'Forest',
  description: 'Sculpted evergreen on forest-green neutrals with a sage secondary — spread hard shadows over a fine inset.',
  icon: 'i-lucide-trees',
  doc: {
    version: 1,
    meta: { name: 'Forest', base: 'forest' },
    // Both ramps were sculpted in the curve editor (hence the custom-* names:
    // the editors reopen them as their own), plus a muted sage for secondary.
    palettes: {
      'custom-neutral': {
        shades: {
          50: 'oklch(93.7% 0.041 140.516)',
          100: 'oklch(90.8% 0.053 140.375)',
          200: 'oklch(85.5% 0.066 140.572)',
          300: 'oklch(75% 0.079 141.493)',
          400: 'oklch(61.8% 0.09 142.245)',
          500: 'oklch(51.4% 0.095 142.85)',
          600: 'oklch(43.4% 0.085 143.372)',
          700: 'oklch(36.9% 0.067 143.839)',
          800: 'oklch(31.3% 0.049 144.268)',
          900: 'oklch(26.4% 0.033 144.666)',
          950: 'oklch(22.1% 0.017 145.041)'
        }
      },
      'custom-primary': {
        shades: {
          50: 'oklch(98.2% 0.03 144.679)',
          100: 'oklch(96.7% 0.058 144.074)',
          200: 'oklch(92.4% 0.124 143.449)',
          300: 'oklch(86.5% 0.164 142.837)',
          400: 'oklch(79.4% 0.221 142.544)',
          500: 'oklch(71.6% 0.223 142.677)',
          600: 'oklch(63.2% 0.196 142.818)',
          700: 'oklch(54.4% 0.166 142.921)',
          800: 'oklch(45.3% 0.137 142.994)',
          900: 'oklch(36% 0.108 143.043)',
          950: 'oklch(26.6% 0.079 143.072)'
        }
      },
      'sage': {
        shades: {
          50: 'oklch(97.7% 0.004 134.849)',
          100: 'oklch(95% 0.01 140.516)',
          200: 'oklch(90% 0.018 140.022)',
          300: 'oklch(82.6% 0.029 141.964)',
          400: 'oklch(71.9% 0.038 142.667)',
          500: 'oklch(61.7% 0.042 142.713)',
          600: 'oklch(53% 0.038 143.698)',
          700: 'oklch(45.7% 0.032 143.377)',
          800: 'oklch(39.8% 0.026 142.997)',
          900: 'oklch(35.1% 0.022 145.097)',
          950: 'oklch(24.2% 0.017 145.041)'
        }
      }
    },
    colors: {
      primary: 'custom-primary',
      secondary: 'sage',
      success: 'emerald',
      info: 'cyan',
      warning: 'amber',
      neutral: 'custom-neutral'
    },
    font: { sans: 'Raleway' },
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
    // Spread-1 hard shadows in graded neutral shades, a 1px bottom inset at
    // 25%, subtle surfaces with stock outline fields.
    style: {
      shadow: 'hard',
      shadowGeometry: {
        x: 0,
        y: 3,
        blur: 0,
        spread: 1
      },
      shadowOpacity: 50,
      innerShadow: 'hard',
      innerShadowGeometry: {
        x: 0,
        y: 1,
        blur: 0,
        spread: 1
      },
      innerShadowOpacity: 25,
      shadowColor: 'shade',
      shadowShade: {
        light: 500,
        dark: 950
      },
      innerShadowColor: 'shade',
      innerShadowShade: {
        light: 950,
        dark: 400
      },
      defaults: {
        variants: {
          buttons: 'subtle',
          panels: 'subtle',
          inputs: 'outline'
        }
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
    font: { sans: 'DM Sans' },
    tokens: {
      light: {
        '--ui-bg': 'var(--ui-color-neutral-50)'
      },
      dark: {
        '--ui-bg': 'var(--ui-color-neutral-900)',
        '--ui-primary': 'var(--ui-color-primary-500)'
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
}]
