import type { ComputedRef, VNode } from 'vue'
import type { ClassValue } from 'tailwind-variants'
import { computed, getCurrentInstance } from 'vue'
import defu from 'defu'
import { createContext } from 'reka-ui'
import { useAppConfig } from '#imports'
import type { TVConfig } from '../types/tv'
import type * as ComponentTypes from '../types'
import type * as ui from '#build/ui'
import { get } from '../utils'

type UIConfig = TVConfig<typeof ui>
type ExtractUISlots<C> = C extends { slots?: infer S } ? NonNullable<S> : never
type UIConfigSlots<T extends keyof UIConfig>
  = 'slots' extends keyof NonNullable<UIConfig[T]>
    ? ExtractUISlots<NonNullable<UIConfig[T]>>
    : { base?: ClassValue }

type ThemeSlotOverrides<T> = T extends { slots: infer S extends Record<string, any> }
  ? { [K in keyof S]?: ClassValue }
  : { [K in keyof T]?: T[K] extends Record<string, any> ? ThemeSlotOverrides<T[K]> : ClassValue }

/**
 * Flat slot-class override shape: `{ button: { base: '...' }, modal: {...} }`.
 * Powers the `:ui` prop on `<UTheme>`, which remains the recommended way to
 * scope class overrides without touching component prop defaults.
 */
export type ThemeUI = {
  [K in keyof typeof ui]?: ThemeSlotOverrides<(typeof ui)[K]>
}

/**
 * Map a theme key (camelCase component name) to its `<PascalCase>Props` type
 * exported from `@nuxt/ui`. Falls back to `Record<string, any>` when no
 * matching props type exists (e.g. `prose` namespace).
 */
type ComponentPropsOf<K extends string> = `${Capitalize<K>}Props` extends keyof typeof ComponentTypes
  ? typeof ComponentTypes[`${Capitalize<K>}Props` & keyof typeof ComponentTypes]
  : Record<string, any>

/**
 * Per-component defaults shape: `{ button: { color: 'warning', ui: { base: '...' } } }`.
 * Known keys are auto-derived from the theme registry (`#build/ui`) and typed
 * against each component's exported `Props` interface for full autocompletion
 * in `<UTheme>`. Unknown string keys fall through to a loose shape so
 * downstream augmentations remain possible.
 */
export type ThemeDefaults = {
  [K in keyof typeof ui & string]?: Partial<ComponentPropsOf<K>>
} & {
  [name: string]: Record<string, any> | undefined
}

export type ThemeContext = {
  defaults: ComputedRef<ThemeDefaults>
}

const [_injectThemeContext, provideThemeContext] = createContext<ThemeContext>('UTheme', 'RootContext')

/**
 * Module-level fallback so components can call `useComponentDefaults` outside any
 * `<UTheme>` wrapper without crashing.
 */
export const defaultThemeContext: ThemeContext = {
  defaults: computed(() => ({}))
}

export function injectThemeContext(fallback: ThemeContext = defaultThemeContext): ThemeContext {
  return _injectThemeContext(fallback)
}

export { provideThemeContext }

function camelCase(str: string): string {
  return str.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
}

function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)
}

/**
 * Vuetify-style detection for whether a prop was explicitly passed by the parent,
 * distinguishing "user set it" from "got the `withDefaults` fallback".
 * Checks both camelCase and kebab-case names to cover both template conventions.
 */
function propIsDefined(vnode: VNode | null | undefined, prop: string): boolean {
  if (!vnode || !vnode.props) return false
  return vnode.props[camelCase(prop)] !== undefined
    || vnode.props[kebabCase(prop)] !== undefined
}

/**
 * Resolve a component's props with the priority chain:
 *   explicit prop > nearest UTheme > withDefaults
 *     > app.config.ui.<name>.defaultVariants > theme.defaultVariants
 *
 * The returned proxy transparently reads from `props`, falling through to the
 * injected `ThemeContext`, `app.config.ui.<name>.defaultVariants`, and the
 * component's tv() theme for defaults. The `ui` prop is deep-merged
 * (explicit slot classes override theme slot classes) instead of being replaced.
 */
export function useComponentDefaults<T extends object>(
  name: string,
  props: T,
  theme?: Record<string, any>
): T {
  const vm = getCurrentInstance()
  const { defaults } = injectThemeContext()
  const appConfig = useAppConfig() as { ui?: Record<string, any> }

  return new Proxy(props, {
    get(target, prop, receiver) {
      const raw = Reflect.get(target, prop, receiver)
      if (typeof prop !== 'string') return raw

      const themeEntry = defaults.value[name]

      if (prop === 'ui') {
        const themeUi = themeEntry?.ui
        if (!raw && !themeUi) return raw
        return defu(raw ?? {}, themeUi ?? {})
      }

      if (vm && propIsDefined(vm.vnode, prop)) return raw

      const themeValue = themeEntry?.[prop]
      if (themeValue !== undefined) return themeValue

      if (raw !== undefined) return raw

      const appConfigDefault = appConfig.ui?.[name]?.defaultVariants?.[prop]
      if (appConfigDefault !== undefined) return appConfigDefault

      return theme?.defaultVariants?.[prop]
    },
    has: (t, p) => Reflect.has(t, p),
    ownKeys: t => Reflect.ownKeys(t),
    getOwnPropertyDescriptor: (t, p) => Reflect.getOwnPropertyDescriptor(t, p)
  })
}

type ComponentUIProps<T extends keyof UIConfig> = {
  ui?: UIConfigSlots<T>
}

/**
 * Backward-compat shim used by components that haven't migrated to
 * `useComponentDefaults` yet. Returns the merged `ui` (slot-class overrides)
 * the same way it did before, but sourced from the new `ThemeContext.defaults`.
 */
export function useComponentUI<T extends keyof UIConfig>(name: T, props: ComponentUIProps<T>): ComputedRef<UIConfigSlots<T>>
export function useComponentUI(name: string, props: { ui?: any }): ComputedRef<any>
export function useComponentUI(name: string, props: { ui?: any }): ComputedRef<any> {
  const { defaults } = injectThemeContext()

  return computed(() => {
    const themeUi = get(defaults.value, `${name}.ui`) || {}
    return defu(props.ui ?? {}, themeUi)
  })
}
