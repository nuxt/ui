import type { InjectionKey } from 'vue'
import { resolveAlias, resolveShade, contrastRatio } from './theme-engine'
import type { ThemeDoc, Shade } from './theme-engine'

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
