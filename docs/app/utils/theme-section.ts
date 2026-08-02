import type { InjectionKey } from 'vue'
import { resolveAlias, resolveShade } from './theme-engine'
import type { ThemeDoc, Shade } from './theme-engine'

/** How deep a ThemeStudioSection sits, which decides how it behaves. */
export const SECTION_DEPTH: InjectionKey<number> = Symbol('theme-studio-section-depth')

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
