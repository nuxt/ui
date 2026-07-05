/**
 * Shadow and border treatments, expressed as per-component class bundles.
 *
 * Nuxt UI has no semantic `--ui-shadow` / `--ui-border-width` tokens yet
 * (a known core gap), so these ride the `app.config ui.<component>` override
 * path instead. The class strings must stay STATIC literals in this file —
 * tailwind compiles what it can see in source, not what appears at runtime.
 *
 * Ring overrides need two altitudes: slot-base classes cover variants
 * without their own ring (solid/soft/ghost), while `outline`/`subtle` rings
 * come from theme compoundVariants which render AFTER slot classes — so
 * those are overridden with extension compoundVariants, which append later
 * still and win the merge.
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

const BOLD_RING = 'ring-2 ring-(--ui-border-inverted)'

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
        base: 'shadow-[3px_3px_0_0_var(--ui-border-inverted)] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_var(--ui-border-inverted)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[box-shadow,translate,background-color]'
      }
    },
    card: { slots: { root: 'shadow-[5px_5px_0_0_var(--ui-border-inverted)]' } },
    input: { slots: { base: 'shadow-[3px_3px_0_0_var(--ui-border-inverted)]' } },
    select: { slots: { base: 'shadow-[3px_3px_0_0_var(--ui-border-inverted)]' } },
    textarea: { slots: { base: 'shadow-[3px_3px_0_0_var(--ui-border-inverted)]' } },
    alert: { slots: { root: 'shadow-[5px_5px_0_0_var(--ui-border-inverted)]' } },
    badge: { slots: { base: 'shadow-[2px_2px_0_0_var(--ui-border-inverted)]' } }
  }
}

const BORDER_FRAGMENTS: Record<BorderStyle, Fragments> = {
  default: {},
  bold: {
    card: { slots: { root: BOLD_RING } },
    input: { slots: { base: `${BOLD_RING} ring-inset` } },
    select: { slots: { base: `${BOLD_RING} ring-inset` } },
    textarea: { slots: { base: `${BOLD_RING} ring-inset` } },
    alert: {
      slots: { root: BOLD_RING },
      compoundVariants: [
        { variant: 'outline', class: { root: BOLD_RING } },
        { variant: 'subtle', class: { root: BOLD_RING } }
      ]
    },
    button: {
      slots: { base: `${BOLD_RING} ring-inset` },
      compoundVariants: [
        { variant: 'outline', class: `${BOLD_RING} ring-inset` },
        { variant: 'subtle', class: `${BOLD_RING} ring-inset` }
      ]
    },
    badge: {
      slots: { base: `${BOLD_RING} ring-inset` },
      compoundVariants: [
        { variant: 'outline', class: `${BOLD_RING} ring-inset` },
        { variant: 'subtle', class: `${BOLD_RING} ring-inset` }
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
