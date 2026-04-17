/**
 * Prevents Enter-to-submit from firing during IME composition.
 *
 * Handles the Safari quirk where `compositionend` fires before `keydown`,
 * making `event.isComposing` unreliable (https://bugs.webkit.org/show_bug.cgi?id=165004).
 */
export function useIMEGuard(callback: (event: KeyboardEvent) => void) {
  let compositionJustEnded = false

  function isComposing(event: KeyboardEvent) {
    return event.isComposing || event.keyCode === 229
  }

  function onKeydown(event: KeyboardEvent) {
    if (compositionJustEnded || isComposing(event)) {
      return
    }

    event.preventDefault()
    callback(event)
  }

  let compositionEndTimer: ReturnType<typeof setTimeout>

  function onCompositionEnd() {
    clearTimeout(compositionEndTimer)
    compositionJustEnded = true
    compositionEndTimer = setTimeout(() => {
      compositionJustEnded = false
    }, 50)
  }

  return { onKeydown, onCompositionEnd }
}
