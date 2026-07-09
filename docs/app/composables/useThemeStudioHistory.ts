import type { ThemeDoc } from '../utils/theme-engine'

/**
 * Undo/redo over whole theme documents — the same serialize/restore pair
 * exports and presets already use, so one history entry is one applyDoc
 * away. State is app-level because the site header hosts the undo/redo
 * buttons while on /theme; the page owns the debounced capture watcher.
 * Session-only by design.
 */
export function useThemeStudioHistory() {
  const { applyDoc } = useThemeStudio()

  const past = useState<ThemeDoc[]>('theme-studio-history-past', () => [])
  const future = useState<ThemeDoc[]>('theme-studio-history-future', () => [])
  const lastSnapshot = useState('theme-studio-history-snapshot', () => '')
  const pendingRestore = useState('theme-studio-history-pending', () => false)

  /** Realign the baseline without recording (page mount). */
  function align(snapshot: string) {
    lastSnapshot.value = snapshot
  }

  /** Record a settled snapshot (call after the page's debounce). */
  function capture(snapshot: string) {
    if (pendingRestore.value) {
      // the first settle after our own undo/redo restore — realign without
      // recording, however long the flush took
      pendingRestore.value = false
      lastSnapshot.value = snapshot
      return
    }
    if (snapshot === lastSnapshot.value) return
    past.value.push(JSON.parse(lastSnapshot.value))
    if (past.value.length > 50) past.value.shift()
    future.value = []
    lastSnapshot.value = snapshot
  }

  function restore(doc: ThemeDoc) {
    pendingRestore.value = true
    applyDoc(doc)
    // realignment happens on the next capture, from currentDoc() itself —
    // the applied doc may re-serialize differently than it round-trips
  }

  function undo() {
    const doc = past.value.pop()
    if (!doc) return
    future.value.push(JSON.parse(lastSnapshot.value))
    restore(doc)
  }

  function redo() {
    const doc = future.value.pop()
    if (!doc) return
    past.value.push(JSON.parse(lastSnapshot.value))
    restore(doc)
  }

  return { past, future, align, capture, undo, redo }
}
