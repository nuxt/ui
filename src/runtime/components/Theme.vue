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
   * Per-component slot classes (the `slots` of `app.config.ui.<name>`, or
   * `:props.<name>.ui`), applied over the app config and any `<UTheme>` above.
   * @example `{ button: { base: 'rounded-full' } }`
   */
  ui?: ThemeUI
  /**
   * Per-component variant values (the `variants` of `app.config.ui.<name>`),
   * applied over the app config and any `<UTheme>` above. Changes the classes
   * of a variant value, or adds one.
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
import defu, { createDefu } from 'defu'
import { injectThemeContext, provideThemeContext } from '../composables/useComponentProps'

const _props = withDefaults(defineProps<ThemeProps>(), { unstyled: undefined })
defineSlots<ThemeSlots>()

const parent = injectThemeContext()

const NAMESPACES = new Set(['prose'])

/**
 * Put each component's value under `key`, in the shape of `app.config.ui`:
 * `{ button: {...} }` to `{ button: { [key]: {...} } }`, with prose components
 * nested under `prose` as in the app config.
 */
function toLevel(key: 'slots' | 'variants', value?: Record<string, any>): Record<string, any> {
  const level: Record<string, any> = {}
  for (const [name, entry] of Object.entries(value ?? {})) {
    if (!entry || typeof entry !== 'object') continue
    level[name] = NAMESPACES.has(name)
      ? Object.fromEntries(Object.entries(entry).filter(([, child]) => child && typeof child === 'object').map(([child, childValue]) => [child, { [key]: childValue }]))
      : { [key]: entry }
  }
  return level
}

/** The `ui` inside `:props`, lifted out of each component's defaults. */
function propsUi(props?: Record<string, any>): Record<string, any> {
  const ui: Record<string, any> = {}
  for (const [name, entry] of Object.entries(props ?? {})) {
    if (!entry || typeof entry !== 'object') continue
    if (NAMESPACES.has(name)) {
      const nested = propsUi(entry)
      if (Object.keys(nested).length) ui[name] = nested
    } else if (entry.ui) {
      ui[name] = entry.ui
    }
  }
  return ui
}

// Like `defu`, but the winning slot's array of classes replaces the other
// instead of being concatenated before it, where the other would win
const mergeSlots = createDefu((object, key, value) => {
  if (Array.isArray(object[key]) && Array.isArray(value)) {
    object[key] = value
    return true
  }
})

/**
 * This Theme's level of class overrides: its `variants`, and its `ui` with the
 * one in `:props` (which wins on the same slot, as a prop default would).
 */
const level = computed(() => {
  const slots = mergeSlots(propsUi(_props.props), _props.ui ?? {})
  if (!_props.variants && !Object.keys(slots).length) {
    return undefined
  }
  return defu(toLevel('slots', slots), toLevel('variants', _props.variants))
})

provideThemeContext({
  defaults: computed(() => defu(
    (_props.props ?? {}) as ThemeContextDefaults,
    parent.defaults.value
  )),
  unstyled: computed(() => _props.unstyled ?? parent.unstyled.value),
  config: computed(() => _props.icons
    ? defu({ icons: _props.icons }, parent.config.value)
    : parent.config.value),
  levels: computed(() => level.value ? [...parent.levels.value, level.value] : parent.levels.value)
})
</script>

<template>
  <slot />
</template>
