import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import type { ComponentThemeConfig, SlotClassValue, TVTheme, TVThemeCheck, TVVariantProps } from '../types/tv'
import { get } from '../utils'
import { tv } from '../utils/tv'
import { useComponentProps, useComponentOverrides } from './useComponentProps'

/**
 * One function per slot, the way `tv()` returns them, typed with the variant
 * values `app.config.ui.<name>` adds. Each one already holds the component's
 * `ui` prop for its slot, and the root slot its `class` prop.
 */
export type ComponentThemeSlots<T extends Record<string, any>, K extends string> = ComponentThemeConfig<T, K>['ui']

/**
 * The slot the `class` prop goes to: `root`, or `base` for a component made of
 * one element, or else the first one.
 */
function rootSlot(theme: TVTheme): string | undefined {
  const slots = Object.keys(theme.slots ?? {})
  return slots.includes('root') ? 'root' : slots.includes('base') ? 'base' : slots[0]
}

/**
 * Style a component with a theme, the way Nuxt UI's own components are styled.
 *
 * `props` resolves each prop from the component, then the nearest `<UTheme :props>`,
 * then `app.config.ui.<name>.defaultVariants`. `ui` has one function per slot,
 * resolved from the theme, `app.config.ui.<name>`, each `<UTheme>` around the
 * component, its `ui` prop and its `class` prop, with the app's Tailwind prefix
 * and `unstyled`.
 *
 * The theme's variants are read from the props of the same name. Pass `variants`
 * for the ones that come from elsewhere, like a value derived from another prop:
 * it receives the resolved props.
 *
 * @example
 * const { props, ui } = useComponentTheme('acmeStat', _props, theme)
 */
export function useComponentTheme<K extends string, P extends object, T extends TVTheme>(
  name: K,
  props: P,
  theme: T & TVThemeCheck<T>,
  variants?: (props: P) => TVVariantProps<T> & Record<string, unknown>
): { props: P, ui: ComputedRef<ComponentThemeSlots<T, K>> } {
  const proxy = useComponentProps(name, props, theme)
  const overrides = useComponentOverrides(ui => get(ui, name))
  const root = rootSlot(theme)
  const keys = Object.keys(theme.variants ?? {})

  const ui = computed(() => {
    const own = proxy as Record<string, any>
    const variantProps: Record<string, unknown> = {}
    for (const key of keys) {
      variantProps[key] = own[key]
    }
    // A variant the app config or a `<UTheme>` adds is read from its prop too
    for (const level of overrides.value.levels) {
      for (const key in level?.variants) {
        variantProps[key] ??= own[key]
      }
    }
    Object.assign(variantProps, variants?.(proxy))

    const slots = tv(theme, overrides.value)(variantProps) as Record<string, (slotProps?: Record<string, any>) => string>
    const ownUi = own.ui as Record<string, SlotClassValue> | undefined
    const ownClass = own.class

    const result: Record<string, (slotProps?: Record<string, any>) => string> = {}
    for (const slot in slots) {
      const classes = slot === root ? [ownUi?.[slot], ownClass] : ownUi?.[slot]
      // The component's own classes for the slot come first, for its `ui` prop to win them
      result[slot] = slotProps => slots[slot]!({ ...slotProps, class: slotProps?.class === undefined ? classes : [slotProps.class, classes] })
    }
    return result
  })

  return { props: proxy, ui: ui as unknown as ComputedRef<ComponentThemeSlots<T, K>> }
}
