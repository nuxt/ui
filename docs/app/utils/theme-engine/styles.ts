/**
 * Shadow and border treatments, expressed as per-component class bundles.
 *
 * Nuxt UI has no semantic `--ui-shadow` / `--ui-border-width` tokens yet
 * (a known core gap), so these ride the `app.config ui.<component>` override
 * path instead. The class strings must stay STATIC literals in this file —
 * tailwind compiles what it can see in source, not what appears at runtime.
 *
 * Semantics:
 * - `border: bold` only THICKENS borders that already exist, keeping each
 *   element's own ring color. Borderless variants (ghost, solid, soft) stay
 *   borderless. outline/subtle rings come from theme compoundVariants which
 *   render after slot classes, so their width overrides ship as extension
 *   compoundVariants (appended later, they win the merge).
 * - `shadow: hard` uses `--ui-shadow-color` (near-black in light, black in
 *   dark — a shadow, not a glow) defined in the docs CSS and emitted by the
 *   export when the treatment is active.
 */

export type ShadowStyle = 'none' | 'soft' | 'hard'
export type BorderStyle = 'default' | 'bold'

export interface StyleOptions {
  shadow?: ShadowStyle
  border?: BorderStyle
}

export const SHADOW_STYLES: ShadowStyle[] = ['none', 'soft', 'hard']
export const BORDER_STYLES: BorderStyle[] = ['default', 'bold']

interface ComponentFragment {
  slots?: Record<string, string>
  compoundVariants?: Array<Record<string, unknown>>
}

type Fragments = Record<string, ComponentFragment>

const SHADOW_FRAGMENTS: Record<ShadowStyle, Fragments> = {
  none: {},
  soft: {
    button: { slots: { base: 'shadow-sm' } },
    card: { slots: { root: 'shadow-md' } },
    input: { slots: { base: 'shadow-xs' } },
    select: { slots: { base: 'shadow-xs' } },
    textarea: { slots: { base: 'shadow-xs' } },
    alert: { slots: { root: 'shadow-md' } },
    badge: { slots: { base: 'shadow-xs' } }
  },
  hard: {
    button: {
      slots: {
        base: 'shadow-[3px_3px_0_0_var(--ui-shadow-color)] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_var(--ui-shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[box-shadow,translate,background-color]'
      },
      // A floating shadow under an invisible box reads as a glitch — ghost
      // and link buttons stay flat, as in the reference neobrutalism kits.
      compoundVariants: [
        { variant: 'ghost', class: 'shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0' },
        { variant: 'link', class: 'shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0' }
      ]
    },
    card: { slots: { root: 'shadow-[5px_5px_0_0_var(--ui-shadow-color)]' } },
    input: { slots: { base: 'shadow-[3px_3px_0_0_var(--ui-shadow-color)]' } },
    select: { slots: { base: 'shadow-[3px_3px_0_0_var(--ui-shadow-color)]' } },
    textarea: { slots: { base: 'shadow-[3px_3px_0_0_var(--ui-shadow-color)]' } },
    alert: { slots: { root: 'shadow-[5px_5px_0_0_var(--ui-shadow-color)]' } },
    badge: { slots: { base: 'shadow-[2px_2px_0_0_var(--ui-shadow-color)]' } }
  }
}

const BORDER_FRAGMENTS: Record<BorderStyle, Fragments> = {
  default: {},
  bold: {
    // Width only — each element keeps its own ring color, and elements
    // without a ring don't gain one.
    card: { slots: { root: 'ring-2' } },
    input: { slots: { base: 'ring-2' } },
    select: { slots: { base: 'ring-2' } },
    textarea: { slots: { base: 'ring-2' } },
    alert: {
      compoundVariants: [
        { variant: 'outline', class: { root: 'ring-2' } },
        { variant: 'subtle', class: { root: 'ring-2' } }
      ]
    },
    button: {
      compoundVariants: [
        { variant: 'outline', class: 'ring-2' },
        { variant: 'subtle', class: 'ring-2' }
      ]
    },
    badge: {
      compoundVariants: [
        { variant: 'outline', class: 'ring-2' },
        { variant: 'subtle', class: 'ring-2' }
      ]
    }
  }
}

/**
 * Expand style options into the `ui.<component>` override shape, merging the
 * shadow and border fragments slot-wise (both may touch the same slot).
 */
export function styleComponents(style: StyleOptions): Fragments {
  const result: Fragments = {}

  for (const fragments of [SHADOW_FRAGMENTS[style.shadow ?? 'none'], BORDER_FRAGMENTS[style.border ?? 'default']]) {
    for (const [component, fragment] of Object.entries(fragments)) {
      const target = result[component] ||= {}
      for (const [slot, classes] of Object.entries(fragment.slots || {})) {
        target.slots ||= {}
        target.slots[slot] = [target.slots[slot], classes].filter(Boolean).join(' ')
      }
      if (fragment.compoundVariants) {
        target.compoundVariants = [...(target.compoundVariants || []), ...fragment.compoundVariants]
      }
    }
  }

  return result
}

/** Every component key a style bundle may touch — cleared before re-applying. */
export const STYLE_COMPONENT_KEYS = [...new Set([
  ...Object.values(SHADOW_FRAGMENTS).flatMap(fragments => Object.keys(fragments)),
  ...Object.values(BORDER_FRAGMENTS).flatMap(fragments => Object.keys(fragments))
])]
