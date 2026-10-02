import type { App, ComputedRef } from 'vue'
import { computed, effectScope, getCurrentInstance } from 'vue'
import { createContext } from 'reka-ui'
import { useAppConfig } from '#imports'
import detected from '#build/ui/detected'
import { get } from '../utils'
import { propIsDefined } from '../utils/props'
import { ComponentOverrides, engineFor } from '../utils/tv'

export type ThemeContext = {
  defaults: ComputedRef<Record<string, Record<string, any> | undefined>>
  unstyled: ComputedRef<boolean | undefined>
  /**
   * The `ui` config components read: `app.config.ui`, which `<UApp>` provides
   * at the root and every `<UTheme>` passes down, with the `icons` it sets.
   */
  config: ComputedRef<Record<string, any>>
  /**
   * The levels of class overrides, farthest first: `app.config.ui`, then each
   * `<UTheme>` that sets `variants` or `ui`, in the shape of `app.config.ui`
   * (`{ button: { variants, slots } }`). The engine stacks them in that order,
   * so the nearest wins.
   */
  levels: ComputedRef<Record<string, any>[]>
}

const [_injectThemeContext, provideThemeContext] = createContext<ThemeContext>('UTheme', 'RootContext')

const rootContexts = new WeakMap<App, ThemeContext>()

function createRootThemeContext(): ThemeContext {
  const appConfig = useAppConfig() as { ui?: Record<string, any> }

  // Detached, so the first component to create it doesn't take it down with it
  return effectScope(true).run(() => ({
    defaults: computed(() => ({})),
    unstyled: computed(() => undefined),
    config: computed(() => appConfig.ui ?? {}),
    levels: computed(() => [appConfig.ui ?? {}])
  }))!
}

/**
 * The context at the root of an app: `app.config.ui` and no prop defaults.
 * `<UApp>` provides it, and a component rendered outside `<UApp>` falls back to
 * the same one, created once per app.
 * @internal
 */
export function useRootThemeContext(): ThemeContext {
  const app = getCurrentInstance()?.appContext.app
  if (!app) {
    return createRootThemeContext()
  }
  let context = rootContexts.get(app)
  if (!context) {
    context = createRootThemeContext()
    rootContexts.set(app, context)
  }
  return context
}

export function injectThemeContext(): ThemeContext {
  return _injectThemeContext(null) ?? useRootThemeContext()
}

export { provideThemeContext }

/**
 * The `ui` config of the nearest `<UTheme>`, shaped like the app config so
 * `appConfig.ui.<c>` and `appConfig.ui.icons` read the same. At the root it is
 * `app.config.ui`.
 * @internal
 */
export function useThemeConfig(): { ui: Record<string, any> } {
  const { config } = injectThemeContext()

  return {
    get ui() {
      return config.value
    }
  }
}

/**
 * The library-wide defaults a `'*'` entry replaces. A component whose own theme
 * default is something else (a `neutral` Kbd, an `sm` component) keeps it.
 */
const GLOBAL_DEFAULTS: Record<string, string> = { color: 'primary', size: 'md' }

const undetected = new Set<string>()

/**
 * Warns in dev when a component renders whose theme component detection didn't
 * find, since the build leaves its classes out of the CSS.
 */
function warnUndetected(name: string) {
  const names = detected
  if (!names || names.has(name) || name.includes('.') || undetected.has(name)) return
  undetected.add(name)

  // A component just added to a file renders before detection runs again, so
  // it's only reported when still missing once the update had time to land
  setTimeout(() => {
    if (names.has(name)) return
    const component = name[0]!.toUpperCase() + name.slice(1)
    console.warn(`[@nuxt/ui] Component detection didn't find \`${component}\`, so the build leaves its classes out of your CSS. Add it to the \`componentDetection\` option: \`componentDetection: ['${component}']\`.`)
  }, 1000)
}

/**
 * Resolve a component's props with the priority chain:
 *   explicit prop > nearest UTheme > nearest UTheme `'*'`
 *     > app.config.ui.<name>.defaultVariants > app.config.ui.defaultVariants
 *     > withDefaults
 *
 * The returned proxy transparently reads from `props`, falling through to the
 * injected `ThemeContext` and `app.config.ui.<name>.defaultVariants` for
 * defaults, then to the component's `withDefaults`, which holds the default of
 * every prop, the theme variants included. So the proxy has the resolved value
 * of every variant: the one `tv()` picks the classes with and the one a
 * template binds to a data attribute. The `ui` prop holds the component's own
 * `ui` only, and `class` merges a `<UTheme :props>` class under the
 * component's own.
 */
export function useComponentProps<T extends object>(name: string, props: T, theme?: { defaultVariants?: Record<string, unknown>, [key: string]: unknown }): T {
  return createPropsProxy(name, props, theme, true)
}

/**
 * What a component was given, for what it passes down: an explicit prop, the
 * nearest `<UTheme :props>` key or `app.config.ui.<name>.defaultVariants`. It
 * leaves out the component's own `withDefaults` and the `'*'` defaults, so a
 * child it renders, or a child of the group it provides to, keeps its own
 * defaults and its own `<UTheme :props>` key.
 * @internal
 */
export function useGivenProps<T extends object>(name: string, props: T): T {
  return createPropsProxy(name, props, undefined, false)
}

function createPropsProxy<T extends object>(name: string, props: T, theme: { defaultVariants?: Record<string, unknown>, [key: string]: unknown } | undefined, own: boolean): T {
  const vm = getCurrentInstance()
  const { defaults, config } = injectThemeContext()

  if (import.meta.dev && import.meta.client && theme) {
    warnUndetected(name)
  }

  // A `'*'` value, only for a prop whose own default is the library-wide one:
  // the component's `app.config.ui.<name>.defaultVariants`, or else the one it
  // declares in `withDefaults`
  function globalDefault(entry: Record<string, any> | undefined, prop: string) {
    const base = GLOBAL_DEFAULTS[prop]
    const value = entry?.[prop]
    if (!own || !base || value === undefined) return undefined
    const appConfigEntry = name.includes('.') ? get(config.value, name) : config.value[name]
    if (appConfigEntry?.defaultVariants?.[prop] !== undefined || (vm?.type as any)?.props?.[prop]?.default !== base) return undefined
    // A value the component doesn't have, like `xl` on a Kbd, leaves its default
    const values = (theme?.variants as Record<string, Record<string, unknown>> | undefined)?.[prop]
    if (values && !(value in values) && !(value in (appConfigEntry?.variants?.[prop] ?? {}))) return undefined
    return value
  }

  return new Proxy(props, {
    get(target, prop, receiver) {
      // Advertise as a Vue reactive proxy so `toRefs`, `reactiveOmit`,
      // `reactivePick`, and similar utilities don't warn when given the proxy.
      // Reads still flow through to the underlying reactive `props` object
      // returned by `defineProps`, so reactivity tracking works normally.
      if (prop === '__v_isReactive') return true
      if (prop === '__v_raw') return target

      const raw = Reflect.get(target, prop, receiver)
      if (typeof prop !== 'string') return raw

      // Support dotted-path names (e.g. `prose.p`, `prose.code`) so prose
      // components can pull from the nested `ThemeContext.defaults` shape
      // `<UTheme :props>` takes (`{ prose: { p: { ... } } }`).
      const themeEntry = name.includes('.') ? get(defaults.value, name) : defaults.value[name]

      // A `<UTheme>`'s `ui` is one of the levels the engine stacks, beneath this
      // one, so the prop only holds what the component was given
      if (prop === 'ui') return raw

      // `class` is merged instead of replaced so a component passing its own
      // `class` still gets the theme's. The explicit class comes last to win
      // the merge.
      if (prop === 'class') {
        const themeClass = themeEntry?.class
        if (themeClass === undefined) return raw
        if (raw === undefined) return themeClass
        return [themeClass, raw]
      }

      if (vm && propIsDefined(vm.vnode, prop)) return raw

      const themeValue = themeEntry?.[prop]
      if (themeValue !== undefined) return themeValue

      const themeGlobalValue = globalDefault(defaults.value['*'], prop)
      if (themeGlobalValue !== undefined) return themeGlobalValue

      // A global `app.config.ui.<name>.defaultVariants` value takes priority over
      // the component's `withDefaults` fallback
      const appConfigEntry = name.includes('.') ? get(config.value, name) : config.value[name]
      const appConfigValue = appConfigEntry?.defaultVariants?.[prop]
      if (appConfigValue !== undefined) return appConfigValue

      const appConfigGlobalValue = globalDefault(config.value.defaultVariants, prop)
      if (appConfigGlobalValue !== undefined) return appConfigGlobalValue

      // Only fall back to `raw` when `withDefaults` set an explicit default for
      // this prop. Otherwise Vue's runtime would auto-cast unset Boolean props
      // to `false` (and other typed props to their normalized fallback), which
      // would override defaults baked into the underlying primitive when those
      // props are forwarded downstream.
      const propDef = (vm?.type as any)?.props?.[prop]
      if (own && propDef && Object.prototype.hasOwnProperty.call(propDef, 'default')) {
        return raw
      }

      return undefined
    },
    // `has`, `ownKeys`, and `getOwnPropertyDescriptor` reflect the underlying
    // `defineProps` schema only — theme defaults are NOT enumerable. As a
    // result, `Object.keys(props)`, `for…in`, and `{ ...props }` see only the
    // declared prop keys, but each value lookup still flows through the proxy.
    // This is the contract our internal `useForwardProps` relies on.
    has: (t, p) => Reflect.has(t, p),
    ownKeys: t => Reflect.ownKeys(t),
    getOwnPropertyDescriptor: (t, p) => Reflect.getOwnPropertyDescriptor(t, p)
  })
}

/**
 * A component's `tv()` overrides: its entry at each level, read by `entry` from
 * `app.config.ui` then from each `<UTheme>` down to the component, whether the
 * nearest `<UTheme>` (or `app.config.ui.unstyled` without one) makes it
 * `unstyled`, and the engine for the app's merge config (`app.config.ui.tv`)
 * and Tailwind prefix.
 *
 * Type the level as the component's app config to type the variant values the
 * app adds: `useComponentOverrides((ui: Button['AppConfig']['ui']) => ui.button)`.
 */
export function useComponentOverrides<U = Record<string, any>, T extends Record<string, any> = Record<string, any>>(entry: (ui: U) => T | undefined): ComputedRef<ComponentOverrides<T>> {
  const { unstyled, config, levels } = injectThemeContext()

  return computed(() => new ComponentOverrides(
    levels.value.map(level => entry(level as U)),
    !!(unstyled.value ?? config.value.unstyled),
    engineFor(config.value.tv, config.value.prefix)
  ))
}
