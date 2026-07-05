/**
 * Shadow and border treatments, expressed as per-component class bundles.
 *
 * Nuxt UI has no semantic `--ui-shadow` / `--ui-border-width` tokens yet
 * (a known core gap), so these ride the `app.config ui.<component>` override
 * path instead. The class strings must stay STATIC literals in this file —
 * tailwind compiles what it can see in source, not what appears at runtime.
 */

export type ShadowStyle = 'none' | 'soft' | 'hard'
export type BorderStyle = 'default' | 'bold'

export interface StyleOptions {
  shadow?: ShadowStyle
  border?: BorderStyle
}

export const SHADOW_STYLES: ShadowStyle[] = ['none', 'soft', 'hard']
export const BORDER_STYLES: BorderStyle[] = ['default', 'bold']

type SlotFragments = Record<string, Record<string, string>>

/** component → slot → classes appended to the theme's own. */
const SHADOW_FRAGMENTS: Record<ShadowStyle, SlotFragments> = {
  none: {},
  soft: {
    button: { base: 'shadow-sm' },
    card: { root: 'shadow-md' },
    input: { base: 'shadow-xs' },
    select: { base: 'shadow-xs' },
    textarea: { base: 'shadow-xs' },
    alert: { root: 'shadow-md' },
    badge: { base: 'shadow-xs' }
  },
  hard: {
    button: {
      base: 'shadow-[3px_3px_0_0_var(--ui-border-inverted)] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_var(--ui-border-inverted)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-[box-shadow,translate,background-color]'
    },
    card: { root: 'shadow-[5px_5px_0_0_var(--ui-border-inverted)]' },
    input: { base: 'shadow-[3px_3px_0_0_var(--ui-border-inverted)]' },
    select: { base: 'shadow-[3px_3px_0_0_var(--ui-border-inverted)]' },
    textarea: { base: 'shadow-[3px_3px_0_0_var(--ui-border-inverted)]' },
    alert: { root: 'shadow-[5px_5px_0_0_var(--ui-border-inverted)]' },
    badge: { base: 'shadow-[2px_2px_0_0_var(--ui-border-inverted)]' }
  }
}

const BORDER_FRAGMENTS: Record<BorderStyle, SlotFragments> = {
  default: {},
  bold: {
    card: { root: 'ring-2 ring-(--ui-border-inverted)' },
    input: { base: 'ring-2 ring-(--ui-border-inverted)' },
    select: { base: 'ring-2 ring-(--ui-border-inverted)' },
    textarea: { base: 'ring-2 ring-(--ui-border-inverted)' },
    alert: { root: 'ring-2 ring-(--ui-border-inverted)' },
    button: { base: 'ring-2 ring-inset ring-(--ui-border-inverted)' },
    badge: { base: 'ring-2 ring-inset ring-(--ui-border-inverted)' }
  }
}

/**
 * Expand style options into the `ui.<component>` override shape, merging the
 * shadow and border fragments slot-wise (both may touch the same slot).
 */
export function styleComponents(style: StyleOptions): Record<string, { slots: Record<string, string> }> {
  const result: Record<string, { slots: Record<string, string> }> = {}

  for (const fragments of [SHADOW_FRAGMENTS[style.shadow ?? 'none'], BORDER_FRAGMENTS[style.border ?? 'default']]) {
    for (const [component, slots] of Object.entries(fragments)) {
      result[component] ||= { slots: {} }
      for (const [slot, classes] of Object.entries(slots)) {
        result[component]!.slots[slot] = [result[component]!.slots[slot], classes].filter(Boolean).join(' ')
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
