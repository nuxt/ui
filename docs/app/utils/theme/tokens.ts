// The semantic token defaults the docs render on, the library's own
// (src/runtime/css/base.css) minus the --ui-<alias> tokens the colors plugin
// generates. Restated whole into the .light/.dark blocks whenever a mode
// carries an override, so every entry must match the library or the page
// would silently diverge from the export, which diffs against the engine's
// LIBRARY_TOKEN_DEFAULTS.
export const cssVariableDefaults = {
  light: {
    '--ui-text-faint': 'var(--ui-color-neutral-400)',
    '--ui-text-muted': 'var(--ui-color-neutral-500)',
    '--ui-text-default': 'var(--ui-color-neutral-700)',
    '--ui-text-strong': 'var(--ui-color-neutral-900)',
    '--ui-text-contrast': 'white',
    '--ui-bg-default': 'white',
    '--ui-bg-muted': 'var(--ui-color-neutral-50)',
    '--ui-bg-soft': 'var(--ui-color-neutral-100)',
    '--ui-bg-strong': 'var(--ui-color-neutral-200)',
    '--ui-border-default': 'var(--ui-color-neutral-200)',
    '--ui-border-muted': 'var(--ui-color-neutral-200)',
    '--ui-border-strong': 'var(--ui-color-neutral-300)'
  },
  dark: {
    '--ui-text-faint': 'var(--ui-color-neutral-500)',
    '--ui-text-muted': 'var(--ui-color-neutral-400)',
    '--ui-text-default': 'var(--ui-color-neutral-200)',
    '--ui-text-strong': 'white',
    '--ui-text-contrast': 'var(--ui-color-neutral-900)',
    '--ui-bg-default': 'var(--ui-color-neutral-900)',
    '--ui-bg-muted': 'var(--ui-color-neutral-800)',
    '--ui-bg-soft': 'var(--ui-color-neutral-800)',
    '--ui-bg-strong': 'var(--ui-color-neutral-700)',
    '--ui-border-default': 'var(--ui-color-neutral-800)',
    '--ui-border-muted': 'var(--ui-color-neutral-700)',
    '--ui-border-strong': 'var(--ui-color-neutral-700)'
  }
} as const
