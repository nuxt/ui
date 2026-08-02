import type { ThemeDoc, StoredPaletteParams } from '../utils/theme-engine'

/**
 * One undo/redo step. The exported `doc` carries colours, style and the
 * RESOLVED palette shades, but not the curves and pins behind them, which
 * live in the studio's `paletteParams`. We snapshot both: restoring the doc
 * alone would fix the visible colours yet strand the palette editor on stale
 * (or refitted-to-default) curves, and the next edit would regenerate from
 * those and clobber the ramp.
 */
interface HistoryEntry {
  doc: ThemeDoc
  pp: Partial<Record<string, StoredPaletteParams>>
}

/**
 * Undo/redo over whole theme documents, the same serialize/restore pair
 * exports and presets already use, so one history entry is one applyDoc
 * away. State is app-level because the site header hosts the undo/redo
 * buttons while on /theme; the page owns the debounced capture watcher.
 * Session-only by design.
 */
export function useThemeStudioHistory() {
  const { applyDoc, paletteParams, setPaletteParams } = useThemeStudio()
  const { currentDoc } = useTheme()

  const past = useState<HistoryEntry[]>('theme-studio-history-past', () => [])
  const future = useState<HistoryEntry[]>('theme-studio-history-future', () => [])
  const lastSnapshot = useState('theme-studio-history-snapshot', () => '')
  const pendingRestore = useState('theme-studio-history-pending', () => false)

  /**
   * The full restorable studio state as a stable string, the exported doc
   * plus the editor's curve/pin params. Reads reactive sources, so the page's
   * capture watcher re-runs on any change to either.
   */
  function snapshot() {
    return JSON.stringify({ doc: currentDoc(), pp: paletteParams.value })
  }

  /**
   * Realign the baseline without recording (page mount). If the theme
   * changed while no watcher was mounted (preset from the header picker on
   * another page), the stacks describe a document lineage that no longer
   * exists, undo/redo against them would clobber the off-page change, so
   * they reset.
   */
  function align(snap: string) {
    if (lastSnapshot.value && snap !== lastSnapshot.value) {
      past.value = []
      future.value = []
    }
    pendingRestore.value = false
    lastSnapshot.value = snap
  }

  /** Record a settled snapshot (call after the page's debounce). */
  function capture(snap: string) {
    if (pendingRestore.value) {
      // the first settle after our own undo/redo restore, realign without
      // recording, however long the flush took
      pendingRestore.value = false
      lastSnapshot.value = snap
      return
    }
    if (snap === lastSnapshot.value) return
    // No baseline yet (capture before the page's mount align), adopt
    // rather than record: JSON.parse('') would throw.
    if (!lastSnapshot.value) {
      lastSnapshot.value = snap
      return
    }
    past.value.push(JSON.parse(lastSnapshot.value))
    if (past.value.length > 50) past.value.shift()
    future.value = []
    lastSnapshot.value = snap
  }

  function restore(entry: HistoryEntry) {
    pendingRestore.value = true
    // The baseline moves NOW, not at the debounced settle, a second
    // undo/redo inside the debounce window must push this entry, not the
    // pre-restore state (which would drop a step and duplicate another).
    lastSnapshot.value = JSON.stringify(entry)
    applyDoc(entry.doc)
    // Restore the editor curves/pins AFTER applyDoc, applyDoc resets and
    // re-applies the visible colours (and clears paletteParams), so this must
    // run last to realign the editor's source of truth to the restored ramp.
    // JSON round-trip, NOT structuredClone: entry.pp is a reactive-proxy value
    // off the history useState, and structuredClone throws DataCloneError on a
    // Vue Proxy, which would abort restore right before this line, leaving the
    // ramp applied but the editor stranded on stale curves.
    setPaletteParams(entry.pp ? JSON.parse(JSON.stringify(entry.pp)) : {})
    // the settle still realigns from snapshot() itself, the applied doc
    // may re-serialize differently than it round-trips
  }

  function undo() {
    const entry = past.value.pop()
    if (!entry) return
    future.value.push(JSON.parse(lastSnapshot.value))
    restore(entry)
  }

  function redo() {
    const entry = future.value.pop()
    if (!entry) return
    past.value.push(JSON.parse(lastSnapshot.value))
    restore(entry)
  }

  return { past, future, snapshot, align, capture, undo, redo }
}

/**
 * Drives the history stack from the live theme: aligns the baseline on mount,
 * then folds every burst of edits into one step. Slider drags fire per pixel,
 * so a raw watcher would record a step per frame.
 */
export function useThemeStudioRecorder() {
  const { snapshot, align, capture } = useThemeStudioHistory()

  const mounted = ref(false)
  let timeout: ReturnType<typeof setTimeout> | undefined

  onMounted(() => {
    mounted.value = true
    align(snapshot())
  })

  // the snapshot spans the doc AND the editor's curve/pin params
  watch(() => (mounted.value ? snapshot() : undefined), (snap) => {
    if (!snap) return
    clearTimeout(timeout)
    timeout = setTimeout(() => capture(snap), 350)
  })

  // A pending capture flushes rather than dies, an edit inside the debounce
  // window would otherwise vanish from history.
  onUnmounted(() => {
    clearTimeout(timeout)
    capture(snapshot())
  })
}
