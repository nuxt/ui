import type { App, ComputedRef, VNode } from 'vue'
import { computed, effectScope, getCurrentInstance } from 'vue'
import defu from 'defu'
import { createContext } from 'reka-ui'
import { useAppConfig } from '#imports'
import { get } from '../utils'
import { ComponentOverrides, engineFor } from '../utils/tv'

export type ThemeContext = {
  defaults: ComputedRef<Record<string, Record<string, any> | undefined>>
  unstyled: ComputedRef<boolean | undefined>
  /**
   * The `ui` config components read: `app.config.ui`, which `<UApp>` provides
   * at the root and every `<UTheme>` passes down.
   */
  config: ComputedRef<Record<string, any>>
}

const [_injectThemeContext, provideThemeContext] = createContext<ThemeContext>('UTheme', 'RootContext')

const rootContexts = new WeakMap<App, ThemeContext>()

function createRootThemeContext(): ThemeContext {
  const appConfig = useAppConfig() as { ui?: Record<string, any> }

  // Detached, so the first component to create it doesn't take it down with it
  return effectScope(true).run(() => ({
    defaults: computed(() => ({})),
    unstyled: computed(() => undefined),
    config: computed(() => appConfig.ui ?? {})
  }))!
}

/**
 * The context at the root of an app: `app.config.ui` and no prop defaults.
 * `<UApp>` provides it, and a component rendered outside `<UApp>` falls back to
 * the same one, created once per app.
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
 */
export function useThemeConfig(): { ui: Record<string, any> } {
  const { config } = injectThemeContext()

  return {
    get ui() {
      return config.value
    }
  }
}

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
 * The library-wide defaults a `'*'` entry replaces. A component whose own theme
 * default is something else (a `neutral` Kbd, an `sm` component) keeps it.
 */
const GLOBAL_DEFAULTS: Record<string, string> = { color: 'primary', size: 'md' }

/**
 * Resolve a component's props with the priority chain:
 *   explicit prop > nearest UTheme > nearest UTheme `'*'`
 *     > app.config.ui.<name>.defaultVariants > app.config.ui.defaultVariants
 *     > withDefaults
 *
 * The returned proxy transparently reads from `props`, falling through to the
 * injected `ThemeContext` and `app.config.ui.<name>.defaultVariants` for
 * defaults. The component's tv() `defaultVariants` are intentionally left out
 * of the proxy fallback — they continue to drive `tv()`-internal class
 * resolution (the original semantics) without leaking into prop reads. The
 * `ui` and `class` props are merged (explicit classes override theme classes)
 * instead of being replaced.
 */
export function useComponentProps<T extends object>(name: string, props: T, theme?: { defaultVariants?: Record<string, unknown>, [key: string]: unknown }): T {
  const vm = getCurrentInstance()
  const { defaults, config } = injectThemeContext()

  // A `'*'` value, only for a prop whose theme default is the library-wide one
  function globalDefault(entry: Record<string, any> | undefined, prop: string) {
    const base = GLOBAL_DEFAULTS[prop]
    if (!base || theme?.defaultVariants?.[prop] !== base) return undefined
    return entry?.[prop]
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
      // components can pull from the same nested `ThemeContext.defaults` shape
      // that `normalizeUi` produces in `<UTheme>`.
      const themeEntry = name.includes('.') ? get(defaults.value, name) : defaults.value[name]

      if (prop === 'ui') {
        const themeUi = themeEntry?.ui
        if (!raw && !themeUi) return raw
        return defu(raw ?? {}, themeUi ?? {})
      }

      // Like `ui`, `class` is merged instead of replaced so a component passing
      // its own `class` still gets the theme classes. The explicit class comes
      // last to win `twMerge`'s last-in-wins resolution.
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
      // the component's `withDefaults` fallback. This keeps `defaultVariants`
      // working uniformly for every variant, including props a component pins in
      // `withDefaults` (e.g. `orientation`, kept defined so `:data-orientation`
      // always renders a value).
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
      if (propDef && Object.prototype.hasOwnProperty.call(propDef, 'default')) {
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
 * A component's `tv()` overrides: its `app.config.ui` entry, whether the nearest
 * `<UTheme>` (or `app.config.ui.unstyled` without one) makes it `unstyled`, and
 * the engine for the app's merge config (`app.config.ui.tv`) and Tailwind prefix.
 */
export function useComponentOverrides<T extends Record<string, any>>(entry: () => T | undefined): ComputedRef<ComponentOverrides<T>> {
  const { unstyled, config } = injectThemeContext()

  return computed(() => new ComponentOverrides(
    entry(),
    !!(unstyled.value ?? config.value.unstyled),
    engineFor(config.value.tv, config.value.prefix)
  ))
}
