import { DEFAULT_COLORS, LIBRARY_TOKEN_DEFAULTS } from './engine/types'

const aliasTokens = new Set(Object.keys(DEFAULT_COLORS).map(alias => `--ui-${alias}`))
const withoutAliases = (tokens: Record<string, string>) => Object.fromEntries(Object.entries(tokens).filter(([token]) => !aliasTokens.has(token)))

// The semantic token defaults the docs render on, the library's own
// (src/runtime/css/base.css) minus the --ui-<alias> tokens the colors plugin
// generates. Restated whole into the .light/.dark blocks whenever a mode
// carries an override, so they are the engine's LIBRARY_TOKEN_DEFAULTS, the
// table the export diffs against, and the page can't diverge from the export.
export const cssVariableDefaults = {
  light: withoutAliases(LIBRARY_TOKEN_DEFAULTS.light),
  dark: withoutAliases(LIBRARY_TOKEN_DEFAULTS.dark)
}
