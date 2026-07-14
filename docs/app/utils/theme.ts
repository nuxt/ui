import lucide from '../../../src/theme/icons'

/** Parse a persisted JSON value, falling back on SSR, absence or corruption. */
export function readLocalStorage<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/** Uppercase the first letter — labels from config values. */
export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Tailwind's stock weight ladder — set steps are absences at these values. */
export const FONT_WEIGHT_DEFAULTS = { normal: 400, medium: 500, semibold: 600, bold: 700 } as const

// Families whose preview faces are already requested — Public Sans is
// bundled. Module-level so the controls, the preset menu and every search
// batch share one ledger and no family is fetched twice.
const loadedFontPreviews = new Set<string>(['Public Sans'])

/**
 * Load the listed families (Google Fonts, 400/700 only) so pickers can
 * render themselves in the faces they offer. Incremental: each call adds
 * one stylesheet covering only the families not yet requested — the font
 * search feeds result batches through here as the user types.
 */
export function loadFontPreviews(fonts: readonly string[]) {
  if (!import.meta.client) return
  const families = fonts.filter(name => !loadedFontPreviews.has(name))
  if (!families.length) return
  families.forEach(name => loadedFontPreviews.add(name))
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${families.map(name => `family=${encodeURIComponent(name)}:wght@400;700`).join('&')}&display=swap`
  document.head.appendChild(link)
}

/**
 * interact-outside handler: clicks on studio chrome marked data-keep-panels
 * (the color-mode switch) must not dismiss an open panel.
 */
export function keepPanels(event: Event) {
  if ((event.target as HTMLElement | null)?.closest?.('[data-keep-panels]')) {
    event.preventDefault()
  }
}

// Picking a set replaces appConfig.ui.icons wholesale, so every set must
// map the full key list from src/theme/icons — a missing key would blank
// that icon across the whole app. Names are validated against the Iconify
// API (sets beyond lucide resolve through @nuxt/icon's API fallback).
export const themeIcons = {
  lucide,
  bootstrap: {
    arrowDown: 'i-bi-arrow-down',
    arrowLeft: 'i-bi-arrow-left',
    arrowRight: 'i-bi-arrow-right',
    arrowUp: 'i-bi-arrow-up',
    caution: 'i-bi-exclamation-circle',
    check: 'i-bi-check',
    chevronDoubleLeft: 'i-bi-chevron-double-left',
    chevronDoubleRight: 'i-bi-chevron-double-right',
    chevronDown: 'i-bi-chevron-down',
    chevronLeft: 'i-bi-chevron-left',
    chevronRight: 'i-bi-chevron-right',
    chevronUp: 'i-bi-chevron-up',
    close: 'i-bi-x',
    copy: 'i-bi-clipboard',
    copyCheck: 'i-bi-clipboard-check',
    dark: 'i-bi-moon',
    drag: 'i-bi-grip-vertical',
    ellipsis: 'i-bi-three-dots',
    error: 'i-bi-x-circle',
    external: 'i-bi-box-arrow-up-right',
    eye: 'i-bi-eye',
    eyeOff: 'i-bi-eye-slash',
    file: 'i-bi-file-earmark',
    folder: 'i-bi-folder',
    folderOpen: 'i-bi-folder2-open',
    hash: 'i-bi-hash',
    info: 'i-bi-info-circle',
    light: 'i-bi-sun',
    loading: 'i-bi-arrow-repeat',
    menu: 'i-bi-list',
    minus: 'i-bi-dash',
    panelClose: 'i-bi-arrow-bar-left',
    panelOpen: 'i-bi-arrow-bar-right',
    plus: 'i-bi-plus',
    reload: 'i-bi-arrow-counterclockwise',
    search: 'i-bi-search',
    stop: 'i-bi-square',
    star: 'i-bi-star',
    success: 'i-bi-check-circle',
    system: 'i-bi-display',
    tip: 'i-bi-lightbulb',
    upload: 'i-bi-upload',
    warning: 'i-bi-exclamation-triangle'
  },
  heroicons: {
    arrowDown: 'i-heroicons-arrow-down',
    arrowLeft: 'i-heroicons-arrow-left',
    arrowRight: 'i-heroicons-arrow-right',
    arrowUp: 'i-heroicons-arrow-up',
    caution: 'i-heroicons-exclamation-circle',
    check: 'i-heroicons-check',
    chevronDoubleLeft: 'i-heroicons-chevron-double-left',
    chevronDoubleRight: 'i-heroicons-chevron-double-right',
    chevronDown: 'i-heroicons-chevron-down',
    chevronLeft: 'i-heroicons-chevron-left',
    chevronRight: 'i-heroicons-chevron-right',
    chevronUp: 'i-heroicons-chevron-up',
    close: 'i-heroicons-x-mark',
    copy: 'i-heroicons-clipboard',
    copyCheck: 'i-heroicons-clipboard-document-check',
    dark: 'i-heroicons-moon',
    drag: 'i-heroicons-bars-3',
    ellipsis: 'i-heroicons-ellipsis-horizontal',
    error: 'i-heroicons-x-circle',
    external: 'i-heroicons-arrow-up-right',
    eye: 'i-heroicons-eye',
    eyeOff: 'i-heroicons-eye-slash',
    file: 'i-heroicons-document',
    folder: 'i-heroicons-folder',
    folderOpen: 'i-heroicons-folder-open',
    hash: 'i-heroicons-hashtag',
    info: 'i-heroicons-information-circle',
    light: 'i-heroicons-sun',
    loading: 'i-heroicons-arrow-path',
    menu: 'i-heroicons-bars-3',
    minus: 'i-heroicons-minus',
    panelClose: 'i-heroicons-chevron-left',
    panelOpen: 'i-heroicons-chevron-right',
    plus: 'i-heroicons-plus',
    reload: 'i-heroicons-arrow-uturn-left',
    search: 'i-heroicons-magnifying-glass',
    stop: 'i-heroicons-stop',
    star: 'i-heroicons-star',
    success: 'i-heroicons-check-circle',
    system: 'i-heroicons-computer-desktop',
    tip: 'i-heroicons-light-bulb',
    upload: 'i-heroicons-arrow-up-tray',
    warning: 'i-heroicons-exclamation-triangle'
  },
  iconoir: {
    arrowDown: 'i-iconoir-arrow-down',
    arrowLeft: 'i-iconoir-arrow-left',
    arrowRight: 'i-iconoir-arrow-right',
    arrowUp: 'i-iconoir-arrow-up',
    caution: 'i-iconoir-warning-circle',
    check: 'i-iconoir-check',
    chevronDoubleLeft: 'i-iconoir-fast-arrow-left',
    chevronDoubleRight: 'i-iconoir-fast-arrow-right',
    chevronDown: 'i-iconoir-nav-arrow-down',
    chevronLeft: 'i-iconoir-nav-arrow-left',
    chevronRight: 'i-iconoir-nav-arrow-right',
    chevronUp: 'i-iconoir-nav-arrow-up',
    close: 'i-iconoir-xmark',
    copy: 'i-iconoir-copy',
    copyCheck: 'i-iconoir-clipboard-check',
    dark: 'i-iconoir-half-moon',
    drag: 'i-iconoir-menu',
    ellipsis: 'i-iconoir-more-horiz',
    error: 'i-iconoir-xmark-circle',
    external: 'i-iconoir-arrow-up-right',
    eye: 'i-iconoir-eye',
    eyeOff: 'i-iconoir-eye-closed',
    file: 'i-iconoir-page',
    folder: 'i-iconoir-folder',
    // iconoir has no open-folder glyph — repeat the closed folder rather
    // than show a book on expanded tree nodes
    folderOpen: 'i-iconoir-folder',
    hash: 'i-iconoir-hashtag',
    info: 'i-iconoir-info-circle',
    light: 'i-iconoir-sun-light',
    loading: 'i-iconoir-refresh',
    menu: 'i-iconoir-menu',
    minus: 'i-iconoir-minus',
    panelClose: 'i-iconoir-sidebar-collapse',
    panelOpen: 'i-iconoir-sidebar-expand',
    plus: 'i-iconoir-plus',
    reload: 'i-iconoir-undo',
    search: 'i-iconoir-search',
    stop: 'i-iconoir-square',
    star: 'i-iconoir-star',
    success: 'i-iconoir-check-circle',
    system: 'i-iconoir-computer',
    tip: 'i-iconoir-light-bulb',
    upload: 'i-iconoir-upload',
    warning: 'i-iconoir-warning-triangle'
  },
  material: {
    arrowDown: 'i-material-symbols-arrow-downward-rounded',
    arrowLeft: 'i-material-symbols-arrow-back-rounded',
    arrowRight: 'i-material-symbols-arrow-forward-rounded',
    arrowUp: 'i-material-symbols-arrow-upward-rounded',
    caution: 'i-material-symbols-error-outline-rounded',
    check: 'i-material-symbols-check-rounded',
    chevronDoubleLeft: 'i-material-symbols-keyboard-double-arrow-left-rounded',
    chevronDoubleRight: 'i-material-symbols-keyboard-double-arrow-right-rounded',
    chevronDown: 'i-material-symbols-keyboard-arrow-down-rounded',
    chevronLeft: 'i-material-symbols-chevron-left-rounded',
    chevronRight: 'i-material-symbols-chevron-right-rounded',
    chevronUp: 'i-material-symbols-keyboard-arrow-up-rounded',
    close: 'i-material-symbols-close-rounded',
    copy: 'i-material-symbols-content-copy-outline-rounded',
    copyCheck: 'i-material-symbols-inventory-rounded',
    dark: 'i-material-symbols-dark-mode-outline-rounded',
    drag: 'i-material-symbols-drag-indicator',
    ellipsis: 'i-material-symbols-more-horiz',
    error: 'i-material-symbols-cancel-outline-rounded',
    external: 'i-material-symbols-arrow-outward-rounded',
    eye: 'i-material-symbols-visibility-outline-rounded',
    eyeOff: 'i-material-symbols-visibility-off-outline-rounded',
    file: 'i-material-symbols-description-outline-rounded',
    folder: 'i-material-symbols-folder-outline-rounded',
    folderOpen: 'i-material-symbols-folder-open-outline-rounded',
    hash: 'i-material-symbols-tag-rounded',
    info: 'i-material-symbols-info-outline-rounded',
    // colon form: the dashed name would resolve against the separate
    // material-symbols-light collection and never load
    light: 'i-material-symbols:light-mode-outline-rounded',
    loading: 'i-material-symbols-progress-activity',
    menu: 'i-material-symbols-menu-rounded',
    minus: 'i-material-symbols-remove-rounded',
    panelClose: 'i-material-symbols-left-panel-close-outline-rounded',
    panelOpen: 'i-material-symbols-left-panel-open-outline-rounded',
    plus: 'i-material-symbols-add-rounded',
    reload: 'i-material-symbols-refresh-rounded',
    search: 'i-material-symbols-search-rounded',
    stop: 'i-material-symbols-stop-outline-rounded',
    star: 'i-material-symbols-star-outline-rounded',
    success: 'i-material-symbols-check-circle-outline-rounded',
    system: 'i-material-symbols-desktop-windows-outline-rounded',
    tip: 'i-material-symbols-lightbulb-outline-rounded',
    upload: 'i-material-symbols-upload-rounded',
    warning: 'i-material-symbols-warning-outline-rounded'
  },
  phosphor: {
    arrowDown: 'i-ph-arrow-down',
    arrowLeft: 'i-ph-arrow-left',
    arrowRight: 'i-ph-arrow-right',
    arrowUp: 'i-ph-arrow-up',
    caution: 'i-ph-warning-circle',
    check: 'i-ph-check',
    chevronDoubleLeft: 'i-ph-caret-double-left',
    chevronDoubleRight: 'i-ph-caret-double-right',
    chevronDown: 'i-ph-caret-down',
    chevronLeft: 'i-ph-caret-left',
    chevronRight: 'i-ph-caret-right',
    chevronUp: 'i-ph-caret-up',
    close: 'i-ph-x',
    copy: 'i-ph-copy',
    copyCheck: 'i-ph-check-circle',
    dark: 'i-ph-moon',
    drag: 'i-ph-dots-six-vertical',
    ellipsis: 'i-ph-dots-three',
    error: 'i-ph-x-circle',
    external: 'i-ph-arrow-up-right',
    eye: 'i-ph-eye',
    eyeOff: 'i-ph-eye-slash',
    file: 'i-ph-file',
    folder: 'i-ph-folder',
    folderOpen: 'i-ph-folder-open',
    hash: 'i-ph-hash',
    info: 'i-ph-info',
    light: 'i-ph-sun',
    loading: 'i-ph-circle-notch',
    menu: 'i-ph-list',
    minus: 'i-ph-minus',
    panelClose: 'i-ph-caret-left',
    panelOpen: 'i-ph-caret-right',
    plus: 'i-ph-plus',
    reload: 'i-ph-arrow-counter-clockwise',
    search: 'i-ph-magnifying-glass',
    stop: 'i-ph-square',
    star: 'i-ph-star',
    success: 'i-ph-check-circle',
    system: 'i-ph-monitor',
    tip: 'i-ph-lightbulb',
    upload: 'i-ph-upload',
    warning: 'i-ph-warning'
  },
  remix: {
    arrowDown: 'i-ri-arrow-down-line',
    arrowLeft: 'i-ri-arrow-left-line',
    arrowRight: 'i-ri-arrow-right-line',
    arrowUp: 'i-ri-arrow-up-line',
    caution: 'i-ri-error-warning-line',
    check: 'i-ri-check-line',
    chevronDoubleLeft: 'i-ri-arrow-left-double-line',
    chevronDoubleRight: 'i-ri-arrow-right-double-line',
    chevronDown: 'i-ri-arrow-down-s-line',
    chevronLeft: 'i-ri-arrow-left-s-line',
    chevronRight: 'i-ri-arrow-right-s-line',
    chevronUp: 'i-ri-arrow-up-s-line',
    close: 'i-ri-close-line',
    copy: 'i-ri-file-copy-line',
    copyCheck: 'i-ri-checkbox-multiple-line',
    dark: 'i-ri-moon-line',
    drag: 'i-ri-draggable',
    ellipsis: 'i-ri-more-line',
    error: 'i-ri-close-circle-line',
    external: 'i-ri-external-link-line',
    eye: 'i-ri-eye-line',
    eyeOff: 'i-ri-eye-off-line',
    file: 'i-ri-file-line',
    folder: 'i-ri-folder-line',
    folderOpen: 'i-ri-folder-open-line',
    hash: 'i-ri-hashtag',
    info: 'i-ri-information-line',
    light: 'i-ri-sun-line',
    loading: 'i-ri-loader-4-line',
    menu: 'i-ri-menu-line',
    minus: 'i-ri-subtract-line',
    panelClose: 'i-ri-sidebar-fold-line',
    panelOpen: 'i-ri-sidebar-unfold-line',
    plus: 'i-ri-add-line',
    reload: 'i-ri-arrow-go-back-line',
    search: 'i-ri-search-line',
    stop: 'i-ri-stop-line',
    star: 'i-ri-star-line',
    success: 'i-ri-checkbox-circle-line',
    system: 'i-ri-computer-line',
    tip: 'i-ri-lightbulb-line',
    upload: 'i-ri-upload-2-line',
    warning: 'i-ri-alert-line'
  },
  tabler: {
    arrowDown: 'i-tabler-arrow-down',
    arrowLeft: 'i-tabler-arrow-left',
    arrowRight: 'i-tabler-arrow-right',
    arrowUp: 'i-tabler-arrow-up',
    caution: 'i-tabler-alert-square-rounded',
    check: 'i-tabler-check',
    chevronDoubleLeft: 'i-tabler-chevrons-left',
    chevronDoubleRight: 'i-tabler-chevrons-right',
    chevronDown: 'i-tabler-chevron-down',
    chevronLeft: 'i-tabler-chevron-left',
    chevronRight: 'i-tabler-chevron-right',
    chevronUp: 'i-tabler-chevron-up',
    close: 'i-tabler-x',
    copy: 'i-tabler-copy',
    copyCheck: 'i-tabler-copy-check',
    dark: 'i-tabler-moon',
    drag: 'i-tabler-grip-vertical',
    ellipsis: 'i-tabler-dots',
    error: 'i-tabler-square-rounded-x',
    external: 'i-tabler-external-link',
    eye: 'i-tabler-eye',
    eyeOff: 'i-tabler-eye-off',
    file: 'i-tabler-file',
    folder: 'i-tabler-folder',
    folderOpen: 'i-tabler-folder-open',
    hash: 'i-tabler-hash',
    info: 'i-tabler-info-square-rounded',
    light: 'i-tabler-sun',
    loading: 'i-tabler-loader-2',
    menu: 'i-tabler-menu',
    minus: 'i-tabler-minus',
    panelClose: 'i-tabler-layout-sidebar-left-collapse',
    panelOpen: 'i-tabler-layout-sidebar-left-expand',
    plus: 'i-tabler-plus',
    reload: 'i-tabler-reload',
    search: 'i-tabler-search',
    stop: 'i-tabler-player-stop',
    star: 'i-tabler-star',
    success: 'i-tabler-square-rounded-check',
    system: 'i-tabler-device-desktop',
    tip: 'i-tabler-bulb',
    upload: 'i-tabler-upload',
    warning: 'i-tabler-alert-triangle'
  }
}

export type ThemeIcons = keyof typeof themeIcons

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
