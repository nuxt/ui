// The `color` prop works through a scope class that sets a variable
// (`[--ui-accent:var(--ui-primary)]`) and styles nothing, so it survives blanking
const COLOR_SCOPE = /^\[--(?:ui-accent|ui-highlight|spotlight-color):/

/** The color scope classes of a class value, the rest dropped. */
function scopesOf(value: unknown): string {
  const scopes: string[] = []
  const collect = (item: unknown) => {
    if (typeof item === 'string') {
      for (const cls of item.split(/\s+/)) {
        if (COLOR_SCOPE.test(cls)) {
          scopes.push(cls)
        }
      }
    } else if (Array.isArray(item)) {
      item.forEach(collect)
    }
  }
  collect(value)
  return scopes.join(' ')
}

/**
 * Blank every class string in a theme so components render without their
 * default styles, keeping only what the user supplies via `class`, `ui` or
 * `app.config.ui`, and the color scope classes, so `color` still reaches the
 * `accent` utilities the user writes. All keys are preserved (slots stay callable, `variants` and
 * `defaultVariants` keep their values) so variant props still type-check and
 * validate. Mirrors the engine's own shapes: a slot value is either a class
 * string/array or, inside `variants`/`compoundVariants`, an object mapping slot
 * names to classes.
 * @param result - The theme result object
 * @param unstyled - Whether to strip the theme classes
 * @returns The theme result with blanked class strings
 * @internal
 */
export function applyUnstyled(result: any, unstyled?: boolean): any {
  if (!result || !unstyled) {
    return result
  }

  const blank = (value: unknown): unknown => (value && typeof value === 'object' && !Array.isArray(value))
    ? Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([slot, classes]) => [slot, scopesOf(classes)]))
    : scopesOf(value)

  // Copy before reassigning: object-shaped themes are the shared module export
  // (function-shaped ones produce a fresh object per call), and blanking the
  // shared object in place would blank every later read — the Vue dev server
  // re-generates themes as component detection grows.
  result = { ...result }

  if (result.slots) {
    result.slots = Object.fromEntries(Object.keys(result.slots).map(slot => [slot, '']))
  }

  if (result.variants) {
    result.variants = Object.fromEntries(
      Object.entries(result.variants).map(([name, group]) => [
        name,
        Object.fromEntries(Object.entries(group as Record<string, unknown>).map(([key, value]) => [key, blank(value)]))
      ])
    )
  }

  if (result.compoundVariants) {
    result.compoundVariants = result.compoundVariants.map((entry: Record<string, unknown>) => {
      const { class: cls, ...selectors } = entry
      return { ...selectors, class: blank(cls) }
    })
  }

  return result
}

const unstyledThemes = new WeakMap<object, Record<string, any>>()

/**
 * The blanked copy of a theme, built once per theme object, which the engine
 * resolves in place of the theme under `<UTheme unstyled>`.
 * @internal
 */
export function unstyledTheme(theme: Record<string, any>): Record<string, any> {
  let blanked = unstyledThemes.get(theme)
  if (!blanked) {
    blanked = applyUnstyled(theme, true)
    unstyledThemes.set(theme, blanked!)
  }
  return blanked!
}
