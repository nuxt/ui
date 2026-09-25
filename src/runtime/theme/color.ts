// The color aliases every component accepts. Each scope below is written out in
// full so Tailwind finds it by scanning this file: nothing is generated or
// safelisted, and a theme never builds a class from a color name.
export const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'] as const

export type Color = typeof colors[number]

const accentScopes: Record<Color, string> = {
  primary: '[--ui-accent:var(--ui-primary)]',
  secondary: '[--ui-accent:var(--ui-secondary)]',
  success: '[--ui-accent:var(--ui-success)]',
  info: '[--ui-accent:var(--ui-info)]',
  warning: '[--ui-accent:var(--ui-warning)]',
  error: '[--ui-accent:var(--ui-error)]',
  neutral: '[--ui-accent:var(--ui-neutral)]'
}

// A second color on an element that already has one (NavigationMenu `highlightColor`).
const highlightScopes: Record<Color, string> = {
  primary: '[--ui-highlight:var(--ui-primary)]',
  secondary: '[--ui-highlight:var(--ui-secondary)]',
  success: '[--ui-highlight:var(--ui-success)]',
  info: '[--ui-highlight:var(--ui-info)]',
  warning: '[--ui-highlight:var(--ui-warning)]',
  error: '[--ui-highlight:var(--ui-error)]',
  neutral: '[--ui-highlight:var(--ui-neutral)]'
}

// PageCard's spotlight gradient.
const spotlightScopes: Record<Color, string> = {
  primary: '[--spotlight-color:var(--ui-primary)]',
  secondary: '[--spotlight-color:var(--ui-secondary)]',
  success: '[--spotlight-color:var(--ui-success)]',
  info: '[--spotlight-color:var(--ui-info)]',
  warning: '[--spotlight-color:var(--ui-warning)]',
  error: '[--spotlight-color:var(--ui-error)]',
  neutral: '[--spotlight-color:var(--ui-neutral)]'
}

function scoped<S extends string>(scopes: Record<Color, string>, slots: Record<S, string>) {
  return Object.fromEntries(colors.map(color => [color, Object.fromEntries(
    (Object.keys(slots) as S[]).map(slot => [slot, [scopes[color], slots[slot]].filter(Boolean).join(' ')])
  ) as Record<S, string>])) as Record<Color, Record<S, string>>
}

/**
 * A `color` variant group: every color scopes `--ui-accent` on the given slots,
 * next to their classes. `colorVariant({ base: '' })` only scopes.
 */
export const colorVariant = <S extends string>(slots: Record<S, string>) => scoped(accentScopes, slots)

export const highlightColorVariant = <S extends string>(slots: Record<S, string>) => scoped(highlightScopes, slots)

export const spotlightColorVariant = <S extends string>(slots: Record<S, string>) => scoped(spotlightScopes, slots)
