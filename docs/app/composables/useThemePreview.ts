import type { ThemeDoc, StoredPaletteParams } from '../utils/theme/engine'

interface PreviewSnapshot {
  doc: ThemeDoc
  pp: Partial<Record<string, StoredPaletteParams>>
  preset?: string
}

/**
 * True while a hovered option is painted on the page. Shared with the theme
 * plugin, which holds its storage write until the preview ends.
 */
export function useThemePreviewing() {
  return useState('nuxt-ui-theme-previewing', () => false)
}

/**
 * Turns previews off while the calling component is mounted. The palette
 * editor reads its curves once on open, a preview's restore would leave it
 * refitted to the previewed ramp.
 */
function useThemePreviewBlocked() {
  return useState('nuxt-ui-theme-preview-blocked', () => 0)
}

export function useThemePreviewBlock() {
  const blocked = useThemePreviewBlocked()
  onMounted(() => blocked.value++)
  onUnmounted(() => blocked.value--)
}

/**
 * `source`, held at its value from the moment a preview starts. A picker
 * reads its value, label and checks through this, so they keep naming the
 * applied option while the page shows the hovered one. Sync, so it is read
 * before the previewed option lands.
 */
export function useHeldDuringPreview<T>(source: () => T) {
  const previewing = useThemePreviewing()
  const held = shallowRef<{ value: T }>()
  watch(previewing, (on) => {
    held.value = on ? { value: source() } : undefined
  }, { flush: 'sync' })
  return computed(() => (held.value ? held.value.value : source()))
}

const NAVIGATION_KEYS = new Set(['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'])

/**
 * Hover previews for the theme pickers. The first preview snapshots the
 * theme the same way undo/redo does, every preview after that restores it
 * and applies its option on top, so one preview never stacks on another.
 * Leaving restores it, picking restores it and applies the option for real,
 * so the pick is tracked and persisted like any other change.
 *
 * `intent`: for lists that highlight a row on their own (the listbox on
 * open, the combobox on every search), previews wait for a pointer move or
 * an arrow key in the panel. Bind `onPointermove` and `onKeydown` to it.
 */
export function useThemePreview(options: { intent?: boolean } = {}) {
  const previewing = useThemePreviewing()
  const blocked = useThemePreviewBlocked()
  const historyPending = useThemeStudioHistoryPending()
  const { applyDoc, paletteParams, setPaletteParams, activePreset } = useThemeStudio()
  const { currentDoc } = useTheme()
  const { untracked } = useAnalytics()

  let snapshot: PreviewSnapshot | undefined
  let timeout: ReturnType<typeof setTimeout> | undefined
  let armed = !options.intent

  function restore() {
    if (!snapshot) return
    // a fresh copy each time, applyDoc's shallow spread would alias it
    const { doc, pp, preset } = JSON.parse(JSON.stringify(snapshot)) as PreviewSnapshot
    applyDoc(doc)
    // applyDoc clears the editor curves and the baseline preset, both come back after it
    setPaletteParams(pp)
    activePreset.value = preset
  }

  function preview(apply: () => void) {
    if (blocked.value) return
    if (!snapshot) {
      // currentDoc embeds reactive slices, round-trip to plain JSON
      snapshot = JSON.parse(JSON.stringify({ doc: currentDoc(), pp: paletteParams.value, preset: activePreset.value }))
      previewing.value = true
    }
    // same tick as the restore, the style tags swap once
    untracked(() => {
      restore()
      apply()
    })
  }

  /** Back to the snapshot. Only the instance that took it releases the shared flag. */
  function end() {
    if (!snapshot) return
    untracked(restore)
    snapshot = undefined
    // the restore may serialize a hair differently from the snapshot, the
    // undo stack realigns on it rather than record a step nobody made
    historyPending.value = true
    previewing.value = false
  }

  /**
   * Preview an option, or end the preview with none. Debounced: sweeping
   * down a list, or crossing the gap between two items, shouldn't repaint
   * the page for every row the pointer passes.
   */
  function show(apply?: () => void) {
    if (!armed) apply = undefined
    clearTimeout(timeout)
    timeout = setTimeout(() => (apply ? preview(apply) : end()), apply ? 80 : 100)
  }

  /** End the preview right away, the menu closed. */
  function cancel() {
    clearTimeout(timeout)
    armed = !options.intent
    end()
  }

  /** Apply an option for real, from the theme as it was before the preview. */
  function commit(apply: () => void) {
    clearTimeout(timeout)
    if (snapshot) {
      untracked(restore)
      snapshot = undefined
      previewing.value = false
    }
    apply()
  }

  const onPointermove = () => {
    armed = true
  }
  // typing in a search disarms and ends the preview, its first match isn't a pick
  const onKeydown = (event: KeyboardEvent) => {
    armed = NAVIGATION_KEYS.has(event.key)
    if (!armed) show()
  }

  // a picker unmounting mid preview (the mobile menu closing) takes it down
  onScopeDispose(cancel)

  return { show, cancel, commit, onPointermove, onKeydown }
}
