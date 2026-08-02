import type { InjectionKey } from 'vue'

/** How deep a ThemeStudioSection sits, which decides how it behaves. */
export const SECTION_DEPTH: InjectionKey<number> = Symbol('theme-studio-section-depth')
