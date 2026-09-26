<script lang="ts">
import type { VNode } from 'vue'
import type { ThemeContextDefaults, ThemeDefaults, ThemeIcons, ThemeUI, ThemeVariants } from '../types/theme'

export interface ThemeProps {
  /**
   * Per-component prop defaults that flow through `useComponentProps` to
   * every descendant. Each key maps to a partial of that component's props.
   * @example `{ button: { color: 'warning' }, tooltip: { delayDuration: 0 } }`
   */
  props?: ThemeDefaults
  /**
   * Per-component slot class overrides (flat shorthand for `:props.<name>.ui`).
   * @example `{ button: { base: 'rounded-full' } }`
   */
  ui?: ThemeUI
  /**
   * Per-component variant values (the `variants` of `app.config.ui.<name>`),
   * merged over the app config and any `<UTheme>` above, the nearest winning.
   * Changes the classes of a variant value, or adds one.
   * @example `{ button: { variant: { soft: { base: 'rounded-full' } } } }`
   */
  variants?: ThemeVariants
  /**
   * Icons for descendant components, merged over `app.config.ui.icons` and any
   * `<UTheme>` above.
   * @example `{ close: 'i-lucide-circle-x' }`
   */
  icons?: ThemeIcons
  /**
   * Render descendant components without their theme classes, keeping only the
   * classes you supply through `class`, `ui` or `app.config.ui`. Set it to
   * `false` to style a subtree again.
   * @defaultValue undefined
   */
  unstyled?: boolean
}

export interface ThemeSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import defu from 'defu'
import { injectThemeContext, provideThemeContext } from '../composables/useComponentProps'

const _props = withDefaults(defineProps<ThemeProps>(), { unstyled: undefined })
defineSlots<ThemeSlots>()

const parent = injectThemeContext()

const NAMESPACES = new Set(['prose'])

/**
 * Lift the flat `ThemeUI` shape (`{ button: { base: '...' } }`) into the
 * per-component defaults shape (`{ button: { ui: { base: '...' } } }`) so
 * `useComponentProps('button', ...)` reads slot classes from the same
 * `ThemeContext.defaults` map as every other prop default.
 *
 * Namespaced maps like `{ prose: { p: { base: '...' } } }` preserve their
 * nesting so prose components' `useComponentProps('prose.p', ...)` lookup still
 * resolves: `{ prose: { p: { ui: { base: '...' } } } }`.
 */
function normalizeUi(ui?: ThemeUI): ThemeContextDefaults {
  if (!ui) return {}
  const result: ThemeContextDefaults = {}
  for (const [key, value] of Object.entries(ui)) {
    if (!value || typeof value !== 'object') continue
    if (NAMESPACES.has(key)) {
      const nested: Record<string, any> = {}
      for (const [childKey, childValue] of Object.entries(value)) {
        if (childValue && typeof childValue === 'object') {
          nested[childKey] = { ui: childValue }
        }
      }
      result[key] = nested
    } else {
      result[key] = { ui: value }
    }
  }
  return result
}

/**
 * `variants` and `icons` in the shape of `app.config.ui`, to merge over the
 * parent's config: `{ button: { variants: {...} }, icons: {...} }`, with prose
 * components nested under `prose` as in the app config.
 */
function toConfig(variants?: ThemeVariants, icons?: ThemeIcons): Record<string, any> {
  const config: Record<string, any> = {}
  for (const [key, value] of Object.entries(variants ?? {})) {
    if (!value || typeof value !== 'object') continue
    config[key] = NAMESPACES.has(key)
      ? Object.fromEntries(Object.entries(value).map(([child, childValue]) => [child, { variants: childValue }]))
      : { variants: value }
  }
  if (icons) {
    config.icons = icons
  }
  return config
}

provideThemeContext({
  defaults: computed(() => defu(
    (_props.props ?? {}) as ThemeContextDefaults,
    normalizeUi(_props.ui),
    parent.defaults.value
  )),
  unstyled: computed(() => _props.unstyled ?? parent.unstyled.value),
  config: computed(() => _props.variants || _props.icons
    ? defu(toConfig(_props.variants, _props.icons), parent.config.value)
    : parent.config.value)
})
</script>

<template>
  <slot />
</template>
