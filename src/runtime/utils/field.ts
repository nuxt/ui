/**
 * Whether a click in the box of a field is one for the field itself, which
 * then takes the focus: a click on an icon or on plain leading or trailing
 * content. A control or focusable content in the box keeps its own click, and
 * a click that ends a text selection keeps the selection.
 * @internal
 */
export function isFieldClick(event: MouseEvent): boolean {
  const box = event.currentTarget as HTMLElement
  const control = (event.target as HTMLElement).closest('input, textarea, select, button, a, label, [tabindex], [contenteditable]')

  if (control && control !== box && box.contains(control)) {
    return false
  }

  return !window.getSelection()?.toString()
}
