/**
 * Whether a click in the box of a field is one for the field itself, which
 * then takes the focus: a click on an icon or on plain leading or trailing
 * content. A control or focusable content in the box keeps its own click, and
 * a click that ends a text selection keeps the selection. A click in a field
 * nested in another one is for the inner field alone.
 * @internal
 */
const seen = new WeakSet<MouseEvent>()

export function isFieldClick(event: MouseEvent): boolean {
  if (seen.has(event)) {
    return false
  }
  seen.add(event)

  const box = event.currentTarget as HTMLElement
  const control = (event.target as HTMLElement).closest('input, textarea, select, button, a, label, [tabindex], [contenteditable]')

  if (control && control !== box && box.contains(control)) {
    return false
  }

  return !window.getSelection()?.toString().trim()
}
