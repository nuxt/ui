// The semantic token defaults the docs render on, the library's own
// (src/runtime/index.css) minus the --ui-<alias> tokens the colors plugin
// generates. Restated whole into the .light/.dark blocks whenever a mode
// carries an override, so every entry must match the library or the page
// would silently diverge from the export, which diffs against the engine's
// LIBRARY_TOKEN_DEFAULTS.
export const cssVariableDefaults = {
  light: {
    '--ui-text-dimmed': 'var(--ui-color-neutral-400)',
    '--ui-text-muted': 'var(--ui-color-neutral-500)',
    '--ui-text-toned': 'var(--ui-color-neutral-600)',
    '--ui-text': 'var(--ui-color-neutral-700)',
    '--ui-text-highlighted': 'var(--ui-color-neutral-900)',
    '--ui-text-inverted': 'white',
    '--ui-bg': 'white',
    '--ui-bg-muted': 'var(--ui-color-neutral-50)',
    '--ui-bg-elevated': 'var(--ui-color-neutral-100)',
    '--ui-bg-accented': 'var(--ui-color-neutral-200)',
    '--ui-bg-inverted': 'var(--ui-color-neutral-900)',
    '--ui-border': 'var(--ui-color-neutral-200)',
    '--ui-border-muted': 'var(--ui-color-neutral-200)',
    '--ui-border-accented': 'var(--ui-color-neutral-300)',
    '--ui-border-inverted': 'var(--ui-color-neutral-900)'
  },
  dark: {
    '--ui-text-dimmed': 'var(--ui-color-neutral-500)',
    '--ui-text-muted': 'var(--ui-color-neutral-400)',
    '--ui-text-toned': 'var(--ui-color-neutral-300)',
    '--ui-text': 'var(--ui-color-neutral-200)',
    '--ui-text-highlighted': 'white',
    '--ui-text-inverted': 'var(--ui-color-neutral-900)',
    '--ui-bg': 'var(--ui-color-neutral-900)',
    '--ui-bg-muted': 'var(--ui-color-neutral-800)',
    '--ui-bg-elevated': 'var(--ui-color-neutral-800)',
    '--ui-bg-accented': 'var(--ui-color-neutral-700)',
    '--ui-bg-inverted': 'white',
    '--ui-border': 'var(--ui-color-neutral-800)',
    '--ui-border-muted': 'var(--ui-color-neutral-700)',
    '--ui-border-accented': 'var(--ui-color-neutral-700)',
    '--ui-border-inverted': 'white'
  }
} as const
