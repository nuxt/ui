export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type Shade = typeof SHADES[number]

export type ColorAlias = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export interface ThemePalette {
  /** Tailwind palette this one is based on, when only some shades differ */
  extends?: string
  shades: Partial<Record<Shade, string>>
}

/**
 * A theme is a sparse document: it stores only explicit overrides and
 * everything absent stays inherited from the Nuxt UI defaults. Serializing
 * the document therefore *is* the minimal export.
 */
export interface ThemeDoc {
  version: 1
  meta?: {
    name?: string
    /** Preset id this document was forked from */
    base?: string
    /** Seed used by shuffle, kept for reproducible rolls */
    seed?: number
  }
  /** L0 — custom palettes, injected as `--color-{name}-{shade}` */
  palettes?: Record<string, ThemePalette>
  /** L1 — alias → palette name (tailwind or a key of `palettes`) */
  colors?: Partial<Record<ColorAlias, string>>
  blackAsPrimary?: boolean
  /** L2 — semantic `--ui-*` token overrides per mode */
  tokens?: {
    light?: Record<string, string>
    dark?: Record<string, string>
  }
  radius?: number
  font?: {
    sans?: string
  }
  icons?: string
  /** L4 — per-component overrides merged into `app.config ui.<component>` */
  components?: Record<string, Record<string, unknown>>
}

export const DEFAULT_COLORS: Record<ColorAlias, string> = {
  primary: 'green',
  secondary: 'blue',
  success: 'green',
  info: 'blue',
  warning: 'yellow',
  error: 'red',
  neutral: 'slate'
}

export const THEME_DEFAULTS = {
  radius: 0.25,
  font: 'Public Sans',
  icons: 'lucide'
} as const

export function createThemeDoc(): ThemeDoc {
  return { version: 1 }
}

/** A document with no overrides means "stock Nuxt UI". */
export function isDefaultTheme(doc: ThemeDoc): boolean {
  return !doc.palettes && !doc.colors && !doc.blackAsPrimary && !doc.tokens
    && doc.radius === undefined && !doc.font?.sans && !doc.icons && !doc.components
}
