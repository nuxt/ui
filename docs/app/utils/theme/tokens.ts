// The docs' own render baseline. It intentionally diverges from the library
// defaults in one place: light `--ui-bg` follows the neutral ramp (set in
// main.css) so tinted neutrals reach the page background. Export diffing
// uses the engine's LIBRARY_TOKEN_DEFAULTS instead.
export const cssVariableDefaults = {
  light: {
    '--ui-text-dimmed': 'var(--ui-color-neutral-400)',
    '--ui-text-muted': 'var(--ui-color-neutral-500)',
    '--ui-text-toned': 'var(--ui-color-neutral-600)',
    '--ui-text': 'var(--ui-color-neutral-700)',
    '--ui-text-highlighted': 'var(--ui-color-neutral-900)',
    '--ui-text-inverted': 'white',
    '--ui-bg': 'var(--ui-color-neutral-50)',
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
