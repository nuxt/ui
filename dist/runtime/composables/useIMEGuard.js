export function useIMEGuard(callback) {
  let compositionJustEnded = false;
  function isComposing(event) {
    return event.isComposing || event.keyCode === 229;
  }
  function onKeydown(event) {
    if (compositionJustEnded || isComposing(event)) {
      return;
    }
    event.preventDefault();
    callback(event);
  }
  let compositionEndTimer;
  function onCompositionEnd() {
    clearTimeout(compositionEndTimer);
    compositionJustEnded = true;
    compositionEndTimer = setTimeout(() => {
      compositionJustEnded = false;
    }, 50);
  }
  return { onKeydown, onCompositionEnd };
}
